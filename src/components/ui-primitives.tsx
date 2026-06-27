import type { ReactNode } from 'react'
import { cn } from '../../utils'
import { timeAgo } from '../../utils/helpers'

/**
 * InfoRow — adapted from Addis Land's info-row component.
 * A compact label/value pair for detail panels and preview forms.
 */
export function InfoRow({
  label,
  value,
  className,
}: {
  label: string
  value: ReactNode
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-[140px_1fr] items-start gap-2 py-2 text-sm', className)}>
      <span className="font-medium text-slate-500">{label}</span>
      <span className="text-slate-900">{value ?? '—'}</span>
    </div>
  )
}

/**
 * ActivityItem — renders a single audit trail / activity feed entry.
 * Styled to match the Addis Land notification/feed pattern.
 */
export function ActivityItem({
  icon,
  title,
  description,
  timestamp,
  variant = 'default',
}: {
  icon: ReactNode
  title: string
  description?: string
  timestamp: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const ringColor = {
    default: 'ring-slate-100',
    success: 'ring-emerald-100',
    warning: 'ring-[#ff9500]/20',
    danger: 'ring-red-100',
  }[variant]

  const iconBg = {
    default: 'bg-slate-50',
    success: 'bg-emerald-50',
    warning: 'bg-[#ff9500]/10',
    danger: 'bg-red-50',
  }[variant]

  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2',
          iconBg,
          ringColor
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{title}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{description}</p>}
      </div>
      <time className="shrink-0 text-xs text-slate-400 mt-0.5">{timeAgo(timestamp)}</time>
    </div>
  )
}

/**
 * SectionDivider — a subtle horizontal rule with a label, used to separate
 * sections inside forms or detail panels.
 */
export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-1 border-t border-slate-100" />
      <span className="mx-3 flex-shrink-0 rounded-full bg-slate-50 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <div className="flex-1 border-t border-slate-100" />
    </div>
  )
}

/**
 * StatCard — a compact metric tile for dashboards.
 * Adapted from Addis Land's dashboard stat pattern.
 */
export function StatCard({
  label,
  value,
  icon,
  delta,
  accent = false,
}: {
  label: string
  value: string | number
  icon: ReactNode
  delta?: { value: string; positive: boolean }
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        'card card-hover animate-fadeInUp flex items-start gap-4 p-5',
        accent && 'border-[#0b265a]/20 bg-gradient-to-br from-[#0b265a] to-[#161A61] text-white'
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
          accent ? 'bg-white/15' : 'bg-slate-50 text-[#0b265a]'
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            'text-2xl font-bold tracking-tight',
            accent ? 'text-white' : 'text-slate-900'
          )}
        >
          {value}
        </p>
        <p
          className={cn('mt-0.5 text-sm font-medium', accent ? 'text-white/70' : 'text-slate-500')}
        >
          {label}
        </p>
        {delta && (
          <p
            className={cn(
              'mt-1 text-xs font-semibold',
              delta.positive ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {delta.positive ? '▲' : '▼'} {delta.value}
          </p>
        )}
      </div>
    </div>
  )
}
