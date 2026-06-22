import { useState } from 'react'
import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { DataTable } from '../components/DataTable'
import { EngagementForm } from '../components/EngagementForm'
import { engagements } from '../data'

export function EngagementPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="max-w-2xl">
              <p className="header-font text-xl font-semibold tracking-[-0.01em] text-slate-950">
                Partnership Engagements
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Track engagement meetings and outcomes
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                <Input
                  placeholder="Search engagements..."
                  className="w-full max-w-xl rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10"
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
                  Add Engagements
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm ? (
        <EngagementForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      ) : (
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
              render: (item) => (
                <Badge tone={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'warning' : 'muted'}>
                  {item.status}
                </Badge>
              ),
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
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
