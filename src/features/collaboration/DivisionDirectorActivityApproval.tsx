import { useState } from 'react'
import {
  ArrowLeft,
  AlertCircle,
  Check,
  FileText,
  CalendarDays,
  Building2,
  PackageCheck,
  Paperclip,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button, Textarea } from '../../ui'
import { StatusBadge } from '../../components/StatusBadge'
import type { ActivityRecord } from '../../types'
import { activityStore } from './activityStore'

interface Props {
  activity: ActivityRecord
  onClose: () => void
}

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

function Field({ label, value, wide }: { label: string; value?: string | null; wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-full' : ''}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 leading-relaxed">{value || '—'}</p>
    </div>
  )
}

const PLANNED_OUTPUT_OPTIONS = [
  'AI Training',
  'Research Paper',
  'Policy Recommendation',
  'Prototype',
  'Workshop',
  'Training Manual',
  'Final Report',
  'Others',
]

export function DivisionDirectorActivityApproval({ activity, onClose }: Props) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const isPending = activity.status === 'Pending Approval'

  const handleApprove = () => {
    activityStore.update({
      ...activity,
      status: 'Approved',
      approvedBy: 'Division Director',
      approvedAt: new Date().toISOString(),
    })
    toast.success('Activity approved successfully')
    onClose()
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    activityStore.update({
      ...activity,
      status: 'Rejected',
      rejectedBy: 'Division Director',
      rejectedAt: new Date().toISOString(),
      rejectionReason,
    })
    toast.success('Activity rejected')
    onClose()
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onClose}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#161A61]">
              {activity.activityName || 'Activity Detail'}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {activity.id}
              {activity.submittedBy && (
                <>
                  {' '}
                  · Submitted by <span className="font-medium">{activity.submittedBy}</span>
                </>
              )}
              {activity.submittedAt && (
                <> on {new Date(activity.submittedAt).toLocaleDateString()}</>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={activity.status} />
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

      {/* ── Status Banners ── */}
      {activity.status === 'Approved' && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">Activity Approved</p>
            {activity.approvedAt && (
              <p className="text-xs text-green-600">
                Approved on {new Date(activity.approvedAt).toLocaleString()} by{' '}
                {activity.approvedBy}
              </p>
            )}
          </div>
        </div>
      )}

      {activity.status === 'Rejected' && activity.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm font-semibold text-red-800">Activity Rejected</p>
          </div>
          <p className="text-sm text-red-700">{activity.rejectionReason}</p>
          {activity.rejectedAt && (
            <p className="mt-1 text-xs text-red-500">
              Rejected on {new Date(activity.rejectedAt).toLocaleString()} by {activity.rejectedBy}
            </p>
          )}
        </div>
      )}

      {/* ══ SECTION 1: Activity Information ══ */}
      <Section icon={FileText} title="Activity Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Activity Name" value={activity.activityName} />
          <Field label="Activity Type" value={activity.activityType} />
          <Field label="Description" value={activity.description} wide />
        </div>
      </Section>

      {/* ══ SECTION 2: Timeline ══ */}
      <Section icon={CalendarDays} title="Timeline">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Start Date" value={activity.startDate} />
          <Field label="End Date" value={activity.endDate} />
        </div>
      </Section>

      {/* ══ SECTION 3: Responsibility ══ */}
      <Section icon={Building2} title="Responsibility">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Lead Organization
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#ff9500] px-4 py-2.5">
              <Building2 className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">
                Ethiopian Artificial Intelligence Institute
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="EAII Responsible Unit" value={activity.eaiiResponsibleUnit} />
            <Field label="Partner Organization" value={activity.partnerResponsibleUnit} />
          </div>
          {activity.actualOutputs?.[0] && (
            <Field label="Description" value={activity.actualOutputs[0]} wide />
          )}
        </div>
      </Section>

      {/* ══ SECTION 4: Planned Outputs ══ */}
      <Section icon={PackageCheck} title="Planned Outputs">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PLANNED_OUTPUT_OPTIONS.map(option => {
              const selected = (activity.plannedOutputs ?? []).includes(option)
              return (
                <div
                  key={option}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                    selected
                      ? 'border-[#161A61] bg-[#161A61]/5 text-[#161A61] font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                      selected ? 'border-[#ff9500] bg-[#ff9500]' : 'border-slate-300'
                    }`}
                  >
                    {selected && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  {option}
                </div>
              )
            })}
          </div>

          {(activity.plannedOutputs ?? []).length === 0 && (
            <p className="text-sm text-slate-400">No planned outputs selected.</p>
          )}

          {activity.actualOutputs?.[1] && (
            <div className="mt-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">
                Additional Description
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{activity.actualOutputs[1]}</p>
            </div>
          )}
        </div>
      </Section>

      {/* ══ SECTION 5: Attachments ══ */}
      {(activity.attachments ?? []).length > 0 && (
        <Section icon={Paperclip} title={`Attachments (${activity.attachments?.length})`}>
          <div className="space-y-2">
            {(activity.attachments ?? []).map(file => (
              <div
                key={file}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5"
              >
                <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-sm text-slate-700">{file}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Rejection Modal ── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reject Activity</h3>
                <p className="text-xs text-slate-500">This action will notify the focal person</p>
              </div>
            </div>
            <p className="mb-3 text-sm text-slate-600">
              Please provide a clear reason so the focal person can revise and resubmit.
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
