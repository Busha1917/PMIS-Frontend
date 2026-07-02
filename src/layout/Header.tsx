import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Bell,
  ChevronRight,
  Globe,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  LogOut,
  User,
  Settings as SettingsIcon,
} from 'lucide-react'
import type { AdminPage, UserRole } from '../types'
import { Drawer } from '../ui/Drawer'
import { Button } from '../ui'
import { useLayout } from '../contexts/LayoutContext'
import { useAuth } from '../hooks/useAuth'
import {
  selectNotifications,
  selectUnreadCount,
  markAllRead,
} from '../store/slices/notificationsSlice'

const PAGE_LABELS: Record<AdminPage, string> = {
  dashboard: 'Dashboard',
  events: 'Events & Visits',
  opportunities: 'Opportunities',
  'opportunities-officer': 'Opportunities — Officer',
  'opportunities-knowledge-director': 'Opportunities — Review',
  'opportunities-division-director': 'Opportunities — Approval',
  engagement: 'Engagement',
  'engagement-ke-director': 'Engagement — Review',
  'engagement-officer': 'Engagement — Officer',
  'engagement-division-director': 'Engagement — Approval',
  agreements: 'Agreements',
  'agreements-officer': 'Agreements — Officer',
  'agreements-legal': 'Agreements — Verification',
  'agreements-ke-director': 'Agreements — Approval',
  partners: 'Partners',
  baseData: 'Base Data',
  users: 'Users',
  roles: 'Roles',
  'permission-actions': 'Permission Actions',
  'permission-resources': 'Permission Resources',
  profile: 'My Profile',
  'audit-logs': 'Audit Logs',
  notifications: 'Notifications',
}

type HeaderProps = {
  activePage: AdminPage
  onNavigate?: (page: AdminPage) => void
  onLogout?: () => void
}

/** Format an ISO timestamp as relative time, e.g. "5m ago", "2h ago", "3d ago" */
function formatRelativeTime(isoTimestamp: string): string {
  const diff = Date.now() - new Date(isoTimestamp).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function Header({ activePage, onNavigate, onLogout }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { breadcrumbSuffix } = useLayout()
  const { user, changeRole } = useAuth()
  const dispatch = useDispatch()

  const notifications = useSelector(selectNotifications)
  const unreadCount = useSelector(selectUnreadCount)

  const pageLabel = PAGE_LABELS[activePage] || 'Profile'
  const isHome = activePage === 'dashboard'

  // Generate initials
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
        <div className="flex h-[72px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-slate-500" aria-label="Breadcrumb">
            <LayoutDashboard className="h-4 w-4 text-slate-400" />
            {!isHome && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="font-semibold text-[#161A61]">{pageLabel}</span>
                {breadcrumbSuffix && (
                  <>
                    <span className="text-slate-300 mx-1">/</span>
                    <span
                      className="text-slate-500 font-medium truncate max-w-[200px]"
                      title={breadcrumbSuffix}
                    >
                      {breadcrumbSuffix}
                    </span>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-2 text-slate-700 md:flex">
              <Globe className="h-5 w-5 text-[#1f2863]" />
              <span className="text-sm font-semibold tracking-[0.01em]">ENG</span>
            </div>

            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#1f2863] hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#ff8a1a] ring-2 ring-white px-1 text-[10px] font-bold text-white leading-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="hidden text-right leading-tight sm:block">
                  <p className="text-[14px] font-semibold text-slate-900">
                    {user?.name || 'Alexander M.'}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email || 'alexmorgan@gmail.com'}</p>
                </div>
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#ff8a1a] bg-[#161A61] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="px-4 py-2 border-b border-slate-100">
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                        Role Simulator
                      </label>
                      <select
                        value={user?.role || ''}
                        onChange={e => changeRole(e.target.value as UserRole)}
                        className="w-full text-sm border border-slate-200 rounded-md py-1 px-2 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10 bg-slate-50 text-slate-700 cursor-pointer"
                      >
                        <option value="admin">System Admin</option>
                        <option value="manager">Manager</option>
                        <option value="viewer">Viewer</option>
                        <option value="Officer">Officer</option>
                        <option value="Director General">Director General</option>
                        <option value="Assigned Person">Assigned Person</option>
                      </select>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          onNavigate?.('profile')
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          // Mock settings route
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <SettingsIcon className="h-4 w-4 text-slate-400" />
                        Account Settings
                      </button>
                    </div>
                    <div className="py-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          onLogout?.()
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <Drawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notifications"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">No notifications</p>
            ) : (
              <div className="space-y-4">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`relative flex gap-4 rounded-xl border p-4 ${
                      !notif.isRead ? 'border-slate-200 bg-slate-50' : 'border-transparent bg-white'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {notif.type === 'success' && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {notif.type === 'warning' && (
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      )}
                      {notif.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                      {notif.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                      <p className="text-sm text-slate-500">{notif.message}</p>
                      <p className="text-xs font-medium text-slate-400">
                        {formatRelativeTime(notif.timestamp)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#ff8a1a]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-slate-200 p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => dispatch(markAllRead())}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}
