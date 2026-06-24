import type { ChangeEvent } from 'react'
import { Filter, Plus } from 'lucide-react'
import { Button, Input } from '../ui'

type PageToolbarProps = {
  searchPlaceholder: string
  addLabel?: string
  onSearch?: (value: string) => void
  onFilter?: () => void
  onAdd?: () => void
}

export function PageToolbar({
  searchPlaceholder,
  addLabel,
  onSearch,
  onFilter,
  onAdd,
}: PageToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 min-w-0">
        <Input
          placeholder={searchPlaceholder}
          className="w-full max-w-sm rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearch?.(event.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="!px-5" onClick={onFilter}>
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        {onAdd && (
          <Button className="!bg-[#ff9500] !text-white !hover:bg-[#e68a00]" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
