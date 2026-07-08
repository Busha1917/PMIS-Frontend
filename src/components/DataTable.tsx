import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import { cn } from '../utils'
import { Card, CardHeader, CardTitle } from '../ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'
import { EmptyState } from './EmptyState'
import { TablePagination } from './TablePagination'
import type { EmptyStateVariant } from './EmptyState'

type DataColumn<T> = {
  label: string
  render: (item: T, index: number) => ReactNode
  headClassName?: string
  cellClassName?: string
}

type DataTableProps<T> = {
  title?: string
  items: T[]
  rowKey: (item: T) => string | number
  columns: DataColumn<T>[]
  className?: string
  emptyVariant?: EmptyStateVariant
  emptyMessage?: string
  emptyAction?: ReactNode
  showPagination?: boolean
  isLoading?: boolean
}

export function DataTable<T>({
  title,
  items,
  rowKey,
  columns,
  className,
  emptyVariant = 'empty',
  emptyMessage,
  emptyAction,
  showPagination = true,
  isLoading,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const paginatedItems = useMemo(() => {
    const reversed = [...items].reverse()
    if (!showPagination) return reversed
    const start = (currentPage - 1) * rowsPerPage
    return reversed.slice(start, start + rowsPerPage)
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[400px] text-center text-slate-500 bg-white"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#161A61]" />
                      <p className="text-sm font-medium">Loading data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="bg-white">
                    <EmptyState
                      variant={emptyVariant}
                      message={emptyMessage}
                      action={emptyAction}
                    />
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, rowIndex) => (
                  <TableRow key={rowKey(item)} className="bg-white hover:bg-slate-50">
                    {columns.map(column => (
                      <TableCell
                        key={column.label}
                        className={cn('text-left', column.cellClassName)}
                      >
                        {column.render(item, rowIndex + 1)}
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
