import type { ChangeEvent, ReactNode } from 'react'
import { Filter, Plus } from 'lucide-react'
import { Button, Card, CardContent, Input } from '../ui'

type PageHeaderCardProps = {
  title: string
  subtitle: string
  searchPlaceholder: string
  addLabel: string
  onAdd: () => void
  onExport?: () => void
  exportLabel?: string
  onSearch?: (value: string) => void
  onFilter?: () => void
  className?: string
  extraActions?: ReactNode
}

export function PageHeaderCard({
  title,
  subtitle,
  searchPlaceholder,
  addLabel,
  onAdd,
  onExport,
  exportLabel,
  onSearch,
  onFilter,
  className,
  extraActions,
}: PageHeaderCardProps) {
  return (
    <Card className={className ?? 'rounded-[2rem] bg-white shadow-sm'}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="max-w-2xl">
            <p className="header-font text-xl font-semibold tracking-[-0.01em] text-slate-950">{title}</p>
            <p className="header-font mt-2 text-sm text-slate-600">{subtitle}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <Input
                placeholder={searchPlaceholder}
                className="w-full max-w-sm rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                onChange={(event: ChangeEvent<HTMLInputElement>) => onSearch?.(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {onExport ? (
                <Button variant="outline" className="!px-5" onClick={onExport}>
                  {exportLabel ?? 'Export'}
                </Button>
              ) : null}
              <Button variant="outline" className="!px-5" onClick={onFilter}>
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button className="!bg-[#ff9500] !text-white !hover:bg-[#e68a00]" onClick={onAdd}>
                <Plus className="h-4 w-4" />
                {addLabel}
              </Button>
              {extraActions}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
