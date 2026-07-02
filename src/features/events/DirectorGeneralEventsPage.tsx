import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  UserCheck,
  CalendarDays,
  MapPin,
  Tag,
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
      { label: 'Pending Review', value: 'Pending Review' },
      { label: 'Pending Final Review', value: 'Pending Final Review' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Completed', value: 'Completed' },
    ],
  },
]

const STAFF_LIST = [
  { id: 'usr-hiwot', name: 'Hiwot Girma', department: 'Natural Language Processing' },
  { id: 'usr-tigist', name: 'Tigist Alemu', department: 'Strategic Partnerships' },
  { id: 'usr-belay', name: 'Belay Tadesse', department: 'International Relations' },
  { id: 'usr-dawit', name: 'Dawit Haile', department: 'AI Research' },
  { id: 'usr-selam', name: 'Selam Worku', department: 'Public Relations' },
  { id: 'usr-aster', name: 'Aster Tolossa', department: 'Programs' },
]

const inputCls =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-all focus:border-[#161A61] focus:bg-white focus:ring-2 focus:ring-[#161A61]/10'
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

function AuditTimeline({ trail }: { trail: AuditTrailEntry[] }) {
  const statusColors: Record<string, string> = {
    Submitted: 'bg-blue-500',
    Approved: 'bg-green-500',
    Rejected: 'bg-red-500',
    Assigned: 'bg-purple-500',
    'Outcome Submitted': 'bg-amber-500',
    Completed: 'bg-emerald-600',
    'Sent Back for Revision': 'bg-orange-500',
  }
  return (
    <div className="space-y-4">
      {trail.map((entry, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={`h-3 w-3 rounded-full mt-1.5 ${statusColors[entry.actionLabel] ?? 'bg-slate-400'}`}
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

export function DirectorGeneralEventsPage() {
  const [records, setRecords] = useState<EventRecord[]>(eventsStore.getAll())
  const [selected, setSelected] = useState<EventRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  // Assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignPersonId, setAssignPersonId] = useState('')
  const [assignNotes, setAssignNotes] = useState('')
  const [assignDueDate, setAssignDueDate] = useState('')

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  // Final complete modal state
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  useEffect(() => {
    return eventsStore.subscribe(() => setRecords(eventsStore.getAll()))
  }, [])

  // DG sees all records that have been submitted (not Draft)
  const queue = useMemo(() => {
    return records.filter(item => {
      if (item.status === 'Draft') return false
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.category && (item.category ?? 'Event') !== activeFilters.category)
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [records, searchQuery, activeFilters])

  const updateAndSync = (updated: EventRecord) => {
    eventsStore.update(updated)
    setSelected(updated)
  }

  const handleConfirmApproveAssign = () => {
    if (!selected || !assignPersonId) return
    const staff = STAFF_LIST.find(s => s.id === assignPersonId)
    const updated: EventRecord = {
      ...selected,
      status: 'Approved',
      assignedPerson: staff?.name ?? assignPersonId,
      assignedPersonId: assignPersonId,
      outcomeDueDate: assignDueDate || undefined,
      reviewComment: assignNotes || undefined,
      auditTrail: [
        ...(selected.auditTrail ?? []),
        {
          actorName: 'Dir. General Abebe',
          actorRole: 'Director General',
          actionLabel: 'Approved' as const,
          previousStatus: 'Pending Review' as const,
          newStatus: 'Approved' as const,
          timestamp: new Date().toISOString(),
          comment: assignNotes || undefined,
        },
      ],
    }
    updateAndSync(updated)
    toast.success('Approved & assigned', { description: `Assigned to ${staff?.name}` })
    setShowAssignModal(false)
    setAssignPersonId('')
    setAssignNotes('')
    setAssignDueDate('')
  }

  const handleConfirmReject = () => {
    if (!selected || !rejectReason.trim()) return
    const updated: EventRecord = {
      ...selected,
      status: 'Rejected',
      rejectionReason: rejectReason,
      auditTrail: [
        ...(selected.auditTrail ?? []),
        {
          actorName: 'Dir. General Abebe',
          actorRole: 'Director General',
          actionLabel: 'Rejected' as const,
          previousStatus: 'Pending Review' as const,
          newStatus: 'Rejected' as const,
          timestamp: new Date().toISOString(),
          comment: rejectReason,
        },
      ],
    }
    updateAndSync(updated)
    toast.error('Record rejected', { description: selected.title })
    setShowRejectModal(false)
    setRejectReason('')
  }

  const handleConfirmComplete = () => {
    if (!selected) return
    const updated: EventRecord = {
      ...selected,
      status: 'Completed',
      auditTrail: [
        ...(selected.auditTrail ?? []),
        {
          actorName: 'Dir. General Abebe',
          actorRole: 'Director General',
          actionLabel: 'Completed' as const,
          previousStatus: 'Pending Final Review' as const,
          newStatus: 'Completed' as const,
          timestamp: new Date().toISOString(),
        },
      ],
    }
    updateAndSync(updated)
    toast.success('Record completed', { description: selected.title })
    setShowCompleteModal(false)
  }

  const renderDetailView = () => {
    if (!selected) return null
    const isPendingReview = selected.status === 'Pending Review'
    const isPendingFinal = selected.status === 'Pending Final Review'

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
            {isPendingReview && (
              <>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  <UserCheck className="h-4 w-4" />
                  Approve & Assign
                </button>
                <button
                  onClick={() => {
                    setRejectReason('')
                    setShowRejectModal(true)
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </>
            )}
            {isPendingFinal && (
              <button
                onClick={() => setShowCompleteModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#161A61] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f124a] transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Completed
              </button>
            )}
          </div>
        </div>

        {/* Summary grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: event/visit details */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard title="Basic Information">
              <dl className="divide-y divide-slate-50">
                <InfoRow label="Category" value={selected.category} />
                <InfoRow label="Type" value={selected.type} />
                <InfoRow
                  label="Date"
                  value={
                    selected.category === 'Visit'
                      ? selected.visitDate
                      : selected.date?.split('T')[0]
                  }
                />
                <InfoRow label="Venue / Location" value={selected.venue} />
                {selected.category === 'Event' && (
                  <>
                    <InfoRow label="Organizer" value={selected.organizer} />
                    <InfoRow label="Co-Organizer" value={selected.coOrganizer} />
                    <InfoRow label="Mode" value={selected.eventMode} />
                    <InfoRow label="Event Category" value={selected.eventCategory} />
                    <InfoRow
                      label="Estimated Budget (ETB)"
                      value={selected.estimatedBudget?.toLocaleString()}
                    />
                  </>
                )}
                {selected.category === 'Visit' && (
                  <>
                    <InfoRow label="Visit Type" value={selected.visitType} />
                    <InfoRow label="Host Organization" value={selected.hostOrganization} />
                    <InfoRow label="Visiting Organization" value={selected.visitingOrganization} />
                    <InfoRow label="Locations" value={selected.visitLocations} />
                    <InfoRow label="Purpose" value={selected.purposeOfVisit} />
                    <InfoRow label="Focal Person" value={selected.focalPersonName} />
                    <InfoRow label="Division" value={selected.focalPersonDivision} />
                  </>
                )}
              </dl>
            </SectionCard>

            {/* Outcomes (if already submitted by Assigned Person) */}
            {(selected.status === 'Pending Final Review' || selected.status === 'Completed') && (
              <SectionCard
                title={selected.category === 'Visit' ? 'Visit Outcome' : 'Event Outcome'}
              >
                {selected.category === 'Event' ? (
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

            {/* Rejection reason */}
            {selected.status === 'Rejected' && selected.rejectionReason && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-semibold text-red-700 mb-2">Rejection Reason</p>
                <p className="text-sm text-red-600">{selected.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Right: assignment info + audit trail */}
          <div className="space-y-6">
            {/* Assignment info */}
            {selected.assignedPerson && (
              <SectionCard title="Assignment">
                <dl className="divide-y divide-slate-50">
                  <InfoRow label="Assigned To" value={selected.assignedPerson} />
                  <InfoRow label="Due Date" value={selected.outcomeDueDate} />
                  <InfoRow label="Notes" value={selected.reviewComment} />
                </dl>
              </SectionCard>
            )}

            {/* Audit Trail */}
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
          title="Events & Visits — Director General"
          subtitle="Review submitted records, approve & assign outcomes, or reject with feedback"
        />
      )}

      <PageToolbar
        searchPlaceholder="Search events & visits..."
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        showSearchAndFilters={!selected}
      />

      {selected ? (
        renderDetailView()
      ) : (
        <DataTable
          items={queue}
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
                  onClick={() => setSelected(item)}
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
                  onClick={() => setSelected(item)}
                  className="rounded-lg border border-[#161A61] px-3 py-1.5 text-xs font-semibold text-[#161A61] hover:bg-[#161A61] hover:text-white transition-colors"
                >
                  Review
                </button>
              ),
              headClassName: 'bg-[#0b265a] text-white text-center',
              cellClassName: 'text-center',
            },
          ]}
        />
      )}

      {/* Approve & Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Approve & Assign</h2>
            <p className="text-sm text-slate-500 mb-6">
              Select a staff member to fill in the outcomes for this{' '}
              {selected?.category?.toLowerCase() || 'record'}.
            </p>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Assign To <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignPersonId}
                  onChange={e => setAssignPersonId(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select staff member...</option>
                  {STAFF_LIST.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Outcome Due Date
                </label>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={e => setAssignDueDate(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes / Instructions
                </label>
                <textarea
                  value={assignNotes}
                  onChange={e => setAssignNotes(e.target.value)}
                  className={`${textareaCls} min-h-[80px]`}
                  placeholder="Any specific instructions for the assigned person..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
              <button
                type="button"
                disabled={!assignPersonId}
                onClick={handleConfirmApproveAssign}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-40 transition-colors"
              >
                <UserCheck className="h-4 w-4" />
                Approve & Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Reject Record</h2>
            <p className="text-sm text-slate-500 mb-4">
              Provide a reason for rejection. This will be visible to the officer who submitted the
              record.
            </p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className={`${textareaCls} min-h-[100px]`}
              placeholder="Reason for rejection..."
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <button
                type="button"
                disabled={!rejectReason.trim()}
                onClick={handleConfirmReject}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Mark as Completed</h2>
            <p className="text-sm text-slate-500 mb-6">
              Confirm that you have reviewed the submitted outcomes and are marking this record as
              completed. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setShowCompleteModal(false)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="flex items-center gap-1.5 rounded-lg bg-[#161A61] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0f124a] transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Completed
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
        title="Filter Events & Visits"
      />
    </div>
  )
}
