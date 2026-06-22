import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({ children, className, ...props }: Props) {
  return (
    <div
      className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: Props) {
  return (
    <div className={cn('border-b border-slate-200 px-6 py-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: Props) {
  return (
    <h2 className={cn('text-lg font-semibold text-[#161A61]', className)} {...props}>
      {children}
    </h2>
  )
}

export function CardContent({ children, className, ...props }: Props) {
  return (
    <div className={cn('px-6 py-5', className)} {...props}>
      {children}
    </div>
  )
}
