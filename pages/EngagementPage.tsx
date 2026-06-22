import { useState } from 'react'
import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Input } from '../ui'
import { DataTable } from '../components/DataTable'
import { EngagementForm } from '../components/EngagementForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { engagements } from '../data'

export function EngagementPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Partnership Engagements"
        subtitle="Track engagement meetings and outcomes"
        searchPlaceholder="Search engagements..."
        addLabel="Add Record"
        onAdd={() => setShowForm((current) => !current)}
        onExport={() => undefined}
      />

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
