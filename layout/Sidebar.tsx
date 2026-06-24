import { navigationItems } from '../data'
import { Menu, LogOut } from 'lucide-react'
import type { AdminPage } from '../types'
import { cn } from '../utils'

type SidebarProps = {
  activePage: AdminPage
  collapsed: boolean
  onNavigate: (page: AdminPage) => void
  onToggleSidebar?: () => void
  className?: string
  onLogout?: () => void
}

const groups = ['DASHBOARD', 'MAIN', 'BASE DATA', 'USER MANAGEMENT'] as const

export function Sidebar({ activePage, collapsed, onNavigate, onToggleSidebar, className, onLogout }: SidebarProps) {
  return (
    <aside
      className={cn(
        'relative shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out',
        collapsed ? 'w-[60px]' : 'w-60',
        className
      )}
    >
      <div className="flex h-full flex-col">

        {/* Header — logo centered, toggle tab at right edge */}
        <div className="relative flex items-center justify-center border-b border-slate-200 py-6">
          {collapsed ? (
            /* Collapsed: small logo icon only */
            <img
              src="/images/logo.png"
              alt="EAII logo"
              className="h-9 w-9 rounded-full border border-slate-200 bg-white object-cover shadow-sm"
            />
          ) : (
            /* Expanded: full logo */
            <img
              src="/images/logo.png"
              alt="EAII logo"
              className="h-20 w-20 rounded-full border-2 border-slate-100 bg-white object-cover shadow-sm"
            />
          )}

          {/* Toggle tab — always at right edge */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="absolute -right-[1px] bottom-0 translate-y-1/2 flex h-10 w-6 items-center justify-center rounded-r-lg border border-l-0 border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          {groups.map((group) => {
            const groupItems = navigationItems.filter((item) => item.group === group)

            return (
              <div key={group} className="mb-4">
                {/* Group label — only visible when expanded */}
                {group !== 'DASHBOARD' && !collapsed && (
                  <p className="px-4 pb-2 text-xs font-bold uppercase tracking-widest text-[#ff9500]">
                    {group}
                  </p>
                )}
                {/* Spacer in collapsed mode between groups */}
                {group !== 'DASHBOARD' && collapsed && <div className="mb-1" />}

                <div className="space-y-1">
                  {groupItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activePage === item.page

                    return (
                      <button
                        key={item.label}
                        type="button"
                        title={collapsed ? item.label : undefined}
                        onClick={() => onNavigate(item.page)}
                        className={cn(
                          'flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                          collapsed
                            ? 'justify-center px-0 py-3'
                            : 'gap-3 px-4 py-3 text-left',
                          isActive
                            ? 'bg-[#161A61] text-white shadow-md'
                            : 'text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {/* Label — hidden when collapsed */}
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer — Logout button */}
        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={onLogout}
            className={cn(
              'flex items-center rounded-xl text-sm font-semibold transition-all duration-200',
              collapsed
                ? 'justify-center w-full py-3 text-slate-500 hover:bg-red-50 hover:text-[#ff383c]'
                : 'w-full gap-3 px-4 py-3 text-left text-slate-700 hover:bg-red-50 hover:text-[#ff383c]'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
