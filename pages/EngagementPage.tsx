import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { Button, Input } from '../ui'
import { DataTable } from '../components/DataTable'
import { EngagementForm } from '../components/EngagementForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { TablePagination } from '../components/TablePagination'
import { engagements } from '../data'

export function EngagementPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Partnership Engagements"
        subtitle="Track engagement meetings and outcomes"
      />
      <PageToolbar
        searchPlaceholder="Search engagements..."
        addLabel="Add Record"
        onSearch={() => undefined}
        onFilter={() => undefined}
        onAdd={() => setShowForm((current) => !current)}
      />

      {showForm ? (
        <EngagementForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      ) : (
        <>
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

          <TablePagination totalEntries={engagements.length} />
        </>
      )}
    </div>
  )
}
