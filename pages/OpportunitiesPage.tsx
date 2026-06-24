import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable } from '../components/DataTable'
import { OpportunityForm } from '../components/OpportunityForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { TablePagination } from '../components/TablePagination'
import { ConfirmationModal } from '../components/ConfirmationModal'
import type { OpportunityRecord } from '../types'
import { opportunities as initialOpportunities } from '../data'

export function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(initialOpportunities)
  const [showForm, setShowForm] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  const handleSubmit = (formData: OpportunityRecord) => {
    if (formMode === 'edit' && selectedOpportunity) {
      setOpportunities((current) => current.map((item) => (item.id === selectedOpportunity.id ? formData : item)))
    } else {
      setOpportunities((current) => [
        ...current,
        {
          ...formData,
          id: `opp-${Date.now()}`,
          no: current.length + 1,
        },
      ])
    }
    setShowForm(false)
    setSelectedOpportunity(null)
    setFormMode('create')
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedOpportunity(null)
    setFormMode('create')
  }

  const confirmDelete = () => {
    if (!selectedOpportunity) return
    setOpportunities((current) => current.filter((item) => item.id !== selectedOpportunity.id))
    setShowDeleteModal(false)
    setSelectedOpportunity(null)
    setFormMode('create')
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Partnership Opportunities"
        subtitle="Register Partnership Opportunities and track outcomes"
      />
      <PageToolbar
        searchPlaceholder="Search opportunities..."
        addLabel="Add Opportunities"
        onSearch={() => undefined}
        onFilter={() => undefined}
        onAdd={showForm ? undefined : handleAddNew}
      />

      {showForm ? (
        <OpportunityForm
          opportunity={selectedOpportunity}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <DataTable
            items={opportunities}
            rowKey={(item) => item.id}
            columns={[
              {
                label: 'No.',
                render: (item) => <span className="font-semibold text-slate-900">{item.no}</span>,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              { label: 'Title', render: (item) => item.title, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Source', render: (item) => item.source, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Date', render: (item) => item.date, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Division', render: (item) => item.division, headClassName: 'bg-[#0b265a] text-white' },
              {
                label: 'Status',
                render: (item) => <StatusBadge status={item.status} />,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Action',
                render: (item) => (
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

          <TablePagination totalEntries={opportunities.length} />
        </>
      )}

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
