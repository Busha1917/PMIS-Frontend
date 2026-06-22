import { Eye, Edit3, Trash2 } from 'lucide-react'
import { Button } from '../ui'

type TableActionButtonsProps = {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function TableActionButtons({ onView, onEdit, onDelete }: TableActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        iconOnly
        className="rounded-full border border-slate-200 bg-slate-50 text-[#161A61] hover:bg-slate-100 p-2"
        onClick={onView}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        iconOnly
        className="rounded-full border border-slate-200 bg-white text-[#161A61] hover:bg-slate-50 p-2"
        onClick={onEdit}
      >
        <Edit3 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        iconOnly
        className="rounded-full border border-red-100 bg-white text-red-600 hover:bg-red-50 p-2"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
