import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui'
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
    <Card className={className ?? 'overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm'}>
      {title ? (
        <CardHeader className="bg-[#0b265a] px-6 py-4">
          <CardTitle className="text-sm uppercase tracking-[0.2em] text-white">{title}</CardTitle>
        </CardHeader>
      ) : null}

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                {columns.map((column) => (
                  <TableHead key={column.label} className={column.headClassName}>
                    {column.label}
                  </TableHead>
                ))}
              </tr>
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
      </CardContent>
    </Card>
  )
}
