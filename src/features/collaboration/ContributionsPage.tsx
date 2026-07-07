import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { ResourceContributionRecord } from '../../types'
import { contributionStore } from './contributionStore'
import { OfficerContributionForm } from './OfficerContributionForm'
import { DivisionDirectorContributionApproval } from './DivisionDirectorContributionApproval'

type ViewMode = 'officer' | 'director'

const OFFICER_FILTERS = [
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

const DIRECTOR_FILTERS = [
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

export function ContributionsPage() {
  const [contributions, setContributions] = useState<ResourceContributionRecord[]>(() =>
    contributionStore.getAll()
  )
  const [viewMode, setViewMode] = useState<ViewMode>('officer')
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<ResourceContributionRecord | undefined>()

  useEffect(() => contributionStore.subscribe(setContributions), [])

  const handleTabSwitch = (mode: ViewMode) => {
    setViewMode(mode)
    setSearchQuery('')
    setActiveFilters({})
    setShowForm(false)
    setSelected(undefined)
  }

  const officerItems = useMemo(
    () =>
      contributions.filter(item => {
        if (
          searchQuery &&
          !item.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false
        if (activeFilters.status && item.status !== activeFilters.status) return false
        return true
      }),
    [contributions, searchQuery, activeFilters]
  )

  const directorItems = useMemo(
    () =>
      contributions
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
        }),
    [contributions, searchQuery, activeFilters]
  )

  const handleAddNew = () => {
    const rec = contributionStore.create()
    setSelected(rec)
    setShowForm(true)
  }

  const handleView = (c: ResourceContributionRecord) => {
    setSelected(c)
    setShowForm(true)
  }
  const handleClose = () => {
    setShowForm(false)
    setSelected(undefined)
  }

  if (showForm && selected) {
    if (viewMode === 'officer')
      return <OfficerContributionForm contribution={selected} onClose={handleClose} />
    return <DivisionDirectorContributionApproval contribution={selected} onClose={handleClose} />
  }

  const COLS_COMMON = [
    {
      label: 'No.',
      render: (_: ResourceContributionRecord, i?: number) => (
        <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
      ),
      headClassName: 'bg-[#0b265a] text-white text-center',
    },
    {
      label: 'ID',
      render: (item: ResourceContributionRecord) => (
        <span className="font-medium text-slate-900">{item.id}</span>
      ),
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Partner',
      render: (item: ResourceContributionRecord) => item.partnerName || '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Project',
      render: (item: ResourceContributionRecord) => item.projectName || '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Total Value',
      render: (item: ResourceContributionRecord) =>
        item.totalValue ? `${item.currency} ${parseFloat(item.totalValue).toLocaleString()}` : '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Status',
      render: (item: ResourceContributionRecord) => <StatusBadge status={item.status} />,
      headClassName: 'bg-[#0b265a] text-white text-center',
      cellClassName: 'text-center',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Resource Contributions"
        subtitle="Track monetary and non-monetary investments from both organizations"
      />

      {/* Role tabs */}
      <div className="flex w-fit gap-2 rounded-xl bg-slate-100 p-1">
        {(['officer', 'director'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            type="button"
            onClick={() => handleTabSwitch(mode)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
              viewMode === mode
                ? 'bg-[#161A61] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {mode === 'officer' ? 'Officer' : 'Division Director'}
          </button>
        ))}
      </div>

      {viewMode === 'officer' && (
        <>
          <PageToolbar
            searchPlaceholder="Search contributions..."
            addLabel="Add Contribution"
            onSearch={setSearchQuery}
            onFilter={() => setShowFilter(true)}
            onAdd={handleAddNew}
            showSearchAndFilters
          />
          <DataTable
            items={officerItems}
            rowKey={item => item.id}
            emptyVariant="empty"
            emptyMessage="No contributions found. Start by adding a record."
            emptyAction={
              <button
                onClick={handleAddNew}
                className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
              >
                Add Contribution
              </button>
            }
            columns={[
              ...COLS_COMMON,
              {
                label: 'Action',
                render: (item: ResourceContributionRecord) => (
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
            fields={OFFICER_FILTERS}
            title="Filter Contributions"
          />
        </>
      )}

      {viewMode === 'director' && (
        <>
          <PageToolbar
            searchPlaceholder="Search contributions..."
            onSearch={setSearchQuery}
            onFilter={() => setShowFilter(true)}
            showSearchAndFilters
          />
          <DataTable
            items={directorItems}
            rowKey={item => item.id}
            emptyVariant="empty"
            emptyMessage="No contributions pending review."
            columns={[
              ...COLS_COMMON,
              {
                label: 'Action',
                render: (item: ResourceContributionRecord) => (
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
            fields={DIRECTOR_FILTERS}
            title="Filter Contributions"
          />
        </>
      )}
    </div>
  )
}
