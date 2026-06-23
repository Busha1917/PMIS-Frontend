import type { HTMLAttributes } from 'react'
import { cn } from '../utils'
import { Badge } from '../ui'

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: string
}

const getStatusStyle = (status: string) => {
  const normalized = status.toLowerCase()

  if (normalized === 'draft') {
    return 'bg-[#B8CBDD] text-slate-900'
  }

  if (normalized === 'approved') {
    return 'bg-[#34C75980] text-slate-900'
  }

  if (normalized === 'accepted') {
    return 'bg-[#CEE7D4] text-slate-900'
  }

  if (normalized === 'rejected') {
    return 'bg-[#F89E9E] text-slate-900'
  }

  if (normalized === 'active') {
    return 'bg-[#4BCB6B] text-white'
  }

  return 'bg-slate-100 text-slate-600'
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <Badge
      tone="default"
      className={cn(
        'inline-flex h-[25px] w-[90px] items-center justify-center gap-[10px] rounded-[4px] px-[10px] py-[4px] text-[11px] font-semibold uppercase tracking-[0.08em]',
        getStatusStyle(status),
        className
      )}
      {...props}
    >
      {status}
    </Badge>
  )
}
