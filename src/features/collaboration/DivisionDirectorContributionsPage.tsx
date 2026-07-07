import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { ResourceContributionRecord } from '../../types'
import { contributionStore } from './contributionStore'
import { DivisionDirectorContributionApproval } from './DivisionDirectorContributionApproval'

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

export function DivisionDirectorContributionsPage() {
  const [contributions, setContributions] = useState<ResourceContributionRecord[]>(() =>
    contributionStore.getAll()
  )
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [showApproval, setShowApproval] = useState(false)
  const [selectedContribution, setSelectedContribution] = useState<
    ResourceContributionRecord | undefined
  >()

  useEffect(() => contributionStore.subscribe(setContributions), [])

  const filtered = useMemo(() => {
    return contributions
      .filter(c => c.status !== 'Draft')
      .filter(item => {
        if (
          searchQuery &&
          !item.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false
        if (activeFilters.status && item.status !== activeFilters.status) return false
        return true
      })
  }, [contributions, searchQuery, activeFilters])

  const handleView = (contribution: ResourceContributionRecord) => {
    setSelectedContribution(contribution)
    setShowApproval(true)
  }

  const handleClose = () => {
    setShowApproval(false)
    setSelectedContribution(undefined)
  }

  return (
    <div className="space-y-6">
      {!showApproval ? (
        <>
          <PageHeaderCard
            title="Resource Contributions — Division Director"
            subtitle="Review and approve resource contribution records submitted by officers"
          />
          <PageToolbar
            searchPlaceholder="Search contributions..."
            onSearch={setSearchQuery}
            onFilter={() => setShowFilter(true)}
            showSearchAndFilters
          />
          <DataTable
            items={filtered}
            rowKey={item => item.id}
            emptyVariant="empty"
            emptyMessage="No contributions pending review."
            columns={[
              {
                label: 'No.',
                render: (_item, i) => (
                  <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
              },
              {
                label: 'Contribution ID',
                render: item => <span className="font-medium text-slate-900">{item.id}</span>,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Partner',
                render: item => item.partnerName || '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Project',
                render: item => item.projectName || '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Total Value',
                render: item =>
                  item.totalValue
                    ? `${item.currency} ${parseFloat(item.totalValue).toLocaleString()}`
                    : '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Submitted At',
                render: item =>
                  item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : '—',
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
            title="Filter Contributions"
          />
        </>
      ) : (
        selectedContribution && (
          <DivisionDirectorContributionApproval
            contribution={selectedContribution}
            onClose={handleClose}
          />
        )
      )}
    </div>
  )
}
