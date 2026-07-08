import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { OpportunityForm } from './OpportunityForm'
import { Send } from 'lucide-react'
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
  useScreenOpportunityMutation,
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
    ],
  },
]
export function OfficerOpportunitiesPage() {
  const { data: opportunities = [], isLoading } = useGetOpportunitiesQuery({})
  const [createOpportunity] = useCreateOpportunityMutation()
  const [updateOpportunity] = useUpdateOpportunityMutation()
  const [deleteOpportunity] = useDeleteOpportunityMutation()
  const [screenOpportunity] = useScreenOpportunityMutation()

  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selected, setSelected] = useState<OpportunityRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  const filtered = useMemo(() => {
    return opportunities.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.division && item.division !== activeFilters.division) return false
      return true
    })
  }, [opportunities, searchQuery, activeFilters])

  const handleAddNew = () => {
    setSelected(null)
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

  const handleSubmit = async (data: OpportunityRecord) => {
    try {
      const payload: any = {
        title: data.title,
        dateIdentified: data.dateIdentified
          ? new Date(data.dateIdentified).toISOString()
          : new Date().toISOString(),
        partnerName: data.partnerName,
        partnerAcronym: data.partnerAcronym,
        organizationType: data.organizationType,
        country: data.country,
        region: data.region,
        city: data.city,
        website: data.website,
        contactPersonName: data.contactPersonName,
        contactPosition: data.contactPosition,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        interestArea: data.interestArea,
        strategicImportanceLevelId:
          (data as any).strategicImportanceLevelId || data.strategicImportanceLevel?.id,
        opportunityCategoryId: (data as any).opportunityCategoryId || data.opportunityCategory?.id,
        opportunitySourceId: (data as any).opportunitySourceId || data.opportunitySource?.id,
        opportunityBackground: data.opportunityBackground,
        opportunityDescription: data.opportunityDescription,
        proposedCollaborationArea: data.proposedCollaborationArea,
        expectedOutcome: data.expectedOutcome,
        partnerId: data.partnerId,
        status: data.status,
      }

      if (
        ['New Partner', 'Existing Partner', 'Former Partner'].includes(
          data.existingRelationship || ''
        )
      ) {
        payload.existingRelationship = data.existingRelationship
      }

      if (data.strategicAlignment) {
        payload.strategicAlignment = Array.isArray(data.strategicAlignment)
          ? JSON.stringify(data.strategicAlignment)
          : data.strategicAlignment
      }

      if (data.expectedBenefits) {
        payload.expectedBenefits = Array.isArray(data.expectedBenefits)
          ? JSON.stringify(data.expectedBenefits)
          : data.expectedBenefits
      }

      // Remove undefined values
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

      if (formMode === 'edit' && selected) {
        await updateOpportunity({ id: selected.id, data: payload }).unwrap()
        toast.success('Opportunity updated', { description: data.title })
      } else {
        await createOpportunity(payload).unwrap()
        toast.success('Opportunity registered', { description: data.title })
      }
      handleCancel()
    } catch (err: any) {
      const messages = err?.data?.message
      const msgStr = Array.isArray(messages) ? messages.join(', ') : messages || err.message
      toast.error('Failed to save opportunity', { description: msgStr })
    }
  }
  const confirmSend = async () => {
    if (!selected) return
    try {
      await screenOpportunity(selected.id).unwrap()
      toast.success('Opportunity sent for screening', { description: selected.title })
      setShowSendModal(false)
      setSelected(null)
      setShowForm(false)
    } catch (err: any) {
      toast.error('Failed to send for screening', {
        description: err?.data?.message || err.message,
      })
    }
  }

  const confirmDelete = async () => {
    if (!selected) return
    try {
      await deleteOpportunity(selected.id).unwrap()
      toast.error('Opportunity deleted', { description: selected.title })
      setShowDeleteModal(false)
      setSelected(null)
    } catch (err: any) {
      toast.error('Failed to delete', { description: err?.data?.message || err.message })
    }
  }

  const handleExport = () => {
    exportToCsv(
      'opportunities',
      ['#', 'Title', 'Source', 'Date', 'Division', 'Status'],
      [
        filtered.map((item, i) => [
          i + 1,
          item.title,
          item.opportunitySource?.sourceName || '',
          item.dateIdentified || '',
          item.division || '',
          item.status || '',
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
          actions={
            selected?.status === 'Draft' && formMode === 'preview' ? (
              <button
                onClick={() => setShowSendModal(true)}
                className="flex items-center gap-2 rounded-lg bg-[#0b265a] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                <Send className="h-4 w-4" /> Send for Screening
              </button>
            ) : undefined
          }
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
      <ConfirmationModal
        open={showSendModal}
        title="Send for Screening"
        message="Are you sure you want to send this opportunity to the Knowledge & Ecosystem Director for screening?"
        confirmLabel="Send"
        onCancel={() => setShowSendModal(false)}
        onConfirm={confirmSend}
      />
    </div>
  )
}
