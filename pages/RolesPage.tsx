import { Plus, Filter, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'
import { roles } from '../data'

export function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Register and manage roles and permissions.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input placeholder="Search roles..." className="w-full sm:w-72" />
          <Button variant="outline" className="!px-4"> <Filter className="h-4 w-4" /> Filter</Button>
          <Button className="bg-orange-500 hover:bg-orange-600"> <Plus className="h-4 w-4" /> Add Role</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.no}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.permissions}</TableCell>
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
