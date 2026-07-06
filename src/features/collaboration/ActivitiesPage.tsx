import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { ActivityRecord } from '../../types'
import { activityStore } from './activityStore'

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

export function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityRecord[]>(() => activityStore.getAll())
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  useEffect(() => activityStore.subscribe(setActivities), [])

  const filtered = useMemo(() => {
    return activities.filter(item => {
      if (
        searchQuery &&
        !item.activityName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [activities, searchQuery, activeFilters])

  const handleAddNew = () => {
    toast.info('Activity creation coming soon')
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Joint Activities"
        subtitle="Manage standalone activity modules and mutual events"
      />
      <PageToolbar
        searchPlaceholder="Search activities..."
        addLabel="Add Activity"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={handleAddNew}
        showSearchAndFilters
      />
      <DataTable
        items={filtered}
        rowKey={item => item.id}
        emptyVariant="empty"
        emptyMessage="No joint activities found. Start by adding an activity."
        emptyAction={
          <button
            onClick={handleAddNew}
            className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
          >
            Add Activity
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
            label: 'Activity ID',
            render: item => <span className="font-medium text-slate-900">{item.id}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Activity Name',
            render: item => item.activityName || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Partner',
            render: item => item.partnerName,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Type',
            render: item => item.activityType || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Lead Organization',
            render: item => item.leadOrganization || '—',
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
                onClick={() => toast.info('View activity details')}
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
        title="Filter Activities"
      />
    </div>
  )
}
