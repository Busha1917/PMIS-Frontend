import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { ActivityRecord } from '../../types'
import { activityStore } from './activityStore'
import { DivisionDirectorActivityApproval } from './DivisionDirectorActivityApproval'

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

export function DivisionDirectorActivitiesPage() {
  const [activities, setActivities] = useState<ActivityRecord[]>(() => activityStore.getAll())
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [showApprovalView, setShowApprovalView] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | undefined>()

  useEffect(() => activityStore.subscribe(setActivities), [])

  const directorActivities = useMemo(() => {
    return activities
      .filter(a => a.status !== 'Draft')
      .filter(item => {
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

  const handleView = (activity: ActivityRecord) => {
    setSelectedActivity(activity)
    setShowApprovalView(true)
  }

  const handleClose = () => {
    setShowApprovalView(false)
    setSelectedActivity(undefined)
  }

  if (showApprovalView && selectedActivity) {
    return <DivisionDirectorActivityApproval activity={selectedActivity} onClose={handleClose} />
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Joint Activities — Division Director"
        subtitle="Review and approve submitted joint activity records"
      />
      <PageToolbar
        searchPlaceholder="Search activities..."
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        showSearchAndFilters
      />
      <DataTable
        items={directorActivities}
        rowKey={item => item.id}
        emptyVariant="empty"
        emptyMessage="No activities pending review."
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
            label: 'Type',
            render: item => item.activityType || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'EAII Unit',
            render: item => item.eaiiResponsibleUnit || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Start Date',
            render: item => item.startDate || '—',
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
        title="Filter Activities"
      />
    </div>
  )
}
