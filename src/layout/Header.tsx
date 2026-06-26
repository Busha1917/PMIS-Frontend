import { useState } from 'react'
import {
  Bell,
  ChevronRight,
  Globe,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react'
import type { AdminPage } from '../types'
import { Drawer } from '../ui/Drawer'
import { Button } from '../ui'
import { useLayout } from '../contexts/LayoutContext'

const PAGE_LABELS: Record<AdminPage, string> = {
  dashboard: 'Dashboard',
  events: 'Events & Visits',
  opportunities: 'Opportunities',
  engagement: 'Engagement',
  agreements: 'Agreements',
  partners: 'Partners',
  baseData: 'Base Data',
  users: 'Users',
  roles: 'Roles',
}

type HeaderProps = {
  activePage: AdminPage
}

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Partnership Agreement',
    message: 'A new agreement with Ministry of Tech has been drafted.',
    time: '5m ago',
    type: 'info',
    unread: true,
  },
  {
    id: 11,
    title: 'Gemechis Gebeyehu is kidnapped',
    message: 'A new agreement with Ministry of Tech has been drafted.',
    time: '5m ago',
    type: 'error',
    unread: true,
  },
  {
    id: 2,
    title: 'Visit Scheduled',
    message: 'Global Corp visit scheduled for next Tuesday at 10:00 AM.',
    time: '2h ago',
    type: 'success',
    unread: true,
  },
  {
    id: 3,
    title: 'Follow-up Required',
    message: 'Engagement follow-up with DataCorp is due today.',
    time: '1d ago',
    type: 'warning',
    unread: false,
  },
]

export function Header({ activePage }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { breadcrumbSuffix } = useLayout()
  const pageLabel = PAGE_LABELS[activePage]
  const isHome = activePage === 'dashboard'

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
              <span className="absolute right-1.5 top-1.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#ff8a1a] ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-[14px] font-semibold text-slate-900">Alexander M.</p>
                <p className="text-xs text-slate-500">alexmorgan@gmail.com</p>
              </div>
              <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#ff8a1a] bg-slate-100 flex-shrink-0">
                <img
                  src="/images/image1.png"
                  alt="Alexander M."
                  className="h-full w-full object-cover object-center"
                />
              </div>
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
            <div className="space-y-4">
              {MOCK_NOTIFICATIONS.map(notif => (
                <div
                  key={notif.id}
                  className={`relative flex gap-4 rounded-xl border p-4 ${
                    notif.unread ? 'border-slate-200 bg-slate-50' : 'border-transparent bg-white'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'success' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {notif.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500" />}
                    {notif.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                    <p className="text-sm text-slate-500">{notif.message}</p>
                    <p className="text-xs font-medium text-slate-400">{notif.time}</p>
                  </div>
                  {notif.unread && (
                    <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#ff8a1a]" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200 p-4">
            <Button variant="outline" className="w-full">
              Mark all as read
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}
