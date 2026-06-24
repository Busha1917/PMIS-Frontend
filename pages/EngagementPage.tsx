import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable } from '../components/DataTable'
import { EngagementForm } from '../components/EngagementForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { TablePagination } from '../components/TablePagination'
import { ConfirmationModal } from '../components/ConfirmationModal'
import type { EngagementRecord } from '../types'
import { engagements as initialEngagements } from '../data'

export function EngagementPage() {
  const [engagements, setEngagements] = useState<EngagementRecord[]>(initialEngagements)
  const [showForm, setShowForm] = useState(false)
  const [selectedEngagement, setSelectedEngagement] = useState<EngagementRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  const handleSubmit = (formData: EngagementRecord) => {
    if (formMode === 'edit' && selectedEngagement) {
      setEngagements((current) => current.map((item) => (item.id === selectedEngagement.id ? formData : item)))
    } else {
      setEngagements((current) => [
        ...current,
        {
          ...formData,
          id: `eng-${Date.now()}`,
          no: current.length + 1,
        },
      ])
    }
    setShowForm(false)
    setSelectedEngagement(null)
    setFormMode('create')
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedEngagement(null)
    setFormMode('create')
  }

  const confirmDelete = () => {
    if (!selectedEngagement) return
    setEngagements((current) => current.filter((item) => item.id !== selectedEngagement.id))
    setShowDeleteModal(false)
    setSelectedEngagement(null)
    setFormMode('create')
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Partnership Engagements"
        subtitle="Track engagement meetings and outcomes"
      />
      <PageToolbar
        searchPlaceholder="Search engagements..."
        addLabel="Add Record"
        onSearch={() => undefined}
        onFilter={() => undefined}
        onAdd={handleAddNew}
      />

      {showForm ? (
        <EngagementForm
          engagement={selectedEngagement}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <DataTable
            items={engagements}
            rowKey={(item) => item.id}
            columns={[
              {
                label: 'No.',
                render: (item) => <span className="font-semibold text-slate-900">{item.no}</span>,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              { label: 'Engagement Type', render: (item) => item.type, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Date', render: (item) => item.date, headClassName: 'bg-[#0b265a] text-white' },
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

          <TablePagination totalEntries={engagements.length} />
        </>
      )}

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
