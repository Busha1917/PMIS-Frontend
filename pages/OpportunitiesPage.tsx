import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'
import { opportunities } from '../data'

export function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Register Partnership Opportunities and track outcomes</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input placeholder="Search opportunities..." className="w-full sm:w-72" />
          <Button variant="outline" className="!px-4"> <Filter className="h-4 w-4" /> Filter</Button>
          <Button className="bg-orange-500 hover:bg-orange-600"> <Plus className="h-4 w-4" /> Add Opportunity</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partnership Opportunities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {opportunities.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.no}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.division}</TableCell>
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
