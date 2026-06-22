import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  tone?: 'default' | 'success' | 'warning' | 'muted'
}

const tones = {
  default: 'bg-slate-950 text-white',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-800',
  muted: 'bg-slate-100 text-slate-600',
}

export function Badge({ children, className, tone = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
