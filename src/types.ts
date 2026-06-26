import type { LucideIcon } from 'lucide-react'

export type AdminPage =
  | 'dashboard'
  | 'events'
  | 'opportunities'
  | 'engagement'
  | 'agreements'
  | 'partners'
  | 'baseData'
  | 'users'
  | 'roles'
  | 'permission-actions'
  | 'permission-resources'
  | 'profile'
  | 'audit-logs'
  | 'notifications'

export type NotificationRecord = {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  timestamp: string
  link?: string
}

export type AuditLogRecord = {
  id: string
  action: string
  module: string
  user: string
  timestamp: string
  details: string
}

export type NavigationItem = {
  label: string
  page: AdminPage
  icon: LucideIcon
  group: string
}

export type UserStatus = 'Active' | 'Pending' | 'Inactive'

export type UserRecord = {
  id: string
  no: number
  name: string
  email: string
  phone: string
  position: string
  status: UserStatus
}

export type PermissionActionRecord = {
  id: number
  action: string
}

export type PermissionResourceRecord = {
  id: number
  name: string
}

export type RolePermissionResource = {
  permission_resource_id: number
  rolePermissionResourceActions: { permission_action_id: number }[]
}

export type RoleRecord = {
  id: string
  no: number
  name: string
  description: string
  rolePermissionResources: RolePermissionResource[]
}

export type EventRecord = {
  id: string
  no: number
  title: string
  type: string
  date: string
  venue: string
  status: string
}

export type OpportunityRecord = {
  id: string
  no: number
  title: string
  source: string
  date: string
  division: string
  status: string
}

export type EngagementRecord = {
  id: string
  no: number
  type: string
  date: string
  status: string
}

export type AgreementRecord = {
  id: string
  no: number
  title: string
  type: string
  date: string
  startDate: string
  endDate: string
  status: string
}

export type PartnerRecord = {
  id: string
  no: number
  name: string
  type: string
  country: string
  organization: string
  contact: string
  status: string
}

export type BaseDataItem = {
  id: string
  title: string
  description: string
}

export type PermissionRecord = {
  id: string
  key: string
  description: string
  group: string
}
