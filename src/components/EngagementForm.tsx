import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import type { EngagementRecord } from '../types'

type EngagementFormMode = 'create' | 'edit' | 'preview'

type EngagementFormProps = {
  engagement?: EngagementRecord | null
  mode?: EngagementFormMode
  onSubmit?: (engagement: EngagementRecord) => void
  onCancel?: () => void
  onEdit?: () => void
}

const statusOptions = ['Draft', 'Approved', 'Accepted', 'Rejected']

export function EngagementForm({
  engagement,
  mode = 'create',
  onSubmit,
  onCancel,
  onEdit,
}: EngagementFormProps) {
  const [formState, setFormState] = useState<
    EngagementRecord & { followUpDate?: string; summary?: string }
  >(
    engagement ?? {
      id: `eng-${Date.now()}`,
      no: 0,
      type: '',
      date: '',
      status: 'Draft',
      followUpDate: '',
      summary: '',
    }
  )

  useEffect(() => {
    if (engagement) {
      setFormState({
        ...engagement,
        followUpDate: (engagement as any).followUpDate ?? '',
        summary: (engagement as any).summary ?? '',
      })
    }
  }, [engagement])

  const isPreview = mode === 'preview'
  const canSubmit = mode !== 'preview'

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-0 bg-transparent p-0 text-slate-700 shadow-none hover:bg-transparent hover:text-slate-950"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Engagement Details
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {formState.type || 'Engagement Preview'}
              </h1>
              <p className="mt-2 text-sm text-slate-500">ID: {formState.id}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-800 shadow-sm shadow-orange-100/80">
                {formState.status}
              </span>
              {formState.status?.toLowerCase() === 'draft' && (
                <Button
                  variant="outline"
                  onClick={onEdit ?? onCancel}
                  className="rounded-full border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Key Information
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <dl className="divide-y divide-slate-200 text-sm text-slate-700">
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Engagement Type</dt>
                  <dd className="font-semibold text-slate-950">{formState.type || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Date</dt>
                  <dd className="font-semibold text-slate-950">{formState.date || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Follow-up Date</dt>
                  <dd className="font-semibold text-slate-950">
                    {formState.followUpDate || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Summary & Notes
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <p className="text-sm leading-7 text-slate-700">
                {formState.summary ||
                  'No summary text registered for this engagement event. Standard processes were followed and notes will be updated during the next review meeting.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">
          {mode === 'edit' ? 'Edit Engagement' : 'Engagement Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form
          className="space-y-6"
          onSubmit={event => {
            event.preventDefault()
            if (canSubmit) onSubmit?.(formState)
          }}
        >
          <div className="grid gap-4 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Engagement Type
              </label>
              <Input
                value={formState.type}
                onChange={e => setFormState(current => ({ ...current, type: e.target.value }))}
                placeholder="Enter engagement type"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
              <Input
                type="datetime-local"
                value={formState.date}
                onChange={e => setFormState(current => ({ ...current, date: e.target.value }))}
                required
                className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={formState.status}
                onChange={e => setFormState(current => ({ ...current, status: e.target.value }))}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              >
                {statusOptions.map(statusOption => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Follow-up Date
              </label>
              <Input
                type="datetime-local"
                value={formState.followUpDate}
                onChange={e =>
                  setFormState(current => ({ ...current, followUpDate: e.target.value }))
                }
                className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Summary</label>
            <textarea
              value={formState.summary}
              onChange={e => setFormState(current => ({ ...current, summary: e.target.value }))}
              className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              placeholder="Enter engagement summary"
            />
          </div>

          <div className="flex items-end justify-end gap-3">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="!bg-[#ff9500] !text-white !hover:bg-[#e68a00]" type="submit">
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
