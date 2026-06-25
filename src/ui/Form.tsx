import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import React from 'react'
import { cn } from '../utils'

export const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10',
          className
        )}
        {...props}
      />
    )
  }
)

export function Label({
  children,
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label className={cn('text-sm font-medium text-slate-700', className)} {...props}>
      {children}
    </label>
  )
}
