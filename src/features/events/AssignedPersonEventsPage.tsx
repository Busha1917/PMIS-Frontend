import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ClipboardList,
  CalendarDays,
  MapPin,
  Tag,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { AuditTrailEntry, EventRecord } from '../../types'
import { eventsStore } from './eventsStore'
import { Button } from '../../ui'

const FILTER_FIELDS = [
  {
    key: 'category',
    label: 'Category',
    type: 'select' as const,
    options: [
      { label: 'Event', value: 'Event' },
      { label: 'Visit', value: 'Visit' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Approved', value: 'Approved' },
      { label: 'Pending Final Review', value: 'Pending Final Review' },
      { label: 'Completed', value: 'Completed' },
    ],
  },
]

const textareaCls =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#161A61] focus:bg-white focus:ring-2 focus:ring-[#161A61]/10 resize-none'

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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-900">{title}</p>
        <span className="block h-1.5 w-12 rounded-full bg-[#ff9500]" />
      </div>
      {children}
    </div>
  )
}

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

function AuditTimeline({ trail }: { trail: AuditTrailEntry[] }) {
  const dotColors: Record<string, string> = {
    Submitted: 'bg-blue-500',
    Approved: 'bg-green-500',
    Rejected: 'bg-red-500',
    Assigned: 'bg-purple-500',
    'Outcome Submitted': 'bg-amber-500',
    Completed: 'bg-emerald-600',
  }
  return (
    <div className="space-y-4">
      {trail.map((entry, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={`h-3 w-3 rounded-full mt-1.5 ${dotColors[entry.actionLabel] ?? 'bg-slate-400'}`}
            />
            {i < trail.length - 1 && <span className="flex-1 w-px bg-slate-200 mt-1" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-semibold text-slate-800">
              {entry.actionLabel}{' '}
              <span className="font-normal text-slate-500">by {entry.actorName}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(entry.timestamp).toLocaleString()} · {entry.actorRole}
            </p>
            {entry.comment && (
              <p className="mt-1.5 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                {entry.comment}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// For demo: the currently logged-in "assigned person"
const CURRENT_ASSIGNED_PERSON_IDS = [
  'usr-hiwot',
  'usr-tigist',
  'usr-belay',
  'usr-dawit',
  'usr-selam',
  'usr-aster',
]

type OutcomeForm = {
  // Event outcomes
  keyDiscussions: string
  agreementsReached: string
  actionPoints: string
  objectivesAchieved: string
  recommendations: string
  // Visit outcomes
  keyTopicsDiscussed: string
  visitAgreementsReached: string
  followUpActions: string
  opportunitiesIdentified: string
}

export function AssignedPersonEventsPage() {
  const [records, setRecords] = useState<EventRecord[]>(eventsStore.getAll())
  const [selected, setSelected] = useState<EventRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [editingOutcome, setEditingOutcome] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [outcomeForm, setOutcomeForm] = useState<OutcomeForm>({
    keyDiscussions: '',
    agreementsReached: '',
    actionPoints: '',
    objectivesAchieved: '',
    recommendations: '',
    keyTopicsDiscussed: '',
    visitAgreementsReached: '',
    followUpActions: '',
    opportunitiesIdentified: '',
  })

  useEffect(() => {
    return eventsStore.subscribe(() => setRecords(eventsStore.getAll()))
  }, [])

  // Assigned person sees only records assigned to them (Approved + Pending Final Review + Completed)
  const myRecords = useMemo(() => {
    return records.filter(item => {
      if (!['Approved', 'Pending Final Review', 'Completed'].includes(item.status)) return false
      // In a real app, filter by current user id; here show all assigned records for demo
      if (item.assignedPersonId && !CURRENT_ASSIGNED_PERSON_IDS.includes(item.assignedPersonId))
        return false
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.category && (item.category ?? 'Event') !== activeFilters.category)
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [records, searchQuery, activeFilters])

  const handleOpen = (item: EventRecord) => {
    setSelected(item)
    setEditingOutcome(false)
    setOutcomeForm({
      keyDiscussions: item.keyDiscussions || '',
      agreementsReached: item.agreementsReached || '',
      actionPoints: item.actionPoints || '',
      objectivesAchieved: item.objectivesAchieved || '',
      recommendations: item.recommendations || '',
      keyTopicsDiscussed: item.keyTopicsDiscussed || '',
      visitAgreementsReached: item.visitAgreementsReached || '',
      followUpActions: item.followUpActions || '',
      opportunitiesIdentified: item.opportunitiesIdentified || '',
    })
  }

  const handleSubmitOutcome = () => {
    if (!selected) return
    const updated: EventRecord = {
      ...selected,
      ...outcomeForm,
      status: 'Pending Final Review',
      auditTrail: [
        ...(selected.auditTrail ?? []),
        {
          actorName: selected.assignedPerson || 'Assigned Person',
          actorRole: 'Assigned Person',
          actionLabel: 'Outcome Submitted' as const,
          previousStatus: 'Approved' as const,
          newStatus: 'Pending Final Review' as const,
          timestamp: new Date().toISOString(),
        },
      ],
    }
    eventsStore.update(updated)
    setSelected(updated)
    setEditingOutcome(false)
    setShowSubmitModal(false)
    toast.success('Outcome submitted for Director General review', { description: selected.title })
  }

  const renderOutcomeEditForm = () => {
    if (!selected) return null
    const isEvent = selected.category === 'Event'
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingOutcome(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Fill {isEvent ? 'Event' : 'Visit'} Outcomes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{selected.title}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setEditingOutcome(false)}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
              Submit Outcomes
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-900 mb-6">
            {isEvent ? 'Event Outcome Details' : 'Visit Discussion Summary'}
          </p>

          {isEvent ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField label="Key Discussions" required>
                  <textarea
                    value={outcomeForm.keyDiscussions}
                    onChange={e => setOutcomeForm(p => ({ ...p, keyDiscussions: e.target.value }))}
                    className={`${textareaCls} min-h-[90px]`}
                    placeholder="Summarize the main topics and discussions..."
                  />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Agreements Reached">
                  <textarea
                    value={outcomeForm.agreementsReached}
                    onChange={e =>
                      setOutcomeForm(p => ({ ...p, agreementsReached: e.target.value }))
                    }
                    className={`${textareaCls} min-h-[80px]`}
                    placeholder="List any agreements or commitments made..."
                  />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Action Points">
                  <textarea
                    value={outcomeForm.actionPoints}
                    onChange={e => setOutcomeForm(p => ({ ...p, actionPoints: e.target.value }))}
                    className={`${textareaCls} min-h-[80px]`}
                    placeholder="List specific action items with owners and deadlines..."
                  />
                </FormField>
              </div>
              <FormField label="Objectives Achieved">
                <textarea
                  value={outcomeForm.objectivesAchieved}
                  onChange={e =>
                    setOutcomeForm(p => ({ ...p, objectivesAchieved: e.target.value }))
                  }
                  className={`${textareaCls} min-h-[80px]`}
                  placeholder="Which event objectives were met?"
                />
              </FormField>
              <FormField label="Recommendations">
                <textarea
                  value={outcomeForm.recommendations}
                  onChange={e => setOutcomeForm(p => ({ ...p, recommendations: e.target.value }))}
                  className={`${textareaCls} min-h-[80px]`}
                  placeholder="Recommendations for future events or follow-up..."
                />
              </FormField>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField label="Key Topics Discussed" required>
                  <textarea
                    value={outcomeForm.keyTopicsDiscussed}
                    onChange={e =>
                      setOutcomeForm(p => ({ ...p, keyTopicsDiscussed: e.target.value }))
                    }
                    className={`${textareaCls} min-h-[90px]`}
                    placeholder="What were the main topics discussed during the visit?"
                  />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Opportunities Identified">
                  <textarea
                    value={outcomeForm.opportunitiesIdentified}
                    onChange={e =>
                      setOutcomeForm(p => ({ ...p, opportunitiesIdentified: e.target.value }))
                    }
                    className={`${textareaCls} min-h-[80px]`}
                    placeholder="Partnership, collaboration, or funding opportunities identified..."
                  />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Agreements Reached">
                  <textarea
                    value={outcomeForm.visitAgreementsReached}
                    onChange={e =>
                      setOutcomeForm(p => ({ ...p, visitAgreementsReached: e.target.value }))
                    }
                    className={`${textareaCls} min-h-[80px]`}
                    placeholder="Any agreements, MOUs, or commitments made..."
                  />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Follow-Up Actions">
                  <textarea
                    value={outcomeForm.followUpActions}
                    onChange={e => setOutcomeForm(p => ({ ...p, followUpActions: e.target.value }))}
                    className={`${textareaCls} min-h-[80px]`}
                    placeholder="Next steps, follow-up meetings, deliverables..."
                  />
                </FormField>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderDetailView = () => {
    if (!selected) return null
    if (editingOutcome) return renderOutcomeEditForm()

    const isEvent = selected.category === 'Event'
    const canFillOutcome = selected.status === 'Approved'
    const alreadySubmitted =
      selected.status === 'Pending Final Review' || selected.status === 'Completed'

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{selected.title}</h1>
              <p className="text-xs text-slate-400 mt-1">
                {selected.date?.split('T')[0] || 'TBD'} · {selected.venue || 'TBD'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <StatusBadge status={selected.status} />
            {canFillOutcome && (
              <button
                type="button"
                onClick={() => setEditingOutcome(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
              >
                <ClipboardList className="h-4 w-4" />
                Fill Outcomes
              </button>
            )}
            {alreadySubmitted && (
              <span className="flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-sm font-semibold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Outcomes Submitted
              </span>
            )}
          </div>
        </div>

        {/* DG Notes */}
        {selected.reviewComment && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-1">
              Director General Notes
            </p>
            <p className="text-sm text-blue-800">{selected.reviewComment}</p>
            {selected.outcomeDueDate && (
              <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due by {selected.outcomeDueDate}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard title="Record Details">
              <dl className="divide-y divide-slate-50">
                <InfoRow label="Category" value={selected.category} />
                <InfoRow label="Type" value={selected.type} />
                {isEvent ? (
                  <>
                    <InfoRow label="Date" value={selected.date?.split('T')[0]} />
                    <InfoRow label="Venue" value={selected.venue} />
                    <InfoRow label="Organizer" value={selected.organizer} />
                    <InfoRow label="Co-Organizer" value={selected.coOrganizer} />
                    <InfoRow label="Mode" value={selected.eventMode} />
                    <InfoRow label="Event Category" value={selected.eventCategory} />
                    <InfoRow
                      label="Estimated Budget (ETB)"
                      value={selected.estimatedBudget?.toLocaleString()}
                    />
                  </>
                ) : (
                  <>
                    <InfoRow label="Visit Date" value={selected.visitDate} />
                    <InfoRow label="Host Organization" value={selected.hostOrganization} />
                    <InfoRow label="Visiting Organization" value={selected.visitingOrganization} />
                    <InfoRow label="Locations" value={selected.visitLocations} />
                    <InfoRow label="Purpose" value={selected.purposeOfVisit} />
                    <InfoRow label="Focal Person" value={selected.focalPersonName} />
                  </>
                )}
              </dl>
            </SectionCard>

            {/* Read-only outcomes once submitted */}
            {alreadySubmitted && (
              <SectionCard title={isEvent ? 'Event Outcomes' : 'Visit Discussion Summary'}>
                {isEvent ? (
                  <dl className="divide-y divide-slate-50">
                    <InfoRow label="Key Discussions" value={selected.keyDiscussions} />
                    <InfoRow label="Agreements Reached" value={selected.agreementsReached} />
                    <InfoRow label="Action Points" value={selected.actionPoints} />
                    <InfoRow label="Objectives Achieved" value={selected.objectivesAchieved} />
                    <InfoRow label="Recommendations" value={selected.recommendations} />
                  </dl>
                ) : (
                  <dl className="divide-y divide-slate-50">
                    <InfoRow label="Key Topics Discussed" value={selected.keyTopicsDiscussed} />
                    <InfoRow
                      label="Opportunities Identified"
                      value={selected.opportunitiesIdentified}
                    />
                    <InfoRow label="Agreements Reached" value={selected.visitAgreementsReached} />
                    <InfoRow label="Follow-Up Actions" value={selected.followUpActions} />
                  </dl>
                )}
              </SectionCard>
            )}
          </div>

          <div className="space-y-6">
            <SectionCard title="My Assignment">
              <dl className="divide-y divide-slate-50">
                <InfoRow label="Assigned To" value={selected.assignedPerson} />
                <InfoRow label="Due Date" value={selected.outcomeDueDate} />
              </dl>
            </SectionCard>

            {selected.auditTrail && selected.auditTrail.length > 0 && (
              <SectionCard title="Activity Log">
                <AuditTimeline trail={selected.auditTrail} />
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!selected && (
        <PageHeaderCard
          title="Events & Visits — Assigned Person"
          subtitle="View records assigned to you and fill in the event or visit outcomes"
        />
      )}

      <PageToolbar
        searchPlaceholder="Search assigned records..."
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        showSearchAndFilters={!selected}
      />

      {selected ? (
        renderDetailView()
      ) : (
        <DataTable
          items={myRecords}
          rowKey={item => item.id}
          emptyVariant="events"
          columns={[
            {
              label: 'No.',
              render: (_item, index) => (
                <span className="font-semibold text-slate-900">{index}</span>
              ),
              headClassName: 'bg-[#0b265a] text-white text-center',
            },
            {
              label: 'Name / Title',
              render: (item: EventRecord) => (
                <button
                  onClick={() => handleOpen(item)}
                  className="text-left font-medium text-[#161A61] hover:underline"
                >
                  {item.title}
                </button>
              ),
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Category',
              render: (item: EventRecord) => (
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3 w-3 text-slate-400" />
                  {item.category || 'Event'}
                </span>
              ),
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Date',
              render: (item: EventRecord) => (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3 w-3 text-slate-400" />
                  {item.date?.split('T')[0] || '—'}
                </span>
              ),
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Due Date',
              render: (item: EventRecord) =>
                item.outcomeDueDate ? (
                  <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                    <Clock className="h-3 w-3" />
                    {item.outcomeDueDate}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                ),
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Venue',
              render: (item: EventRecord) => (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {item.venue}
                </span>
              ),
              headClassName: 'bg-[#0b265a] text-white',
            },
            {
              label: 'Status',
              render: (item: EventRecord) => <StatusBadge status={item.status} />,
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
            {
              label: 'Action',
              render: (item: EventRecord) => (
                <button
                  onClick={() => handleOpen(item)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    item.status === 'Approved'
                      ? 'border-[#ff9500] text-[#ff9500] hover:bg-[#ff9500] hover:text-white'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.status === 'Approved' ? 'Fill Outcomes' : 'View'}
                </button>
              ),
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
          ]}
        />
      )}

      {/* Submit Outcome Confirmation */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Submit Outcomes</h2>
            <p className="text-sm text-slate-500 mb-6">
              Once submitted, the outcomes will be sent to the Director General for final review.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setShowSubmitModal(false)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleSubmitOutcome}
                className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
              >
                <ClipboardList className="h-4 w-4" />
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}

      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setActiveFilters}
        fields={FILTER_FIELDS}
        title="Filter My Assignments"
      />
    </div>
  )
}
