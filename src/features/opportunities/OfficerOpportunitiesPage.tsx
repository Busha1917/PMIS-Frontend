import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { OpportunityForm } from './OpportunityForm'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { TableActionButtons } from '../../components/TableActionButtons'
import { ConfirmationModal } from '../../components/ConfirmationModal'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { OpportunityRecord } from '../../types'
import { opportunityStore } from './opportunityStore'
import { exportToCsv } from '../../utils/exportCsv'

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
    ],
  },
]
export function OfficerOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(() =>
    opportunityStore.getAll()
  )
  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selected, setSelected] = useState<OpportunityRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  useEffect(() => opportunityStore.subscribe(setOpportunities), [])

  const filtered = useMemo(() => {
    return opportunities.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.division && item.division !== activeFilters.division) return false
      return true
    })
  }, [opportunities, searchQuery, activeFilters])

  const handleAddNew = () => {
    const newOpp = opportunityStore.create()
    setSelected(newOpp)
    setFormMode('create')
    setShowForm(true)
  }
  const handleView = (item: OpportunityRecord) => {
    setSelected(item)
    setFormMode('preview')
    setShowForm(true)
  }
  const handleEdit = (item: OpportunityRecord) => {
    setSelected(item)
    setFormMode('edit')
    setShowForm(true)
  }
  const handleDelete = (item: OpportunityRecord) => {
    setSelected(item)
    setShowDeleteModal(true)
  }
  const handleCancel = () => {
    setShowForm(false)
    setSelected(null)
    setFormMode('create')
  }

  const handleSubmit = (data: OpportunityRecord) => {
    const updated = {
      ...data,
      registeredAt: data.registeredAt || new Date().toISOString(),
    }
    opportunityStore.update(updated)
    if (formMode === 'edit') {
      toast.success('Opportunity updated', { description: data.title })
    } else {
      toast.success('Opportunity registered', { description: data.title })
    }
    handleCancel()
  }

  const confirmDelete = () => {
    if (!selected) return
    opportunityStore.delete(selected.id)
    toast.error('Opportunity deleted', { description: selected.title })
    setShowDeleteModal(false)
    setSelected(null)
  }

  const handleExport = () => {
    exportToCsv(
      'opportunities',
      ['#', 'Title', 'Source', 'Date', 'Division', 'Status'],
      [
        filtered.map((item, i) => [
          i + 1,
          item.title,
          item.source,
          item.date,
          item.division,
          item.status,
        ]),
      ]
    )
    toast.success('Exported to CSV', { description: `${filtered.length} records` })
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <PageHeaderCard
          title="Partnership Opportunities"
          subtitle="Register and manage partnership opportunities"
        />
      )}
      <PageToolbar
        searchPlaceholder="Search opportunities..."
        addLabel="Add Opportunity"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={showForm ? undefined : handleAddNew}
        onExport={showForm ? undefined : handleExport}
        showSearchAndFilters={!showForm}
      />

      {showForm ? (
        <OpportunityForm
          opportunity={selected}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onEdit={() => setFormMode('edit')}
        />
      ) : (
        <DataTable
          items={filtered}
          rowKey={item => item.id}
          emptyVariant="opportunities"
          emptyAction={
            <button
              onClick={handleAddNew}
              className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
            >
              Add Opportunity
            </button>
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
              render: item => item.source,
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Division',
              render: item => item.division,
              headClassName: 'bg-[#0b265a] text-white',
            },
            { label: 'Date', render: item => item.date, headClassName: 'bg-[#0b265a] text-white' },
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
