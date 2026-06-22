import { useState } from 'react'
import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { DataTable } from '../components/DataTable'
import { UserForm } from '../components/UserForm'
import { users } from '../data'

export function UsersPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="max-w-2xl">
          <p className="header-font text-xl font-semibold tracking-[-0.01em] text-slate-950">User Management</p>
          <p className="mt-2 text-sm text-slate-600">Register and manage users information.</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search users..."
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
              Add User
            </Button>
          </div>
        </div>
      </div>

      {showForm ? (
        <UserForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      ) : (
        <DataTable
          items={users}
          rowKey={(user) => user.id}
          columns={[
            { label: 'No.', render: (user) => <span className="font-semibold text-slate-900">{user.no}</span>, headClassName: 'bg-[#0b265a] text-white text-center', cellClassName: 'text-center' },
            { label: 'Full Name', render: (user) => user.name, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Email', render: (user) => user.email, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Phone Number', render: (user) => user.phone, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Position', render: (user) => user.position, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Status', render: (user) => <Badge tone={user.status === 'Active' ? 'success' : user.status === 'Inactive' ? 'muted' : 'warning'}>{user.status}</Badge>, headClassName: 'bg-[#0b265a] text-white text-center', cellClassName: 'text-center' },
            {
              label: 'Action',
              render: () => (
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" iconOnly className="rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 p-2">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" iconOnly className="rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 p-2">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="danger" iconOnly className="rounded-xl p-2 text-white">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
          ]}
        />
      )}
    </div>
  )
}
