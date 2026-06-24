import type { ReactNode } from 'react'
import { Search, Users } from 'lucide-react'
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
  onLogout?: () => void
}

export function AppLayout({
  activePage,
  title,
  description,
  hideHeader = false,
  children,
  onNavigate,
  sidebarOpen = true,
  onToggleSidebar,
  onLogout,
}: AppLayoutProps) {
  return (
    <div className="h-screen bg-slate-50 text-slate-950 overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar — always visible, collapses to icon-only */}
        <Sidebar
          activePage={activePage}
          collapsed={!sidebarOpen}
          onNavigate={onNavigate}
          onToggleSidebar={onToggleSidebar}
          onLogout={onLogout}
        />

        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          <Header title={title ?? ''} />
          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
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
