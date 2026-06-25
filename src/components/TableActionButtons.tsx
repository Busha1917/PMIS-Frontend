import { Eye, Edit3, Trash2 } from 'lucide-react'

type TableActionButtonsProps = {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function TableActionButtons({ onView, onEdit, onDelete }: TableActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#161A61] hover:bg-[#E8EEFF] hover:text-[#0b265a] transition-colors duration-200"
        onClick={onView}
        title="View details"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#161A61] hover:bg-[#F5F7FF] hover:text-[#0b265a] transition-colors duration-200"
        onClick={onEdit}
        title="Edit record"
      >
        <Edit3 className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#FF383C] hover:bg-[#FFF1F1] hover:text-[#d32f2f] transition-colors duration-200"
        onClick={onDelete}
        title="Delete record"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
