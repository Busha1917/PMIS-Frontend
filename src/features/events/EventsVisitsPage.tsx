import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { PageToolbar } from '../../components/PageToolbar'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { StatusBadge } from '../../components/StatusBadge'
import { TableActionButtons } from '../../components/TableActionButtons'
import { ConfirmationModal } from '../../components/ConfirmationModal'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { EventRecord, VisitRecord } from '../../types'
import {
  useGetEventsQuery,
  useGetVisitsQuery,
  useDeleteEventMutation,
  useDeleteVisitMutation,
} from '../../store/apiSlice'

const EVENT_FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Planned', value: 'Planned' },
      { label: 'Ongoing', value: 'Ongoing' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'Follow-up Required', value: 'Follow-up Required' },
    ],
  },
]

const VISIT_FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Planned', value: 'Planned' },
      { label: 'Ongoing', value: 'Ongoing' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'Follow-up Required', value: 'Follow-up Required' },
    ],
  },
]

type Tab = 'events' | 'visits'

export function EventsVisitsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('events')
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [deleteType, setDeleteType] = useState<'event' | 'visit'>('event')

  const { data: events = [], isLoading: eventsLoading } = useGetEventsQuery({})
  const { data: visits = [], isLoading: visitsLoading } = useGetVisitsQuery({})
  const [deleteEvent] = useDeleteEventMutation()
  const [deleteVisit] = useDeleteVisitMutation()

  const filteredEvents = useMemo(() => {
    return events.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [events, searchQuery, activeFilters])

  const filteredVisits = useMemo(() => {
    return visits.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [visits, searchQuery, activeFilters])

  const handleDeleteEvent = (item: EventRecord) => {
    setSelectedId(item.id)
    setDeleteType('event')
    setShowDeleteModal(true)
  }

  const handleDeleteVisit = (item: VisitRecord) => {
    setSelectedId(item.id)
    setDeleteType('visit')
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedId) return
    try {
      if (deleteType === 'event') {
        await deleteEvent(selectedId).unwrap()
        toast.success('Event deleted')
      } else {
        await deleteVisit(String(selectedId)).unwrap()
        toast.success('Visit deleted')
      }
    } catch {
      toast.error('Failed to delete record')
    }
    setShowDeleteModal(false)
    setSelectedId(null)
  }

  const tabCls = (tab: Tab) =>
    `px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
      activeTab === tab ? 'bg-[#161A61] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Events & Visits"
        subtitle="Partnership Management Information System — Overview"
      />

      {/* Tab switcher */}
      <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 w-fit">
        <button
          className={tabCls('events')}
          onClick={() => {
            setActiveTab('events')
            setSearchQuery('')
            setActiveFilters({})
          }}
        >
          Events
        </button>
        <button
          className={tabCls('visits')}
          onClick={() => {
            setActiveTab('visits')
            setSearchQuery('')
            setActiveFilters({})
          }}
        >
          Visits
        </button>
      </div>

      <PageToolbar
        searchPlaceholder={activeTab === 'events' ? 'Search events...' : 'Search visits...'}
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        showSearchAndFilters
      />

      {activeTab === 'events' ? (
        <DataTable
          items={filteredEvents}
          rowKey={item => item.id}
          emptyVariant={searchQuery || activeFilters.status ? 'search' : 'events'}
          isLoading={eventsLoading}
          columns={[
            {
              label: 'No.',
              render: (_item, index) => (
                <span className="font-semibold text-slate-900">{index}</span>
              ),
              headClassName: 'bg-[#0b265a] text-white text-center',
            },
            {
              label: 'Title',
              render: (item: EventRecord) => item.title,
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Type',
              render: (item: EventRecord) => item.eventType?.typeName || '—',
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Date',
              render: (item: EventRecord) => item.eventDate || '—',
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Venue',
              render: (item: EventRecord) => item.venue || '—',
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Organizer',
              render: (item: EventRecord) => item.organizer || '—',
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Status',
              render: (item: EventRecord) => <StatusBadge status={item.status} />,
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
            {
              label: 'Action',
              render: (item: EventRecord) => (
                <TableActionButtons onDelete={() => handleDeleteEvent(item)} />
              ),
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
          ]}
        />
      ) : (
        <DataTable
          items={filteredVisits}
          rowKey={item => item.id}
          emptyVariant={searchQuery || activeFilters.status ? 'search' : 'events'}
          isLoading={visitsLoading}
          columns={[
            {
              label: 'No.',
              render: (_item, index) => (
                <span className="font-semibold text-slate-900">{index}</span>
              ),
              headClassName: 'bg-[#0b265a] text-white text-center',
            },
            {
              label: 'Title',
              render: (item: VisitRecord) => item.title,
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Type',
              render: (item: VisitRecord) => item.visitType?.typeName || '—',
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Date',
              render: (item: VisitRecord) => item.visitDate || '—',
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Host Organization',
              render: (item: VisitRecord) => item.hostOrganization || '—',
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Visiting Organization',
              render: (item: VisitRecord) => item.visitingOrganization || '—',
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Status',
              render: (item: VisitRecord) => <StatusBadge status={item.status} />,
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
            {
              label: 'Action',
              render: (item: VisitRecord) => (
                <TableActionButtons onDelete={() => handleDeleteVisit(item)} />
              ),
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
          ]}
        />
      )}

      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={f => {
          setActiveFilters(f)
          setShowFilter(false)
        }}
        fields={activeTab === 'events' ? EVENT_FILTER_FIELDS : VISIT_FILTER_FIELDS}
        title={activeTab === 'events' ? 'Filter Events' : 'Filter Visits'}
      />

      <ConfirmationModal
        open={showDeleteModal}
        title={`Delete ${deleteType === 'event' ? 'Event' : 'Visit'}`}
        message="Are you sure you want to delete this record? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
