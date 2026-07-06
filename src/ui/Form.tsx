import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import React from 'react'
import { cn } from '../utils'

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ className, label, ...props }, ref) => {
    if (label) {
      return (
        <div className="space-y-1.5">
          <Label>{label}</Label>
          <input
            ref={ref}
            className={cn(
              'h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10',
              className
            )}
            {...props}
          />
        </div>
      )
    }
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

interface TextareaWithLabelProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaWithLabelProps>(
  ({ className, label, ...props }, ref) => {
    if (label) {
      return (
        <div className="space-y-1.5">
          <Label>{label}</Label>
          <textarea
            ref={ref}
            className={cn(
              'min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10',
              className
            )}
            {...props}
          />
        </div>
      )
    }
    return (
      <textarea
        ref={ref}
        className={cn(
          'min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10',
          className
        )}
        {...props}
      />
    )
  }
)

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onValueChange'> {
  label?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, placeholder, onValueChange, children, ...props }, ref) => {
    const selectElement = (
      <select
        ref={ref}
        className={cn(
          'h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10',
          className
        )}
        onChange={e => onValueChange?.(e.target.value)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    )

    if (label) {
      return (
        <div className="space-y-1.5">
          <Label>{label}</Label>
          {selectElement}
        </div>
      )
    }

    return selectElement
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
