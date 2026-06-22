import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui'

type ConfirmationModalProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <Card className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <CardHeader className="border-b border-slate-200 px-6 py-5">
          <CardTitle className="text-lg text-slate-950">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <p className="text-sm leading-7 text-slate-600">{message}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 justify-end">
            <Button variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
