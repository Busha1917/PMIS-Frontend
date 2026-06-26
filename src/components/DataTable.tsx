import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import { cn } from '../utils'
import { Card, CardHeader, CardTitle } from '../ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'
import { EmptyState } from './EmptyState'
import { TablePagination } from './TablePagination'

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
  emptyVariant?: 'search' | 'empty'
  emptyMessage?: string
  showPagination?: boolean
}

export function DataTable<T>({
  title,
  items,
  rowKey,
  columns,
  className,
  emptyVariant = 'empty',
  emptyMessage,
  showPagination = true,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const paginatedItems = useMemo(() => {
    if (!showPagination) return items
    const start = (currentPage - 1) * rowsPerPage
    return items.slice(start, start + rowsPerPage)
  }, [items, currentPage, rowsPerPage, showPagination])

  return (
    <>
      <Card
        className={className ?? 'overflow-hidden rounded-[14px] border border-slate-200 shadow-sm'}
      >
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
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="bg-white">
                    <EmptyState variant={emptyVariant} message={emptyMessage} />
                  </td>
                </tr>
              ) : (
                paginatedItems.map(item => (
                  <TableRow key={rowKey(item)} className="bg-white hover:bg-slate-50">
                    {columns.map(column => (
                      <TableCell key={column.label} className={column.cellClassName}>
                        {column.render(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {showPagination && items.length > 0 && (
        <TablePagination
          totalEntries={items.length}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}
    </>
  )
}
