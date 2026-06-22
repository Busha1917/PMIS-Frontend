import { useState } from 'react'
import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { EventForm } from '../components/EventForm'
import { DataTable } from '../components/DataTable'
import type { EventRecord } from '../types'
import { events } from '../data'

function getStatusTone(status: string) {
  switch (status) {
    case 'Approved':
    case 'Accepted':
      return 'success'
    case 'Rejected':
      return 'danger'
    default:
      return 'muted'
  }
}

export function EventsVisitsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="max-w-2xl">
              <p className="header-font text-xl font-semibold tracking-[-0.01em] text-slate-950">
                Events & Visits
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Partnership Management Information System — Overview
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                <Input
                  placeholder="Search events..."
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
                  Add Events & Visit
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm ? (
        <EventForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      ) : (
        <>
          <DataTable
            items={events}
            rowKey={(event) => event.id}
            columns={[
              {
                label: 'No.',
                render: (event: EventRecord) => <span className="font-semibold text-slate-900">{event.no}</span>,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Event Name',
                render: (event: EventRecord) => event.title,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Event Type',
                render: (event: EventRecord) => event.type,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Date & Time',
                render: (event: EventRecord) => event.date,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Venue',
                render: (event: EventRecord) => event.venue,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Status',
                render: (event: EventRecord) => (
                  <Badge tone={getStatusTone(event.status)} className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]">
                    {event.status}
                  </Badge>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Action',
                render: (event: EventRecord) => (
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

          <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-sm text-slate-500">Rows per page</span>
                <select className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/10">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>
              <p className="text-sm text-slate-600">Showing 1 to 10 of 20 entries</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Button variant="outline" className="!px-4">&lt; Back</Button>
              {[1, 2, 3, 4, 5].map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={
                    pageNumber === 1
                      ? 'min-w-[2.2rem] rounded-full bg-[#001f3f] px-3 py-2 text-sm font-semibold text-white shadow-sm'
                      : 'min-w-[2.2rem] rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200'
                  }
                >
                  {pageNumber}
                </button>
              ))}
              <Button variant="outline" className="!px-4">Next &gt;</Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
