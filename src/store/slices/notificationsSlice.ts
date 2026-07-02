import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { NotificationRecord } from '../../types'
import type { RootState } from '../index'
import { notifications as seedNotifications } from '../../data'

type NotificationsState = {
  items: NotificationRecord[]
}

const initialState: NotificationsState = {
  items: seedNotifications,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<NotificationRecord, 'id'>>) {
      const newNotification: NotificationRecord = {
        ...action.payload,
        id: `notif-${Date.now()}`,
      }
      state.items.unshift(newNotification)
    },
    markRead(state, action: PayloadAction<string>) {
      const notification = state.items.find(item => item.id === action.payload)
      if (notification) {
        notification.isRead = true
      }
    },
    markAllRead(state) {
      state.items.forEach(item => {
        item.isRead = true
      })
    },
    deleteNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
  },
})

export const { addNotification, markRead, markAllRead, deleteNotification } =
  notificationsSlice.actions

// Selectors
export const selectNotifications = (state: RootState) => state.notifications.items
export const selectUnreadCount = (state: RootState) =>
  state.notifications.items.filter(item => !item.isRead).length

export default notificationsSlice.reducer
