import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'

export type KanbanColumn<T> = {
  id: string
  title: string
  color: string
  items: T[]
}

type KanbanBoardProps<T> = {
  columns: KanbanColumn<T>[]
  renderCard: (item: T) => ReactNode
  onAddCard?: (columnId: string) => void
}

export function KanbanBoard<T>({ columns, renderCard, onAddCard }: KanbanBoardProps<T>) {
  return (
    <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 items-start min-h-[500px]">
      {columns.map(col => (
        <div key={col.id} className="flex-shrink-0 w-full md:w-[320px] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${col.color}`} />
              <h3 className="font-semibold text-slate-900">{col.title}</h3>
              <span className="inline-flex h-5 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-medium text-slate-600">
                {col.items.length}
              </span>
            </div>
            {onAddCard && (
              <button
                type="button"
                onClick={() => onAddCard(col.id)}
                className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3 min-h-[150px] rounded-xl bg-slate-50/50 p-2 border border-slate-100">
            {col.items.map((item, index) => (
              <div key={index} className="w-full">
                {renderCard(item)}
              </div>
            ))}
            {col.items.length === 0 && (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/50 p-6 text-center">
                <span className="text-sm text-slate-400">No items</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
