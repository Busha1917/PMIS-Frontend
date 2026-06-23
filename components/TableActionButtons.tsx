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
        className="text-[#161A61] hover:bg-[#E8EEFF] p-2"
        onClick={onView}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        iconOnly
        className="text-[#161A61] hover:bg-[#F5F7FF] p-2"
        onClick={onEdit}
      >
        <Edit3 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        iconOnly
        className="text-[#FF383C] hover:bg-[#FFF1F1] p-2"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
