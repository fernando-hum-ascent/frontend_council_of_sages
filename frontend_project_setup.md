# React Frontend Project Setup Guide

This guide provides comprehensive instructions for setting up a React web application with modern tooling, best practices, and easy deployment to Render. Use this as a reference to generate all necessary configuration files and scripts.

## Project Structure

```
frontend-project/
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Lock file for dependencies
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # Node-specific TypeScript config
├── eslint.config.js          # ESLint configuration
├── prettier.config.js        # Prettier configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── .gitignore                # Git ignore patterns
├── .env.example              # Environment variables template
├── README.md                 # Project documentation
├── index.html                # Main HTML template
├── public/                   # Static assets
│   ├── favicon.ico
│   └── manifest.json
├── src/                      # Source code
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   └── common/           # Common components
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API services and utilities
│   ├── store/                # State management (Zustand)
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript type definitions
│   └── assets/               # Images, icons, etc.
├── tests/                    # Test files
└── docs/                     # Additional documentation
```

## Required Files and Configurations

### 1. Package Configuration

**File: `package.json`**
```json
{
  "name": "council-of-sages-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "prepare": "husky install"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.1",
    "@tanstack/react-query": "^5.51.23",
    "zustand": "^4.5.5",
    "axios": "^1.7.4",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "lucide-react": "^0.436.0",
    "@hookform/resolvers": "^3.9.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.8",
    "sonner": "^1.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^8.0.1",
    "@typescript-eslint/parser": "^8.0.1",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^9.9.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.6",
    "tailwindcss": "^3.4.10",
    "postcss": "^8.4.41",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.0.5",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/user-event": "^14.5.2",
    "@vitest/ui": "^2.0.5",
    "@vitest/coverage-v8": "^2.0.5",
    "jsdom": "^25.0.0",
    "husky": "^9.1.5",
    "lint-staged": "^15.2.9"
  }
}
```

### 2. TypeScript Configuration

**File: `tsconfig.json`**
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/store/*": ["./src/store/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  }
}
```

**File: `tsconfig.app.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### 3. Vite Configuration

**File: `vite.config.ts`**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // Expose env variables to the client
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
```

### 4. ESLint Configuration

**File: `eslint.config.js`**
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      'prefer-const': 'off', // Disable base rule
      'no-var': 'error',
    },
  },
]
```

### 5. Environment Configuration

**File: `.env.example`**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5073
VITE_API_TIMEOUT=10000

# Application Settings
VITE_APP_NAME=Council of Sages
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-powered application frontend

# Environment
VITE_NODE_ENV=development
VITE_DEBUG=true

# External Services (optional)
VITE_SENTRY_DSN=
VITE_ANALYTICS_ID=
```

### 6. HTML Template

**File: `index.html`**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Council of Sages - AI-powered application" />
    <meta name="theme-color" content="#000000" />
    <title>Council of Sages</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Basic Application Files

### 1. Main Entry Point

**File: `src/main.tsx`**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import App from './App'
import './index.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
```

### 2. Root App Component

**File: `src/App.tsx`**
```typescript
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { Layout } from '@/components/common/Layout'
import { ErrorFallback } from '@/components/common/ErrorFallback'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
```

### 3. API Service

**File: `src/services/api.ts`**
```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5073'
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
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  }

  static async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  }

  static async patch<T>(
    url: string,
    data?: any,
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
```

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # Run TypeScript compiler

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
```

## Deployment to Render

### 1. Build Settings for Render

Create a `render.yaml` file in your project root:

**File: `render.yaml`**
```yaml
services:
  - type: web
    name: council-of-sages-frontend
    env: node
    plan: free
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    pullRequestPreviewsEnabled: true
    headers:
      - path: /*
        name: X-Robots-Tag
        value: noindex
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### 2. Environment Variables for Production

In Render dashboard, set these environment variables:
```
VITE_API_BASE_URL=https://your-api-domain.onrender.com
VITE_APP_NAME=Council of Sages
VITE_NODE_ENV=production
VITE_DEBUG=false
```

### 3. Deployment Steps

1. **Connect Repository to Render**:
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository
   - Choose "Static Site" service

2. **Configure Build Settings**:
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`

3. **Set Environment Variables** in Render dashboard

4. **Deploy**: Render will automatically deploy when you push to main branch

## Project Initialization Steps

1. **Create project directory**:
   ```bash
   mkdir council-of-sages-frontend
   cd council-of-sages-frontend
   ```

2. **Initialize npm project**:
   ```bash
   npm init -y
   ```

3. **Install dependencies**:
   ```bash
   # Install all dependencies
   npm install react react-dom react-router-dom @tanstack/react-query zustand axios clsx tailwind-merge lucide-react @hookform/resolvers react-hook-form zod sonner

   # Install dev dependencies
   npm install -D @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript vite prettier prettier-plugin-tailwindcss tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/ui @vitest/coverage-v8 jsdom husky lint-staged
   ```

4. **Create all configuration files** from the templates above

5. **Create basic directory structure**:
   ```bash
   mkdir -p src/{components/{ui,common},pages,hooks,services,store,utils,types,assets} tests public
   ```

6. **Set up Husky**:
   ```bash
   npx husky install
   npx husky add .husky/pre-commit "npx lint-staged"
   ```

7. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

8. **Initialize git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial React project setup"
   ```

## Best Practices Included

### Code Organization
- **Modular structure** with clear separation of concerns
- **Absolute imports** using `@/` alias for cleaner imports
- **Type-safe** development with TypeScript
- **Component composition** patterns

### Performance
- **Code splitting** with dynamic imports
- **React Query** for efficient data fetching and caching
- **Optimized builds** with Vite
- **Tree shaking** and bundle optimization

### Developer Experience
- **Hot Module Replacement** for fast development
- **ESLint + Prettier** for consistent code quality
- **Husky + lint-staged** for pre-commit hooks
- **Vitest** for fast unit testing

### Production Ready
- **Environment configuration** for different stages
- **Error boundaries** for graceful error handling
- **SEO optimization** with proper meta tags
- **Responsive design** with Tailwind CSS

This setup provides a robust, modern React application foundation with excellent developer experience and production-ready deployment capabilities.