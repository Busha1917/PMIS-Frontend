import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { Badge, Button, Input } from '../ui'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PartnerForm } from '../components/PartnerForm'
import { TableActionButtons } from '../components/TableActionButtons'
import { partners } from '../data'

export function PartnersPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Partner Registration"
        subtitle="Manage partnership organizations"
        searchPlaceholder="Search partners..."
        addLabel="Add Record"
        onAdd={() => setShowForm((current) => !current)}
        onExport={() => undefined}
      />

      {showForm ? (
        <PartnerForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      ) : (
        <DataTable
          items={partners}
          rowKey={(item) => item.id}
          columns={[
            {
              label: 'No.',
              render: (item) => <span className="font-semibold text-slate-900">{item.no}</span>,
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
            { label: 'Partner Name', render: (item) => item.name, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Type', render: (item) => item.type, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Country', render: (item) => item.country, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Organization', render: (item) => item.organization, headClassName: 'bg-[#0b265a] text-white' },
            { label: 'Primary Contact', render: (item) => item.contact, headClassName: 'bg-[#0b265a] text-white' },
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
