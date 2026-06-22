import { useState } from 'react'
import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Input } from '../ui'
import { DataTable } from '../components/DataTable'
import { OpportunityForm } from '../components/OpportunityForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { opportunities } from '../data'

export function OpportunitiesPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Partnership Opportunities"
        subtitle="Register Partnership Opportunities and track outcomes"
        searchPlaceholder="Search opportunities..."
        addLabel="Add Record"
        onAdd={() => setShowForm((current) => !current)}
        onExport={() => undefined}
      />

      {showForm ? (
        <OpportunityForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      ) : (
        <DataTable
          items={opportunities}
          rowKey={(item) => item.id}
          columns={[
            {
              label: 'No.',
              render: (item) => <span className="font-semibold text-slate-900">{item.no}</span>,
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
            { label: 'Title', render: (item) => item.title, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Source', render: (item) => item.source, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Date', render: (item) => item.date, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Division', render: (item) => item.division, headClassName: 'bg-[#0b265a] text-white' },
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
