import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import type { AgreementRecord } from '../types'

type AgreementFormMode = 'create' | 'edit' | 'preview'

type AgreementFormProps = {
  agreement?: AgreementRecord | null
  mode?: AgreementFormMode
  onSubmit?: (agreement: AgreementRecord) => void
  onCancel?: () => void
}

const agreementTypes = ['MoU', 'Contract', 'Service Level']
const statusOptions = ['Draft', 'Approved', 'Accepted', 'Rejected']

export function AgreementForm({ agreement, mode = 'create', onSubmit, onCancel }: AgreementFormProps) {
  const [formState, setFormState] = useState<AgreementRecord & { summary?: string }>(
    agreement ?? {
      id: `agr-${Date.now()}`,
      no: 0,
      title: '',
      type: 'MoU',
      date: '',
      startDate: '',
      endDate: '',
      status: 'Draft',
      summary: '',
    }
  )

  useEffect(() => {
    if (agreement) {
      setFormState({
        ...agreement,
        summary: (agreement as any).summary ?? '',
      })
    }
  }, [agreement])

  const isPreview = mode === 'preview'
  const canSubmit = mode !== 'preview'

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Agreement Details</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{formState.title || 'Agreement Preview'}</h1>
              <p className="mt-2 text-sm text-slate-500">ID: {formState.id}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={onCancel} className="rounded-full px-5 py-2.5 text-sm font-semibold">
                Back
              </Button>
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-800 shadow-sm shadow-orange-100/80">
                {formState.status}
              </span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">Key Information</p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <dl className="divide-y divide-slate-200 text-sm text-slate-700">
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Agreement Title</dt>
                  <dd className="font-semibold text-slate-950">{formState.title || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-semibold text-slate-950">{formState.type || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Effective Date</dt>
                  <dd className="font-semibold text-slate-950">{formState.date || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Start Date</dt>
                  <dd className="font-semibold text-slate-950">{formState.startDate || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">End Date</dt>
                  <dd className="font-semibold text-slate-950">{formState.endDate || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">Summary & Scope</p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <p className="text-sm leading-7 text-slate-700">
                {formState.summary || 'This agreement outlines terms of mutual collaboration. Under these provisions, both organizations commit to resource exchanges and joint operational review schedules.'}
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
          {mode === 'edit' ? 'Edit Agreement' : 'Agreement Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            if (canSubmit) onSubmit?.(formState)
          }}
        >
          <div className="grid gap-4 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Agreement Title</label>
              <Input
                value={formState.title}
                onChange={(e) => setFormState((current) => ({ ...current, title: e.target.value }))}
                placeholder="Enter agreement title"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
              <select
                value={formState.type}
                onChange={(e) => setFormState((current) => ({ ...current, type: e.target.value }))}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              >
                {agreementTypes.map((typeOption) => (
                  <option key={typeOption} value={typeOption}>
                    {typeOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
              <Input
                type="datetime-local"
                value={formState.startDate}
                onChange={(e) => setFormState((current) => ({ ...current, startDate: e.target.value }))}
                required
                className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">End Date</label>
              <Input
                type="datetime-local"
                value={formState.endDate}
                onChange={(e) => setFormState((current) => ({ ...current, endDate: e.target.value }))}
                required
                className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Effective Date</label>
              <Input
                type="datetime-local"
                value={formState.date}
                onChange={(e) => setFormState((current) => ({ ...current, date: e.target.value }))}
                required
                className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={formState.status}
                onChange={(e) => setFormState((current) => ({ ...current, status: e.target.value }))}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              >
                {statusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Agreement Summary</label>
            <textarea
              value={formState.summary}
              onChange={(e) => setFormState((current) => ({ ...current, summary: e.target.value }))}
              className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              placeholder="Enter agreement summary"
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
