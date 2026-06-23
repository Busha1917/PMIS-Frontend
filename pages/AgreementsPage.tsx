import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { Input } from '../ui'
import { DataTable } from '../components/DataTable'
import { AgreementForm } from '../components/AgreementForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { agreements } from '../data'

export function AgreementsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Agreement Management"
        subtitle="Manage partnership agreements and legal documents"
        searchPlaceholder="Search agreements..."
        addLabel="Add Record"
        onAdd={() => setShowForm((current) => !current)}
        onExport={() => undefined}
      />

      {showForm ? (
        <AgreementForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      ) : (
        <DataTable
          items={agreements}
          rowKey={(item) => item.id}
          columns={[
            {
              label: 'No.',
              render: (item) => <span className="font-semibold text-slate-900">{item.no}</span>,
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
            { label: 'Title', render: (item) => item.title, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Type', render: (item) => item.type, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Date', render: (item) => item.date, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Start Date', render: (item) => item.startDate, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'End Date', render: (item) => item.endDate, headClassName: 'bg-[#0b265a] text-white' },
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
