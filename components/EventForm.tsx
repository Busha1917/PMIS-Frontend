import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'

type EventFormProps = {
  onSubmit?: () => void
  onCancel?: () => void
}

export function EventForm({ onSubmit, onCancel }: EventFormProps) {
  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">Event Details</CardTitle>
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Event Name</label>
              <Input placeholder="Enter event name" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Event Type</label>
              <select className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10">
                <option>Select event type</option>
                <option>Conference / Forum</option>
                <option>Concert</option>
                <option>Workshop</option>
                <option>Webinar</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Date & Time</label>
              <Input
                type="datetime-local"
                className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Venue</label>
              <Input placeholder="Enter venue" />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                <p className="text-sm font-semibold text-slate-900">Partner Representatives</p>
              </div>
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10"
                placeholder="Enter partner representatives"
              />
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                <p className="text-sm font-semibold text-slate-900">EAII Representatives</p>
              </div>
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10"
                placeholder="Enter EAII representatives"
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Agreements Reached</label>
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10"
                placeholder="Enter agreements reached"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Action Points</label>
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10"
                placeholder="Enter action points"
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10">
                <option>Select status</option>
                <option>Draft</option>
                <option>Approved</option>
                <option>Accepted</option>
                <option>Rejected</option>
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
