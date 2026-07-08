import { useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { EngagementForm } from './EngagementForm'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { TableActionButtons } from '../../components/TableActionButtons'

import { ConfirmationModal } from '../../components/ConfirmationModal'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import {
  useGetEngagementsQuery,
  useDeleteEngagementMutation,
  useCreateEngagementMutation,
  useUpdateEngagementMutation,
} from '../../store/apiSlice'
import type { EngagementRecord } from '../../types'

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
    label: 'Engagement Type',
    type: 'select' as const,
    options: [
      { label: 'Negotiation', value: 'Negotiation' },
      { label: 'Workshop', value: 'Workshop' },
      { label: 'Meeting', value: 'Meeting' },
      { label: 'Follow-Up', value: 'Follow-Up' },
      { label: 'Site Visit', value: 'Site Visit' },
    ],
  },
]

export function EngagementPage() {
  const { data: engagements = [], isLoading, isFetching } = useGetEngagementsQuery()
  const [deleteEngagement] = useDeleteEngagementMutation()
  const [createEngagement] = useCreateEngagementMutation()
  const [updateEngagement] = useUpdateEngagementMutation()

  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedEngagement, setSelectedEngagement] = useState<any | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  const filteredEngagements = useMemo(() => {
    return engagements.filter(item => {
      const typeStr = item.engagementType?.typeName || ''
      if (searchQuery && !typeStr.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.type && typeStr !== activeFilters.type) return false
      return true
    })
  }, [engagements, searchQuery, activeFilters])

  const isFiltering = searchQuery !== '' || Object.keys(activeFilters).length > 0

  const handleAddNew = () => {
    setSelectedEngagement(null)
    setFormMode('create')
    setShowForm(true)
  }

  const handleView = (item: EngagementRecord) => {
    setSelectedEngagement(item)
    setFormMode('preview')
    setShowForm(true)
  }

  const handleEdit = (item: EngagementRecord) => {
    setSelectedEngagement(item)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = (item: EngagementRecord) => {
    setSelectedEngagement(item)
    setShowDeleteModal(true)
  }

  const handleSubmit = async (formData: any) => {
    try {
      if (formMode === 'edit' && selectedEngagement) {
        await updateEngagement({ id: selectedEngagement.id, data: formData }).unwrap()
      } else {
        await createEngagement(formData).unwrap()
      }
      setShowForm(false)
      setSelectedEngagement(null)
      setFormMode('create')
    } catch (err) {
      console.error('Failed to save engagement:', err)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedEngagement(null)
    setFormMode('create')
  }

  const confirmDelete = async () => {
    if (!selectedEngagement) return
    try {
      await deleteEngagement(selectedEngagement.id).unwrap()
    } catch (err) {
      console.error('Failed to delete engagement:', err)
    }
    setShowDeleteModal(false)
    setSelectedEngagement(null)
    setFormMode('create')
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <PageHeaderCard
          title="Partnership Engagements"
          subtitle="Track engagement meetings and outcomes"
        />
      )}
      <PageToolbar
        searchPlaceholder="Search engagements..."
        addLabel="Add Engagement"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={showForm ? undefined : handleAddNew}
        showSearchAndFilters={!showForm}
      />

      {showForm ? (
        <EngagementForm
          engagement={selectedEngagement}
          mode={formMode === 'create' ? 'create' : 'edit'}
          onSaveDraft={data => {
            handleSubmit({ ...data, status: 'Draft' })
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <DataTable
            items={filteredEngagements}
            rowKey={item => item.id}
            emptyVariant={isFiltering ? 'search' : 'engagement'}
            emptyAction={
              !isFiltering && (
                <button
                  onClick={handleAddNew}
                  className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
                >
                  Add Engagement
                </button>
              )
            }
            columns={[
              {
                label: 'No.',
                render: (_item, index) => (
                  <span className="font-semibold text-slate-900">{(index ?? 0) + 1}</span>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center whitespace-nowrap',
              },
              {
                label: 'Engagement ID',
                render: item => <span className="text-slate-900 font-medium">{item.id}</span>,
                headClassName: 'bg-[#0b265a] text-white whitespace-nowrap',
              },
              {
                label: 'Organization',
                render: item => item.externalParticipants?.[0]?.organizationName || 'N/A',
                headClassName: 'bg-[#0b265a] text-white whitespace-nowrap',
              },
              {
                label: 'Type',
                render: item => item.engagementType?.typeName || 'N/A',
                headClassName: 'bg-[#0b265a] text-white whitespace-nowrap',
              },
              {
                label: 'Date',
                render: item => item.engagementDate,
                headClassName: 'bg-[#0b265a] text-white whitespace-nowrap',
              },
              {
                label: 'Status',
                render: item => <StatusBadge status={item.status} />,
                headClassName: 'bg-[#0b265a] text-white text-center whitespace-nowrap',
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
                headClassName: 'bg-[#0b265a] text-white text-center whitespace-nowrap',
                cellClassName: 'text-center',
              },
            ]}
          />
        </>
      )}

      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setActiveFilters}
        fields={FILTER_FIELDS}
        title="Filter Engagements"
      />

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Engagement"
        message="Are you sure you want to delete this engagement? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
