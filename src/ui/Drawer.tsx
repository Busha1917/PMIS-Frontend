import { type ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../utils'

type DrawerProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  width?: string
}

export function Drawer({ open, onClose, title, children, width = 'max-w-sm' }: DrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className={cn('relative flex h-full w-full flex-col bg-white shadow-2xl', width)}>
        {title && (
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  )
}
