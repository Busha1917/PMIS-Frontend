import { navigationItems } from '../data'
import { X } from 'lucide-react'
import type { AdminPage } from '../types'
import { Button } from '../ui'
import { cn } from '../utils'

type SidebarProps = {
  activePage: AdminPage
  onNavigate: (page: AdminPage) => void
  onToggleSidebar?: () => void
  className?: string
}

const groups = ['DASHBOARD', 'MAIN', 'BASE DATA', 'USER MANAGEMENT'] as const

export function Sidebar({ activePage, onNavigate, onToggleSidebar, className }: SidebarProps) {
  return (
    <aside className={cn('w-72 shrink-0 border-r border-slate-200 bg-white', className)}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-6">
          <div className="flex flex-1 justify-center">
            <img src="/images/logo.png" alt="EAII logo" className="h-20 w-20 rounded-full border-2 border-slate-100 bg-white object-cover shadow-sm" />
          </div>
          <Button
            variant="ghost"
            iconOnly
            className="rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 p-2"
            onClick={onToggleSidebar}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => {
            const groupItems = navigationItems.filter((item) => item.group === group)
            
            return (
              <div key={group} className="mb-4">
                <p className="px-3 pb-3 text-xs font-bold uppercase tracking-widest text-[#ff9500]">
                  {group}
                </p>
                <div className="space-y-2">
                  {groupItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activePage === item.page

                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => onNavigate(item.page)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200',
                          isActive
                            ? 'bg-[#161A61] text-white shadow-md'
                            : 'text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-bold text-slate-900">EAII Partnership System</p>
            <p className="mt-1 text-xs leading-relaxed">Mock data dashboard ready for extension.</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
