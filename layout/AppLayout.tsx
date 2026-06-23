import type { ReactNode } from 'react'
import { Menu, Search, Users } from 'lucide-react'
import { Button } from '../ui'
import type { AdminPage } from '../types'
import { Footer } from './Footer'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

type AppLayoutProps = {
  activePage: AdminPage
  title?: string
  description?: string
  hideHeader?: boolean
  children: ReactNode
  onNavigate: (page: AdminPage) => void
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
}

export function AppLayout({
  activePage,
  title,
  description,
  hideHeader = false,
  children,
  onNavigate,
  sidebarOpen = false,
  onToggleSidebar,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        {sidebarOpen ? (
          <div className="fixed inset-0 z-20 bg-slate-950/20 lg:hidden" onClick={onToggleSidebar} />
        ) : null}
        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          onToggleSidebar={onToggleSidebar}
          className={sidebarOpen ? 'fixed inset-y-0 left-0 z-30 block lg:static lg:block' : 'hidden'}
        />
        {!sidebarOpen ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-lg transition hover:bg-slate-50"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}
        <div className="flex min-h-screen flex-1 flex-col">
          <Header title={title ?? ''} onToggleSidebar={onToggleSidebar} />
          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            {!hideHeader && title && (
              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-950">
                    {title}
                  </h1>
                  {description && (
                    <p className="mt-1 max-w-3xl text-sm text-slate-600">
                      {description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                    Export
                  </Button>
                  <Button>
                    <Users className="h-4 w-4" />
                    Add Record
                  </Button>
                </div>
              </div>
            )}
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
