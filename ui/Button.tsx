import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  iconOnly?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[#ff9500] text-white hover:bg-[#e68a00] font-semibold',
  secondary: 'bg-[#001f3f] text-white hover:bg-[#000d1a]',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export function Button({
  children,
  className,
  variant = 'primary',
  iconOnly = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-10 items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        iconOnly ? 'w-10 p-0' : 'gap-2 px-4 py-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
