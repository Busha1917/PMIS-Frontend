import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui'
import { EventForm } from '../components/EventForm'
import { PageToolbar } from '../components/PageToolbar'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { TablePagination } from '../components/TablePagination'
import { ConfirmationModal } from '../components/ConfirmationModal'
import type { EventRecord } from '../types'
import { events as initialEvents } from '../data'

export function EventsVisitsPage() {
  const [events, setEvents] = useState<EventRecord[]>(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
      setEvents((current) => current.map((item) => (item.id === selectedEvent.id ? eventData : item)))
    } else {
      setEvents((current) => [
        ...current,
        {
          ...eventData,
          id: `evt-${Date.now()}`,
          no: current.length + 1,
        },
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
    setEvents((current) => current.filter((item) => item.id !== selectedEvent.id))
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
        onSearch={() => undefined}
        onFilter={() => undefined}
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
            items={events}
            rowKey={(event) => event.id}
            columns={[
              {
                label: 'No.',
                render: (event: EventRecord) => <span className="font-semibold text-slate-900">{event.no}</span>,
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

          <TablePagination totalEntries={events.length} />
        </>
      )}

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
