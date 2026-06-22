import { navigationItems } from '../data'
import type { AdminPage } from '../types'
import { cn } from '../utils'

type SidebarProps = {
  activePage: AdminPage
  onNavigate: (page: AdminPage) => void
}

const groups = ['MAIN', 'BASE DATA', 'USER MANAGEMENT'] as const

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-5 py-6">
          <img src="/images/logo.png" alt="EAII logo" className="h-14 w-14 rounded-full border-2 border-slate-100 bg-white object-cover shadow-sm" />
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
                            ? 'bg-[#001f3f] text-white shadow-md'
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
