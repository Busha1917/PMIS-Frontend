import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import {
  loginSuccess,
  logout,
  selectIsAuthenticated,
  selectCurrentUser,
  selectUserRole,
  selectAccessToken,
} from '@/store/slices/authSlice'
import type { AppDispatch } from '@/store'

/**
 * useAuth — central hook for authentication state and actions.
 *
 * Usage:
 *   const { isAuthenticated, user, login, logout } = useAuth()
 */
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)
  const role = useSelector(selectUserRole)
  const token = useSelector(selectAccessToken)

  /** Call after a successful login API response */
  const login = useCallback(
    (payload: {
      user: {
        id: string
        name: string
        email: string
        role: 'admin' | 'manager' | 'viewer' | 'Officer' | 'Director General' | 'Assigned Person'
      }
      token: string
    }) => {
      dispatch(loginSuccess(payload))
    },
    [dispatch]
  )

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  /** Simple role-based permission check */
  const hasRole = useCallback(
    (required: 'admin' | 'manager' | 'viewer') => {
      const levels: Record<string, number> = {
        admin: 3,
        manager: 2,
        viewer: 1,
        'Director General': 4,
        Officer: 2,
        'Assigned Person': 2,
      }
      return role !== null && (levels[role] || 0) >= levels[required]
    },
    [role]
  )

  const changeRole = useCallback(
    (
      newRole: 'admin' | 'manager' | 'viewer' | 'Officer' | 'Director General' | 'Assigned Person'
    ) => {
      dispatch({ type: 'auth/updateUser', payload: { role: newRole } })
    },
    [dispatch]
  )

  return {
    isAuthenticated,
    user,
    role,
    token,
    login,
    logout: handleLogout,
    hasRole,
    changeRole,
  }
}
