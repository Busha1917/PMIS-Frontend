import { Bell, ChevronRight, Globe, LayoutDashboard } from 'lucide-react'
import type { AdminPage } from '../types'

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

export function Header({ activePage }: HeaderProps) {
  const pageLabel = PAGE_LABELS[activePage]
  const isHome = activePage === 'dashboard'

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
      <div className="flex h-[72px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500" aria-label="Breadcrumb">
          <LayoutDashboard className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-400">Home</span>
          {!isHome && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="font-semibold text-[#161A61]">{pageLabel}</span>
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
  )
}
