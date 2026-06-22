import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'

type AgreementFormProps = {
  onSubmit?: () => void
  onCancel?: () => void
}

export function AgreementForm({ onSubmit, onCancel }: AgreementFormProps) {
  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">Agreement Details</CardTitle>
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Agreement Title</label>
              <Input placeholder="Enter agreement title" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
              <select className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10">
                <option>MoU</option>
                <option>Contract</option>
                <option>Service Level</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
              <Input type="date" className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">End Date</label>
              <Input type="date" className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10" />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Effective Date</label>
              <Input type="date" className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10">
                <option>Draft</option>
                <option>Approved</option>
                <option>Accepted</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Agreement Summary</label>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              placeholder="Enter agreement summary"
            />
          </div>

          <div className="flex items-end justify-end gap-3">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="!bg-[#ff9500] !text-white !hover:bg-[#e68a00]" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
