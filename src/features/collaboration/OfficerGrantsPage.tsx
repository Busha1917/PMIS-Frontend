import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { GrantRecord } from '../../types'
import { grantStore } from './grantStore'
import { OfficerGrantForm } from './OfficerGrantForm'

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

export function OfficerGrantsPage() {
  const [grants, setGrants] = useState<GrantRecord[]>(() => grantStore.getAll())
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [showForm, setShowForm] = useState(false)
  const [selectedGrant, setSelectedGrant] = useState<GrantRecord | undefined>()

  useEffect(() => grantStore.subscribe(setGrants), [])

  const filtered = useMemo(() => {
    return grants.filter(item => {
      if (
        searchQuery &&
        !item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [grants, searchQuery, activeFilters])

  const handleAddNew = () => {
    const newGrant = grantStore.create()
    setSelectedGrant(newGrant)
    setShowForm(true)
  }

  const handleView = (grant: GrantRecord) => {
    setSelectedGrant(grant)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setSelectedGrant(undefined)
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <PageHeaderCard
            title="Funding & Grants — Officer"
            subtitle="Register and submit grant records for approval"
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
            emptyMessage="No grants found. Start by registering a new grant."
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
                label: 'Project Name',
                render: item => item.projectName || '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Thematic Area',
                render: item => item.thematicArea || '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Budget',
                render: item =>
                  item.amount
                    ? `${item.currency} ${parseFloat(item.amount).toLocaleString()}`
                    : '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Progress',
                render: item => (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-[#ff9500]"
                        style={{ width: `${item.percentageCompletion ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">
                      {item.percentageCompletion ?? 0}%
                    </span>
                  </div>
                ),
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
                    onClick={() => handleView(item)}
                    className="rounded-lg bg-[#161A61] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0f1347]"
                  >
                    {item.status === 'Draft' ? 'Edit' : 'View'}
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
        </>
      ) : (
        selectedGrant && <OfficerGrantForm grant={selectedGrant} onClose={handleClose} />
      )}
    </div>
  )
}
