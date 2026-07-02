import { useEffect, useMemo, useState } from 'react'
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
import type { EventRecord } from '../../types'
import { eventsStore } from './eventsStore'
import { exportToCsv } from '../../utils/exportCsv'
import { KanbanBoard } from '../../components/KanbanBoard'

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
      { label: 'Pending Review', value: 'Pending Review' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Completed', value: 'Completed' },
    ],
  },
  {
    key: 'type',
    label: 'Type',
    type: 'text' as const,
    placeholder: 'e.g. Workshop, delegation visit...',
  },
]

export function OfficerEventsPage() {
  const [records, setRecords] = useState<EventRecord[]>(eventsStore.getAll())
  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selected, setSelected] = useState<EventRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  // Subscribe to store so this page reflects changes made from other pages
  useEffect(() => {
    return eventsStore.subscribe(() => setRecords(eventsStore.getAll()))
  }, [])

  // Officers see all records they submitted (all statuses for tracking)
  const filtered = useMemo(() => {
    return records.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.category && (item.category ?? 'Event') !== activeFilters.category)
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.type && !item.type.toLowerCase().includes(activeFilters.type.toLowerCase()))
        return false
      return true
    })
  }, [records, searchQuery, activeFilters])

  const isFiltering = searchQuery !== '' || Object.keys(activeFilters).length > 0

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

  const handleSubmit = (data: EventRecord) => {
    if ((formMode === 'edit' || formMode === 'preview') && selected) {
      eventsStore.update(data)
      toast.success('Record updated', { description: data.title })
    } else {
      const newRecord: EventRecord = {
        ...data,
        id: `evt-${Date.now()}`,
        no: eventsStore.getAll().length + 1,
      }
      eventsStore.add(newRecord)
      toast.success('Record created', { description: data.title })
    }
    handleCancel()
  }

  const confirmDelete = () => {
    if (!selected) return
    eventsStore.remove(selected.id)
    toast.error('Record deleted', { description: selected.title })
    setShowDeleteModal(false)
    setSelected(null)
  }

  const handleExport = () => {
    exportToCsv(
      'events-visits-officer',
      ['#', 'Title', 'Category', 'Type', 'Date & Time', 'Venue / Location', 'Status'],
      [
        filtered.map((item, i) => [
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
    toast.success('Exported to CSV', { description: `${filtered.length} records` })
  }

  const statusGroups: EventRecord['status'][] = [
    'Draft',
    'Pending Review',
    'Approved',
    'Rejected',
    'Completed',
  ]

  return (
    <div className="space-y-6">
      {!showForm && (
        <PageHeaderCard
          title="Events & Visits — Officer"
          subtitle="Create and submit event or visit records for Director General review"
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
          event={selected}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onEdit={() => setFormMode('edit')}
          userRole="Officer"
        />
      ) : (
        <>
          {viewMode === 'kanban' ? (
            <KanbanBoard
              columns={statusGroups.map(s => ({
                id: s,
                title: s,
                color:
                  s === 'Draft'
                    ? 'bg-slate-400'
                    : s === 'Pending Review'
                      ? 'bg-yellow-500'
                      : s === 'Approved'
                        ? 'bg-blue-500'
                        : s === 'Rejected'
                          ? 'bg-red-500'
                          : 'bg-green-500',
                items: filtered.filter(e => e.status === s),
              }))}
              onAddCard={handleAddNew}
              renderCard={item => (
                <div
                  onClick={() => handleView(item)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{item.type}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {item.no}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{item.venue}</p>
                  <p className="text-xs text-slate-500">{item.date?.split('T')[0]}</p>
                </div>
              )}
            />
          ) : (
            <DataTable
              items={filtered}
              rowKey={item => item.id}
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
                  render: (_item, index) => (
                    <span className="font-semibold text-slate-900">{index}</span>
                  ),
                  headClassName: 'bg-[#0b265a] text-white text-center',
                },
                {
                  label: 'Name / Title',
                  render: (item: EventRecord) => item.title,
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Category',
                  render: (item: EventRecord) => item.category || 'Event',
                  headClassName: 'bg-[#0b265a] text-white text-center',
                  cellClassName: 'text-center',
                },
                {
                  label: 'Type',
                  render: (item: EventRecord) => item.type,
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Date',
                  render: (item: EventRecord) => item.date?.split('T')[0] || '—',
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Venue',
                  render: (item: EventRecord) => item.venue,
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
                        item.status === 'Draft' || item.status === 'Rejected'
                          ? () => handleEdit(item)
                          : undefined
                      }
                      onDelete={item.status === 'Draft' ? () => handleDelete(item) : undefined}
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
        title="Filter Events & Visits"
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
