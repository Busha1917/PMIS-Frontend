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

// Response Interceptor: Global error handlers & notifications
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const data = error.response?.data as any

    // Friendly error message extraction
    const errorMessage = data?.message || error.message || 'An unexpected error occurred'

    switch (status) {
      case 401:
        // Unauthorized: token expired or missing
        // In the future, trigger silent refresh token or redirect to Keycloak login
        toast.error('Session expired. Please log in again.')
        localStorage.removeItem('access_token')
        // Optional redirect: window.location.href = '/login'
        break

      case 403:
        // Forbidden: lack of permissions
        toast.error('Access Denied: You do not have permission to perform this action.')
        break

      case 404:
        // Not Found
        toast.error(`Resource not found: ${errorMessage}`)
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
        } else {
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
