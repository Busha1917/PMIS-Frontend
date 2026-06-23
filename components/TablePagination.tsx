import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'
import { Button } from '../ui'

type TablePaginationProps = {
  totalEntries: number
}

export function TablePagination({ totalEntries }: TablePaginationProps) {
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(totalEntries / rowsPerPage))

  const pageNumbers = useMemo(() => {
    if (pageCount <= 6) {
      return Array.from({ length: pageCount }, (_, index) => index + 1)
    }

    return [1, 2, 3, 4, 5, 'ellipsis' as const, pageCount]
  }, [pageCount])

  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries)

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextRowsPerPage = Number(event.target.value)
    setRowsPerPage(nextRowsPerPage)
    setCurrentPage(1)
  }

  return (
    <div className="mt-4 flex flex-col gap-3 px-2 sm:px-0 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-sm text-slate-500">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-[#161A61] focus:outline-none focus:ring-2 focus:ring-[#161A61]/10"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <p className="text-sm text-slate-600">
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm xl:justify-self-end">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-md border-slate-200 bg-white px-4 text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
        >
          &lt; Back
        </Button>
        {pageNumbers.map((pageNumber, index) =>
          pageNumber === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="flex h-10 min-w-10 items-center justify-center px-1 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setCurrentPage(pageNumber)}
              className={
                pageNumber === currentPage
                  ? 'flex h-10 min-w-10 items-center justify-center rounded-md bg-[#f59e0b] px-3 text-sm font-semibold text-white shadow-sm'
                  : 'flex h-10 min-w-10 items-center justify-center rounded-md bg-white px-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50'
              }
            >
              {pageNumber}
            </button>
          )
        )}
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-md border-slate-200 bg-white px-4 text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
          disabled={currentPage === pageCount}
        >
          Next &gt;
        </Button>
      </div>
    </div>
  )
}
