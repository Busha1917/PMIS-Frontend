import { createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router'
import { AdminDashboard } from './pages/AdminDashboard'
import { EventsVisitsPage } from './pages/EventsVisitsPage'
import { OpportunitiesPage } from './pages/OpportunitiesPage'
import { EngagementPage } from './pages/EngagementPage'
import { AgreementsPage } from './pages/AgreementsPage'
import { PartnersPage } from './pages/PartnersPage'
import { BaseDataPage } from './pages/BaseDataPage'
import { UsersPage } from './pages/UsersPage'
import { RolesPage } from './pages/RolesPage'
import { LoginPage } from './pages/LoginPage'
import { RootLayout } from './layout/RootLayout'

// ---------------------------------------------------------------------------
// Auth helpers — simple localStorage flag (swap for real auth later)
// ---------------------------------------------------------------------------
function isAuthenticated(): boolean {
  return localStorage.getItem('pmis_auth') === 'true'
}

export function login() {
  localStorage.setItem('pmis_auth', 'true')
}

export function logout() {
  localStorage.removeItem('pmis_auth')
}

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------
function requireAuth() {
  if (!isAuthenticated()) {
    throw redirect({ to: '/login' })
  }
}

// ---------------------------------------------------------------------------
// Root route (wraps authenticated pages in AppLayout)
// ---------------------------------------------------------------------------
const rootRoute = createRootRoute()

// ---------------------------------------------------------------------------
// Login route (no layout shell)
// ---------------------------------------------------------------------------
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/dashboard' })
    }
  },
})

// ---------------------------------------------------------------------------
// Layout shell route (wraps all authenticated pages)
// ---------------------------------------------------------------------------
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: RootLayout,
  beforeLoad: requireAuth,
})

// ---------------------------------------------------------------------------
// Authenticated page routes
// ---------------------------------------------------------------------------
const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/dashboard' }) },
})

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/dashboard',
  component: AdminDashboard,
})

const eventsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/events',
  component: EventsVisitsPage,
})

const opportunitiesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/opportunities',
  component: OpportunitiesPage,
})

const engagementRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/engagement',
  component: EngagementPage,
})

const agreementsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/agreements',
  component: AgreementsPage,
})

const partnersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/partners',
  component: PartnersPage,
})

const baseDataRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/base-data',
  component: BaseDataPage,
})

const usersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/users',
  component: UsersPage,
})

const rolesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/roles',
  component: RolesPage,
})

// ---------------------------------------------------------------------------
// Route tree
// ---------------------------------------------------------------------------
const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    indexRoute,
    dashboardRoute,
    eventsRoute,
    opportunitiesRoute,
    engagementRoute,
    agreementsRoute,
    partnersRoute,
    baseDataRoute,
    usersRoute,
    rolesRoute,
  ]),
])

// ---------------------------------------------------------------------------
// Router instance
// ---------------------------------------------------------------------------
export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
