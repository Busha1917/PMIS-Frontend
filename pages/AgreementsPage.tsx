import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable } from '../components/DataTable'
import { AgreementForm } from '../components/AgreementForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { TablePagination } from '../components/TablePagination'
import { ConfirmationModal } from '../components/ConfirmationModal'
import type { AgreementRecord } from '../types'
import { agreements as initialAgreements } from '../data'

export function AgreementsPage() {
  const [agreements, setAgreements] = useState<AgreementRecord[]>(initialAgreements)
  const [showForm, setShowForm] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<AgreementRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
      setAgreements((current) => current.map((item) => (item.id === selectedAgreement.id ? formData : item)))
    } else {
      setAgreements((current) => [
        ...current,
        {
          ...formData,
          id: `agr-${Date.now()}`,
          no: current.length + 1,
        },
      ])
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
    setAgreements((current) => current.filter((item) => item.id !== selectedAgreement.id))
    setShowDeleteModal(false)
    setSelectedAgreement(null)
    setFormMode('create')
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Agreement Management"
        subtitle="Manage partnership agreements and legal documents"
      />
      <PageToolbar
        searchPlaceholder="Search agreements..."
        addLabel="Add Agreements"
        onSearch={() => undefined}
        onFilter={() => undefined}
        onAdd={showForm ? undefined : handleAddNew}
      />

      {showForm ? (
        <AgreementForm
          agreement={selectedAgreement}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <DataTable
            items={agreements}
            rowKey={(item) => item.id}
            columns={[
              {
                label: 'No.',
                render: (item) => <span className="font-semibold text-slate-900">{item.no}</span>,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              { label: 'Title', render: (item) => item.title, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Type', render: (item) => item.type, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Date', render: (item) => item.date, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Start Date', render: (item) => item.startDate, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'End Date', render: (item) => item.endDate, headClassName: 'bg-[#0b265a] text-white' },
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

          <TablePagination totalEntries={agreements.length} />
        </>
      )}

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
