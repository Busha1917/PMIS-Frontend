import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { toast } from 'sonner'

// Central Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 15000, // 15 seconds request timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor: Attach authentication token
apiClient.interceptors.request.use(
  config => {
    // E.g., Retrieve the current JWT token from local storage, session storage, or memory
    // When Keycloak integration is finalized, read from keycloak.token
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Track if we're already refreshing to avoid parallel refresh storms
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

// Response Interceptor: Global error handlers & notifications
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const data = error.response?.data as any
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Attempt transparent token refresh on 401 (unless this is already a retry or an auth endpoint)
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      const storedRefresh = localStorage.getItem('refresh_token')
      if (storedRefresh) {
        if (!isRefreshing) {
          isRefreshing = true
          originalRequest._retry = true
          try {
            const { data: refreshData } = await apiClient.post('/auth/refresh', {
              refreshToken: storedRefresh,
            })
            const newAccess = refreshData?.data?.accessToken ?? refreshData?.accessToken
            const newRefresh = refreshData?.data?.refreshToken ?? refreshData?.refreshToken
            if (newAccess) {
              localStorage.setItem('access_token', newAccess)
              if (newRefresh) localStorage.setItem('refresh_token', newRefresh)
              apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`
              onTokenRefreshed(newAccess)
              isRefreshing = false
              // Retry original request with new token
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${newAccess}`
              }
              return apiClient(originalRequest)
            }
          } catch {
            isRefreshing = false
            refreshSubscribers = []
          }
        } else {
          // Queue subsequent requests until refresh completes
          return new Promise(resolve => {
            refreshSubscribers.push((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
              }
              resolve(apiClient(originalRequest))
            })
          })
        }
      }
      // Refresh failed or no refresh token — force logout
      toast.error('Session expired. Please log in again.')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.dispatchEvent(new Event('auth:unauthorized'))
      return Promise.reject(error)
    }

    // Friendly error message extraction
    const errorMessage = data?.message || error.message || 'An unexpected error occurred'

    switch (status) {
      case 403:
        // Forbidden: lack of permissions
        toast.error('Access Denied: You do not have permission to perform this action.')
        break

      case 404:
        // Not Found
        toast.error(`Resource not found: ${errorMessage}`)
        break

      case 409:
        toast.error(errorMessage)
        break

      case 500:
      case 502:
      case 503:
      case 504:
        // Server Errors
        toast.error(`Server Error (${status}): Please try again later.`)
        break

      default:
        // Network connection issues or unhandled statuses
        if (error.code === 'ECONNABORTED') {
          toast.error('Connection timed out. Please check your network.')
        } else if (!error.response) {
          toast.error('Network Error: Unable to reach the server.')
        } else if (status !== 401) {
          toast.error(errorMessage)
        }
        break
    }

    return Promise.reject(error)
  }
)

/**
 * Custom base query wrapper for RTK Query that routes all endpoint requests
 * through our centralized Axios client with interceptors, timeouts, and error toasts.
 */
export const axiosBaseQuery =
  (): BaseQueryFn<{
    url: string
    method: AxiosRequestConfig['method']
    data?: AxiosRequestConfig['data']
    params?: AxiosRequestConfig['params']
    headers?: AxiosRequestConfig['headers']
  }> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await apiClient({ url, method, data, params, headers })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || err.message,
        },
      }
    }
  }

export default apiClient
