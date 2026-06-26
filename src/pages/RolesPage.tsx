import { useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { TableActionButtons } from '../components/TableActionButtons'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { RoleForm } from '../components/RoleForm'
import type { RoleRecord } from '../types'
import type { RoleFormValues } from '../utils/validation'
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

  const handleSubmit = (data: RoleFormValues) => {
    if (formMode === 'edit' && selectedRole) {
      // Update existing role
      setRoles(current =>
        current.map(r =>
          r.id === selectedRole.id
            ? {
                ...r,
                name: data.name,
                description: data.description,
                rolePermissionResources: data.rolePermissionResources,
              }
            : r
        )
      )
      toast.success(`Role "${data.name}" updated successfully!`)
    } else {
      // Create new role
      const newRole: RoleRecord = {
        id: `role-${Date.now()}`,
        no: roles.length + 1,
        name: data.name,
        description: data.description,
        rolePermissionResources: data.rolePermissionResources,
      }
      setRoles(current => [...current, newRole])
      toast.success(`Role "${data.name}" created successfully!`)
    }

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
    const name = selectedRole.name
    setRoles(current => current.filter(item => item.id !== selectedRole.id))
    setShowDeleteModal(false)
    setSelectedRole(null)
    toast.error(`Role "${name}" deleted.`)
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
        addLabel={showForm ? undefined : 'Add Role'}
        onAdd={showForm ? undefined : handleAddNew}
      />

      {showForm ? (
        <RoleForm
          role={selectedRole}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
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
                render: (role: RoleRecord) => (
                  <span className="font-semibold text-slate-900">{role.name}</span>
                ),
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
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        count > 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count} Actions Granted
                    </span>
                  )
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
        message={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
