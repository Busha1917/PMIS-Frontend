import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AppLayout } from '@/layout/AppLayout'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { Skeleton } from '@/ui'
import type { AdminPage } from '@/types'

// Lazy-loaded pages — each page is a separate JS chunk downloaded on first visit
const AdminDashboard = lazy(() =>
  import('@/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard }))
)
const BaseDataPage = lazy(() =>
  import('@/pages/BaseDataPage').then(m => ({ default: m.BaseDataPage }))
)
const EventsVisitsPage = lazy(() =>
  import('@/features/events/EventsVisitsPage').then(m => ({ default: m.EventsVisitsPage }))
)
const OpportunitiesPage = lazy(() =>
  import('@/features/opportunities/OpportunitiesPage').then(m => ({ default: m.OpportunitiesPage }))
)
const OfficerOpportunitiesPage = lazy(() =>
  import('@/features/opportunities/OfficerOpportunitiesPage').then(m => ({
    default: m.OfficerOpportunitiesPage,
  }))
)
const KnowledgeDirectorPage = lazy(() =>
  import('@/features/opportunities/KnowledgeDirectorPage').then(m => ({
    default: m.KnowledgeDirectorPage,
  }))
)
const DivisionDirectorPage = lazy(() =>
  import('@/features/opportunities/DivisionDirectorPage').then(m => ({
    default: m.DivisionDirectorPage,
  }))
)
const EngagementPage = lazy(() =>
  import('@/features/engagement/EngagementPage').then(m => ({ default: m.EngagementPage }))
)
const AgreementsPage = lazy(() =>
  import('@/features/agreements/AgreementsPage').then(m => ({ default: m.AgreementsPage }))
)
const PartnersPage = lazy(() =>
  import('@/features/partners/PartnersPage').then(m => ({ default: m.PartnersPage }))
)
const RolesPage = lazy(() => import('@/pages/RolesPage').then(m => ({ default: m.RolesPage })))
const PermissionActionsPage = lazy(() =>
  import('@/pages/PermissionActionsPage').then(m => ({ default: m.PermissionActionsPage }))
)
const PermissionResourcesPage = lazy(() =>
  import('@/pages/PermissionResourcesPage').then(m => ({ default: m.PermissionResourcesPage }))
)
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage }))
)
const AuditLogsPage = lazy(() =>
  import('@/pages/AuditLogsPage').then(m => ({ default: m.AuditLogsPage }))
)
const NotificationsPage = lazy(() =>
  import('@/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage }))
)
const UsersPage = lazy(() => import('@/pages/UsersPage').then(m => ({ default: m.UsersPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))

// Full-page skeleton shown while a lazy page chunk is loading
function PageLoadingFallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="mt-2 h-64 rounded-2xl" />
    </div>
  )
}

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
  'opportunities-officer': {
    path: '/opportunities/officer',
    title: 'Opportunities — Officer',
    description: 'Register and manage partnership opportunities.',
  },
  'opportunities-knowledge-director': {
    path: '/opportunities/review',
    title: 'Opportunities — Review',
    description: 'Review registered opportunities and send for approval.',
  },
  'opportunities-division-director': {
    path: '/opportunities/approval',
    title: 'Opportunities — Approval',
    description: 'Approve or reject opportunities sent for final decision.',
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
    description: 'Register and manage base data.',
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
  'permission-actions': {
    path: '/permission-actions',
    title: 'Permission Actions',
    description: 'Manage the actions that can be performed on resources.',
  },
  'permission-resources': {
    path: '/permission-resources',
    title: 'Permission Resources',
    description: 'Manage the resources that can be protected.',
  },
  profile: {
    path: '/profile',
    title: 'My Profile',
    description: 'Manage your profile and view your permissions.',
  },
  'audit-logs': {
    path: '/audit-logs',
    title: 'Audit Logs',
    description: 'Track system events and user activity.',
  },
  notifications: {
    path: '/notifications',
    title: 'Notifications',
    description: 'Manage your alerts and stay up to date with system activities.',
  },
}

const pathToPage: Record<string, AdminPage> = Object.fromEntries(
  Object.entries(pageRoutes).map(([page, data]) => [data.path, page])
) as Record<string, AdminPage>

function getPageFromPath(pathname: string): AdminPage {
  return pathToPage[pathname.toLowerCase()] ?? 'dashboard'
}

function App() {
  const { isAuthenticated, login, logout } = useAuth()
  const [page, setPage] = useState<AdminPage>(() => getPageFromPath(window.location.pathname))
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

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

  const handleToggleSidebar = () => {
    setSidebarOpen(current => !current)
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <AdminDashboard />
      case 'events':
        return <EventsVisitsPage />
      case 'opportunities':
        return <OpportunitiesPage />
      case 'opportunities-officer':
        return <OfficerOpportunitiesPage />
      case 'opportunities-knowledge-director':
        return <KnowledgeDirectorPage />
      case 'opportunities-division-director':
        return <DivisionDirectorPage />
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
      case 'audit-logs':
        return <AuditLogsPage />
      case 'notifications':
        return <NotificationsPage />
      case 'roles':
        return <RolesPage />
      case 'permission-actions':
        return <PermissionActionsPage />
      case 'permission-resources':
        return <PermissionResourcesPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <AdminDashboard />
    }
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <LoginPage
          onLogin={() =>
            login({
              user: { id: 'local', name: 'Admin', email: 'admin@pmis.et', role: 'admin' },
              token: 'mock-token',
            })
          }
        />
      </Suspense>
    )
  }

  return (
    <>
      <AppLayout
        activePage={page}
        title={pageMeta.title}
        description={pageMeta.description}
        hideHeader={false}
        onNavigate={handleNavigate}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onLogout={() => setShowLogoutModal(true)}
      >
        <Suspense fallback={<PageLoadingFallback />}>{renderPage()}</Suspense>
      </AppLayout>

      <ConfirmationModal
        open={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to log out of the EAII Partnership System?"
        cancelLabel="Cancel"
        confirmLabel="Logout"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false)
          logout()
        }}
      />
    </>
  )
}

export default App
