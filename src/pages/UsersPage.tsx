import { useMemo, useState } from 'react'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'

import { ConfirmationModal } from '../components/ConfirmationModal'
import { FilterDrawer } from '../components/FilterDrawer'
import type { FilterValues } from '../components/FilterDrawer'
import { UserForm } from '../components/UserForm'
import type { UserRecord } from '../types'
import { users as initialUsers } from '../data'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Inactive', value: 'Inactive' },
    ],
  },
  {
    key: 'position',
    label: 'Position',
    type: 'text' as const,
    placeholder: 'e.g. Designer, Engineer...',
  },
]

export function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (
        searchQuery &&
        !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && user.status !== activeFilters.status) return false
      if (
        activeFilters.position &&
        !user.position.toLowerCase().includes(activeFilters.position.toLowerCase())
      )
        return false
      return true
    })
  }, [users, searchQuery, activeFilters])

  const isFiltering = searchQuery !== '' || Object.keys(activeFilters).length > 0

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
    setUsers(current => current.filter(item => item.id !== selectedUser.id))
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <PageHeaderCard title="User Management" subtitle="Register and manage users information." />
      )}
      <PageToolbar
        searchPlaceholder="Search users..."
        addLabel="Add User"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={showForm ? undefined : handleAddNew}
        showSearchAndFilters={!showForm}
      />

      {showForm ? (
        <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <>
          <DataTable
            items={filteredUsers}
            rowKey={user => user.id}
            emptyVariant={isFiltering ? 'search' : 'users'}
            emptyAction={
              !isFiltering && (
                <button
                  onClick={handleAddNew}
                  className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
                >
                  Add User
                </button>
              )
            }
            columns={[
              {
                label: 'No.',
                render: (user: UserRecord) => (
                  <span className="font-semibold text-slate-900">{user.no}</span>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Full Name',
                render: (user: UserRecord) => user.name,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Email',
                render: (user: UserRecord) => user.email,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Phone Number',
                render: (user: UserRecord) => user.phone,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Position',
                render: (user: UserRecord) => user.position,
                headClassName: 'bg-[#0b265a] text-white',
              },
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
        </>
      )}

      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setActiveFilters}
        fields={FILTER_FIELDS}
        title="Filter Users"
      />

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
