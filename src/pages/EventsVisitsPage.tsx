import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../components/DataTable'
import { EventForm } from '../components/EventForm'
import { KanbanBoard } from '../components/KanbanBoard'
import { PageToolbar } from '../components/PageToolbar'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { FilterDrawer } from '../components/FilterDrawer'
import type { FilterValues } from '../components/FilterDrawer'
import type { EventRecord } from '../types'
import { events as initialEvents } from '../data'
import { exportToCsv } from '../utils/exportCsv'

const FILTER_FIELDS = [
  {
    key: 'category',
    label: 'Category',
    type: 'select' as const,
    options: [
      { label: 'Event', value: 'Event' },
      { label: 'Visit', value: 'Visit' },
    ],
  },
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
    label: 'Type',
    type: 'text' as const,
    placeholder: 'e.g. Workshop, delegation visit...',
  },
  {
    key: 'venue',
    label: 'Venue / Location',
    type: 'text' as const,
    placeholder: 'Search by venue...',
  },
]

export function EventsVisitsPage() {
  const [events, setEvents] = useState<EventRecord[]>(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  const filteredEvents = useMemo(() => {
    return events.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.category && (item.category ?? 'Event') !== activeFilters.category)
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.type && !item.type.toLowerCase().includes(activeFilters.type.toLowerCase()))
        return false
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
      toast.success('Record updated', { description: eventData.title })
    } else {
      setEvents(current => [
        ...current,
        { ...eventData, id: `evt-${Date.now()}`, no: current.length + 1 },
      ])
      toast.success('Record added', { description: eventData.title })
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

  const handleExport = () => {
    exportToCsv(
      'events-visits',
      ['#', 'Title', 'Category', 'Type', 'Date & Time', 'Venue / Location', 'Status'],
      [
        filteredEvents.map((item, i) => [
          i + 1,
          item.title,
          item.category || 'Event',
          item.type,
          item.date,
          item.venue,
          item.status,
        ]),
      ]
    )
    toast.success('Exported to CSV', { description: `${filteredEvents.length} records` })
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <PageHeaderCard
          title="Events & Visits"
          subtitle="Partnership Management Information System — Overview"
        />
      )}
      <PageToolbar
        searchPlaceholder="Search events & visits..."
        addLabel="Add Record"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={showForm ? undefined : handleAddNew}
        onExport={showForm ? undefined : handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearchAndFilters={!showForm}
      />

      {showForm ? (
        <EventForm
          event={selectedEvent}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onEdit={() => setFormMode('edit')}
        />
      ) : (
        <>
          {viewMode === 'kanban' ? (
            <KanbanBoard
              columns={[
                {
                  id: 'Draft',
                  title: 'Draft',
                  color: 'bg-slate-400',
                  items: filteredEvents.filter(event => event.status === 'Draft'),
                },
                {
                  id: 'Approved',
                  title: 'Approved',
                  color: 'bg-blue-500',
                  items: filteredEvents.filter(event => event.status === 'Approved'),
                },
                {
                  id: 'Accepted',
                  title: 'Accepted',
                  color: 'bg-emerald-500',
                  items: filteredEvents.filter(event => event.status === 'Accepted'),
                },
                {
                  id: 'Rejected',
                  title: 'Rejected',
                  color: 'bg-red-500',
                  items: filteredEvents.filter(event => event.status === 'Rejected'),
                },
              ]}
              onAddCard={() => handleAddNew()}
              renderCard={event => (
                <div
                  onClick={() => handleView(event)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{event.type}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {event.no}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>{event.venue}</p>
                    <p className="mt-1 text-xs text-slate-500">{event.date}</p>
                  </div>
                </div>
              )}
            />
          ) : (
            <DataTable
              items={filteredEvents}
              rowKey={event => event.id}
              emptyVariant={isFiltering ? 'search' : 'events'}
              emptyAction={
                !isFiltering && (
                  <button
                    onClick={handleAddNew}
                    className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
                  >
                    Add Record
                  </button>
                )
              }
              columns={[
                {
                  label: 'No.',
                  render: (_event, index) => (
                    <span className="font-semibold text-slate-900">{index}</span>
                  ),
                  headClassName: 'bg-[#0b265a] text-white text-center',
                },
                {
                  label: 'Name / Title',
                  render: (event: EventRecord) => event.title,
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Category',
                  render: (event: EventRecord) => event.category || 'Event',
                  headClassName: 'bg-[#0b265a] text-white text-center',
                  cellClassName: 'text-center',
                },
                {
                  label: 'Type',
                  render: (event: EventRecord) => event.type,
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Date & Time',
                  render: (event: EventRecord) => event.date,
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Venue / Location',
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
          )}
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
