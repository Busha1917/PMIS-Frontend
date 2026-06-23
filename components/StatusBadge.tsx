import type { HTMLAttributes } from 'react'
import { cn } from '../utils'
import { Badge } from '../ui'

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: string
}

const getStatusStyle = (status: string) => {
  const normalized = status.toLowerCase()

  if (normalized === 'draft') {
    return 'bg-[#B8CBDD] text-white'
  }

  if (normalized === 'approved') {
    return 'bg-[#34C759] text-white'
  }

  if (normalized === 'accepted') {
    return 'bg-[#9EE7B9] text-white'
  }

  if (normalized === 'rejected') {
    return 'bg-[#FF6B6B] text-white'
  }

  if (normalized === 'active') {
    return 'bg-[#28A745] text-white'
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
