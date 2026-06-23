import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { Button, Input } from '../ui'
import { DataTable } from '../components/DataTable'
import { OpportunityForm } from '../components/OpportunityForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
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
              render: (item) => <StatusBadge status={item.status} />,
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
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
