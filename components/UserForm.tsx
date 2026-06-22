import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'

type UserFormProps = {
  onSubmit?: () => void
  onCancel?: () => void
}

export function UserForm({ onSubmit, onCancel }: UserFormProps) {
  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">User Details</CardTitle>
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <Input placeholder="Enter full name" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <Input type="email" placeholder="Enter email address" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
              <Input placeholder="Enter phone number" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Position</label>
              <Input placeholder="Enter position" />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10">
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
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
