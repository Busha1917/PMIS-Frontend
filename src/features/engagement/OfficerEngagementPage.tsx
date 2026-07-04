import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import { EngagementForm } from './EngagementForm'
import type { EngagementRecord } from '../../types'
import { engagementStore } from './engagementStore'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Assigned', value: 'Assigned' },
      { label: 'Pending Approval', value: 'Pending Approval' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

export function OfficerEngagementPage() {
  const [engagements, setEngagements] = useState<EngagementRecord[]>(() => engagementStore.getAll())
  const [selected, setSelected] = useState<EngagementRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  useEffect(() => engagementStore.subscribe(setEngagements), [])

  const handleCreateNew = () => {
    const newEngagement = engagementStore.create()
    setSelected(newEngagement)
  }

  // Officer only sees Assigned engagements (and their own submitted ones)
  const filtered = useMemo(() => {
    return engagements.filter(item => {
      if (item.status === 'Draft') return false
      if (
        searchQuery &&
        !item.organization?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [engagements, searchQuery, activeFilters])

  const handleSaveDraft = (data: EngagementRecord) => {
    const updated: EngagementRecord = {
      ...data,
      status: 'Assigned',
      submittedAt: undefined,
    }
    engagementStore.update(updated)
    setSelected(updated)
    toast.success('Draft saved', { description: data.organization })
  }

  const handleSubmit = (data: EngagementRecord) => {
    const updated: EngagementRecord = {
      ...data,
      status: 'Pending Approval',
      submittedAt: new Date().toISOString(),
      submittedBy: 'Officer',
    }
    engagementStore.update(updated)
    setSelected(null)
    toast.success('Engagement submitted for approval', { description: data.organization })
  }

  // ── Form view ────────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <EngagementForm
        engagement={selected}
        mode="edit"
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        onCancel={() => setSelected(null)}
      />
    )
  }

  // ── Table view ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="My Engagements"
        subtitle="Fill in the details for engagements assigned to you"
      />
      <PageToolbar
        searchPlaceholder="Search engagements..."
        addLabel="Add Engagement"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={handleCreateNew}
        showSearchAndFilters
      />
      <DataTable
        items={filtered}
        rowKey={item => item.id}
        emptyVariant="engagement"
        columns={[
          {
            label: 'No.',
            render: (_item, i) => (
              <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
            ),
            headClassName: 'bg-[#0b265a] text-white text-center',
          },
          {
            label: 'Engagement ID',
            render: item => <span className="font-medium text-slate-900">{item.id}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Organization',
            render: item => item.organization || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          { label: 'Type', render: item => item.type, headClassName: 'bg-[#0b265a] text-white' },
          { label: 'Date', render: item => item.date, headClassName: 'bg-[#0b265a] text-white' },
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
                onClick={() => setSelected(item)}
                className={
                  item.status === 'Assigned'
                    ? 'rounded-lg bg-[#ff9500] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#e68a00]'
                    : 'rounded-lg bg-[#161A61] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0f1347]'
                }
              >
                {item.status === 'Assigned' ? 'Fill Details' : 'View'}
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
        title="Filter Engagements"
      />
    </div>
  )
}
