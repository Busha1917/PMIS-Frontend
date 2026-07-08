import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { KanbanBoard } from '../../components/KanbanBoard'
import { OpportunityForm } from './OpportunityForm'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { TableActionButtons } from '../../components/TableActionButtons'
import { ConfirmationModal } from '../../components/ConfirmationModal'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { OpportunityRecord } from '../../types'
import { exportToCsv } from '../../utils/exportCsv'
import {
  useGetOpportunitiesQuery,
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
} from '../../store/apiSlice'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Under Review', value: 'Under Review' },
      { label: 'Verified', value: 'Verified' },
      { label: 'Reviewed', value: 'Reviewed' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Converted', value: 'Converted' },
    ],
  },
  {
    key: 'division',
    label: 'Division',
    type: 'select' as const,
    options: [
      { label: 'Finance', value: 'Finance' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Product', value: 'Product' },
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Business', value: 'Business' },
      { label: 'Design', value: 'Design' },
      { label: 'Market Management', value: 'Market Management' },
      { label: 'Core Platform', value: 'Core Platform' },
      { label: 'Production System', value: 'Production System' },
    ],
  },
]

export function OpportunitiesPage() {
  const { data: opportunities = [], isLoading, isFetching } = useGetOpportunitiesQuery({})
  const [createOpportunity] = useCreateOpportunityMutation()
  const [updateOpportunity] = useUpdateOpportunityMutation()
  const [deleteOpportunity] = useDeleteOpportunityMutation()
  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.division && item.division !== activeFilters.division) return false
      return true
    })
  }, [opportunities, searchQuery, activeFilters])

  const kanbanColumns = useMemo(
    () => [
      {
        id: 'Draft',
        title: 'Draft',
        color: 'bg-slate-400',
        items: filteredOpportunities.filter(op => op.status === 'Draft'),
      },
      {
        id: 'Under Review',
        title: 'Under Review',
        color: 'bg-amber-500',
        items: filteredOpportunities.filter(op => op.status === 'Under Review'),
      },
      {
        id: 'Approved',
        title: 'Approved',
        color: 'bg-emerald-500',
        items: filteredOpportunities.filter(op => op.status === 'Approved'),
      },
      {
        id: 'Rejected',
        title: 'Rejected',
        color: 'bg-red-500',
        items: filteredOpportunities.filter(op => op.status === 'Rejected'),
      },
    ],
    [filteredOpportunities]
  )

  const isFiltering = searchQuery !== '' || Object.keys(activeFilters).length > 0

  const handleAddNew = () => {
    setSelectedOpportunity(null)
    setFormMode('create')
    setShowForm(true)
  }

  const handleView = (item: OpportunityRecord) => {
    setSelectedOpportunity(item)
    setFormMode('preview')
    setShowForm(true)
  }

  const handleEdit = (item: OpportunityRecord) => {
    setSelectedOpportunity(item)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = (item: OpportunityRecord) => {
    setSelectedOpportunity(item)
    setShowDeleteModal(true)
  }

  const handleSubmit = async (formData: OpportunityRecord) => {
    try {
      if ((formMode === 'edit' || formMode === 'preview') && selectedOpportunity) {
        await updateOpportunity({ id: selectedOpportunity.id, data: formData }).unwrap()
        toast.success('Opportunity updated', { description: formData.title })
      } else {
        await createOpportunity(formData).unwrap()
        toast.success('Opportunity added', { description: formData.title })
      }
      setShowForm(false)
      setSelectedOpportunity(null)
      setFormMode('create')
    } catch (err: any) {
      toast.error('Failed to save opportunity', { description: err?.data?.message || err.message })
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedOpportunity(null)
    setFormMode('create')
  }

  const confirmDelete = async () => {
    if (!selectedOpportunity) return
    try {
      await deleteOpportunity(selectedOpportunity.id).unwrap()
      toast.error('Opportunity deleted', { description: selectedOpportunity.title })
      setShowDeleteModal(false)
      setSelectedOpportunity(null)
    } catch (err: any) {
      toast.error('Failed to delete', { description: err?.data?.message || err.message })
    }
  }

  const handleExport = () => {
    exportToCsv(
      'opportunities',
      ['#', 'Title', 'Source', 'Date', 'Division', 'Status'],
      [
        filteredOpportunities.map((item, i) => [
          i + 1,
          item.title || '',
          item.opportunitySource?.sourceName || '',
          item.dateIdentified || '',
          item.division || '',
          item.status || '',
        ]),
      ]
    )
    toast.success('Exported to CSV', { description: `${filteredOpportunities.length} records` })
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <PageHeaderCard
          title="Partnership Opportunities"
          subtitle="Register Partnership Opportunities and track outcomes"
        />
      )}
      <PageToolbar
        searchPlaceholder="Search opportunities..."
        addLabel="Add Opportunities"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={showForm ? undefined : handleAddNew}
        onExport={showForm ? undefined : handleExport}
        showSearchAndFilters={!showForm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {showForm ? (
        <OpportunityForm
          opportunity={selectedOpportunity}
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
                  <p className="text-xs text-slate-600 font-medium line-clamp-1">
                    {item.opportunitySource?.sourceName || 'Unknown Source'}
                  </p>
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {item.division}
                    </span>
                    <span>
                      {item.dateIdentified
                        ? new Date(item.dateIdentified).toLocaleDateString()
                        : 'No date'}
                    </span>
                  </div>
                </div>
              )}
            />
          ) : (
            <DataTable
              items={filteredOpportunities}
              rowKey={item => item.id}
              emptyVariant={isFiltering ? 'search' : 'opportunities'}
              emptyAction={
                !isFiltering && (
                  <button
                    onClick={handleAddNew}
                    className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
                  >
                    Add Opportunity
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
                  label: 'Source',
                  render: item => item.opportunitySource?.sourceName || item.source || '-',
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Division',
                  render: item => item.division || '-',
                  headClassName: 'bg-[#0b265a] text-white',
                },
                {
                  label: 'Date',
                  render: item => item.dateIdentified || item.date || '-',
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
        title="Filter Opportunities"
      />

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Opportunity"
        message="Are you sure you want to delete this opportunity? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
