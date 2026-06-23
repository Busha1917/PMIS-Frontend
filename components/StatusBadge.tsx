import type { HTMLAttributes } from 'react'
import { cn } from '../utils'
import { Badge } from '../ui'

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: string
}

const getStatusStyle = (status: string) => {
  const normalized = status.toLowerCase()

  if (normalized === 'draft') {
    return 'bg-[#B8C9DA] text-[#1F1F1F]'
  }

  if (normalized === 'approved') {
    return 'bg-[#A6E5B4] text-[#1B7A3B]'
  }

  if (normalized === 'accepted') {
    return 'bg-[#D6ECD8] text-[#33A852]'
  }

  if (normalized === 'rejected') {
    return 'bg-[#F6A8A8] text-[#D62828]'
  }

  if (normalized === 'active') {
    return 'bg-[#D6ECD8] text-[#33A852]'
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
