import { useMemo, useState } from 'react'
import { DataTable } from '../components/DataTable'
import { EventForm } from '../components/EventForm'
import { PageToolbar } from '../components/PageToolbar'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { TablePagination } from '../components/TablePagination'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { FilterDrawer } from '../components/FilterDrawer'
import type { FilterValues } from '../components/FilterDrawer'
import type { EventRecord } from '../types'
import { events as initialEvents } from '../data'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Accepted', value: 'Accepted' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
  {
    key: 'type',
    label: 'Event Type',
    type: 'select' as const,
    options: [
      { label: 'Conference / Forum', value: 'Conference / Forum' },
      { label: 'Concert', value: 'Concert' },
      { label: 'Art/Culture', value: 'Art/Culture' },
      { label: 'Sport', value: 'Sport' },
      { label: 'AGM', value: 'AGM' },
      { label: 'Workshop', value: 'Workshop' },
      { label: 'Webinar', value: 'Webinar' },
    ],
  },
  { key: 'venue', label: 'Venue', type: 'text' as const, placeholder: 'Search by venue...' },
]

export function EventsVisitsPage() {
  const [events, setEvents] = useState<EventRecord[]>(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  const filteredEvents = useMemo(() => {
    return events.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.type && item.type !== activeFilters.type) return false
      if (
        activeFilters.venue &&
        !item.venue.toLowerCase().includes(activeFilters.venue.toLowerCase())
      )
        return false
      return true
    })
  }, [events, searchQuery, activeFilters])

  const isFiltering = searchQuery !== '' || Object.keys(activeFilters).length > 0

  const handleAddNew = () => {
    setSelectedEvent(null)
    setFormMode('create')
    setShowForm(true)
  }

  const handleView = (event: EventRecord) => {
    setSelectedEvent(event)
    setFormMode('preview')
    setShowForm(true)
  }

  const handleEdit = (event: EventRecord) => {
    setSelectedEvent(event)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = (event: EventRecord) => {
    setSelectedEvent(event)
    setShowDeleteModal(true)
  }

  const handleSubmit = (eventData: EventRecord) => {
    if (formMode === 'edit' && selectedEvent) {
      setEvents(current => current.map(item => (item.id === selectedEvent.id ? eventData : item)))
    } else {
      setEvents(current => [
        ...current,
        { ...eventData, id: `evt-${Date.now()}`, no: current.length + 1 },
      ])
    }
    setShowForm(false)
    setSelectedEvent(null)
    setFormMode('create')
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedEvent(null)
    setFormMode('create')
  }

  const confirmDelete = () => {
    if (!selectedEvent) return
    setEvents(current => current.filter(item => item.id !== selectedEvent.id))
    setShowDeleteModal(false)
    setSelectedEvent(null)
    setFormMode('create')
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Events & Visits"
        subtitle="Partnership Management Information System — Overview"
      />
      <PageToolbar
        searchPlaceholder="Search events..."
        addLabel="Add Events & Visit"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={showForm ? undefined : handleAddNew}
      />

      {showForm ? (
        <EventForm
          event={selectedEvent}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <DataTable
            items={filteredEvents}
            rowKey={event => event.id}
            emptyVariant={isFiltering ? 'search' : 'empty'}
            columns={[
              {
                label: 'No.',
                render: (event: EventRecord) => (
                  <span className="font-semibold text-slate-900">{event.no}</span>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Event Name',
                render: (event: EventRecord) => event.title,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Event Type',
                render: (event: EventRecord) => event.type,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Date & Time',
                render: (event: EventRecord) => event.date,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Venue',
                render: (event: EventRecord) => event.venue,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Status',
                render: (event: EventRecord) => <StatusBadge status={event.status} />,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Action',
                render: (event: EventRecord) => (
                  <TableActionButtons
                    onView={() => handleView(event)}
                    onEdit={() => handleEdit(event)}
                    onDelete={() => handleDelete(event)}
                  />
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
            ]}
          />
          <TablePagination totalEntries={filteredEvents.length} />
        </>
      )}

      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setActiveFilters}
        fields={FILTER_FIELDS}
        title="Filter Events"
      />

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
