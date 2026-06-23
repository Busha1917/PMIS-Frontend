import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { DataTable } from '../components/DataTable'
import { RoleForm } from '../components/RoleForm'
import { TableActionButtons } from '../components/TableActionButtons'
import { roles } from '../data'

export function RolesPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="max-w-2xl">
          <p className="header-font text-xl font-semibold tracking-[-0.01em] text-slate-950">Role Management</p>
          <p className="mt-2 text-sm text-slate-600">Register and manage roles and permissions.</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search roles..."
              className="w-full max-w-xl rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="!px-5">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              className="!bg-[#ff9500] !text-white !hover:bg-[#e68a00]"
              onClick={() => setShowForm((current) => !current)}
            >
              <Plus className="h-4 w-4" />
              Add Role
            </Button>
          </div>
        </div>
      </div>

      {showForm ? (
        <RoleForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      ) : (
        <DataTable
          items={roles}
          rowKey={(role) => role.id}
          columns={[
            { label: 'No.', render: (role) => <span className="font-semibold text-slate-900">{role.no}</span>, headClassName: 'bg-[#0b265a] text-white text-center', cellClassName: 'text-center' },
            { label: 'Name', render: (role) => role.name, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Description', render: (role) => role.description, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Permissions', render: (role) => role.permissions, headClassName: 'bg-[#0b265a] text-white text-center', cellClassName: 'text-center' },
            {
              label: 'Action',
              render: () => <TableActionButtons onView={() => undefined} onEdit={() => undefined} onDelete={() => undefined} />,
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
          ]}
        />
      )}
    </div>
  )
}
