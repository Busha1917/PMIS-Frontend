import { useState } from 'react'
import {
  ArrowLeft,
  AlertCircle,
  Check,
  Users,
  FileText,
  DollarSign,
  CalendarDays,
  Flag,
  PackageCheck,
  ShieldAlert,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button, Textarea } from '../../ui'
import { StatusBadge } from '../../components/StatusBadge'
import type { GrantRecord } from '../../types'
import { grantStore } from './grantStore'

interface Props {
  grant: GrantRecord
  onClose: () => void
}

// ── Reusable section card ───────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161A61]/10">
          <Icon className="h-4 w-4 text-[#161A61]" />
        </div>
        <h3 className="text-sm font-bold text-[#161A61]">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

// ── Label / value pair ──────────────────────────────────────────────────────
function Field({
  label,
  value,
  wide,
}: {
  label: string
  value?: string | number | null
  wide?: boolean
}) {
  return (
    <div className={wide ? 'col-span-full' : ''}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 leading-relaxed">{value || '—'}</p>
    </div>
  )
}

// ── Status badge ────────────────────────────────────────────────────────────
function MilestoneBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: 'bg-green-100 text-green-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Delayed: 'bg-red-100 text-red-700',
    'Not Started': 'bg-slate-100 text-slate-500',
  }
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? 'bg-slate-100 text-slate-600'}`}
    >
      {status}
    </span>
  )
}

function DelivBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: 'bg-green-100 text-green-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Overdue: 'bg-red-100 text-red-700',
    Pending: 'bg-yellow-100 text-yellow-700',
  }
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? 'bg-slate-100 text-slate-600'}`}
    >
      {status}
    </span>
  )
}

function Empty({ msg = 'None added.' }: { msg?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-6 text-center text-sm text-slate-400">
      {msg}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export function DivisionDirectorGrantApproval({ grant, onClose }: Props) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const isPending = grant.status === 'Pending Approval'

  const handleApprove = () => {
    grantStore.update({
      ...grant,
      status: 'Approved',
      approvedBy: 'Division Director',
      approvedAt: new Date().toISOString(),
    })
    toast.success('Grant approved successfully')
    onClose()
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    grantStore.update({
      ...grant,
      status: 'Rejected',
      rejectedBy: 'Division Director',
      rejectedAt: new Date().toISOString(),
      rejectionReason,
    })
    toast.success('Grant rejected')
    onClose()
  }

  const teamMembers = grant.teamMembers ?? []
  const milestones = grant.milestones ?? []
  const deliverables = grant.deliverables ?? []
  const risks = grant.risks ?? []

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onClose}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#161A61]">
              {grant.projectName || 'Grant Detail'}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {grant.id}
              {grant.submittedBy && (
                <>
                  {' '}
                  · Submitted by <span className="font-medium">{grant.submittedBy}</span>
                </>
              )}
              {grant.submittedAt && <> on {new Date(grant.submittedAt).toLocaleDateString()}</>}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={grant.status} />
          {isPending && (
            <>
              <Button
                onClick={handleApprove}
                className="bg-green-600 px-6 hover:bg-green-700 shadow-sm"
              >
                <Check className="mr-1.5 h-4 w-4" /> Approve
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
                className="bg-red-600 px-6 hover:bg-red-700 shadow-sm"
              >
                <AlertCircle className="mr-1.5 h-4 w-4" /> Reject
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── Status Banners ──────────────────────────────────────────────────── */}
      {grant.status === 'Approved' && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">Grant Approved</p>
            {grant.approvedAt && (
              <p className="text-xs text-green-600">
                Approved on {new Date(grant.approvedAt).toLocaleString()} by {grant.approvedBy}
              </p>
            )}
          </div>
        </div>
      )}

      {grant.status === 'Rejected' && grant.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm font-semibold text-red-800">Grant Rejected</p>
          </div>
          <p className="text-sm text-red-700">{grant.rejectionReason}</p>
          {grant.rejectedAt && (
            <p className="mt-1 text-xs text-red-500">
              Rejected on {new Date(grant.rejectedAt).toLocaleString()} by {grant.rejectedBy}
            </p>
          )}
        </div>
      )}

      {/* ── Progress bar ────────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Grant Progress</span>
          <span className="text-sm font-bold text-slate-900">
            {grant.percentageCompletion ?? 0}%
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#161A61] to-[#ff9500] transition-all"
            style={{ width: `${grant.percentageCompletion ?? 0}%` }}
          />
        </div>
      </div>

      {/* ── SECTION 1: Project Details ───────────────────────────────────────── */}
      <Section icon={FileText} title="Project Details">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Project ID" value={grant.id} />
          <Field label="Project Name" value={grant.projectName} />
          <Field label="Thematic Area" value={grant.thematicArea} />
          <div className="col-span-full">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Description
            </p>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">
              {grant.description || '—'}
            </p>
          </div>
        </div>
      </Section>

      {/* ── SECTION 2 & 3: Funding + Timeline ──────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section icon={DollarSign} title="Funding">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Budget" value={`${grant.currency || 'USD'} ${grant.amount || '—'}`} />
            <Field label="Currency" value={grant.currency} />
            <Field label="Funding Source" value={grant.fundingSource} />
            <Field label="Donor Name" value={grant.donorName} />
          </div>
        </Section>

        <Section icon={CalendarDays} title="Timeline">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Start Date" value={grant.startDate} />
            <Field label="End Date" value={grant.endDate} />
          </div>
        </Section>
      </div>

      {/* ── SECTION 4: Team ─────────────────────────────────────────────────── */}
      <Section icon={Users} title="Team">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                Project Manager
              </p>
              <p className="text-sm font-semibold text-slate-900">{grant.projectManager || '—'}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                Partner Lead
              </p>
              <p className="text-sm font-semibold text-slate-900">{grant.partnerLead || '—'}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Team Members ({teamMembers.length})
            </p>
            {teamMembers.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0b265a] text-left text-xs font-semibold text-white">
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Role</th>
                      <th className="px-4 py-2.5">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((m, i) => (
                      <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-2.5 font-semibold text-slate-900">{m.name}</td>
                        <td className="px-4 py-2.5 text-slate-600">{m.role || '—'}</td>
                        <td className="px-4 py-2.5 text-slate-400">{m.email || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty msg="No team members added." />
            )}
          </div>
        </div>
      </Section>

      {/* ── SECTION 5: Milestones ───────────────────────────────────────────── */}
      <Section icon={Flag} title={`Milestones (${milestones.length})`}>
        {milestones.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0b265a] text-left text-xs font-semibold text-white">
                  <th className="px-4 py-2.5">Milestone</th>
                  <th className="px-4 py-2.5">Planned Date</th>
                  <th className="px-4 py-2.5">Actual Date</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((m, i) => (
                  <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{m.milestone}</td>
                    <td className="px-4 py-3 text-slate-600">{m.plannedDate || '—'}</td>
                    <td className="px-4 py-3 text-slate-400">{m.actualDate || '—'}</td>
                    <td className="px-4 py-3">
                      <MilestoneBadge status={m.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty msg="No milestones added." />
        )}
      </Section>

      {/* ── SECTION 6: Deliverables ─────────────────────────────────────────── */}
      <Section icon={PackageCheck} title={`Deliverables (${deliverables.length})`}>
        {deliverables.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0b265a] text-left text-xs font-semibold text-white">
                  <th className="px-4 py-2.5">Deliverable</th>
                  <th className="px-4 py-2.5">Due Date</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.map((d, i) => (
                  <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{d.deliverable}</td>
                    <td className="px-4 py-3 text-slate-600">{d.dueDate || '—'}</td>
                    <td className="px-4 py-3">
                      <DelivBadge status={d.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty msg="No deliverables added." />
        )}
      </Section>

      {/* ── SECTION 7: Risk Register ────────────────────────────────────────── */}
      <Section icon={ShieldAlert} title={`Risk Register (${risks.length})`}>
        {risks.length > 0 ? (
          <div className="space-y-4">
            {risks.map((r, i) => (
              <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Risk #{i + 1}</p>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  {r.description}
                </p>
                {r.mitigationPlan && (
                  <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Mitigation Plan</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.mitigationPlan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Empty msg="No risks added." />
        )}
      </Section>

      {/* ── Rejection Modal ─────────────────────────────────────────────────── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reject Grant</h3>
                <p className="text-xs text-slate-500">This action will notify the officer</p>
              </div>
            </div>
            <p className="mb-3 text-sm text-slate-600">
              Please provide a clear reason for rejecting this grant so the officer can revise and
              resubmit.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
            />
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
