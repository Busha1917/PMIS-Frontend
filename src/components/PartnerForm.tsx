import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import type { PartnerRecord } from '../types'

type PartnerFormMode = 'create' | 'edit' | 'preview'

type PartnerFormProps = {
  partner?: PartnerRecord | null
  mode?: PartnerFormMode
  onSubmit?: (partner: PartnerRecord) => void
  onCancel?: () => void
}

const statusOptions = ['Draft', 'Approved', 'Accepted', 'Rejected']

export function PartnerForm({ partner, mode = 'create', onSubmit, onCancel }: PartnerFormProps) {
  const [formState, setFormState] = useState<PartnerRecord & { notes?: string }>(
    partner ?? {
      id: `prt-${Date.now()}`,
      no: 0,
      name: '',
      type: '',
      country: '',
      organization: '',
      contact: '',
      status: 'Draft',
      notes: '',
    }
  )

  useEffect(() => {
    if (partner) {
      setFormState({
        ...partner,
        notes: (partner as any).notes ?? '',
      })
    }
  }, [partner])

  const isPreview = mode === 'preview'
  const canSubmit = mode !== 'preview'

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Partner Details</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {formState.name || 'Partner Preview'}
              </h1>
              <p className="mt-2 text-sm text-slate-500">ID: {formState.id}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="rounded-full px-5 py-2.5 text-sm font-semibold"
              >
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
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Key Information
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <dl className="divide-y divide-slate-200 text-sm text-slate-700">
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Partner Name</dt>
                  <dd className="font-semibold text-slate-950">{formState.name || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-semibold text-slate-950">{formState.type || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Country</dt>
                  <dd className="font-semibold text-slate-950">{formState.country || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Organization</dt>
                  <dd className="font-semibold text-slate-950">
                    {formState.organization || 'N/A'}
                  </dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Primary Contact</dt>
                  <dd className="font-semibold text-slate-950">{formState.contact || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Notes & History
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <p className="text-sm leading-7 text-slate-700">
                {formState.notes ||
                  'This record represents a registered partnership. All active collaborations, legal agreements, and historical visits are linked to this organization profiles.'}
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
          {mode === 'edit' ? 'Edit Partner' : 'Partner Details'}
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Partner Name</label>
              <Input
                value={formState.name}
                onChange={e => setFormState(current => ({ ...current, name: e.target.value }))}
                placeholder="Enter partner name"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
              <Input
                value={formState.type}
                onChange={e => setFormState(current => ({ ...current, type: e.target.value }))}
                placeholder="Enter partner type"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
              <Input
                value={formState.country}
                onChange={e => setFormState(current => ({ ...current, country: e.target.value }))}
                placeholder="Enter country"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Organization</label>
              <Input
                value={formState.organization}
                onChange={e =>
                  setFormState(current => ({ ...current, organization: e.target.value }))
                }
                placeholder="Enter organization"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Primary Contact
              </label>
              <Input
                value={formState.contact}
                onChange={e => setFormState(current => ({ ...current, contact: e.target.value }))}
                placeholder="Enter contact name"
                required
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
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              value={formState.notes}
              onChange={e => setFormState(current => ({ ...current, notes: e.target.value }))}
              className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              placeholder="Enter any partner notes"
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
