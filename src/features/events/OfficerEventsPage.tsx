import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { EventForm } from './EventForm'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { TableActionButtons } from '../../components/TableActionButtons'
import { ConfirmationModal } from '../../components/ConfirmationModal'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { EventRecord, VisitRecord } from '../../types'
import {
  useGetEventsQuery,
  useGetVisitsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useCreateVisitMutation,
  useUpdateVisitMutation,
  useDeleteVisitMutation,
} from '../../store/apiSlice'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Planned', value: 'Planned' },
      { label: 'Ongoing', value: 'Ongoing' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Cancelled', value: 'Cancelled' },
    ],
  },
]

type Tab = 'events' | 'visits'

export function OfficerEventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('events')
  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selected, setSelected] = useState<EventRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  const { data: events = [], isLoading: eventsLoading } = useGetEventsQuery({})
  const { data: visits = [], isLoading: visitsLoading } = useGetVisitsQuery({})
  const [createEvent] = useCreateEventMutation()
  const [updateEvent] = useUpdateEventMutation()
  const [deleteEvent] = useDeleteEventMutation()
  const [createVisit] = useCreateVisitMutation()
  const [updateVisit] = useUpdateVisitMutation()
  const [deleteVisit] = useDeleteVisitMutation()

  const filteredEvents = useMemo(
    () =>
      events.filter(item => {
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()))
          return false
        if (activeFilters.status && item.status !== activeFilters.status) return false
        return true
      }),
    [events, searchQuery, activeFilters]
  )

  const filteredVisits = useMemo(
    () =>
      (visits as any[]).filter(item => {
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()))
          return false
        if (activeFilters.status && item.status !== activeFilters.status) return false
        return true
      }),
    [visits, searchQuery, activeFilters]
  )

  const handleAddNew = () => {
    setSelected(null)
    setFormMode('create')
    setShowForm(true)
  }

  const handleView = (item: EventRecord) => {
    setSelected(item)
    setFormMode('preview')
    setShowForm(true)
  }

  const handleEdit = (item: EventRecord) => {
    setSelected(item)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = (item: EventRecord) => {
    setSelected(item)
    setShowDeleteModal(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelected(null)
    setFormMode('create')
  }

  const handleSubmit = async (data: EventRecord) => {
    try {
      if (data.category === 'Visit') {
        const visitPayload: Partial<VisitRecord> = {
          title: data.title,
          visitDate: data.eventDate || data.date || '',
          hostOrganization: data.hostOrganization ?? undefined,
          visitingOrganization: data.visitingOrganization ?? undefined,
          visitLocation: data.visitLocations ?? undefined,
          purpose: data.purposeOfVisit ?? undefined,
          status: 'Planned' as const,
        }
        if (selected?.id && formMode === 'edit') {
          await updateVisit({ id: String(selected.id), data: visitPayload }).unwrap()
          toast.success('Visit updated', { description: data.title })
        } else {
          await createVisit(visitPayload).unwrap()
          toast.success('Visit created', { description: data.title })
        }
      } else {
        const eventPayload: Partial<EventRecord> = {
          title: data.title,
          eventDate: data.eventDate || data.date || '',
          venue: data.venue || '',
          organizer: data.organizer ?? undefined,
          coOrganizer: data.coOrganizer ?? undefined,
          status: 'Planned' as const,
        }
        if (selected?.id && formMode === 'edit') {
          await updateEvent({ id: selected.id, data: eventPayload }).unwrap()
          toast.success('Event updated', { description: data.title })
        } else {
          await createEvent(eventPayload).unwrap()
          toast.success('Event created', { description: data.title })
        }
      }
      handleCancel()
    } catch (err: any) {
      toast.error('Failed to save record', { description: err?.data?.message })
    }
  }

  const confirmDelete = async () => {
    if (!selected) return
    try {
      if (selected.category === 'Visit') {
        await deleteVisit(String(selected.id)).unwrap()
      } else {
        await deleteEvent(selected.id).unwrap()
      }
      toast.error('Record deleted', { description: selected.title })
    } catch {
      toast.error('Failed to delete record')
    }
    setShowDeleteModal(false)
    setSelected(null)
  }

  const tabCls = (tab: Tab) =>
    `px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
      activeTab === tab ? 'bg-[#161A61] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
    }`

  const eventColumns = [
    {
      label: 'No.',
      render: (_item: EventRecord, index: number) => (
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
      label: 'Status',
      render: (item: EventRecord) => <StatusBadge status={item.status} />,
      headClassName: 'bg-[#0b265a] text-white text-center',
      cellClassName: 'text-center',
    },
    {
      label: 'Action',
      render: (item: EventRecord) => (
        <TableActionButtons
          onView={() => handleView(item)}
          onEdit={
            item.status === 'Planned' || item.status === 'Cancelled'
              ? () => handleEdit(item)
              : undefined
          }
          onDelete={item.status === 'Planned' ? () => handleDelete(item) : undefined}
        />
      ),
      headClassName: 'bg-[#0b265a] text-white text-center',
      cellClassName: 'text-center',
    },
  ]

  const visitColumns = [
    {
      label: 'No.',
      render: (_item: any, index: number) => (
        <span className="font-semibold text-slate-900">{index}</span>
      ),
      headClassName: 'bg-[#0b265a] text-white text-center',
    },
    {
      label: 'Title',
      render: (item: any) => item.title,
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Type',
      render: (item: any) => item.visitType?.typeName || '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Date',
      render: (item: any) => item.visitDate || '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Host Organization',
      render: (item: any) => item.hostOrganization || '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />,
      headClassName: 'bg-[#0b265a] text-white text-center',
      cellClassName: 'text-center',
    },
    {
      label: 'Action',
      render: (item: any) => (
        <TableActionButtons
          onView={() => handleView({ ...item, category: 'Visit' as const })}
          onDelete={
            item.status === 'Planned'
              ? () => handleDelete({ ...item, category: 'Visit' as const })
              : undefined
          }
        />
      ),
      headClassName: 'bg-[#0b265a] text-white text-center',
      cellClassName: 'text-center',
    },
  ]

  return (
    <div className="space-y-6">
      {!showForm && (
        <PageHeaderCard
          title="Events & Visits — Officer"
          subtitle="Create and submit event or visit records"
        />
      )}

      {/* Tab switcher */}
      {!showForm && (
        <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 w-fit">
          <button className={tabCls('events')} onClick={() => setActiveTab('events')}>
            Events
          </button>
          <button className={tabCls('visits')} onClick={() => setActiveTab('visits')}>
            Visits
          </button>
        </div>
      )}

      <PageToolbar
        searchPlaceholder={`Search ${activeTab}...`}
        addLabel="Add Record"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={showForm ? undefined : handleAddNew}
        showSearchAndFilters={!showForm}
      />

      {showForm ? (
        <EventForm
          event={selected}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onEdit={() => setFormMode('edit')}
          userRole="Officer"
        />
      ) : activeTab === 'events' ? (
        <DataTable
          items={filteredEvents}
          rowKey={item => item.id}
          emptyVariant={searchQuery || activeFilters.status ? 'search' : 'events'}
          isLoading={eventsLoading}
          columns={eventColumns}
        />
      ) : (
        <DataTable
          items={filteredVisits}
          rowKey={item => item.id}
          emptyVariant={searchQuery || activeFilters.status ? 'search' : 'events'}
          isLoading={visitsLoading}
          columns={visitColumns}
        />
      )}

      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setActiveFilters}
        fields={FILTER_FIELDS}
        title="Filter Records"
      />

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
