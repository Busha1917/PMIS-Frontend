import type { HTMLAttributes, CSSProperties } from 'react'
import { cn } from '../utils'

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: string
}

type StatusStyle = { backgroundColor: string; color: string }

// Using inline styles — Tailwind arbitrary hex classes can be purged or
// lose specificity battles. Inline styles are always applied, guaranteed.
const STATUS_STYLES: Record<string, StatusStyle> = {
  draft: { backgroundColor: '#B0C4D8', color: '#4A5568' },
  approved: { backgroundColor: 'rgba(52, 199, 89, 0.5)', color: '#05651D' }, // #34C759 at 50% — invalid in Tailwind but works perfectly here
  accepted: { backgroundColor: '#CEE7D4', color: '#34A853' },
  rejected: { backgroundColor: '#F89E9E', color: '#BE1616' },
  active: { backgroundColor: '#4BCB6B', color: '#ffffff' },
}

const DEFAULT_STYLE: StatusStyle = { backgroundColor: '#f1f5f9', color: '#475569' }

export function StatusBadge({ status, className, style, ...props }: StatusBadgeProps) {
  const statusStyle: CSSProperties = {
    ...(STATUS_STYLES[status.toLowerCase()] ?? DEFAULT_STYLE),
    ...style, // allow callers to override if needed
  }

  return (
    <span
      className={cn(
        'inline-flex h-[40px] min-w-[140px] items-center justify-center gap-[10px] rounded-lg px-[16px] py-[4px] text-[16px] font-medium normal-case tracking-normal',
        className
      )}
      style={statusStyle}
      {...props}
    >
      {status}
    </span>
  )
}
