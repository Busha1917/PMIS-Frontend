import { useState } from 'react'
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [page, setPage] = useState<AdminPage>('dashboard')

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />
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

  return (
    <AppLayout
      activePage={page}
      title={page === 'dashboard' ? 'Dashboard' : ''}
      description="Partnership Management Information System — Overview"
      onNavigate={setPage}
    >
      {renderPage()}
    </AppLayout>
  )
}

export default App
