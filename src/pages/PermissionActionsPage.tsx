import { useState } from 'react'
import { permissionActions } from '../data'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { TableActionButtons } from '../components/TableActionButtons'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { BaseDataForm } from '../components/BaseDataForm'
import { RightModal } from '../ui'

export function PermissionActionsPage() {
  const [actions, setActions] = useState(
    permissionActions.map(a => ({
      id: a.id.toString(),
      title: a.action,
      description: 'Permission Action',
    }))
  )
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleAddNew = () => {
    setSelectedItem(null)
    setShowForm(true)
  }

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setShowForm(true)
  }

  const handleDelete = (item: any) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedItem) {
      setActions(prev => prev.filter(item => item.id !== selectedItem.id))
    }
    setShowDeleteModal(false)
    setSelectedItem(null)
  }

  const handleSubmit = (data: any) => {
    setShowForm(false)
    setSelectedItem(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedItem(null)
  }

  return (
    <div className="space-y-6">
      <RightModal
        open={showForm}
        onClose={handleCancel}
        title={selectedItem ? 'Edit Permission Action' : 'Add Permission Action'}
        subtitle="Manage permission action base data"
        size="md"
      >
        <div className="p-2">
          <BaseDataForm
            item={selectedItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            title="Action Details"
          />
        </div>
      </RightModal>

      <PageHeaderCard
        title="Permission Actions"
        subtitle="List of permission actions. You can manage them in this table."
      />

      <PageToolbar
        searchPlaceholder="Search Actions..."
        addLabel="Add Action"
        onAdd={handleAddNew}
        onSearch={() => {}}
        onFilter={() => {}}
        showSearchAndFilters={true}
      />

      <DataTable
        items={actions}
        rowKey={item => item.id}
        columns={[
          {
            label: 'Action Name',
            render: (item: any) => <span className="font-medium text-slate-900">{item.title}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Description',
            render: (item: any) => item.description,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Action',
            render: (item: any) => (
              <TableActionButtons
                onView={() => handleEdit(item)}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            ),
            headClassName: 'bg-[#0b265a] text-white text-center',
            cellClassName: 'text-center',
          },
        ]}
      />

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Action"
        message="Are you sure you want to delete this action? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
