import type { HTMLAttributes } from 'react'
import { cn } from '../utils'
import { Badge } from '../ui'

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: string
}

const getStatusStyle = (status: string) => {
  const normalized = status.toLowerCase()

  if (normalized === 'draft') {
    return 'bg-[#B0C4D8] text-[#4A5568]'
  }

  if (normalized === 'approved') {
    return 'bg-[#34C759]/50 text-[#05651D]'
  }

  if (normalized === 'accepted') {
    return 'bg-[#CEE7D4] text-[#34A853]'
  }

  if (normalized === 'rejected') {
    return 'bg-[#F89E9E] text-[#BE1616]'
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
        'inline-flex h-[40px] min-w-[140px] items-center justify-center gap-[10px] rounded-lg px-[16px] py-[4px] text-[16px] font-medium normal-case tracking-normal',
        getStatusStyle(status),
        className
      )}
      {...props}
    >
      {status}
    </Badge>
  )
}
