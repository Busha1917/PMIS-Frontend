import type { ReactNode } from 'react'
import { SearchX, PackageOpen } from 'lucide-react'

type EmptyStateVariant = 'search' | 'empty'

type EmptyStateProps = {
  variant?: EmptyStateVariant
  icon?: ReactNode
  title?: string
  message?: string
  action?: ReactNode
}

const defaults: Record<EmptyStateVariant, { icon: ReactNode; title: string; message: string }> = {
  search: {
    icon: <SearchX className="h-10 w-10 text-slate-400" />,
    title: 'No results found',
    message: "Try adjusting your search or filter to find what you're looking for.",
  },
  empty: {
    icon: <PackageOpen className="h-10 w-10 text-slate-400" />,
    title: 'Nothing here yet',
    message: 'Get started by adding a new entry.',
  },
}

export function EmptyState({ variant = 'search', icon, title, message, action }: EmptyStateProps) {
  const preset = defaults[variant]

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4">{icon ?? preset.icon}</div>
      <h3 className="mb-1 text-base font-semibold text-slate-900">{title ?? preset.title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{message ?? preset.message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
