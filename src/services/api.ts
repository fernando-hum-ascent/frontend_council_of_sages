import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { authService } from './authService'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

interface APIError {
  message: string
  code?: string
  status?: number
}

// Enhanced axios instance with Firebase auth integration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token refresh state
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: Error) => void
}> = []

// Process queued requests after token refresh
const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else if (token) {
      resolve(token)
    } else {
      reject(new Error('No token available'))
    }
  })
  failedQueue = []
}

// Request interceptor - attach Firebase ID token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Check if this is a request that requires authentication
      const requiresAuth = !config.url?.includes('/health')

      if (requiresAuth) {
        // Check if auth is ready before attempting to get token
        if (!authService.isAuthReady()) {
          console.warn(
            `API Request to ${config.url}: Auth not ready, sending request without token`
          )
        }

        const token = await authService.getIdToken()
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        } else if (requiresAuth) {
          console.warn(
            `API Request to ${config.url}: No token available, request may fail with 401`
          )
        }
      }
    } catch (error) {
      console.error('Failed to get auth token for API request:', error)
      // Continue with request without token - backend will handle unauthorized
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh and auth errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - token expired or invalid
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh token
        const newToken = await authService.getIdToken(true)

        if (newToken) {
          // Process failed queue
          processQueue(null, newToken)

          // Retry original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return apiClient(originalRequest)
        } else {
          throw new Error('No valid token available')
        }
      } catch (refreshError) {
        // Token refresh failed - user needs to sign in again
        processQueue(
          refreshError instanceof Error
            ? refreshError
            : new Error('Token refresh failed'),
          null
        )

        // Clear auth state
        useAuthStore.getState().clearAuth()

        // Redirect to login if not already on auth page
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth'
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other HTTP errors
    const apiError: APIError = {
      message: extractErrorMessage(error),
      code: error.code,
      status: error.response?.status,
    }

    return Promise.reject(apiError)
  }
)

// Extract error message helper
const extractErrorMessage = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as Record<string, unknown>
    if (typeof data.message === 'string') return data.message
    if (typeof data.error === 'string') return data.error
    return 'Request failed'
  }

  if (error.message) {
    return error.message
  }

  return 'An unexpected error occurred'
}

// API service class with static methods (matches existing pattern)
export class ApiService {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config)
    return response.data
  }

  static async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  }

  static async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  }

  static async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.patch<T>(url, data, config)
    return response.data
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config)
    return response.data
  }

  // Utility method to get raw axios instance if needed
  static getAxiosInstance(): AxiosInstance {
    return apiClient
  }
}

// Health check utility (unchanged)
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await ApiService.get('/health')
    return true
  } catch {
    return false
  }
}

export default apiClient

// Type declarations for axios config extension
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean
  }
}
