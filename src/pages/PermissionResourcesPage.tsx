import { useState } from 'react'
import { permissionResources } from '../data'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { TableActionButtons } from '../components/TableActionButtons'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { BaseDataForm } from '../components/BaseDataForm'
import { RightModal } from '../ui'

export function PermissionResourcesPage() {
  const [resources, setResources] = useState(
    permissionResources.map(r => ({
      id: r.id.toString(),
      title: r.name,
      description: 'Permission Resource',
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
      setResources(prev => prev.filter(item => item.id !== selectedItem.id))
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
        title={selectedItem ? 'Edit Permission Resource' : 'Add Permission Resource'}
        subtitle="Manage permission resource base data"
        size="md"
      >
        <div className="p-2">
          {/* Reusing BaseDataForm but without its own Card container by applying classes or just using the form. Since BaseDataForm has a Card, we'll just render it. RightModal provides the scrollable area. */}
          <BaseDataForm
            item={selectedItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            title="Resource Details"
          />
        </div>
      </RightModal>

      <PageHeaderCard
        title="Permission Resources"
        subtitle="List of permission resources. You can manage them in this table."
      />

      <PageToolbar
        searchPlaceholder="Search Resources..."
        addLabel="Add Resource"
        onAdd={handleAddNew}
        onSearch={() => {}}
        onFilter={() => {}}
        showSearchAndFilters={true}
      />

      <DataTable
        items={resources}
        rowKey={item => item.id}
        columns={[
          {
            label: 'Resource Name',
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
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
