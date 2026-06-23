import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui'
import { EventForm } from '../components/EventForm'
import { PageToolbar } from '../components/PageToolbar'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
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
        onAdd={handleAddNew}
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

          <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-sm text-slate-500">Rows per page</span>
                <select className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-[#161A61] focus:outline-none focus:ring-2 focus:ring-[#161A61]/10">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>
              <p className="text-sm text-slate-600">Showing 1 to 10 of {events.length} entries</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Button variant="outline" className="!px-4">&lt; Back</Button>
              {[1, 2, 3, 4, 5].map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={
                    pageNumber === 1
                      ? 'min-w-[2.2rem] rounded-full bg-[#161A61] px-3 py-2 text-sm font-semibold text-white shadow-sm'
                      : 'min-w-[2.2rem] rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200'
                  }
                >
                  {pageNumber}
                </button>
              ))}
              <Button variant="outline" className="!px-4">Next &gt;</Button>
            </div>
          </div>
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
