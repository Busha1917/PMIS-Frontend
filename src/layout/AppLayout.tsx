import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
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
          <Header activePage={activePage} />
          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </div>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </div>
  )
}
