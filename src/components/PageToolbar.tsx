import type { ChangeEvent } from 'react'
import { Filter, Plus } from 'lucide-react'
import { Button, Input } from '../ui'
import { cn } from '../utils'

type PageToolbarProps = {
  searchPlaceholder: string
  addLabel?: string
  onSearch?: (value: string) => void
  onFilter?: () => void
  onAdd?: () => void
  activeFilterCount?: number
  showSearchAndFilters?: boolean
}

export function PageToolbar({
  searchPlaceholder,
  addLabel,
  onSearch,
  onFilter,
  onAdd,
  activeFilterCount = 0,
  showSearchAndFilters = true,
}: PageToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {showSearchAndFilters && (
        <div className="flex-1 min-w-0">
          <Input
            placeholder={searchPlaceholder}
            className="w-full max-w-sm rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
            onChange={(event: ChangeEvent<HTMLInputElement>) => onSearch?.(event.target.value)}
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {showSearchAndFilters && (
          <button
            type="button"
            onClick={onFilter}
            className={cn(
              'relative inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-medium transition-colors',
              activeFilterCount > 0
                ? 'border-[#ff9500] bg-[#ff9500]/5 text-[#ff9500] hover:bg-[#ff9500]/10'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            )}
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ff9500] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {onAdd && (
          <Button className="!bg-[#ff9500] !text-white hover:!bg-[#e68a00]" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
