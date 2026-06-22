import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'
import { events } from '../data'

export function EventsVisitsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Register events, visits, and track outcomes</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input placeholder="Search events..." className="w-full sm:w-72" />
          <Button variant="outline" className="!px-4"> <Filter className="h-4 w-4" /> Filter</Button>
          <Button className="bg-orange-500 hover:bg-orange-600"> <Plus className="h-4 w-4" /> Add Events & Visit</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events & Visits</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>No.</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.no}</TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>
                    <Badge tone={event.status === 'Approved' ? 'success' : event.status === 'Rejected' ? 'warning' : 'muted'}>{event.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="ghost" className="p-2"> <Eye className="h-4 w-4" /> </Button>
                    <Button variant="outline" className="p-2"> <Pencil className="h-4 w-4" /> </Button>
                    <Button variant="danger" className="p-2"> <Trash2 className="h-4 w-4" /> </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
