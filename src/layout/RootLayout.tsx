import { useState } from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'
import { AppLayout } from './AppLayout'

// Pages that hide the header card
const HIDE_HEADER_PATHS = new Set([
  '/events',
  '/opportunities',
  '/engagement',
  '/agreements',
  '/partners',
])

const PATH_META: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'Partnership Management Information System — Overview' },
  '/events': { title: 'Events & Visits', description: 'Manage events and site visits for partner engagements.' },
  '/opportunities': { title: 'Opportunities', description: 'Track active and new partnership opportunities.' },
  '/engagement': { title: 'Engagement', description: 'View engagement records and follow-up activity.' },
  '/agreements': { title: 'Agreements', description: 'Manage partnership agreements and MoU records.' },
  '/partners': { title: 'Partners', description: 'Browse partner organizations and contact details.' },
  '/base-data': { title: 'Base Data', description: 'Configure core reference data for the system.' },
  '/users': { title: 'Users', description: 'Manage user accounts and access rights.' },
  '/roles': { title: 'Roles', description: 'Define roles and permission groups.' },
}

export function RootLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024)

  const meta = PATH_META[location.pathname] ?? { title: '', description: '' }
  const hideHeader = HIDE_HEADER_PATHS.has(location.pathname)

  return (
    <AppLayout
      title={meta.title}
      description={meta.description}
      hideHeader={hideHeader}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen((v) => !v)}
    >
      <Outlet />
    </AppLayout>
  )
}
