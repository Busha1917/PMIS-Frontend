import { useEffect, useMemo, useState } from 'react'
import { AdminDashboard } from '../pages/AdminDashboard'
import { AppLayout } from '../layout/AppLayout'
import { BaseDataPage } from '../pages/BaseDataPage'
import { EventsVisitsPage } from '../pages/EventsVisitsPage'
import { OpportunitiesPage } from '../pages/OpportunitiesPage'
import { EngagementPage } from '../pages/EngagementPage'
import { AgreementsPage } from '../pages/AgreementsPage'
import { PartnersPage } from '../pages/PartnersPage'
import { RolesPage } from '../pages/RolesPage'
import { UsersPage } from '../pages/UsersPage'
import { LoginPage } from '../pages/LoginPage'
import type { AdminPage } from '../types'

const pageRoutes: Record<AdminPage, { path: string; title: string; description: string }> = {
  dashboard: {
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Partnership Management Information System — Overview',
  },
  events: {
    path: '/events',
    title: 'Events & Visits',
    description: 'Manage events and site visits for partner engagements.',
  },
  opportunities: {
    path: '/opportunities',
    title: 'Opportunities',
    description: 'Track active and new partnership opportunities.',
  },
  engagement: {
    path: '/engagement',
    title: 'Engagement',
    description: 'View engagement records and follow-up activity.',
  },
  agreements: {
    path: '/agreements',
    title: 'Agreements',
    description: 'Manage partnership agreements and MoU records.',
  },
  partners: {
    path: '/partners',
    title: 'Partners',
    description: 'Browse partner organizations and contact details.',
  },
  baseData: {
    path: '/base-data',
    title: 'Base Data',
    description: 'Configure core reference data for the system.',
  },
  users: {
    path: '/users',
    title: 'Users',
    description: 'Manage user accounts and access rights.',
  },
  roles: {
    path: '/roles',
    title: 'Roles',
    description: 'Define roles and permission groups.',
  },
}

const pathToPage: Record<string, AdminPage> = Object.fromEntries(
  Object.entries(pageRoutes).map(([page, data]) => [data.path, page])
) as Record<string, AdminPage>

function getPageFromPath(pathname: string): AdminPage {
  return pathToPage[pathname.toLowerCase()] ?? 'dashboard'
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [page, setPage] = useState<AdminPage>(() => getPageFromPath(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      if (window.location.pathname !== '/login') {
        window.history.replaceState({}, '', '/login')
      }
      return
    }

    const desiredPath = pageRoutes[page].path
    if (window.location.pathname !== desiredPath) {
      window.history.replaceState({}, '', desiredPath)
    }
  }, [isAuthenticated, page])

  const pageMeta = useMemo(() => pageRoutes[page], [page])

  const handleNavigate = (nextPage: AdminPage) => {
    setPage(nextPage)
    const nextPath = pageRoutes[nextPage].path
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <AdminDashboard />
      case 'events':
        return <EventsVisitsPage />
      case 'opportunities':
        return <OpportunitiesPage />
      case 'engagement':
        return <EngagementPage />
      case 'agreements':
        return <AgreementsPage />
      case 'partners':
        return <PartnersPage />
      case 'baseData':
        return <BaseDataPage />
      case 'users':
        return <UsersPage />
      case 'roles':
        return <RolesPage />
      default:
        return <AdminDashboard />
    }
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <AppLayout
      activePage={page}
      title={pageMeta.title}
      description={pageMeta.description}
      onNavigate={handleNavigate}
    >
      {renderPage()}
    </AppLayout>
  )
}

export default App
