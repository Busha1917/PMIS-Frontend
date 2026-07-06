import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { ActivityRecord } from '../../types'
import { activityStore } from './activityStore'
import { OfficerActivityForm } from './OfficerActivityForm'
import { DivisionDirectorActivityApproval } from './DivisionDirectorActivityApproval'

type ViewMode = 'officer' | 'director'

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

const DIRECTOR_FILTER_FIELDS = [
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

export function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityRecord[]>(() => activityStore.getAll())
  const [viewMode, setViewMode] = useState<ViewMode>('officer')
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [showForm, setShowForm] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | undefined>()

  useEffect(() => activityStore.subscribe(setActivities), [])

  // Reset filter when switching tabs
  const handleTabSwitch = (mode: ViewMode) => {
    setViewMode(mode)
    setSearchQuery('')
    setActiveFilters({})
    setShowForm(false)
    setSelectedActivity(undefined)
  }

  const officerItems = useMemo(() => {
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

  const directorItems = useMemo(() => {
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

  const handleAddNew = () => {
    const newActivity = activityStore.create('', '')
    setSelectedActivity(newActivity)
    setShowForm(true)
  }

  const handleView = (activity: ActivityRecord) => {
    setSelectedActivity(activity)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setSelectedActivity(undefined)
  }

  // ── Form / Approval view ───────────────────────────────────────────────
  if (showForm && selectedActivity) {
    if (viewMode === 'officer') {
      return <OfficerActivityForm activity={selectedActivity} onClose={handleClose} />
    }
    return <DivisionDirectorActivityApproval activity={selectedActivity} onClose={handleClose} />
  }

  // ── Table view ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Joint Activities"
        subtitle="Register and manage joint activity collaborations"
      />

      {/* Role tabs */}
      <div className="flex gap-2 rounded-xl bg-slate-100 p-1 w-fit">
        <button
          type="button"
          onClick={() => handleTabSwitch('officer')}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
            viewMode === 'officer'
              ? 'bg-[#161A61] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Officer
        </button>
        <button
          type="button"
          onClick={() => handleTabSwitch('director')}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
            viewMode === 'director'
              ? 'bg-[#161A61] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Division Director
        </button>
      </div>

      {/* Officer view */}
      {viewMode === 'officer' && (
        <>
          <PageToolbar
            searchPlaceholder="Search activities..."
            addLabel="Add Activity"
            onSearch={setSearchQuery}
            onFilter={() => setShowFilter(true)}
            onAdd={handleAddNew}
            showSearchAndFilters
          />
          <DataTable
            items={officerItems}
            rowKey={item => item.id}
            emptyVariant="empty"
            emptyMessage="No activities found. Start by registering a joint activity."
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
            title="Filter Activities"
          />
        </>
      )}

      {/* Director view */}
      {viewMode === 'director' && (
        <>
          <PageToolbar
            searchPlaceholder="Search activities..."
            onSearch={setSearchQuery}
            onFilter={() => setShowFilter(true)}
            showSearchAndFilters
          />
          <DataTable
            items={directorItems}
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
            fields={DIRECTOR_FILTER_FIELDS}
            title="Filter Activities"
          />
        </>
      )}
    </div>
  )
}
