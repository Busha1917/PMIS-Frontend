import type { ReactNode } from 'react'

export type EmptyStateVariant =
  | 'search'
  | 'empty'
  | 'partners'
  | 'opportunities'
  | 'agreements'
  | 'events'
  | 'engagement'
  | 'users'
  | 'roles'

type EmptyStateProps = {
  variant?: EmptyStateVariant
  icon?: ReactNode
  title?: string
  message?: string
  action?: ReactNode
}

// SVG Illustrations — inline, animated, unique per context
const SearchIllustration = () => (
  <svg
    width="120"
    height="100"
    viewBox="0 0 120 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="44" r="28" stroke="#e2e8f0" strokeWidth="4" />
    <circle cx="50" cy="44" r="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
    <path d="M70 64 L88 82" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
    <path d="M44 38 Q50 32 56 38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    <circle cx="44" cy="43" r="3" fill="#94a3b8">
      <animate attributeName="cy" values="43;41;43" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="56" cy="43" r="3" fill="#94a3b8">
      <animate attributeName="cy" values="43;41;43" dur="2s" repeatCount="indefinite" />
    </circle>
    <path d="M42 52 Q50 57 58 52" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const EmptyBoxIllustration = () => (
  <svg
    width="120"
    height="100"
    viewBox="0 0 120 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="25"
      y="38"
      width="70"
      height="50"
      rx="6"
      fill="#f1f5f9"
      stroke="#e2e8f0"
      strokeWidth="2"
    />
    <path d="M25 55 L60 68 L95 55" stroke="#cbd5e1" strokeWidth="2" />
    <path d="M44 38 L44 22 L76 22 L76 38" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
    <path d="M44 22 L60 30 L76 22" fill="#cbd5e1" />
    <circle cx="60" cy="55" r="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5">
      <animate attributeName="r" values="8;9;8" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <path
      d="M57 55 L60 58 L64 52"
      stroke="#94a3b8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PartnersIllustration = () => (
  <svg
    width="120"
    height="100"
    viewBox="0 0 120 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="38" cy="38" r="16" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
    <circle cx="82" cy="38" r="16" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2" />
    <circle cx="38" cy="33" r="7" fill="#bfdbfe" />
    <circle cx="82" cy="33" r="7" fill="#fed7aa" />
    <path d="M26 52 Q38 58 50 52" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" />
    <path d="M70 52 Q82 58 94 52" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M52 48 L68 48"
      stroke="#cbd5e1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="4 3"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="0;-14"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </path>
    <circle cx="60" cy="48" r="5" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5" />
    <path
      d="M57.5 48 L62.5 48 M60 45.5 L60 50.5"
      stroke="#94a3b8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const OpportunitiesIllustration = () => (
  <svg
    width="120"
    height="100"
    viewBox="0 0 120 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="20"
      y="30"
      width="80"
      height="55"
      rx="8"
      fill="#f8fafc"
      stroke="#e2e8f0"
      strokeWidth="2"
    />
    <path
      d="M35 50 L50 38 L65 46 L85 30"
      stroke="#ff9500"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animate attributeName="stroke-dashoffset" values="100;0" dur="1.5s" fill="freeze" />
    </path>
    <circle cx="85" cy="30" r="4" fill="#ff9500">
      <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
    </circle>
    <rect x="30" y="62" width="12" height="16" rx="2" fill="#bfdbfe" />
    <rect x="48" y="56" width="12" height="22" rx="2" fill="#93c5fd" />
    <rect x="66" y="50" width="12" height="28" rx="2" fill="#3b82f6" />
  </svg>
)

const DocumentIllustration = () => (
  <svg
    width="120"
    height="100"
    viewBox="0 0 120 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="28"
      y="18"
      width="64"
      height="72"
      rx="6"
      fill="#f8fafc"
      stroke="#e2e8f0"
      strokeWidth="2"
    />
    <rect
      x="20"
      y="22"
      width="64"
      height="72"
      rx="6"
      fill="#ffffff"
      stroke="#e2e8f0"
      strokeWidth="2"
    />
    <path d="M34 42 L66 42" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
    <path d="M34 52 L66 52" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
    <path d="M34 62 L55 62" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
    <circle cx="52" cy="80" r="12" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2">
      <animate attributeName="r" values="12;13;12" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <path d="M52 75 L52 80" stroke="#ff9500" strokeWidth="2" strokeLinecap="round" />
    <circle cx="52" cy="83" r="1.5" fill="#ff9500" />
  </svg>
)

const defaults: Record<
  EmptyStateVariant,
  { illustration: ReactNode; title: string; message: string }
> = {
  search: {
    illustration: <SearchIllustration />,
    title: 'No results found',
    message:
      "We couldn't find anything matching your search. Try adjusting your keywords or clearing your filters.",
  },
  empty: {
    illustration: <EmptyBoxIllustration />,
    title: 'Nothing here yet',
    message: 'Get started by adding a new entry using the button above.',
  },
  partners: {
    illustration: <PartnersIllustration />,
    title: 'No partners registered',
    message:
      'Start building your partnership network. Add your first partner organization to get started.',
  },
  opportunities: {
    illustration: <OpportunitiesIllustration />,
    title: 'No opportunities yet',
    message:
      'Track and manage new partnership opportunities here. Create your first opportunity to begin.',
  },
  agreements: {
    illustration: <DocumentIllustration />,
    title: 'No agreements found',
    message:
      'All partnership agreements and MoUs will appear here. Draft your first agreement to get started.',
  },
  events: {
    illustration: <EmptyBoxIllustration />,
    title: 'No events scheduled',
    message: 'Conferences, workshops and site visits will appear here. Add your first event.',
  },
  engagement: {
    illustration: <PartnersIllustration />,
    title: 'No engagements recorded',
    message:
      'Log engagement sessions with your partners here. Record your first engagement activity.',
  },
  users: {
    illustration: <PartnersIllustration />,
    title: 'No users found',
    message: 'User accounts will appear here. Add your first team member to grant system access.',
  },
  roles: {
    illustration: <EmptyBoxIllustration />,
    title: 'No roles defined',
    message: 'Define roles to control what actions your team members can perform in the system.',
  },
}

export function EmptyState({ variant = 'empty', icon, title, message, action }: EmptyStateProps) {
  const preset = defaults[variant]

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {/* Illustration */}
      <div className="mb-5 opacity-90">
        {icon ? <div className="rounded-full bg-slate-100 p-5">{icon}</div> : preset.illustration}
      </div>

      {/* Text */}
      <h3 className="mb-2 text-lg font-bold text-slate-800">{title ?? preset.title}</h3>
      <p className="max-w-xs text-sm text-slate-500 leading-relaxed">{message ?? preset.message}</p>

      {/* CTA */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
