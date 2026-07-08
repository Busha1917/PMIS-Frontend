import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Trash2, Plus, User, CheckCircle2, ClipboardList, Edit3 } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../../ui'
import { Modal } from '../../ui/Modal'
import type {
  EventRecord,
  PartnerParticipant,
  EaiiParticipant,
  DelegationMember,
} from '../../types'
import { StatusBadge } from '../../components/StatusBadge'
import { OutcomeDraftPanel, type OutcomeDraftPanelHandle } from '../../components/OutcomeDraftPanel'

type EventFormMode = 'create' | 'edit' | 'preview'

type EventFormProps = {
  event?: any
  mode?: EventFormMode
  onSubmit?: (event: any) => void
  onCancel?: () => void
  onEdit?: () => void
  userRole?: 'Officer' | 'Director General' | 'Assigned Person'
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

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  Draft: { color: 'text-slate-600', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  'Pending Review': { color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  Approved: { color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-400' },
  'Pending Final Review': { color: 'text-purple-700', bg: 'bg-purple-50', dot: 'bg-purple-400' },
  Rejected: { color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-400' },
  Completed: { color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' },
}

function StatusBadgeInline({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? {
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    dot: 'bg-slate-400',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">{title}</p>
        <span className="block h-1.5 w-12 rounded-full bg-[#ff9500]" />
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900 text-right max-w-[60%]">
        {value || <span className="text-slate-300 font-normal">—</span>}
      </dd>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-all focus:border-[#161A61] focus:bg-white focus:ring-2 focus:ring-[#161A61]/10'
const textareaCls =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#161A61] focus:bg-white focus:ring-2 focus:ring-[#161A61]/10 resize-none'

export function EventForm({
  event,
  mode = 'create',
  onSubmit,
  onCancel,
  userRole = 'Officer',
}: EventFormProps) {
  const [formState, setFormState] = useState<EventRecord>(() => {
    const base = event ?? {
      id: `evt-${Date.now()}`,
      no: 0,
      title: '',
      type: '',
      date: '',
      venue: '',
      status: 'Draft' as const,
    }
    return {
      ...base,
      category: base.category ?? 'Event',
      partnerParticipants: base.partnerParticipants ?? [],
      eaiiParticipants: base.eaiiParticipants ?? [],
      delegations: base.delegations ?? [],
    }
  })

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [assignedPerson, setAssignedPerson] = useState(event?.assignedPerson || '')
  const [reviewComment, setReviewComment] = useState(event?.reviewComment || '')
  const [editingOutcome, setEditingOutcome] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignDepartment, setAssignDepartment] = useState('')
  const [assignOfficer, setAssignOfficer] = useState('')
  const [assignNotes, setAssignNotes] = useState('')
  const [partnerParticipantDraft, setPartnerParticipantDraft] = useState<PartnerParticipant>({
    id: '',
    fullName: '',
    organizationName: '',
    position: '',
    email: '',
    phone: '',
    type: 'Partner Representative',
  })
  const [eaiiParticipantDraft, setEaiiParticipantDraft] = useState<EaiiParticipant>({
    name: '',
    division: '',
    email: '',
  })
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])

  // Ref for OutcomeDraftPanel imperative handle — enables programmatic scroll+focus (Req 5.5)
  const outcomePanelRef = useRef<OutcomeDraftPanelHandle>(null)

  const [outcomeForm, setOutcomeForm] = useState({
    keyDiscussions: event?.keyDiscussions || '',
    agreementsReached: event?.agreementsReached || '',
    actionPoints: event?.actionPoints || '',
    objectivesAchieved: event?.objectivesAchieved || '',
    recommendations: event?.recommendations || '',
    keyTopicsDiscussed: event?.keyTopicsDiscussed || '',
    visitAgreementsReached: event?.visitAgreementsReached || '',
    followUpActions: event?.followUpActions || '',
    opportunitiesIdentified: event?.opportunitiesIdentified || '',
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
      setAssignedPerson(event.assignedPerson || '')
      setReviewComment(event.reviewComment || '')
    }
  }, [event])

  const isOfficer = userRole === 'Officer'
  const isDG = userRole === 'Director General'
  const isAssignedPerson = userRole === 'Assigned Person'

  const canEditRegistration =
    isOfficer && (formState.status === 'Draft' || formState.status === 'Rejected')
  const canDgReview = isDG && formState.status === 'Pending Review'
  // Determine whether the event has ended (so the assigned person can fill outcomes)
  let eventEnded = false
  try {
    if (formState.category === 'Event' && formState.endDate) {
      const endDate = new Date(formState.endDate)
      if (!isNaN(endDate.getTime())) {
        eventEnded = Date.now() > endDate.getTime()
      }
    } else if (formState.category === 'Visit' && formState.visitEndDate) {
      const endDate = new Date(formState.visitEndDate)
      if (!isNaN(endDate.getTime())) {
        eventEnded = Date.now() > endDate.getTime()
      }
    } else if (formState.category === 'Visit' && formState.visitDate) {
      const endDate = new Date(formState.visitDate)
      if (!isNaN(endDate.getTime())) {
        eventEnded = Date.now() > endDate.getTime()
      }
    } else if (formState.date) {
      const endDate = new Date(formState.date)
      if (!isNaN(endDate.getTime())) {
        eventEnded = Date.now() > endDate.getTime()
      }
    }
  } catch (e) {
    eventEnded = false
  }

  const canFillOutcome = isAssignedPerson && formState.status === 'Approved' && eventEnded
  const canFinalReview = isDG && formState.status === 'Pending Final Review'

  const submitWithStatus = (newStatus: EventRecord['status']) => {
    const finalState = { ...formState, status: newStatus }
    if (formState.category === 'Visit') {
      finalState.title = `${formState.visitingOrganization || 'Visit'} to ${formState.hostOrganization || 'EAII'}`
      finalState.venue = formState.visitLocations || 'EAII Headquarters'
      finalState.type = formState.visitType || ''
      finalState.date = formState.visitDate || ''
    }
    onSubmit?.(finalState)
  }

  const handleDgApprove = () => {
    onSubmit?.({ ...formState, status: 'Approved', assignedPerson, reviewComment })
  }

  const handleDgReject = () => {
    onSubmit?.({ ...formState, status: 'Rejected', assignedPerson, reviewComment: rejectReason })
    setShowRejectModal(false)
  }

  const handleSubmitOutcome = () => {
    onSubmit?.({ ...formState, ...outcomeForm, status: 'Pending Final Review' })
    setEditingOutcome(false)
  }

  const handleFinalReviewComplete = () => {
    onSubmit?.({ ...formState, status: 'Completed' })
  }

  const handleAddPartnerParticipant = () => {
    if (!partnerParticipantDraft.fullName.trim()) return

    const nextParticipant = {
      ...partnerParticipantDraft,
      id: partnerParticipantDraft.id || `pp-${Date.now()}`,
    }

    setFormState(prev => ({
      ...prev,
      partnerParticipants: [...(prev.partnerParticipants ?? []), nextParticipant],
    }))

    setPartnerParticipantDraft({
      id: '',
      fullName: '',
      organizationName: '',
      position: '',
      email: '',
      phone: '',
      type: 'Partner Representative',
    })
  }

  const handleAddEaiiParticipant = () => {
    if (!eaiiParticipantDraft.name.trim()) return

    setFormState(prev => ({
      ...prev,
      eaiiParticipants: [...(prev.eaiiParticipants ?? []), eaiiParticipantDraft],
    }))

    setEaiiParticipantDraft({ name: '', division: '', email: '' })
  }

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    setAttachmentFiles(Array.from(files))
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachmentFiles(current => current.filter((_, idx) => idx !== index))
  }

  const handleRemovePartnerParticipant = (id: string) => {
    setFormState(prev => ({
      ...prev,
      partnerParticipants: prev.partnerParticipants?.filter(item => item.id !== id) ?? [],
    }))
  }

  const handleRemoveEaiiParticipant = (email: string) => {
    setFormState(prev => ({
      ...prev,
      eaiiParticipants: prev.eaiiParticipants?.filter(item => item.email !== email) ?? [],
    }))
  }

  const renderTimeline = () => {
    const s = formState.status

    const registerStatus = s === 'Draft' ? 'Draft' : 'Completed'

    let reviewStatus = 'Draft'
    if (s === 'Pending Review') reviewStatus = 'Pending'
    else if (['Approved', 'Pending Final Review', 'Completed', 'Rejected'].includes(s))
      reviewStatus = 'Completed'
    if (s === 'Rejected') reviewStatus = 'Rejected'

    let outcomeStatus = 'Draft'
    if (s === 'Approved') outcomeStatus = 'Pending'
    else if (['Pending Final Review', 'Completed'].includes(s)) outcomeStatus = 'Completed'

    let finalStatus = 'Draft'
    if (s === 'Pending Final Review') finalStatus = 'Pending'
    else if (s === 'Completed') finalStatus = 'Completed'

    const nodes = [
      {
        title: 'Register Event / Visit',
        role: 'Officer',
        status: registerStatus,
        date: formState.date || 'Pending',
      },
      { title: 'Review & Assign', role: 'Director General', status: reviewStatus, date: 'Pending' },
      {
        title: 'Outcome Registration',
        role: 'Assigned Person',
        status: outcomeStatus,
        date: 'Pending',
      },
      { title: 'Final Review', role: 'Director General', status: finalStatus, date: 'Pending' },
    ]

    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm flex flex-col h-full overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button className="flex-1 py-3 text-sm font-semibold text-white bg-[#161A61] text-center">
            Status
          </button>
          <button className="flex-1 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 text-center">
            Feedback
          </button>
        </div>
        <div className="p-6 relative">
          <div className="absolute left-9 top-8 bottom-8 w-[2px] bg-slate-200 z-0" />
          <div className="space-y-8 relative z-10">
            {nodes.map((n, i) => {
              const isCompleted = n.status === 'Completed'
              const isPending = n.status === 'Pending'
              const dotColor = isCompleted
                ? 'border-[#ff9500] bg-[#ff9500]'
                : isPending
                  ? 'border-[#ff9500] bg-white'
                  : 'border-slate-300 bg-white'
              const dotInner = isPending ? 'bg-[#ff9500]' : 'bg-transparent'
              const badgeColor = isCompleted
                ? 'bg-[#161A61] text-white'
                : isPending
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500'

              return (
                <div key={i} className="flex gap-4">
                  <div
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${dotColor}`}
                  >
                    {isPending && <span className={`h-2.5 w-2.5 rounded-full ${dotInner}`} />}
                    {isCompleted && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                    <p className="text-sm font-bold text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span className="w-3 h-3 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      </span>
                      ({n.role})
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${badgeColor}`}
                      >
                        {n.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {n.date?.split('T')[0] || 'TBD'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderHeader = () => {
    const name =
      formState.category === 'Event'
        ? formState.title || 'New Event'
        : `${formState.visitingOrganization || 'Visitor'} Visit`

    return (
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between mb-6">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {name || 'New Registration'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {formState.date ? formState.date.replace('T', ' ') : 'Pending Date'} ·{' '}
              {formState.venue || 'Pending Venue'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {(mode === 'create' || canEditRegistration) && (
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => submitWithStatus('Draft')}
                className="rounded-lg text-sm"
              >
                Save Draft
              </Button>
              <button
                type="button"
                onClick={() => submitWithStatus('Pending Review')}
                className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
              >
                <ClipboardList className="h-4 w-4" />
                Submit
              </button>
            </>
          )}

          {canFillOutcome && !editingOutcome && (
            <button
              type="button"
              onClick={() => setEditingOutcome(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              Fill Outcomes
            </button>
          )}

          {canDgReview && (
            <>
              <button
                type="button"
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
              >
                Assign
              </button>
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </>
          )}

          {canFinalReview && (
            <button
              type="button"
              onClick={handleFinalReviewComplete}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              Complete Registration
            </button>
          )}
        </div>
      </div>
    )
  }

  const renderRejectModal = () => {
    if (!showRejectModal) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Reject Record</h2>
          <p className="text-sm text-slate-500 mb-4">
            Please provide a reason for rejection. This will be visible to the officer.
          </p>
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            className={`${textareaCls} min-h-[100px]`}
            placeholder="Reason for rejection..."
            autoFocus
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <button
              type="button"
              disabled={!rejectReason.trim()}
              onClick={handleDgReject}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
            >
              Confirm Reject
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderAssignModal = () => {
    if (!showAssignModal) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl mx-4">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Assign Officer</h2>
          <p className="text-sm text-slate-500 mb-4">
            Select a department and assign an officer to handle outcomes.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                Select Department
              </label>
              <select
                value={assignDepartment}
                onChange={e => setAssignDepartment(e.target.value)}
                className={inputCls}
              >
                <option value="">Select Department</option>
                <option value="Research & Development">Research & Development</option>
                <option value="Partnerships">Partnerships</option>
                <option value="Programs">Programs</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                Select Officer
              </label>
              <Input
                value={assignOfficer}
                onChange={e => setAssignOfficer(e.target.value)}
                placeholder="Officer name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                Assignment Notes
              </label>
              <textarea
                value={assignNotes}
                onChange={e => setAssignNotes(e.target.value)}
                className={`${textareaCls} min-h-[80px]`}
                placeholder="Any instructions for the assigned officer"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <button
              type="button"
              disabled={!assignOfficer.trim()}
              onClick={() => {
                // Apply assignment and mark as approved
                const updated: EventRecord = {
                  ...formState,
                  status: 'Approved',
                  assignedPerson: assignOfficer,
                  reviewComment: assignNotes || reviewComment,
                }
                onSubmit?.(updated)
                setShowAssignModal(false)
              }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Assign & Approve
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderOutcomeEditPanel = () => {
    if (!editingOutcome) return null
    return (
      <SectionCard
        title={formState.category === 'Event' ? 'Event Outcomes' : 'Visit Discussion & Outcomes'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {formState.category === 'Event' ? (
            <>
              <FormField label="Key Discussions">
                <textarea
                  value={outcomeForm.keyDiscussions}
                  onChange={e => setOutcomeForm(p => ({ ...p, keyDiscussions: e.target.value }))}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Key topics discussed..."
                />
              </FormField>
              <FormField label="Agreements Reached">
                <textarea
                  value={outcomeForm.agreementsReached}
                  onChange={e => setOutcomeForm(p => ({ ...p, agreementsReached: e.target.value }))}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Agreements reached..."
                />
              </FormField>
              <FormField label="Action Points">
                <textarea
                  value={outcomeForm.actionPoints}
                  onChange={e => setOutcomeForm(p => ({ ...p, actionPoints: e.target.value }))}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Next action items..."
                />
              </FormField>
              <FormField label="Objectives Achieved">
                <textarea
                  value={outcomeForm.objectivesAchieved}
                  onChange={e =>
                    setOutcomeForm(p => ({ ...p, objectivesAchieved: e.target.value }))
                  }
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="What objectives were met..."
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Recommendations">
                  <textarea
                    value={outcomeForm.recommendations}
                    onChange={e => setOutcomeForm(p => ({ ...p, recommendations: e.target.value }))}
                    className={`${textareaCls} min-h-[80px]`}
                    placeholder="Recommendations..."
                  />
                </FormField>
              </div>
            </>
          ) : (
            <>
              <FormField label="Key Topics Discussed">
                <textarea
                  value={outcomeForm.keyTopicsDiscussed}
                  onChange={e =>
                    setOutcomeForm(p => ({ ...p, keyTopicsDiscussed: e.target.value }))
                  }
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Topics discussed..."
                />
              </FormField>
              <FormField label="Opportunities Identified">
                <textarea
                  value={outcomeForm.opportunitiesIdentified}
                  onChange={e =>
                    setOutcomeForm(p => ({ ...p, opportunitiesIdentified: e.target.value }))
                  }
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Opportunities identified..."
                />
              </FormField>
              <FormField label="Agreements Reached">
                <textarea
                  value={outcomeForm.visitAgreementsReached}
                  onChange={e =>
                    setOutcomeForm(p => ({ ...p, visitAgreementsReached: e.target.value }))
                  }
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Agreements reached..."
                />
              </FormField>
              <FormField label="Follow-up Actions">
                <textarea
                  value={outcomeForm.followUpActions}
                  onChange={e => setOutcomeForm(p => ({ ...p, followUpActions: e.target.value }))}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Follow-up actions..."
                />
              </FormField>
            </>
          )}
        </div>
        <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="outline" type="button" onClick={() => setEditingOutcome(false)}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={handleSubmitOutcome}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Submit for Final Review
          </button>
        </div>
      </SectionCard>
    )
  }

  const renderDetailView = () => (
    <div className="space-y-6">
      {canDgReview && (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
          >
            Assign & Approve
          </button>
          <button
            type="button"
            onClick={() => setShowRejectModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
        </div>
      )}
      {editingOutcome && (
        <OutcomeDraftPanel
          ref={outcomePanelRef}
          category={formState.category === 'Visit' ? 'Visit' : 'Event'}
          values={outcomeForm}
          onChange={setOutcomeForm}
          onSaveDraft={() => {
            onSubmit?.({ ...formState, ...outcomeForm, hasOutcomeDraft: true })
          }}
          onSubmit={handleSubmitOutcome}
          onCancel={() => setEditingOutcome(false)}
          hasDraft={!!formState.hasOutcomeDraft}
          revisionComment={formState.reviewComment}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title={formState.category === 'Event' ? 'Event Details' : 'Visit Details'}>
          <dl>
            {formState.category === 'Event' ? (
              <>
                <InfoRow label="Event Name" value={formState.title} />
                <InfoRow label="Category" value={formState.category} />
                <InfoRow label="Event Type" value={formState.type} />
                <InfoRow label="Event Category" value={formState.eventCategory} />
                <InfoRow
                  label="Start Date & Time"
                  value={formState.date ? formState.date.replace('T', ' ') : undefined}
                />
                <InfoRow
                  label="End Date & Time"
                  value={formState.endDate ? formState.endDate.replace('T', ' ') : undefined}
                />
                <InfoRow label="Venue" value={formState.venue} />
                <InfoRow label="Organizer" value={formState.organizer} />
                <InfoRow label="Co-organizer" value={formState.coOrganizer} />
                <InfoRow label="Event Mode" value={formState.eventMode} />
              </>
            ) : (
              <>
                <InfoRow label="Visit Type" value={formState.visitType} />
                <InfoRow label="Visit Category" value={formState.visitCategory} />
                <InfoRow
                  label="Visit Start (Date & Time)"
                  value={formState.visitDate ? formState.visitDate.replace('T', ' ') : undefined}
                />
                <InfoRow
                  label="Visit End (Date & Time)"
                  value={
                    formState.visitEndDate ? formState.visitEndDate.replace('T', ' ') : undefined
                  }
                />
                <InfoRow label="Host Organization" value={formState.hostOrganization} />
                <InfoRow label="Visiting Organization" value={formState.visitingOrganization} />
                <InfoRow label="Visit Locations" value={formState.visitLocations} />
                <InfoRow label="Purpose of Visit" value={formState.purposeOfVisit} />
              </>
            )}
          </dl>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Budget">
            <dl>
              <InfoRow
                label="Estimated Budget"
                value={
                  formState.estimatedBudget !== undefined
                    ? `${formState.estimatedBudget.toLocaleString()} ETB`
                    : undefined
                }
              />
              <InfoRow
                label="Actual Budget"
                value={
                  formState.actualBudget !== undefined
                    ? `${formState.actualBudget.toLocaleString()} ETB`
                    : undefined
                }
              />
              <InfoRow
                label="Funding Score"
                value={formState.fundingScore ? `⭐ ${formState.fundingScore}/5` : undefined}
              />
            </dl>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Participant Summary">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                EAII Participants
              </p>
              <div className="space-y-3">
                {formState.eaiiParticipants?.length ? (
                  formState.eaiiParticipants.map(participant => (
                    <div
                      key={participant.email}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="font-semibold text-slate-900">{participant.name}</p>
                      <p className="text-sm text-slate-500">{participant.division}</p>
                      <p className="text-xs text-slate-400">{participant.email}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No EAII participants added yet.</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                Partner Participants
              </p>
              <div className="space-y-3">
                {formState.partnerParticipants?.length ? (
                  formState.partnerParticipants.map(participant => (
                    <div
                      key={participant.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="font-semibold text-slate-900">{participant.fullName}</p>
                      <p className="text-sm text-slate-500">{participant.organizationName}</p>
                      <p className="text-xs text-slate-400">{participant.email}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No partner participants added yet.</p>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Attachments">
          {attachmentFiles.length > 0 ? (
            <div className="space-y-3">
              {attachmentFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <span className="text-lg font-semibold">DOC</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(1)} Mb
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    Uploaded
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No attachments uploaded yet.</p>
          )}
        </SectionCard>
      </div>

      {['Pending Final Review', 'Completed'].includes(formState.status) && (
        <SectionCard
          title={formState.category === 'Event' ? 'Event Outcomes' : 'Discussion & Outcomes'}
        >
          <div className="grid gap-5 md:grid-cols-2 text-sm">
            {formState.category === 'Event'
              ? [
                  { label: 'Key Discussions', value: formState.keyDiscussions },
                  { label: 'Agreements Reached', value: formState.agreementsReached },
                  { label: 'Action Points', value: formState.actionPoints },
                  { label: 'Objectives Achieved', value: formState.objectivesAchieved },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                      {label}
                    </p>
                    <p className="text-slate-600 leading-relaxed">{value || '—'}</p>
                  </div>
                ))
              : [
                  { label: 'Key Topics Discussed', value: formState.keyTopicsDiscussed },
                  { label: 'Opportunities Identified', value: formState.opportunitiesIdentified },
                  { label: 'Agreements Reached', value: formState.visitAgreementsReached },
                  { label: 'Follow-up Actions', value: formState.followUpActions },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                      {label}
                    </p>
                    <p className="text-slate-600 leading-relaxed">{value || '—'}</p>
                  </div>
                ))}
          </div>
        </SectionCard>
      )}
    </div>
  )

  const renderRegistrationForm = () => (
    <div className="space-y-8 bg-white p-6 rounded-[1.5rem] border border-slate-200">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="Category">
          <select
            value={formState.category ?? 'Event'}
            onChange={e => setFormState(prev => ({ ...prev, category: e.target.value as any }))}
            className={inputCls}
          >
            <option value="Event">Event</option>
            <option value="Visit">Visit</option>
          </select>
        </FormField>
      </div>

      {formState.category === 'Event' ? (
        <>
          <SectionCard title="Event Details">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <FormField label="Event Name">
                <Input
                  value={formState.title}
                  onChange={e => setFormState(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event name"
                  required
                />
              </FormField>
              <FormField label="Event Type">
                <select
                  value={formState.type}
                  onChange={e => setFormState(prev => ({ ...prev, type: e.target.value }))}
                  className={inputCls}
                  required
                >
                  <option value="">Select type</option>
                  {eventTypes.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Event Category">
                <select
                  value={formState.eventCategory || ''}
                  onChange={e =>
                    setFormState(prev => ({ ...prev, eventCategory: e.target.value as any }))
                  }
                  className={inputCls}
                >
                  <option value="">Select category</option>
                  <option value="Internal">Internal</option>
                  <option value="Joint">Joint</option>
                </select>
              </FormField>
              <FormField label="Event Mode">
                <select
                  value={formState.eventMode || ''}
                  onChange={e =>
                    setFormState(prev => ({ ...prev, eventMode: e.target.value as any }))
                  }
                  className={inputCls}
                >
                  <option value="">Select mode</option>
                  <option value="Physically">Physically</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </FormField>
              <FormField label="Start Date & Time">
                <Input
                  type="datetime-local"
                  value={formState.date || ''}
                  onChange={e => setFormState(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="End Date & Time">
                <Input
                  type="datetime-local"
                  value={formState.endDate || ''}
                  onChange={e => setFormState(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Venue">
                <Input
                  value={formState.venue}
                  onChange={e => setFormState(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="Event venue"
                  required
                />
              </FormField>
            </div>
          </SectionCard>
        </>
      ) : (
        <>
          <SectionCard title="Visit Details">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <FormField label="Visit Type">
                <select
                  value={formState.visitType || ''}
                  onChange={e =>
                    setFormState(prev => ({ ...prev, visitType: e.target.value as any }))
                  }
                  className={inputCls}
                  required
                >
                  <option value="">Select type</option>
                  {visitTypes.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Visit Category">
                <select
                  value={formState.visitCategory || ''}
                  onChange={e =>
                    setFormState(prev => ({ ...prev, visitCategory: e.target.value as any }))
                  }
                  className={inputCls}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Internal">Internal</option>
                  <option value="external">External</option>
                  <option value="international">International</option>
                </select>
              </FormField>
              <FormField label="Visit Start (Date & Time)">
                <Input
                  type="datetime-local"
                  value={formState.visitDate || ''}
                  onChange={e => setFormState(prev => ({ ...prev, visitDate: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Visit End (Date & Time)">
                <Input
                  type="datetime-local"
                  value={formState.visitEndDate || ''}
                  onChange={e => setFormState(prev => ({ ...prev, visitEndDate: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Host Organization">
                <Input
                  value={formState.hostOrganization || ''}
                  onChange={e =>
                    setFormState(prev => ({ ...prev, hostOrganization: e.target.value }))
                  }
                  placeholder="e.g. EAII"
                  required
                />
              </FormField>
              <FormField label="Visiting Organization">
                <Input
                  value={formState.visitingOrganization || ''}
                  onChange={e =>
                    setFormState(prev => ({ ...prev, visitingOrganization: e.target.value }))
                  }
                  placeholder="Visiting entity name"
                  required
                />
              </FormField>
              <FormField label="Visit Locations">
                <Input
                  value={formState.visitLocations || ''}
                  onChange={e =>
                    setFormState(prev => ({ ...prev, visitLocations: e.target.value }))
                  }
                  placeholder="Labs/Divisions"
                />
              </FormField>
            </div>
          </SectionCard>
        </>
      )}

      <SectionCard title="Partner Participants">
        <div className="grid gap-4 lg:grid-cols-3">
          <FormField label="Participant ID">
            <Input
              value={partnerParticipantDraft.id}
              onChange={e => setPartnerParticipantDraft(prev => ({ ...prev, id: e.target.value }))}
              placeholder="Enter Participant ID"
            />
          </FormField>
          <FormField label="Full Name">
            <Input
              value={partnerParticipantDraft.fullName}
              onChange={e =>
                setPartnerParticipantDraft(prev => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="Enter Full name"
            />
          </FormField>
          <FormField label="Organization Name">
            <Input
              value={partnerParticipantDraft.organizationName}
              onChange={e =>
                setPartnerParticipantDraft(prev => ({
                  ...prev,
                  organizationName: e.target.value,
                }))
              }
              placeholder="Enter Organization name"
            />
          </FormField>
          <FormField label="Position">
            <Input
              value={partnerParticipantDraft.position}
              onChange={e =>
                setPartnerParticipantDraft(prev => ({ ...prev, position: e.target.value }))
              }
              placeholder="Enter position"
            />
          </FormField>
          <FormField label="Email">
            <Input
              type="email"
              value={partnerParticipantDraft.email}
              onChange={e =>
                setPartnerParticipantDraft(prev => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter email"
            />
          </FormField>
          <FormField label="Phone number">
            <Input
              value={partnerParticipantDraft.phone}
              onChange={e =>
                setPartnerParticipantDraft(prev => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Enter phone number"
            />
          </FormField>
          <FormField label="Participant Type">
            <select
              value={partnerParticipantDraft.type}
              onChange={e =>
                setPartnerParticipantDraft(prev => ({ ...prev, type: e.target.value as any }))
              }
              className={inputCls}
            >
              <option value="Partner Representative">Partner Representative</option>
              <option value="Speaker">Speaker</option>
              <option value="VIP Guest">VIP Guest</option>
              <option value="Guest">Guest</option>
            </select>
          </FormField>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="button" onClick={handleAddPartnerParticipant}>
            Add Participant
          </Button>
        </div>

        {formState.partnerParticipants?.length ? (
          <div className="mt-6 space-y-3">
            {formState.partnerParticipants.map(participant => (
              <div
                key={participant.id}
                className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{participant.fullName}</p>
                  <p className="text-sm text-slate-500">{participant.organizationName}</p>
                  <p className="text-xs text-slate-400">{participant.type}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-600">{participant.email}</span>
                  <span className="text-sm text-slate-600">{participant.phone}</span>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleRemovePartnerParticipant(participant.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="EAII Participants">
        <div className="grid gap-4 lg:grid-cols-3">
          <FormField label="Name">
            <Input
              value={eaiiParticipantDraft.name}
              onChange={e => setEaiiParticipantDraft(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name"
            />
          </FormField>
          <FormField label="Division">
            <Input
              value={eaiiParticipantDraft.division}
              onChange={e =>
                setEaiiParticipantDraft(prev => ({ ...prev, division: e.target.value }))
              }
              placeholder="Enter division"
            />
          </FormField>
          <FormField label="Email">
            <Input
              type="email"
              value={eaiiParticipantDraft.email}
              onChange={e => setEaiiParticipantDraft(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email"
            />
          </FormField>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="button" onClick={handleAddEaiiParticipant}>
            Add Participant
          </Button>
        </div>

        {formState.eaiiParticipants?.length ? (
          <div className="mt-6 space-y-3">
            {formState.eaiiParticipants.map(participant => (
              <div
                key={participant.email}
                className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{participant.name}</p>
                  <p className="text-sm text-slate-500">{participant.division}</p>
                  <p className="text-xs text-slate-400">EAII Participant</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-600">{participant.email}</span>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleRemoveEaiiParticipant(participant.email!)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="Budget">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <FormField label="Estimated Budget (ETB)">
            <Input
              type="number"
              value={formState.estimatedBudget ?? ''}
              onChange={e =>
                setFormState(prev => ({
                  ...prev,
                  estimatedBudget: Number(e.target.value) || undefined,
                }))
              }
              placeholder="Enter estimated budget"
            />
          </FormField>
          <FormField label="Actual Budget (ETB)">
            <Input
              type="number"
              value={formState.actualBudget ?? ''}
              onChange={e =>
                setFormState(prev => ({
                  ...prev,
                  actualBudget: Number(e.target.value) || undefined,
                }))
              }
              placeholder="Enter actual budget"
            />
          </FormField>
          <FormField label="Funding Score">
            <Input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formState.fundingScore ?? ''}
              onChange={e =>
                setFormState(prev => ({
                  ...prev,
                  fundingScore: Number(e.target.value) || undefined,
                }))
              }
              placeholder="e.g. 4.2"
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Attachments">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm font-semibold text-slate-900">Upload Files</p>
          <p className="mt-2 text-sm text-slate-500">select your file or drag and drop</p>
          <p className="text-sm text-slate-500">png, pdf, jpg, docx accepted</p>
          <label className="mt-4 inline-flex cursor-pointer items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#161A61] shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
            browse
            <input type="file" multiple onChange={handleAttachmentChange} className="sr-only" />
          </label>
        </div>

        {attachmentFiles.length > 0 && (
          <div className="mt-4 space-y-3">
            {attachmentFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <span className="text-lg font-semibold">DOC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(1)} Mb
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )

  return (
    <>
      {renderRejectModal()}
      {renderAssignModal()}

      <div className="mb-6">{renderHeader()}</div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-4">
        <div className="xl:col-span-3 space-y-6">
          {mode === 'create' || mode === 'edit' ? (
            <form onSubmit={e => e.preventDefault()}>{renderRegistrationForm()}</form>
          ) : (
            renderDetailView()
          )}
        </div>

        <div className="xl:col-span-1">{renderTimeline()}</div>
      </div>
    </>
  )
}
