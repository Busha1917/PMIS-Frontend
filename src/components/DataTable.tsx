import type { ReactNode } from 'react'
import { cn } from '../utils'
import { Card, CardHeader, CardTitle } from '../ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'

type DataColumn<T> = {
  label: string
  render: (item: T) => ReactNode
  headClassName?: string
  cellClassName?: string
}

type DataTableProps<T> = {
  title?: string
  items: T[]
  rowKey: (item: T) => string | number
  columns: DataColumn<T>[]
  className?: string
}

export function DataTable<T>({ title, items, rowKey, columns, className }: DataTableProps<T>) {
  return (
    <Card className={className ?? 'overflow-hidden rounded-[14px] border border-slate-200 shadow-sm'}>
      {title ? (
        <CardHeader className="bg-[#0b265a] px-6 py-4 rounded-t-[14px]">
          <CardTitle className="text-sm uppercase tracking-[0.2em] text-white">{title}</CardTitle>
        </CardHeader>
      ) : null}

      <div className="overflow-x-auto bg-[#0b265a] rounded-t-[14px]">
        <Table className="bg-transparent">
          <TableHeader>
            <TableRow className="h-[70px] text-white">
              {columns.map((column, index) => (
                <TableHead
                  key={column.label}
                  className={cn(
                    column.headClassName,
                    'bg-transparent text-white py-0 align-middle',
                    index === 0 && 'rounded-tl-[14px]',
                    index === columns.length - 1 && 'rounded-tr-[14px]'
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

            <TableBody>
              {items.map((item) => (
                <TableRow key={rowKey(item)} className="bg-white hover:bg-slate-50">
                  {columns.map((column) => (
                    <TableCell key={column.label} className={column.cellClassName}>
                      {column.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    </Card>
  )
}
