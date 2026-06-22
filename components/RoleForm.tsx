import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'

type RoleFormProps = {
  onSubmit?: () => void
  onCancel?: () => void
}

export function RoleForm({ onSubmit, onCancel }: RoleFormProps) {
  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">Role Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit?.()
          }}
        >
          <div className="grid gap-4 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Role Name</label>
              <Input placeholder="Enter role name" />
            </div>
            <div className="xl:col-span-3">
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <Input placeholder="Enter role description" />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Permissions</label>
              <Input type="number" placeholder="Enter permission count" />
            </div>
            <div className="flex items-end justify-end gap-3">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="!bg-[#ff9500] !text-white !hover:bg-[#e68a00]" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
