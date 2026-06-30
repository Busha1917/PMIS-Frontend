import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2, Plus, Paperclip } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { Modal } from '../ui/Modal'
import type { EventRecord, PartnerParticipant, EaiiParticipant, DelegationMember } from '../types'
import { StatusBadge } from './StatusBadge'

type EventFormMode = 'create' | 'edit' | 'preview'

type EventFormProps = {
  event?: EventRecord | null
  mode?: EventFormMode
  onSubmit?: (event: EventRecord) => void
  onCancel?: () => void
  onEdit?: () => void
}

const eventTypes = [
  'Conference',
  'Workshop',
  'Seminar',
  'Training',
  'Exhibition',
  'Networking event',
  'Hackathon',
  'Demo Day',
  'other',
]

const visitTypes = [
  'Incoming visit',
  'outgoing visit',
  'technical visit',
  'courtesy visit',
  'site visit',
  'delegation visit',
  'benchmarking visit',
  'international visit',
]

const statusOptions = ['Draft', 'Approved', 'Accepted', 'Rejected']

const getAttachmentDisplayValue = (value: string | File | null | undefined) => {
  if (value instanceof File) return value.name
  return value || ''
}

export function EventForm({ event, mode = 'create', onSubmit, onCancel, onEdit }: EventFormProps) {
  const [formState, setFormState] = useState<EventRecord>(() => {
    const base = event ?? {
      id: `evt-${Date.now()}`,
      no: 0,
      title: '',
      type: '',
      date: '',
      venue: '',
      status: 'Draft',
    }
    return {
      ...base,
      category: base.category ?? 'Event',
      partnerParticipants: base.partnerParticipants ?? [],
      eaiiParticipants: base.eaiiParticipants ?? [],
      delegations: base.delegations ?? [],
    }
  })

  // Local states for adding items to nested arrays
  const [partnerPart, setPartnerPart] = useState<Omit<PartnerParticipant, 'id'>>({
    fullName: '',
    organizationName: '',
    position: '',
    email: '',
    phone: '',
    type: 'Partner Representative',
  })

  const [eaiiPart, setEaiiPart] = useState<EaiiParticipant>({
    name: '',
    division: '',
    email: '',
  })

  const [delegationPart, setDelegationPart] = useState<DelegationMember>({
    fullName: '',
    position: '',
    organizationName: '',
    country: '',
    email: '',
    phone: '',
    status: 'Normal',
  })

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    type: 'Approve' | 'Accept' | null
  }>({
    open: false,
    type: null,
  })

  const [rejectModal, setRejectModal] = useState<{ open: boolean; reason: string }>({
    open: false,
    reason: '',
  })

  useEffect(() => {
    if (event) {
      setFormState({
        ...event,
        category: event.category ?? 'Event',
        partnerParticipants: event.partnerParticipants ?? [],
        eaiiParticipants: event.eaiiParticipants ?? [],
        delegations: event.delegations ?? [],
      })
    }
  }, [event])

  const isPreview = mode === 'preview'
  const canSubmit = mode !== 'preview'

  const handleAddPartnerParticipant = () => {
    if (!partnerPart.fullName) return
    const newItem: PartnerParticipant = {
      id: `pp-${Date.now()}`,
      ...partnerPart,
    }
    setFormState(prev => ({
      ...prev,
      partnerParticipants: [...(prev.partnerParticipants ?? []), newItem],
    }))
    setPartnerPart({
      fullName: '',
      organizationName: '',
      position: '',
      email: '',
      phone: '',
      type: 'Partner Representative',
    })
  }

  const handleRemovePartnerParticipant = (id: string) => {
    setFormState(prev => ({
      ...prev,
      partnerParticipants: (prev.partnerParticipants ?? []).filter(item => item.id !== id),
    }))
  }

  const handleAddEaiiParticipant = () => {
    if (!eaiiPart.name) return
    setFormState(prev => ({
      ...prev,
      eaiiParticipants: [...(prev.eaiiParticipants ?? []), { ...eaiiPart }],
    }))
    setEaiiPart({ name: '', division: '', email: '' })
  }

  const handleRemoveEaiiParticipant = (index: number) => {
    setFormState(prev => ({
      ...prev,
      eaiiParticipants: (prev.eaiiParticipants ?? []).filter((_, i) => i !== index),
    }))
  }

  const handleAddDelegation = () => {
    if (!delegationPart.fullName) return
    setFormState(prev => ({
      ...prev,
      delegations: [...(prev.delegations ?? []), { ...delegationPart }],
    }))
    setDelegationPart({
      fullName: '',
      position: '',
      organizationName: '',
      country: '',
      email: '',
      phone: '',
      status: 'Normal',
    })
  }

  const handleRemoveDelegation = (index: number) => {
    setFormState(prev => ({
      ...prev,
      delegations: (prev.delegations ?? []).filter((_, i) => i !== index),
    }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      // Automatically map Name/Title & Venue fields for consistency with legacy table
      const finalState = { ...formState }
      if (finalState.status === 'Rejected') {
        finalState.status = 'Draft'
        finalState.rejectionReason = ''
      }
      if (formState.category === 'Visit') {
        finalState.title = `${formState.visitingOrganization || 'Visit'} to ${formState.hostOrganization || 'EAII'}`
        finalState.venue = formState.visitLocations || 'EAII Headquarters'
        finalState.type = formState.visitType || ''
        finalState.date = formState.visitDate || ''
      }
      onSubmit?.(finalState)
    }
  }

  const handleApproveClick = () => {
    setConfirmModal({ open: true, type: 'Approve' })
  }

  const handleAcceptClick = () => {
    setConfirmModal({ open: true, type: 'Accept' })
  }

  const handleConfirmAction = () => {
    const nextStatus = confirmModal.type === 'Approve' ? 'Approved' : 'Accepted'
    const updated = { ...formState, status: nextStatus as any }
    setFormState(updated)
    onSubmit?.(updated)
    setConfirmModal({ open: false, type: null })
  }

  const handleRejectClick = () => {
    setRejectModal({ open: true, reason: formState.rejectionReason || '' })
  }

  const handleConfirmReject = () => {
    const updated = {
      ...formState,
      status: 'Rejected' as const,
      rejectionReason: rejectModal.reason,
    }
    setFormState(updated)
    onSubmit?.(updated)
    setRejectModal({ open: false, reason: '' })
  }

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
                {formState.category} Details
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {formState.category === 'Event'
                  ? formState.title || 'Event Preview'
                  : `${formState.visitingOrganization || 'Visitor Delegation'} Visit`}
              </h1>
              <p className="mt-2 text-sm text-slate-500">ID: {formState.id}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={formState.status} />
              {formState.status !== 'Accepted' && (
                <Button
                  variant="outline"
                  onClick={onEdit ?? onCancel}
                  className="rounded-full border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Button>
              )}
              {formState.status === 'Draft' && (
                <>
                  <Button
                    variant="default"
                    onClick={handleApproveClick}
                    className="ml-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleRejectClick}
                    className="ml-2 rounded-full"
                  >
                    Reject
                  </Button>
                </>
              )}
              {formState.status === 'Approved' && (
                <>
                  <Button
                    variant="default"
                    onClick={handleAcceptClick}
                    className="ml-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleRejectClick}
                    className="ml-2 rounded-full"
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>

          {formState.status === 'Rejected' && formState.rejectionReason && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
              <span className="font-bold">Rejection Reason:</span> {formState.rejectionReason}
            </div>
          )}

          {formState.category === 'Event' ? (
            /* =================== EVENT PREVIEW =================== */
            <div className="space-y-6">
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                      Event Info
                    </p>
                    <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                  </div>
                  <dl className="divide-y divide-slate-100 text-sm text-slate-700">
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Event Name</dt>
                      <dd className="font-semibold text-slate-950">{formState.title || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Event Type</dt>
                      <dd className="font-semibold text-slate-950">{formState.type || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Category</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.eventCategory || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Date & Time</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.date
                          ? `${formState.date} (${formState.startTime || ''} - ${formState.endTime || ''})`
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Venue</dt>
                      <dd className="font-semibold text-slate-950">{formState.venue || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Organizer</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.organizer || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Co-Organizer</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.coOrganizer || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Event Mode</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.eventMode || 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                      Budget & Finance
                    </p>
                    <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                  </div>
                  <dl className="divide-y divide-slate-100 text-sm text-slate-700">
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Estimated Budget</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.estimatedBudget !== undefined
                          ? `${formState.estimatedBudget.toLocaleString()} ETB`
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Actual Budget</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.actualBudget !== undefined
                          ? `${formState.actualBudget.toLocaleString()} ETB`
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Funding Score</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.fundingScore || 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Participants */}
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                      Partner Participants
                    </p>
                    <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                  </div>
                  {formState.partnerParticipants && formState.partnerParticipants.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400">
                            <th className="py-2">Name</th>
                            <th className="py-2">Org</th>
                            <th className="py-2">Role/Type</th>
                            <th className="py-2">Contact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {formState.partnerParticipants.map((p, idx) => (
                            <tr key={p.id || idx}>
                              <td className="py-2 font-medium text-slate-900">{p.fullName}</td>
                              <td className="py-2 text-slate-500">{p.organizationName}</td>
                              <td className="py-2 text-slate-500">{p.type}</td>
                              <td className="py-2 text-slate-400">{p.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No partner participants registered.</p>
                  )}
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                      EAII Participants
                    </p>
                    <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                  </div>
                  {formState.eaiiParticipants && formState.eaiiParticipants.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400">
                            <th className="py-2">Name</th>
                            <th className="py-2">Division</th>
                            <th className="py-2">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {formState.eaiiParticipants.map((p, idx) => (
                            <tr key={idx}>
                              <td className="py-2 font-medium text-slate-900">{p.name}</td>
                              <td className="py-2 text-slate-500">{p.division}</td>
                              <td className="py-2 text-slate-400">{p.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No EAII participants registered.</p>
                  )}
                </div>
              </div>

              {/* Outcomes */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                    Event Outcomes
                  </p>
                  <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 text-sm text-slate-700">
                  <div>
                    <h4 className="font-semibold text-slate-950">Key Discussions</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.keyDiscussions || 'No discussions registered.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-950">Agreements Reached</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.agreementsReached || 'No agreements registered.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-950">Action Points</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.actionPoints || 'No action points registered.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-950">Objectives Achieved</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.objectivesAchieved || 'No objectives achieved registered.'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-slate-950">Recommendations</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.recommendations || 'No recommendations registered.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                    Attachments
                  </p>
                  <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  {[
                    { label: 'Agenda', value: formState.attachmentsAgenda },
                    { label: 'Attendance Sheet', value: formState.attachmentsAttendanceSheet },
                    { label: 'Presentations', value: formState.attachmentsPresentations },
                    { label: 'Photos', value: formState.attachmentsPhotos },
                    { label: 'Videos', value: formState.attachmentsVideos },
                    { label: 'Event Report', value: formState.attachmentsEventReport },
                  ].map(item => {
                    const displayValue = getAttachmentDisplayValue(item.value)
                    return (
                      displayValue && (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3"
                        >
                          <Paperclip className="h-4 w-4 text-slate-400" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-700">{displayValue}</p>
                            <p className="text-xs text-slate-400">{item.label}</p>
                          </div>
                        </div>
                      )
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* =================== VISIT PREVIEW =================== */
            <div className="space-y-6">
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                      Visit Details
                    </p>
                    <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                  </div>
                  <dl className="divide-y divide-slate-100 text-sm text-slate-700">
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Visit Type</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.visitType || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Visit Category</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.visitCategory || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Visit Date</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.visitDate || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Host Organization</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.hostOrganization || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Visiting Organization</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.visitingOrganization || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Visit Locations</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.visitLocations || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Purpose of Visit</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.purposeOfVisit || 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                      Focal Person
                    </p>
                    <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                  </div>
                  <dl className="divide-y divide-slate-100 text-sm text-slate-700">
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Full Name</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.focalPersonName || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Division</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.focalPersonDivision || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-slate-500">Email</dt>
                      <dd className="font-semibold text-slate-950">
                        {formState.focalPersonEmail || 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Delegation List */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                    Delegation List
                  </p>
                  <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                </div>
                {formState.delegations && formState.delegations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400">
                          <th className="py-2">Full Name</th>
                          <th className="py-2">Organization</th>
                          <th className="py-2">Country</th>
                          <th className="py-2">Position</th>
                          <th className="py-2">Contact</th>
                          <th className="py-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formState.delegations.map((d, idx) => (
                          <tr key={idx}>
                            <td className="py-2 font-medium text-slate-900">{d.fullName}</td>
                            <td className="py-2 text-slate-500">{d.organizationName}</td>
                            <td className="py-2 text-slate-500">{d.country}</td>
                            <td className="py-2 text-slate-500">{d.position}</td>
                            <td className="py-2 text-slate-400">
                              {d.email}{' '}
                              <span className="block text-[10px] text-slate-300">{d.phone}</span>
                            </td>
                            <td className="py-2 text-center">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  d.status === 'VIP'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {d.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No delegates registered.</p>
                )}
              </div>

              {/* Discussion Summary & Outcomes */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                    Discussion Summary & Outcomes
                  </p>
                  <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 text-sm text-slate-700">
                  <div>
                    <h4 className="font-semibold text-slate-950">Key Topics Discussed</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.keyTopicsDiscussed || 'No topics registered.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-950">Opportunities Identified</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.opportunitiesIdentified || 'No opportunities registered.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-950">Agreements Reached</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.visitAgreementsReached || 'No agreements registered.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-950">Follow-up Actions</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.followUpActions || 'No actions registered.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                    Attachments
                  </p>
                  <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  {[
                    { label: 'Visit Schedule', value: formState.visitAttachmentsSchedule },
                    { label: 'Attendance List', value: formState.visitAttachmentsAttendanceList },
                    { label: 'Meeting Minutes', value: formState.visitAttachmentsMinutes },
                    { label: 'Photos', value: formState.visitAttachmentsPhotos },
                    { label: 'Videos', value: formState.visitAttachmentsVideos },
                    { label: 'Presentations', value: formState.visitAttachmentsPresentations },
                    { label: 'Visit Report', value: formState.visitAttachmentsReport },
                  ].map(item => {
                    const displayValue = getAttachmentDisplayValue(item.value)
                    return (
                      displayValue && (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3"
                        >
                          <Paperclip className="h-4 w-4 text-slate-400" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-700">{displayValue}</p>
                            <p className="text-xs text-slate-400">{item.label}</p>
                          </div>
                        </div>
                      )
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modals */}
          <Modal
            open={confirmModal.open}
            onClose={() => setConfirmModal({ open: false, type: null })}
            title={`${confirmModal.type} Confirmation`}
            size="sm"
          >
            <div className="px-6 py-6">
              <p className="text-sm leading-7 text-slate-600">
                Are you sure you want to {confirmModal.type === 'Approve' ? 'approve' : 'accept'}{' '}
                this record?
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmModal({ open: false, type: null })}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleConfirmAction}
                  className={
                    confirmModal.type === 'Approve'
                      ? 'bg-green-600 hover:bg-green-700 text-white rounded-full'
                      : 'bg-blue-600 hover:bg-blue-700 text-white rounded-full'
                  }
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            open={rejectModal.open}
            onClose={() => setRejectModal({ open: false, reason: '' })}
            title="Rejection Reason"
            size="md"
          >
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">
                  Please provide a reason for rejecting this record:
                </label>
                <textarea
                  value={rejectModal.reason}
                  onChange={e => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter rejection reason here..."
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                  required
                />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setRejectModal({ open: false, reason: '' })}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleConfirmReject}
                  disabled={!rejectModal.reason.trim()}
                  className="rounded-full"
                >
                  Confirm Reject
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    )
  }

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">
          {mode === 'edit'
            ? `Edit ${formState.category === 'Visit' ? 'Visit' : 'Event'}`
            : `${formState.category === 'Visit' ? 'Visit' : 'Event'} Registration`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-8" onSubmit={handleFormSubmit}>
          {/* ===== Category Selector ===== */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-700">Category</label>
              <select
                value={formState.category ?? 'Event'}
                onChange={e => setFormState(prev => ({ ...prev, category: e.target.value as any }))}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              >
                <option value="Event">Event</option>
                <option value="Visit">Visit</option>
              </select>
            </div>
          </div>

          {formState.category === 'Event' ? (
            /* =================== EVENT FORM SECTIONS ===================  */
            <>
              {/* Event Detail */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Event Detail
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Event Name
                    </label>
                    <Input
                      value={formState.title}
                      onChange={e => setFormState(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter event name"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Event Type
                    </label>
                    <select
                      value={formState.type}
                      onChange={e => setFormState(prev => ({ ...prev, type: e.target.value }))}
                      required
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                    >
                      <option value="">Select Event Type</option>
                      {eventTypes.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Event Category
                    </label>
                    <select
                      value={formState.eventCategory || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, eventCategory: e.target.value as any }))
                      }
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                    >
                      <option value="">Select Category</option>
                      <option value="Internal">Internal</option>
                      <option value="Joint">Joint</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Event Date
                    </label>
                    <Input
                      type="date"
                      value={formState.date ? formState.date.split('T')[0] : ''}
                      onChange={e => setFormState(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Start Time
                    </label>
                    <Input
                      type="time"
                      value={formState.startTime || ''}
                      onChange={e => setFormState(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      End Time
                    </label>
                    <Input
                      type="time"
                      value={formState.endTime || ''}
                      onChange={e => setFormState(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">Venue</label>
                    <Input
                      value={formState.venue}
                      onChange={e => setFormState(prev => ({ ...prev, venue: e.target.value }))}
                      placeholder="Enter venue location"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Organizer
                    </label>
                    <Input
                      value={formState.organizer || ''}
                      onChange={e => setFormState(prev => ({ ...prev, organizer: e.target.value }))}
                      placeholder="e.g. EAII"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Co-organizer
                    </label>
                    <Input
                      value={formState.coOrganizer || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, coOrganizer: e.target.value }))
                      }
                      placeholder="e.g. AAU"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Event Mode
                    </label>
                    <select
                      value={formState.eventMode || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, eventMode: e.target.value as any }))
                      }
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                    >
                      <option value="">Select Mode</option>
                      <option value="Physically">Physically</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Partner Participants */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Partner Participants
                  </h3>
                </div>
                {/* Addition Form */}
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Full Name
                    </label>
                    <Input
                      value={partnerPart.fullName}
                      onChange={e => setPartnerPart(p => ({ ...p, fullName: e.target.value }))}
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Organization
                    </label>
                    <Input
                      value={partnerPart.organizationName}
                      onChange={e =>
                        setPartnerPart(p => ({ ...p, organizationName: e.target.value }))
                      }
                      placeholder="Organization"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Position
                    </label>
                    <Input
                      value={partnerPart.position}
                      onChange={e => setPartnerPart(p => ({ ...p, position: e.target.value }))}
                      placeholder="Position"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">Email</label>
                    <Input
                      value={partnerPart.email}
                      onChange={e => setPartnerPart(p => ({ ...p, email: e.target.value }))}
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">Phone</label>
                    <Input
                      value={partnerPart.phone}
                      onChange={e => setPartnerPart(p => ({ ...p, phone: e.target.value }))}
                      placeholder="Phone"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">Type</label>
                    <div className="flex gap-2 items-center">
                      <select
                        value={partnerPart.type}
                        onChange={e => setPartnerPart(p => ({ ...p, type: e.target.value as any }))}
                        className="h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-900 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      >
                        <option value="Partner Representative">Partner Representative</option>
                        <option value="Speaker">Speaker</option>
                        <option value="Guest">Guest</option>
                        <option value="VIP Guest">VIP Guest</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddPartnerParticipant}
                        className="flex-shrink-0 bg-[#ff9500] hover:bg-[#e68a00] text-white p-2.5 rounded-md transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* List Table */}
                {formState.partnerParticipants && formState.partnerParticipants.length > 0 && (
                  <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs bg-white">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-2">Full Name</th>
                          <th className="px-4 py-2">Organization</th>
                          <th className="px-4 py-2">Position</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Phone</th>
                          <th className="px-4 py-2">Type</th>
                          <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formState.partnerParticipants.map((p, idx) => (
                          <tr key={p.id || idx}>
                            <td className="px-4 py-2 font-medium text-slate-900">{p.fullName}</td>
                            <td className="px-4 py-2 text-slate-600">{p.organizationName}</td>
                            <td className="px-4 py-2 text-slate-600">{p.position}</td>
                            <td className="px-4 py-2 text-slate-600">{p.email}</td>
                            <td className="px-4 py-2 text-slate-600">{p.phone}</td>
                            <td className="px-4 py-2 text-slate-600">{p.type}</td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemovePartnerParticipant(p.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* EAII Participants */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    EAII Participants
                  </h3>
                </div>
                {/* Addition Form */}
                <div className="grid gap-3 sm:grid-cols-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">Name</label>
                    <Input
                      value={eaiiPart.name}
                      onChange={e => setEaiiPart(p => ({ ...p, name: e.target.value }))}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Division
                    </label>
                    <Input
                      value={eaiiPart.division}
                      onChange={e => setEaiiPart(p => ({ ...p, division: e.target.value }))}
                      placeholder="e.g. AI Research"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">Email</label>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={eaiiPart.email}
                        onChange={e => setEaiiPart(p => ({ ...p, email: e.target.value }))}
                        placeholder="Email"
                      />
                      <button
                        type="button"
                        onClick={handleAddEaiiParticipant}
                        className="flex-shrink-0 bg-[#ff9500] hover:bg-[#e68a00] text-white p-2.5 rounded-md transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* List Table */}
                {formState.eaiiParticipants && formState.eaiiParticipants.length > 0 && (
                  <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs bg-white">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-2">Full Name</th>
                          <th className="px-4 py-2">Division</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formState.eaiiParticipants.map((p, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 font-medium text-slate-900">{p.name}</td>
                            <td className="px-4 py-2 text-slate-600">{p.division}</td>
                            <td className="px-4 py-2 text-slate-600">{p.email}</td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveEaiiParticipant(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Budget
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Estimated Budget
                    </label>
                    <Input
                      type="number"
                      value={formState.estimatedBudget || ''}
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          estimatedBudget: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      placeholder="e.g. 50000"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Actual Budget
                    </label>
                    <Input
                      type="number"
                      value={formState.actualBudget || ''}
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          actualBudget: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      placeholder="e.g. 45000"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Funding Score
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formState.fundingScore || ''}
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          fundingScore: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      placeholder="e.g. 8.5"
                    />
                  </div>
                </div>
              </div>

              {/* Outcomes */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Outcomes
                  </h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Key Discussions
                    </label>
                    <textarea
                      value={formState.keyDiscussions || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, keyDiscussions: e.target.value }))
                      }
                      className="min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      placeholder="Key topics discussed..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Agreements Reached
                    </label>
                    <textarea
                      value={formState.agreementsReached || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, agreementsReached: e.target.value }))
                      }
                      className="min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      placeholder="Agreements reached..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Action Points
                    </label>
                    <textarea
                      value={formState.actionPoints || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, actionPoints: e.target.value }))
                      }
                      className="min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      placeholder="Next action items..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Objectives Achieved
                    </label>
                    <textarea
                      value={formState.objectivesAchieved || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, objectivesAchieved: e.target.value }))
                      }
                      className="min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      placeholder="What objectives were met..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Recommendations
                    </label>
                    <textarea
                      value={formState.recommendations || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, recommendations: e.target.value }))
                      }
                      className="min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      placeholder="Recommendations..."
                    />
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Attachments
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">Agenda</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.zip"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          attachmentsAgenda: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.attachmentsAgenda && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.attachmentsAgenda)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Attendance Sheet
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          attachmentsAttendanceSheet: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.attachmentsAttendanceSheet && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.attachmentsAttendanceSheet)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Presentations
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          attachmentsPresentations: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.attachmentsPresentations && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.attachmentsPresentations)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">Photos</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          attachmentsPhotos: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.attachmentsPhotos && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.attachmentsPhotos)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">Videos</label>
                    <input
                      type="file"
                      accept=".mp4,.mov,.avi,.mkv,.webm"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          attachmentsVideos: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.attachmentsVideos && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.attachmentsVideos)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Event Report
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          attachmentsEventReport: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.attachmentsEventReport && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.attachmentsEventReport)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* =================== VISIT FORM SECTIONS =================== */
            <>
              {/* Visit Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Visit Details
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Visit Type
                    </label>
                    <select
                      value={formState.visitType || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, visitType: e.target.value as any }))
                      }
                      required
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                    >
                      <option value="">Select Visit Type</option>
                      {visitTypes.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Visit Category
                    </label>
                    <select
                      value={formState.visitCategory || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, visitCategory: e.target.value as any }))
                      }
                      required
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                    >
                      <option value="">Select Category</option>
                      <option value="Internal">Internal</option>
                      <option value="external">External</option>
                      <option value="international">International</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Visit Date
                    </label>
                    <Input
                      type="date"
                      value={formState.visitDate || ''}
                      onChange={e => setFormState(prev => ({ ...prev, visitDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Host Organization
                    </label>
                    <Input
                      value={formState.hostOrganization || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, hostOrganization: e.target.value }))
                      }
                      placeholder="e.g. EAII"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Visiting Organization
                    </label>
                    <Input
                      value={formState.visitingOrganization || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, visitingOrganization: e.target.value }))
                      }
                      placeholder="Visiting entity name"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Visit Locations
                    </label>
                    <Input
                      value={formState.visitLocations || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, visitLocations: e.target.value }))
                      }
                      placeholder="Labs/Divisions visited"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Purpose of Visit
                    </label>
                    <Input
                      value={formState.purposeOfVisit || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, purposeOfVisit: e.target.value }))
                      }
                      placeholder="Primary goal of the visit"
                    />
                  </div>
                </div>
              </div>

              {/* Focal Person */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Focal Person
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Full Name
                    </label>
                    <Input
                      value={formState.focalPersonName || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, focalPersonName: e.target.value }))
                      }
                      placeholder="Focal person name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Division
                    </label>
                    <Input
                      value={formState.focalPersonDivision || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, focalPersonDivision: e.target.value }))
                      }
                      placeholder="e.g. Public Relations"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">Email</label>
                    <Input
                      value={formState.focalPersonEmail || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, focalPersonEmail: e.target.value }))
                      }
                      placeholder="Focal person email"
                    />
                  </div>
                </div>
              </div>

              {/* Delegation List */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Delegation List
                  </h3>
                </div>
                {/* Delegation form */}
                <div className="grid gap-3 sm:grid-cols-4 xl:grid-cols-7 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Full Name
                    </label>
                    <Input
                      value={delegationPart.fullName}
                      onChange={e => setDelegationPart(d => ({ ...d, fullName: e.target.value }))}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Position
                    </label>
                    <Input
                      value={delegationPart.position}
                      onChange={e => setDelegationPart(d => ({ ...d, position: e.target.value }))}
                      placeholder="Position"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Organization
                    </label>
                    <Input
                      value={delegationPart.organizationName}
                      onChange={e =>
                        setDelegationPart(d => ({ ...d, organizationName: e.target.value }))
                      }
                      placeholder="Organization"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Country
                    </label>
                    <Input
                      value={delegationPart.country}
                      onChange={e => setDelegationPart(d => ({ ...d, country: e.target.value }))}
                      placeholder="Country"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">Email</label>
                    <Input
                      value={delegationPart.email}
                      onChange={e => setDelegationPart(d => ({ ...d, email: e.target.value }))}
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">Phone</label>
                    <Input
                      value={delegationPart.phone}
                      onChange={e => setDelegationPart(d => ({ ...d, phone: e.target.value }))}
                      placeholder="Phone"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Status
                    </label>
                    <div className="flex gap-2 items-center">
                      <select
                        value={delegationPart.status}
                        onChange={e =>
                          setDelegationPart(d => ({ ...d, status: e.target.value as any }))
                        }
                        className="h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-900 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      >
                        <option value="Normal">Normal</option>
                        <option value="VIP">VIP</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddDelegation}
                        className="flex-shrink-0 bg-[#ff9500] hover:bg-[#e68a00] text-white p-2.5 rounded-md transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delegation Table */}
                {formState.delegations && formState.delegations.length > 0 && (
                  <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs bg-white">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-2">Full Name</th>
                          <th className="px-4 py-2">Organization</th>
                          <th className="px-4 py-2">Country</th>
                          <th className="px-4 py-2">Position</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Phone</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formState.delegations.map((d, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 font-medium text-slate-900">{d.fullName}</td>
                            <td className="px-4 py-2 text-slate-600">{d.organizationName}</td>
                            <td className="px-4 py-2 text-slate-600">{d.country}</td>
                            <td className="px-4 py-2 text-slate-600">{d.position}</td>
                            <td className="px-4 py-2 text-slate-600">{d.email}</td>
                            <td className="px-4 py-2 text-slate-600">{d.phone}</td>
                            <td className="px-4 py-2 text-slate-600">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                  d.status === 'VIP'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {d.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveDelegation(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Discussion Summary & Outcomes */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Discussion Summary & Outcomes
                  </h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Key Topics Discussed
                    </label>
                    <textarea
                      value={formState.keyTopicsDiscussed || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, keyTopicsDiscussed: e.target.value }))
                      }
                      className="min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      placeholder="What was discussed..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Opportunities Identified
                    </label>
                    <textarea
                      value={formState.opportunitiesIdentified || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, opportunitiesIdentified: e.target.value }))
                      }
                      className="min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      placeholder="Collaborative projects..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Agreements Reached
                    </label>
                    <textarea
                      value={formState.visitAgreementsReached || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, visitAgreementsReached: e.target.value }))
                      }
                      className="min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-955 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      placeholder="Official understandings..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Follow-up Actions
                    </label>
                    <textarea
                      value={formState.followUpActions || ''}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, followUpActions: e.target.value }))
                      }
                      className="min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10"
                      placeholder="Tasks and dates..."
                    />
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Attachments
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Visit Schedule
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          visitAttachmentsSchedule: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.visitAttachmentsSchedule && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.visitAttachmentsSchedule)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Attendance List
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          visitAttachmentsAttendanceList: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.visitAttachmentsAttendanceList && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected:{' '}
                        {getAttachmentDisplayValue(formState.visitAttachmentsAttendanceList)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Meeting Minutes
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          visitAttachmentsMinutes: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.visitAttachmentsMinutes && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.visitAttachmentsMinutes)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">Photos</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          visitAttachmentsPhotos: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.visitAttachmentsPhotos && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.visitAttachmentsPhotos)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">Videos</label>
                    <input
                      type="file"
                      accept=".mp4,.mov,.avi,.mkv,.webm"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          visitAttachmentsVideos: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.visitAttachmentsVideos && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.visitAttachmentsVideos)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Presentations
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          visitAttachmentsPresentations: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.visitAttachmentsPresentations && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected:{' '}
                        {getAttachmentDisplayValue(formState.visitAttachmentsPresentations)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Visit Report
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e =>
                        setFormState(prev => ({
                          ...prev,
                          visitAttachmentsReport: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff9500] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e68a00]"
                    />
                    {formState.visitAttachmentsReport && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected: {getAttachmentDisplayValue(formState.visitAttachmentsReport)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Status & Submit buttons */}
          <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t border-slate-200">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={formState.status}
                onChange={e => setFormState(prev => ({ ...prev, status: e.target.value }))}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end justify-end gap-3">
              <Button variant="outline" type="button" onClick={onCancel}>
                Close
              </Button>
              {canSubmit && (
                <Button className="!bg-[#ff9500] !text-white hover:!bg-[#e68a00]" type="submit">
                  Save
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
