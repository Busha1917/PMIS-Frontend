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
const OfficerEventsPage = lazy(() =>
  import('@/features/events/OfficerEventsPage').then(m => ({ default: m.OfficerEventsPage }))
)
const DirectorGeneralEventsPage = lazy(() =>
  import('@/features/events/DirectorGeneralEventsPage').then(m => ({
    default: m.DirectorGeneralEventsPage,
  }))
)
const AssignedPersonEventsPage = lazy(() =>
  import('@/features/events/AssignedPersonEventsPage').then(m => ({
    default: m.AssignedPersonEventsPage,
  }))
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
const KEDirectorEngagementPage = lazy(() =>
  import('@/features/engagement/KEDirectorEngagementPage').then(m => ({
    default: m.KEDirectorEngagementPage,
  }))
)
const OfficerEngagementPage = lazy(() =>
  import('@/features/engagement/OfficerEngagementPage').then(m => ({
    default: m.OfficerEngagementPage,
  }))
)
const DivisionDirectorEngagementPage = lazy(() =>
  import('@/features/engagement/DivisionDirectorEngagementPage').then(m => ({
    default: m.DivisionDirectorEngagementPage,
  }))
)
const AgreementsPage = lazy(() =>
  import('@/features/agreements/AgreementsPage').then(m => ({ default: m.AgreementsPage }))
)
const OfficerAgreementPage = lazy(() =>
  import('@/features/agreements/OfficerAgreementPage').then(m => ({
    default: m.OfficerAgreementPage,
  }))
)
const LegalOfficerAgreementPage = lazy(() =>
  import('@/features/agreements/LegalOfficerAgreementPage').then(m => ({
    default: m.LegalOfficerAgreementPage,
  }))
)
const KEDirectorAgreementPage = lazy(() =>
  import('@/features/agreements/KEDirectorAgreementPage').then(m => ({
    default: m.KEDirectorAgreementPage,
  }))
)
const PartnersPage = lazy(() =>
  import('@/features/partners/PartnersPage').then(m => ({ default: m.PartnersPage }))
)
const OfficerPartnerPage = lazy(() =>
  import('@/features/partners/OfficerPartnerPage').then(m => ({ default: m.default }))
)
const KEDirectorPartnerPage = lazy(() =>
  import('@/features/partners/KEDirectorPartnerPage').then(m => ({
    default: m.KEDirectorPartnerPage,
  }))
)
const DivisionDirectorPartnerPage = lazy(() =>
  import('@/features/partners/DivisionDirectorPartnerPage').then(m => ({
    default: m.DivisionDirectorPartnerPage,
  }))
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

// Collaboration pages
const ProjectsPage = lazy(() =>
  import('@/features/collaboration/ProjectsPage').then(m => ({ default: m.ProjectsPage }))
)
const OfficerProjectsPage = lazy(() =>
  import('@/features/collaboration/OfficerProjectsPage').then(m => ({
    default: m.OfficerProjectsPage,
  }))
)
const DivisionDirectorProjectsPage = lazy(() =>
  import('@/features/collaboration/DivisionDirectorProjectsPage').then(m => ({
    default: m.DivisionDirectorProjectsPage,
  }))
)
const ActivitiesPage = lazy(() =>
  import('@/features/collaboration/ActivitiesPage').then(m => ({ default: m.ActivitiesPage }))
)
const OfficerActivitiesPage = lazy(() =>
  import('@/features/collaboration/OfficerActivitiesPage').then(m => ({
    default: m.OfficerActivitiesPage,
  }))
)
const DivisionDirectorActivitiesPage = lazy(() =>
  import('@/features/collaboration/DivisionDirectorActivitiesPage').then(m => ({
    default: m.DivisionDirectorActivitiesPage,
  }))
)
const GrantsPage = lazy(() =>
  import('@/features/collaboration/GrantsPage').then(m => ({ default: m.GrantsPage }))
)
const ContributionsPage = lazy(() =>
  import('@/features/collaboration/ContributionsPage').then(m => ({ default: m.ContributionsPage }))
)

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
  'events-officer': {
    path: '/events/officer',
    title: 'Events & Visits — Officer',
    description: 'Create and submit events and site visits.',
  },
  'events-director-general': {
    path: '/events/director-general',
    title: 'Events & Visits — Director General',
    description: 'Review submitted events and assign outcomes.',
  },
  'events-assigned-person': {
    path: '/events/assigned-person',
    title: 'Events & Visits — Assigned Person',
    description: 'Fill outcomes for events assigned to you.',
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
  'engagement-ke-director': {
    path: '/engagement/review',
    title: 'Engagement — Review',
    description: 'Review approved opportunities and assign officers.',
  },
  'engagement-officer': {
    path: '/engagement/officer',
    title: 'Engagement — Officer',
    description: 'Fill in engagement details assigned to you.',
  },
  'engagement-division-director': {
    path: '/engagement/approval',
    title: 'Engagement — Approval',
    description: 'Approve or reject submitted engagement records.',
  },
  agreements: {
    path: '/agreements',
    title: 'Agreements',
    description: 'Manage partnership agreements and MoU records.',
  },
  'agreements-officer': {
    path: '/agreements/officer',
    title: 'Agreements — Officer',
    description: 'Fill in and submit agreement details for approved engagements.',
  },
  'agreements-legal': {
    path: '/agreements/legal',
    title: 'Agreements — Verification',
    description: 'Verify submitted agreements as Legal Officer.',
  },
  'agreements-ke-director': {
    path: '/agreements/approval',
    title: 'Agreements — Approval',
    description: 'Approve or reject verified agreements as KE Director.',
  },
  partners: {
    path: '/partners',
    title: 'Partners',
    description: 'Browse partner organizations and contact details.',
  },
  'partners-officer': {
    path: '/partners/officer',
    title: 'Partners — Officer',
    description: 'Register partnership organizations from approved agreements.',
  },
  'partners-ke-director': {
    path: '/partners/verification',
    title: 'Partners — Verification',
    description: 'Verify submitted partner registrations as KE Director.',
  },
  'partners-division-director': {
    path: '/partners/approval',
    title: 'Partners — Approval',
    description: 'Approve or reject verified partners as Division Director.',
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
  'collaboration-projects': {
    path: '/collaboration/projects',
    title: 'Project Collaborations',
    description: 'Track programmatic tech project execution with partners',
  },
  'collaboration-projects-officer': {
    path: '/collaboration/projects/officer',
    title: 'Projects — Officer',
    description: 'Create and manage project collaboration records',
  },
  'collaboration-projects-division-director': {
    path: '/collaboration/projects/approval',
    title: 'Projects — Division Director',
    description: 'Review and approve project collaboration records',
  },
  'collaboration-activities': {
    path: '/collaboration/activities',
    title: 'Joint Activities',
    description: 'Manage standalone activity modules and mutual events',
  },
  'collaboration-grants': {
    path: '/collaboration/grants',
    title: 'Funding & Grants',
    description: 'Manage incoming and outgoing fiscal grant vehicles',
  },
  'collaboration-contributions': {
    path: '/collaboration/contributions',
    title: 'Resource Contributions',
    description: 'Track monetary and non-monetary investments',
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
      case 'events-officer':
        return <OfficerEventsPage />
      case 'events-director-general':
        return <DirectorGeneralEventsPage />
      case 'events-assigned-person':
        return <AssignedPersonEventsPage />
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
      case 'engagement-ke-director':
        return <KEDirectorEngagementPage />
      case 'engagement-officer':
        return <OfficerEngagementPage />
      case 'engagement-division-director':
        return <DivisionDirectorEngagementPage />
      case 'agreements':
        return <AgreementsPage />
      case 'agreements-officer':
        return <OfficerAgreementPage />
      case 'agreements-legal':
        return <LegalOfficerAgreementPage />
      case 'agreements-ke-director':
        return <KEDirectorAgreementPage />
      case 'partners':
        return <PartnersPage />
      case 'partners-officer':
        return <OfficerPartnerPage />
      case 'partners-ke-director':
        return <KEDirectorPartnerPage />
      case 'partners-division-director':
        return <DivisionDirectorPartnerPage />
      case 'collaboration-projects':
        return <ProjectsPage />
      case 'collaboration-projects-officer':
        return <OfficerProjectsPage />
      case 'collaboration-projects-division-director':
        return <DivisionDirectorProjectsPage />
      case 'collaboration-activities':
        return <ActivitiesPage />
      case 'collaboration-grants':
        return <GrantsPage />
      case 'collaboration-contributions':
        return <ContributionsPage />
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
