import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API service class
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
}

// Health check utility
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await ApiService.get('/health')
    return true
  } catch {
    return false
  }
}

export default apiClient
