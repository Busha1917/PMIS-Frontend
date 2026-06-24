import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../utils'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

type ModalProps = {
  open: boolean
  onClose?: () => void
  title?: string
  children: ReactNode
  size?: ModalSize
  closeOnBackdrop?: boolean
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/50"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative w-full rounded-2xl border border-slate-200 bg-white shadow-2xl',
          sizes[size]
        )}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
