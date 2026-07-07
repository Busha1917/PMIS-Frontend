import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { GrantRecord } from '../../types'
import { grantStore } from './grantStore'
import { DivisionDirectorGrantApproval } from './DivisionDirectorGrantApproval'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Pending Approval', value: 'Pending Approval' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

export function DivisionDirectorGrantsPage() {
  const [grants, setGrants] = useState<GrantRecord[]>(() => grantStore.getAll())
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [showApprovalView, setShowApprovalView] = useState(false)
  const [selectedGrant, setSelectedGrant] = useState<GrantRecord | undefined>()

  useEffect(() => grantStore.subscribe(setGrants), [])

  const directorGrants = useMemo(() => {
    return grants
      .filter(g => g.status !== 'Draft')
      .filter(item => {
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

  const handleView = (grant: GrantRecord) => {
    setSelectedGrant(grant)
    setShowApprovalView(true)
  }

  const handleClose = () => {
    setShowApprovalView(false)
    setSelectedGrant(undefined)
  }

  return (
    <div className="space-y-6">
      {!showApprovalView ? (
        <>
          <PageHeaderCard
            title="Funding & Grants — Division Director"
            subtitle="Review and approve submitted grant records"
          />
          <PageToolbar
            searchPlaceholder="Search grants..."
            onSearch={setSearchQuery}
            onFilter={() => setShowFilter(true)}
            showSearchAndFilters
          />
          <DataTable
            items={directorGrants}
            rowKey={item => item.id}
            emptyVariant="empty"
            emptyMessage="No grants pending review."
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
                label: 'Funding Source',
                render: item => item.fundingSource || '—',
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
                    {item.status === 'Pending Approval' ? 'Review' : 'View'}
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
        selectedGrant && (
          <DivisionDirectorGrantApproval grant={selectedGrant} onClose={handleClose} />
        )
      )}
    </div>
  )
}
