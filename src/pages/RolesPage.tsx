import { useState } from 'react'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { TableActionButtons } from '../components/TableActionButtons'

import { ConfirmationModal } from '../components/ConfirmationModal'
import { RoleForm } from '../components/RoleForm'
import type { RoleRecord } from '../types'
import { roles as initialRoles } from '../data'

export function RolesPage() {
  const [roles, setRoles] = useState<RoleRecord[]>(initialRoles)
  const [showForm, setShowForm] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleAddNew = () => {
    setSelectedRole(null)
    setFormMode('create')
    setShowForm(true)
  }

  const handleView = (role: RoleRecord) => {
    setSelectedRole(role)
    setFormMode('preview')
    setShowForm(true)
  }

  const handleEdit = (role: RoleRecord) => {
    setSelectedRole(role)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = (role: RoleRecord) => {
    setSelectedRole(role)
    setShowDeleteModal(true)
  }

  const handleSubmit = () => {
    setShowForm(false)
    setSelectedRole(null)
    setFormMode('create')
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedRole(null)
    setFormMode('create')
  }

  const confirmDelete = () => {
    if (!selectedRole) return
    setRoles(current => current.filter(item => item.id !== selectedRole.id))
    setShowDeleteModal(false)
    setSelectedRole(null)
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <PageHeaderCard
          title="Role Management"
          subtitle="Register and manage roles and permissions."
        />
      )}
      <PageToolbar
        searchPlaceholder="Search roles..."
        onSearch={() => undefined}
        onFilter={() => undefined}
        showSearchAndFilters={!showForm}
      />

      {showForm ? (
        <RoleForm onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <>
          <DataTable
            items={roles}
            rowKey={role => role.id}
            columns={[
              {
                label: 'No.',
                render: (role: RoleRecord) => (
                  <span className="font-semibold text-slate-900">{role.no}</span>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Role Name',
                render: (role: RoleRecord) => role.name,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Description',
                render: (role: RoleRecord) => role.description,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Permissions',
                render: (role: RoleRecord) => {
                  const count =
                    role.rolePermissionResources?.reduce(
                      (acc, res) => acc + res.rolePermissionResourceActions.length,
                      0
                    ) || 0
                  return <span className="font-medium text-slate-700">{count} Actions Granted</span>
                },
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Action',
                render: (role: RoleRecord) => (
                  <TableActionButtons
                    onView={() => handleView(role)}
                    onEdit={() => handleEdit(role)}
                    onDelete={() => handleDelete(role)}
                  />
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
            ]}
          />
        </>
      )}

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
