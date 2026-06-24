import { navigationItems } from '../data'
import { ChevronRight, LogOut } from 'lucide-react'
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

export function Sidebar({
  activePage,
  collapsed,
  onNavigate,
  onToggleSidebar,
  className,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'relative shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out',
        collapsed ? 'w-[64px]' : 'w-64',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo area */}
        <div className="relative flex items-center justify-center border-b border-slate-100 py-5">
          {collapsed ? (
            <img
              src="/images/logo.png"
              alt="EAII logo"
              className="h-9 w-9 rounded-full border border-slate-200 bg-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <img
                src="/images/logo.png"
                alt="EAII logo"
                className="h-16 w-16 rounded-full border-2 border-[#ff9500]/30 bg-white object-cover shadow-md"
              />
              {!collapsed && (
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  EAII PMIS
                </p>
              )}
            </div>
          )}

          {/* Toggle tab */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="absolute -right-[1px] bottom-0 translate-y-1/2 flex h-8 w-5 items-center justify-center rounded-r-md border border-l-0 border-slate-200 bg-white text-slate-400 shadow-sm transition hover:bg-slate-50 hover:text-slate-600"
          >
            <ChevronRight
              className={cn(
                'h-3 w-3 transition-transform duration-300',
                collapsed ? '' : 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          {groups.map(group => {
            const groupItems = navigationItems.filter(item => item.group === group)

            return (
              <div key={group} className="mb-2">
                {group !== 'DASHBOARD' && !collapsed && (
                  <p className="px-4 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-widest text-[#ff9500]/80">
                    {group}
                  </p>
                )}
                {group !== 'DASHBOARD' && collapsed && (
                  <div className="mb-1 mt-2 mx-3 border-t border-slate-100" />
                )}

                <div className="space-y-0.5 px-2">
                  {groupItems.map(item => {
                    const Icon = item.icon
                    const isActive = activePage === item.page

                    return (
                      <button
                        key={item.label}
                        type="button"
                        title={collapsed ? item.label : undefined}
                        onClick={() => onNavigate(item.page)}
                        className={cn(
                          'relative flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                          collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5 text-left',
                          isActive
                            ? 'bg-[#161A61] text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        {/* Active left indicator */}
                        {isActive && !collapsed && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#ff9500]" />
                        )}
                        <Icon className={cn('flex-shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')} />
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer — Logout */}
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onLogout}
            className={cn(
              'flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200 text-slate-500 hover:bg-red-50 hover:text-red-600',
              collapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2.5'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
