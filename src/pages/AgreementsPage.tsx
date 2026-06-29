import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../components/DataTable'
import { KanbanBoard } from '../components/KanbanBoard'
import { AgreementForm } from '../components/AgreementForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'

import { ConfirmationModal } from '../components/ConfirmationModal'
import { FilterDrawer } from '../components/FilterDrawer'
import type { FilterValues } from '../components/FilterDrawer'
import type { AgreementRecord } from '../types'
import { agreements as initialAgreements } from '../data'

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
    label: 'Agreement Type',
    type: 'select' as const,
    options: [
      { label: 'MoU', value: 'MoU' },
      { label: 'MoA', value: 'MoA' },
      { label: 'Contract', value: 'Contract' },
      { label: 'Framework Agreement', value: 'Framework Agreement' },
    ],
  },
]

export function AgreementsPage() {
  const [agreements, setAgreements] = useState<AgreementRecord[]>(initialAgreements)
  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<AgreementRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  const filteredAgreements = useMemo(() => {
    return agreements.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.type && item.type !== activeFilters.type) return false
      return true
    })
  }, [agreements, searchQuery, activeFilters])

  const kanbanColumns = useMemo(
    () => [
      {
        id: 'Draft',
        title: 'Draft',
        color: 'bg-slate-400',
        items: filteredAgreements.filter(op => op.status === 'Draft'),
      },
      {
        id: 'Approved',
        title: 'Approved',
        color: 'bg-blue-500',
        items: filteredAgreements.filter(op => op.status === 'Approved'),
      },
      {
        id: 'Accepted',
        title: 'Accepted',
        color: 'bg-emerald-500',
        items: filteredAgreements.filter(op => op.status === 'Accepted'),
      },
      {
        id: 'Rejected',
        title: 'Rejected',
        color: 'bg-red-500',
        items: filteredAgreements.filter(op => op.status === 'Rejected'),
      },
    ],
    [filteredAgreements]
  )

  const isFiltering = searchQuery !== '' || Object.keys(activeFilters).length > 0

  const handleAddNew = () => {
    setSelectedAgreement(null)
    setFormMode('create')
    setShowForm(true)
  }

  const handleView = (item: AgreementRecord) => {
    setSelectedAgreement(item)
    setFormMode('preview')
    setShowForm(true)
  }

  const handleEdit = (item: AgreementRecord) => {
    setSelectedAgreement(item)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = (item: AgreementRecord) => {
    setSelectedAgreement(item)
    setShowDeleteModal(true)
  }

  const handleSubmit = (formData: AgreementRecord) => {
    if (formMode === 'edit' && selectedAgreement) {
      setAgreements(current =>
        current.map(item => (item.id === selectedAgreement.id ? formData : item))
      )
      toast.success('Agreement updated successfully')
    } else {
      setAgreements(current => [
        ...current,
        { ...formData, id: `agr-${Date.now()}`, no: current.length + 1 },
      ])
      toast.success('Agreement created successfully')
    }
    setShowForm(false)
    setSelectedAgreement(null)
    setFormMode('create')
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedAgreement(null)
    setFormMode('create')
  }

  const confirmDelete = () => {
    if (!selectedAgreement) return
    setAgreements(current => current.filter(item => item.id !== selectedAgreement.id))
    setShowDeleteModal(false)
    setSelectedAgreement(null)
    setFormMode('create')
    toast.success('Agreement deleted')
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <PageHeaderCard
          title="Agreement Management"
          subtitle="Manage partnership agreements and legal documents"
        />
      )}
      <PageToolbar
        searchPlaceholder="Search agreements..."
        addLabel="Add Agreements"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={showForm ? undefined : handleAddNew}
        showSearchAndFilters={!showForm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {showForm ? (
        <AgreementForm
          agreement={selectedAgreement}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onEdit={() => setFormMode('edit')}
        />
      ) : (
        <>
          {viewMode === 'kanban' ? (
            <KanbanBoard
              columns={kanbanColumns}
              onAddCard={handleAddNew}
              renderCard={item => (
                <div
                  onClick={() => handleView(item)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-slate-900 leading-tight">
                      {item.title}
                    </h4>
                    <span className="text-xs font-medium text-slate-500 ml-2 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.no}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {item.type}
                    </span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            />
          ) : (
            <DataTable
              items={filteredAgreements}
              rowKey={item => item.id}
              emptyVariant={isFiltering ? 'search' : 'agreements'}
              emptyAction={
                !isFiltering && (
                  <button
                    onClick={handleAddNew}
                    className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
                  >
                    Add Agreement
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
                  label: 'Title',
                  render: item => item.title,
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Type',
                  render: item => item.type,
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Date',
                  render: item => item.date,
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Start Date',
                  render: item => item.startDate,
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'End Date',
                  render: item => item.endDate,
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
                    <TableActionButtons
                      onView={() => handleView(item)}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item)}
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
        title="Filter Agreements"
      />

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Agreement"
        message="Are you sure you want to delete this agreement? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
