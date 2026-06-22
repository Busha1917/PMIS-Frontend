import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'
import { engagements } from '../data'

export function EngagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Track engagement meetings and outcomes</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input placeholder="Search engagements..." className="w-full sm:w-72" />
          <Button variant="outline" className="!px-4"> <Filter className="h-4 w-4" /> Filter</Button>
          <Button className="bg-orange-500 hover:bg-orange-600"> <Plus className="h-4 w-4" /> Add Engagements</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partnership Engagements</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>No.</TableHead>
                <TableHead>Engagement Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {engagements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.no}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Badge tone={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'warning' : 'muted'}>{item.status}</Badge>
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
