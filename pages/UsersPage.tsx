import { useState } from 'react'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { TablePagination } from '../components/TablePagination'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { UserForm } from '../components/UserForm'
import type { UserRecord } from '../types'
import { users as initialUsers } from '../data'

export function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleAddNew = () => {
    setSelectedUser(null)
    setFormMode('create')
    setShowForm(true)
  }

  const handleView = (user: UserRecord) => {
    setSelectedUser(user)
    setFormMode('preview')
    setShowForm(true)
  }

  const handleEdit = (user: UserRecord) => {
    setSelectedUser(user)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = (user: UserRecord) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleSubmit = () => {
    setShowForm(false)
    setSelectedUser(null)
    setFormMode('create')
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedUser(null)
    setFormMode('create')
  }

  const confirmDelete = () => {
    if (!selectedUser) return
    setUsers((current) => current.filter((item) => item.id !== selectedUser.id))
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="User Management"
        subtitle="Register and manage users information."
      />
      <PageToolbar
        searchPlaceholder="Search users..."
        onSearch={() => undefined}
        onFilter={() => undefined}
      />

      {showForm ? (
        <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <>
          <DataTable
            items={users}
            rowKey={(user) => user.id}
            columns={[
              {
                label: 'No.',
                render: (user: UserRecord) => <span className="font-semibold text-slate-900">{user.no}</span>,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              { label: 'Full Name', render: (user: UserRecord) => user.name, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Email', render: (user: UserRecord) => user.email, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Phone Number', render: (user: UserRecord) => user.phone, headClassName: 'bg-[#0b265a] text-white' },
              { label: 'Position', render: (user: UserRecord) => user.position, headClassName: 'bg-[#0b265a] text-white' },
              {
                label: 'Status',
                render: (user: UserRecord) => <StatusBadge status={user.status} />,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Action',
                render: (user: UserRecord) => (
                  <TableActionButtons
                    onView={() => handleView(user)}
                    onEdit={() => handleEdit(user)}
                    onDelete={() => handleDelete(user)}
                  />
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
            ]}
          />

          <TablePagination totalEntries={users.length} />
        </>
      )}

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete user"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
