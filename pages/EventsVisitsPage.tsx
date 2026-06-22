import { useState } from 'react'
import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'
import { EventForm } from '../components/EventForm'
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
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-xl font-semibold uppercase tracking-[0.18em] text-slate-950">
                Events & Visits
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Partnership Management Information System — Overview
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
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

          <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <Input
              placeholder="Search events..."
              className="w-full max-w-2xl rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10"
            />
            <div className="flex items-center justify-between gap-3 xl:w-auto xl:justify-end">
              <span className="text-sm text-slate-500">Rows per page</span>
              <select className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/10">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm ? (
        <EventForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      ) : (
        <>
          <Card className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
        <CardHeader className="bg-[#0b265a] px-6 py-4">
          <CardTitle className="text-sm uppercase tracking-[0.2em] text-white">
            Events & Visits
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead className="bg-[#0b265a] text-white">No.</TableHead>
                  <TableHead className="bg-[#0b265a] text-white">Event Name</TableHead>
                  <TableHead className="bg-[#0b265a] text-white">Event Type</TableHead>
                  <TableHead className="bg-[#0b265a] text-white">Date & Time</TableHead>
                  <TableHead className="bg-[#0b265a] text-white">Venue</TableHead>
                  <TableHead className="bg-[#0b265a] text-white">Status</TableHead>
                  <TableHead className="bg-[#0b265a] text-white">Action</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} className="bg-white hover:bg-slate-50">
                    <TableCell className="font-semibold text-slate-900">{event.no}</TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.venue}</TableCell>
                    <TableCell>
                      <Badge tone={getStatusTone(event.status)} className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]">
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="ghost" iconOnly className="rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 p-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" iconOnly className="rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 p-2">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" iconOnly className="rounded-xl p-2 text-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">Showing 1 to 10 of 20 entries</p>
        <div className="flex items-center gap-2 text-sm">
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
