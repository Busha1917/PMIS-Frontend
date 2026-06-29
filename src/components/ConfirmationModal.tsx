import type { ReactNode } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui'

type ConfirmationModalProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

export function ConfirmationModal({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  children,
}: ConfirmationModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <div className="px-6 py-6">
        <p className="text-sm leading-7 text-slate-600">{message}</p>
        {children ? <div className="mt-4">{children}</div> : null}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
