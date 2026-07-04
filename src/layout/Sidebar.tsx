import { navigationItems } from '../data'
import {
  ChevronRight,
  LogOut,
  Handshake,
  FolderOpen,
  FileText,
  UserSquare2,
  ChevronDown,
  Layers,
} from 'lucide-react'
import type { AdminPage } from '../types'
import { cn } from '../utils'
import { useState } from 'react'

type SidebarProps = {
  activePage: AdminPage
  collapsed: boolean
  onNavigate: (page: AdminPage) => void
  onToggleSidebar?: () => void
  className?: string
  onLogout?: () => void
}

const groups = ['DASHBOARD', 'MAIN', 'BASE DATA', 'USER MANAGEMENT', 'SYSTEM SETTINGS'] as const

const eventSubItems: { label: string; page: AdminPage; description: string }[] = [
  { label: 'Officer', page: 'events-officer', description: 'Create & submit records' },
  {
    label: 'Director General',
    page: 'events-director-general',
    description: 'Approve & assign outcomes',
  },
  { label: 'Assigned Person', page: 'events-assigned-person', description: 'Fill in outcomes' },
]

const eventPages: AdminPage[] = [
  'events',
  'events-officer',
  'events-director-general',
  'events-assigned-person',
]

const opportunitySubItems: { label: string; page: AdminPage; description: string }[] = [
  { label: 'Officer', page: 'opportunities-officer', description: 'Register opportunities' },
  {
    label: 'KE Director',
    page: 'opportunities-knowledge-director',
    description: 'Review & send for approval',
  },
  {
    label: 'Division Director',
    page: 'opportunities-division-director',
    description: 'Approve or reject',
  },
]

const opportunityPages: AdminPage[] = [
  'opportunities',
  'opportunities-officer',
  'opportunities-knowledge-director',
  'opportunities-division-director',
]

const engagementSubItems: { label: string; page: AdminPage; description: string }[] = [
  { label: 'KE Director', page: 'engagement-ke-director', description: 'Review & assign officer' },
  { label: 'Officer', page: 'engagement-officer', description: 'Fill engagement details' },
  {
    label: 'Division Director',
    page: 'engagement-division-director',
    description: 'Approve or reject',
  },
]

const engagementPages: AdminPage[] = [
  'engagement',
  'engagement-ke-director',
  'engagement-officer',
  'engagement-division-director',
]

const agreementSubItems: { label: string; page: AdminPage; description: string }[] = [
  { label: 'Officer', page: 'agreements-officer', description: 'Fill & submit agreement details' },
  { label: 'Legal Officer', page: 'agreements-legal', description: 'Verify submitted agreements' },
  { label: 'KE Director', page: 'agreements-ke-director', description: 'Approve or reject' },
]

const agreementPages: AdminPage[] = [
  'agreements',
  'agreements-officer',
  'agreements-legal',
  'agreements-ke-director',
]

const partnerSubItems: { label: string; page: AdminPage; description: string }[] = [
  { label: 'Officer', page: 'partners-officer', description: 'Register partner organizations' },
  {
    label: 'KE Director',
    page: 'partners-ke-director',
    description: 'Verify partner registrations',
  },
  {
    label: 'Division Director',
    page: 'partners-division-director',
    description: 'Approve or reject',
  },
]

const partnerPages: AdminPage[] = [
  'partners',
  'partners-officer',
  'partners-ke-director',
  'partners-division-director',
]

const collaborationSubItems: { label: string; page: AdminPage; description: string }[] = [
  {
    label: 'Projects',
    page: 'collaboration-projects',
    description: 'Track project collaborations',
  },
  {
    label: 'Joint Activity',
    page: 'collaboration-activities',
    description: 'Manage joint activities',
  },
  {
    label: 'Funding & Grants',
    page: 'collaboration-grants',
    description: 'Track funding & grants',
  },
  {
    label: 'Resource Con.',
    page: 'collaboration-contributions',
    description: 'Resource contributions',
  },
]

const collaborationPages: AdminPage[] = [
  'collaboration-projects',
  'collaboration-activities',
  'collaboration-grants',
  'collaboration-contributions',
]

export function Sidebar({
  activePage,
  collapsed,
  onNavigate,
  onToggleSidebar,
  className,
  onLogout,
}: SidebarProps) {
  const isEventActive = eventPages.includes(activePage)
  const isOpportunityActive = opportunityPages.includes(activePage)
  const isEngagementActive = engagementPages.includes(activePage)
  const isAgreementActive = agreementPages.includes(activePage)
  const isPartnerActive = partnerPages.includes(activePage)
  const isCollaborationActive = collaborationPages.includes(activePage)
  const [eventsOpen, setEventsOpen] = useState(isEventActive)
  const [opportunitiesOpen, setOpportunitiesOpen] = useState(isOpportunityActive)
  const [engagementOpen, setEngagementOpen] = useState(isEngagementActive)
  const [agreementsOpen, setAgreementsOpen] = useState(isAgreementActive)
  const [partnersOpen, setPartnersOpen] = useState(isPartnerActive)
  const [collaborationOpen, setCollaborationOpen] = useState(isCollaborationActive)
  return (
    <aside
      className={cn(
        'relative shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out',
        collapsed ? 'w-[64px]' : 'w-64',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo area */}
        <div className="relative flex items-center justify-center border-b border-slate-100 py-5">
          {collapsed ? (
            <img
              src="/images/logo.png"
              alt="EAII logo"
              className="h-9 w-9 rounded-full border border-slate-200 bg-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <img
                src="/images/logo.png"
                alt="EAII logo"
                className="h-16 w-16 rounded-full border-2 border-[#ff9500]/30 bg-white object-cover shadow-md"
              />
              {!collapsed && (
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  EAII PMIS
                </p>
              )}
            </div>
          )}

          {/* Toggle tab */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="absolute -right-[1px] bottom-0 translate-y-1/2 flex h-8 w-5 items-center justify-center rounded-r-md border border-l-0 border-slate-200 bg-white text-slate-400 shadow-sm transition hover:bg-slate-50 hover:text-slate-600"
          >
            <ChevronRight
              className={cn(
                'h-3 w-3 transition-transform duration-300',
                collapsed ? '' : 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          {groups.map(group => {
            const groupItems = navigationItems.filter(item => item.group === group)

            return (
              <div key={group} className="mb-2">
                {group !== 'DASHBOARD' && !collapsed && (
                  <p className="px-4 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-widest text-[#ff9500]/80">
                    {group}
                  </p>
                )}
                {group !== 'DASHBOARD' && collapsed && (
                  <div className="mb-1 mt-2 mx-3 border-t border-slate-100" />
                )}

                <div className="space-y-0.5 px-2">
                  {groupItems.map(item => {
                    const Icon = item.icon
                    const isActive = activePage === item.page

                    // ── Events: expandable with sub-items ──────────────
                    if (item.page === 'events') {
                      return (
                        <div key={item.label}>
                          {/* Parent row */}
                          <button
                            type="button"
                            title={collapsed ? item.label : undefined}
                            onClick={() => {
                              if (collapsed) {
                                onNavigate('events')
                              } else {
                                setEventsOpen(o => !o)
                              }
                            }}
                            className={cn(
                              'relative flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                              collapsed
                                ? 'justify-center px-0 py-3'
                                : 'gap-3 px-3 py-2.5 text-left',
                              isEventActive
                                ? 'bg-[#161A61] text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                          >
                            {isEventActive && !collapsed && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#ff9500]" />
                            )}
                            <Icon
                              className={cn('flex-shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')}
                            />
                            {!collapsed && (
                              <>
                                <span className="flex-1">{item.label}</span>
                                <ChevronDown
                                  className={cn(
                                    'h-3.5 w-3.5 transition-transform duration-200',
                                    eventsOpen ? 'rotate-180' : ''
                                  )}
                                />
                              </>
                            )}
                          </button>

                          {/* Sub-items */}
                          {!collapsed && eventsOpen && (
                            <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-3">
                              {eventSubItems.map(sub => {
                                const isSubActive = activePage === sub.page
                                return (
                                  <button
                                    key={sub.page}
                                    type="button"
                                    onClick={() => onNavigate(sub.page)}
                                    className={cn(
                                      'flex w-full flex-col rounded-lg px-3 py-2 text-left transition-all duration-150',
                                      isSubActive
                                        ? 'bg-[#161A61]/10 text-[#161A61]'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'text-xs font-semibold',
                                        isSubActive && 'text-[#161A61]'
                                      )}
                                    >
                                      {sub.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                      {sub.description}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    }

                    // ── Opportunities: expandable with sub-items ──────────────
                    if (item.page === 'opportunities') {
                      return (
                        <div key={item.label}>
                          {/* Parent row */}
                          <button
                            type="button"
                            title={collapsed ? item.label : undefined}
                            onClick={() => {
                              if (collapsed) {
                                onNavigate('opportunities')
                              } else {
                                setOpportunitiesOpen(o => !o)
                              }
                            }}
                            className={cn(
                              'relative flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                              collapsed
                                ? 'justify-center px-0 py-3'
                                : 'gap-3 px-3 py-2.5 text-left',
                              isOpportunityActive
                                ? 'bg-[#161A61] text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                          >
                            {isOpportunityActive && !collapsed && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#ff9500]" />
                            )}
                            <Handshake
                              className={cn('flex-shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')}
                            />
                            {!collapsed && (
                              <>
                                <span className="flex-1">Opportunities</span>
                                <ChevronDown
                                  className={cn(
                                    'h-3.5 w-3.5 transition-transform duration-200',
                                    opportunitiesOpen ? 'rotate-180' : ''
                                  )}
                                />
                              </>
                            )}
                          </button>

                          {/* Sub-items */}
                          {!collapsed && opportunitiesOpen && (
                            <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-3">
                              {opportunitySubItems.map(sub => {
                                const isSubActive = activePage === sub.page
                                return (
                                  <button
                                    key={sub.page}
                                    type="button"
                                    onClick={() => onNavigate(sub.page)}
                                    className={cn(
                                      'flex w-full flex-col rounded-lg px-3 py-2 text-left transition-all duration-150',
                                      isSubActive
                                        ? 'bg-[#161A61]/10 text-[#161A61]'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'text-xs font-semibold',
                                        isSubActive && 'text-[#161A61]'
                                      )}
                                    >
                                      {sub.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                      {sub.description}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    }

                    // ── Engagement: expandable with sub-items ────────────
                    if (item.page === 'engagement') {
                      return (
                        <div key={item.label}>
                          <button
                            type="button"
                            title={collapsed ? item.label : undefined}
                            onClick={() => {
                              if (collapsed) {
                                onNavigate('engagement')
                              } else {
                                setEngagementOpen(o => !o)
                              }
                            }}
                            className={cn(
                              'relative flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                              collapsed
                                ? 'justify-center px-0 py-3'
                                : 'gap-3 px-3 py-2.5 text-left',
                              isEngagementActive
                                ? 'bg-[#161A61] text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                          >
                            {isEngagementActive && !collapsed && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#ff9500]" />
                            )}
                            <FolderOpen
                              className={cn('flex-shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')}
                            />
                            {!collapsed && (
                              <>
                                <span className="flex-1">Engagement</span>
                                <ChevronDown
                                  className={cn(
                                    'h-3.5 w-3.5 transition-transform duration-200',
                                    engagementOpen ? 'rotate-180' : ''
                                  )}
                                />
                              </>
                            )}
                          </button>
                          {!collapsed && engagementOpen && (
                            <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-3">
                              {engagementSubItems.map(sub => {
                                const isSubActive = activePage === sub.page
                                return (
                                  <button
                                    key={sub.page}
                                    type="button"
                                    onClick={() => onNavigate(sub.page)}
                                    className={cn(
                                      'flex w-full flex-col rounded-lg px-3 py-2 text-left transition-all duration-150',
                                      isSubActive
                                        ? 'bg-[#161A61]/10 text-[#161A61]'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'text-xs font-semibold',
                                        isSubActive && 'text-[#161A61]'
                                      )}
                                    >
                                      {sub.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                      {sub.description}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    }

                    // ── Agreements: expandable with sub-items ───────────────
                    if (item.page === 'agreements') {
                      return (
                        <div key={item.label}>
                          <button
                            type="button"
                            title={collapsed ? item.label : undefined}
                            onClick={() => {
                              if (collapsed) {
                                onNavigate('agreements')
                              } else {
                                setAgreementsOpen(o => !o)
                              }
                            }}
                            className={cn(
                              'relative flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                              collapsed
                                ? 'justify-center px-0 py-3'
                                : 'gap-3 px-3 py-2.5 text-left',
                              isAgreementActive
                                ? 'bg-[#161A61] text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                          >
                            {isAgreementActive && !collapsed && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#ff9500]" />
                            )}
                            <FileText
                              className={cn('flex-shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')}
                            />
                            {!collapsed && (
                              <>
                                <span className="flex-1">Agreements</span>
                                <ChevronDown
                                  className={cn(
                                    'h-3.5 w-3.5 transition-transform duration-200',
                                    agreementsOpen ? 'rotate-180' : ''
                                  )}
                                />
                              </>
                            )}
                          </button>
                          {!collapsed && agreementsOpen && (
                            <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-3">
                              {agreementSubItems.map(sub => {
                                const isSubActive = activePage === sub.page
                                return (
                                  <button
                                    key={sub.page}
                                    type="button"
                                    onClick={() => onNavigate(sub.page)}
                                    className={cn(
                                      'flex w-full flex-col rounded-lg px-3 py-2 text-left transition-all duration-150',
                                      isSubActive
                                        ? 'bg-[#161A61]/10 text-[#161A61]'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'text-xs font-semibold',
                                        isSubActive && 'text-[#161A61]'
                                      )}
                                    >
                                      {sub.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                      {sub.description}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    }

                    // ── Partners: expandable with sub-items ──────────────────
                    if (item.page === 'partners') {
                      return (
                        <div key={item.label}>
                          <button
                            type="button"
                            title={collapsed ? item.label : undefined}
                            onClick={() => {
                              if (collapsed) {
                                onNavigate('partners')
                              } else {
                                setPartnersOpen(o => !o)
                              }
                            }}
                            className={cn(
                              'relative flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                              collapsed
                                ? 'justify-center px-0 py-3'
                                : 'gap-3 px-3 py-2.5 text-left',
                              isPartnerActive
                                ? 'bg-[#161A61] text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                          >
                            {isPartnerActive && !collapsed && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#ff9500]" />
                            )}
                            <UserSquare2
                              className={cn('flex-shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')}
                            />
                            {!collapsed && (
                              <>
                                <span className="flex-1">Partners</span>
                                <ChevronDown
                                  className={cn(
                                    'h-3.5 w-3.5 transition-transform duration-200',
                                    partnersOpen ? 'rotate-180' : ''
                                  )}
                                />
                              </>
                            )}
                          </button>
                          {!collapsed && partnersOpen && (
                            <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-3">
                              {partnerSubItems.map(sub => {
                                const isSubActive = activePage === sub.page
                                return (
                                  <button
                                    key={sub.page}
                                    type="button"
                                    onClick={() => onNavigate(sub.page)}
                                    className={cn(
                                      'flex w-full flex-col rounded-lg px-3 py-2 text-left transition-all duration-150',
                                      isSubActive
                                        ? 'bg-[#161A61]/10 text-[#161A61]'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'text-xs font-semibold',
                                        isSubActive && 'text-[#161A61]'
                                      )}
                                    >
                                      {sub.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                      {sub.description}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    }

                    // ── All other nav items ───────────────────────────────────
                    return (
                      <button
                        key={item.label}
                        type="button"
                        title={collapsed ? item.label : undefined}
                        onClick={() => onNavigate(item.page)}
                        className={cn(
                          'relative flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                          collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5 text-left',
                          isActive
                            ? 'bg-[#161A61] text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        {/* Active left indicator */}
                        {isActive && !collapsed && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#ff9500]" />
                        )}
                        <Icon className={cn('flex-shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')} />
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    )
                  })}
                </div>

                {/* Add Collaboration section after Partners (MAIN group only) */}
                {group === 'MAIN' && (
                  <div className="space-y-0.5 px-2">
                    <button
                      type="button"
                      title={collapsed ? 'Collaboration' : undefined}
                      onClick={() => {
                        if (collapsed) {
                          onNavigate('collaboration-projects')
                        } else {
                          setCollaborationOpen(o => !o)
                        }
                      }}
                      className={cn(
                        'relative flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                        collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5 text-left',
                        isCollaborationActive
                          ? 'bg-[#161A61] text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      {isCollaborationActive && !collapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#ff9500]" />
                      )}
                      <Layers className={cn('flex-shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')} />
                      {!collapsed && (
                        <>
                          <span className="flex-1">Collaboration</span>
                          <ChevronDown
                            className={cn(
                              'h-3.5 w-3.5 transition-transform duration-200',
                              collaborationOpen ? 'rotate-180' : ''
                            )}
                          />
                        </>
                      )}
                    </button>
                    {!collapsed && collaborationOpen && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-3">
                        {collaborationSubItems.map(sub => {
                          const isSubActive = activePage === sub.page
                          return (
                            <button
                              key={sub.page}
                              type="button"
                              onClick={() => onNavigate(sub.page)}
                              className={cn(
                                'flex w-full flex-col rounded-lg px-3 py-2 text-left transition-all duration-150',
                                isSubActive
                                  ? 'bg-[#161A61]/10 text-[#161A61]'
                                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                              )}
                            >
                              <span
                                className={cn(
                                  'text-xs font-semibold',
                                  isSubActive && 'text-[#161A61]'
                                )}
                              >
                                {sub.label}
                              </span>
                              <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                {sub.description}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer — Logout */}
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onLogout}
            className={cn(
              'flex w-full items-center rounded-xl text-sm font-semibold transition-all duration-200 text-slate-500 hover:bg-red-50 hover:text-red-600',
              collapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2.5'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
