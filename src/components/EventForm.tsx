import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { useLayout } from '../contexts/LayoutContext'
import type { EventRecord } from '../types'

type EventFormMode = 'create' | 'edit' | 'preview'

type EventFormProps = {
  event?: EventRecord | null
  mode?: EventFormMode
  onSubmit?: (event: EventRecord) => void
  onCancel?: () => void
}

const eventTypes = ['Conference / Forum', 'Concert', 'Workshop', 'Webinar']
const statusOptions = ['Draft', 'Approved', 'Accepted', 'Rejected']

export function EventForm({ event, mode = 'create', onSubmit, onCancel }: EventFormProps) {
  const [formState, setFormState] = useState<EventRecord>(
    event ?? {
      id: `evt-${Date.now()}`,
      no: 0,
      title: '',
      type: '',
      date: '',
      venue: '',
      status: 'Draft',
    }
  )

  const { setBreadcrumbSuffix } = useLayout()

  useEffect(() => {
    if (event) {
      setFormState(event)
    }
  }, [event])

  const isPreview = mode === 'preview'
  const canSubmit = mode !== 'preview'

  useEffect(() => {
    if (isPreview && formState.id) {
      setBreadcrumbSuffix(formState.id)
    }
    return () => setBreadcrumbSuffix(null)
  }, [isPreview, formState.id, setBreadcrumbSuffix])

  if (isPreview) {
    const partnerReps = [
      { name: 'Courtney Henry', role: 'Technical Lead' },
      { name: 'Darlene Robertson', role: 'Director' },
      { name: 'Theresa Webb', role: 'Deputy Director' },
      { name: 'Bessie Cooper', role: 'Deputy Director' },
    ]

    const eaiiReps = [
      { name: 'Theresa Webb', role: 'Technical Lead' },
      { name: 'Wade Warren', role: 'Director' },
      { name: 'Cameron Williamson', role: 'Deputy Director' },
      { name: 'Savannah Nguyen', role: 'Deputy Director' },
    ]

    const summaryText =
      'Nulla auctor, sapien eget posuere vehicula, sapien velit aliquet nibh, eu semper purus erat nec ipsum. Nam eget sagittis arcu. Ut ac sollicitudin odio. In et lacus ipsum. Curabitur faucibus sem eu fermentum malesuada.'

    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Event Details</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {formState.title || 'Event Preview'}
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

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Event Details
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <dl className="divide-y divide-slate-200 text-sm text-slate-700">
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Event Name</dt>
                  <dd className="font-semibold text-slate-950">{formState.title || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Event Type</dt>
                  <dd className="font-semibold text-slate-950">{formState.type || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Date & Time</dt>
                  <dd className="font-semibold text-slate-950">{formState.date || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Venue</dt>
                  <dd className="font-semibold text-slate-950">{formState.venue || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Partner Representatives
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <div className="space-y-4 text-sm text-slate-700">
                {partnerReps.map(rep => (
                  <div
                    key={rep.name}
                    className="flex justify-between border-b border-slate-200 pb-3 last:border-none last:pb-0"
                  >
                    <span>{rep.name}</span>
                    <span className="text-slate-500">{rep.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  EAII Representatives
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <div className="space-y-4 text-sm text-slate-700">
                {eaiiReps.map(rep => (
                  <div
                    key={rep.name}
                    className="flex justify-between border-b border-slate-200 pb-3 last:border-none last:pb-0"
                  >
                    <span>{rep.name}</span>
                    <span className="text-slate-500">{rep.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Agreement Reached
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <p className="text-sm leading-7 text-slate-700">{summaryText}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Action Points
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <p className="text-sm leading-7 text-slate-700">{summaryText}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">Event Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form
          className="space-y-6"
          onSubmit={submitEvent => {
            submitEvent.preventDefault()
            if (canSubmit) onSubmit?.(formState)
          }}
        >
          <div className="grid gap-4 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Event Name</label>
              <Input
                value={formState.title}
                onChange={event =>
                  setFormState(current => ({ ...current, title: event.target.value }))
                }
                placeholder="Enter event name"
                disabled={isPreview}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Event Type</label>
              <select
                value={formState.type}
                onChange={event =>
                  setFormState(current => ({ ...current, type: event.target.value }))
                }
                disabled={isPreview}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
              >
                <option value="">Select event type</option>
                {eventTypes.map(eventType => (
                  <option key={eventType} value={eventType}>
                    {eventType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Date & Time</label>
              <Input
                type="datetime-local"
                value={formState.date}
                onChange={event =>
                  setFormState(current => ({ ...current, date: event.target.value }))
                }
                disabled={isPreview}
                className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Venue</label>
              <Input
                value={formState.venue}
                onChange={event =>
                  setFormState(current => ({ ...current, venue: event.target.value }))
                }
                placeholder="Enter venue"
                disabled={isPreview}
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                <p className="text-sm font-semibold text-slate-900">Partner Representatives</p>
              </div>
              <textarea
                value={formState.venue}
                onChange={event =>
                  setFormState(current => ({ ...current, venue: event.target.value }))
                }
                className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
                placeholder="Enter partner representatives"
                disabled={isPreview}
              />
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                <p className="text-sm font-semibold text-slate-900">EAII Representatives</p>
              </div>
              <textarea
                value={formState.venue}
                onChange={event =>
                  setFormState(current => ({ ...current, venue: event.target.value }))
                }
                className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
                placeholder="Enter EAII representatives"
                disabled={isPreview}
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={formState.status}
                onChange={event =>
                  setFormState(current => ({ ...current, status: event.target.value }))
                }
                disabled={isPreview}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100"
              >
                {statusOptions.map(statusOption => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end justify-end gap-3">
              <Button variant="outline" type="button" onClick={onCancel}>
                Close
              </Button>
              {canSubmit ? (
                <Button className="!bg-[#ff9500] !text-white !hover:bg-[#e68a00]" type="submit">
                  Save
                </Button>
              ) : null}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
