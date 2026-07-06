import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { GrantRecord } from '../../types'
import { grantStore } from './grantStore'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Pending Approval', value: 'Pending Approval' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

export function GrantsPage() {
  const [grants, setGrants] = useState<GrantRecord[]>(() => grantStore.getAll())
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  useEffect(() => grantStore.subscribe(setGrants), [])

  const filtered = useMemo(() => {
    return grants.filter(item => {
      if (
        searchQuery &&
        !item.donorName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [grants, searchQuery, activeFilters])

  const handleAddNew = () => {
    toast.info('Grant creation coming soon')
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Funding & Grant Tracking"
        subtitle="Manage incoming and outgoing fiscal grant vehicles tied to partners"
      />
      <PageToolbar
        searchPlaceholder="Search grants..."
        addLabel="Add Grant"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={handleAddNew}
        showSearchAndFilters
      />
      <DataTable
        items={filtered}
        rowKey={item => item.id}
        emptyVariant="empty"
        emptyMessage="No grants found. Start by adding a grant record."
        emptyAction={
          <button
            onClick={handleAddNew}
            className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
          >
            Add Grant
          </button>
        }
        columns={[
          {
            label: 'No.',
            render: (_item, i) => (
              <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
            ),
            headClassName: 'bg-[#0b265a] text-white text-center',
          },
          {
            label: 'Grant ID',
            render: item => <span className="font-medium text-slate-900">{item.id}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Donor Name',
            render: item => item.donorName || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Partner',
            render: item => item.partnerName,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Amount',
            render: item =>
              item.amount ? `${item.currency} ${parseFloat(item.amount).toLocaleString()}` : '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Submission Date',
            render: item => item.submissionDate || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Status',
            render: item => <StatusBadge status={item.status} />,
            headClassName: 'bg-[#0b265a] text-white text-center',
            cellClassName: 'text-center',
          },
          {
            label: 'Action',
            render: item => (
              <button
                onClick={() => toast.info('View grant details')}
                className="rounded-lg bg-[#161A61] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0f1347]"
              >
                View
              </button>
            ),
            headClassName: 'bg-[#0b265a] text-white text-center',
            cellClassName: 'text-center',
          },
        ]}
      />
      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setActiveFilters}
        fields={FILTER_FIELDS}
        title="Filter Grants"
      />
    </div>
  )
}
