import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

type UserRole = 'admin' | 'manager' | 'viewer' | 'Officer' | 'Director General' | 'Assigned Person'

type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

type AuthState = {
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
}

const TOKEN_KEY = 'access_token'

// Rehydrate from localStorage so auth survives page refresh
const storedToken = localStorage.getItem(TOKEN_KEY)

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  user: null,
  accessToken: storedToken,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.accessToken = action.payload.token
      localStorage.setItem(TOKEN_KEY, action.payload.token)
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { loginSuccess, logout, updateUser } = authSlice.actions

// Selectors
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectAccessToken = (state: RootState) => state.auth.accessToken
export const selectUserRole = (state: RootState) => state.auth.user?.role ?? null

export default authSlice.reducer
