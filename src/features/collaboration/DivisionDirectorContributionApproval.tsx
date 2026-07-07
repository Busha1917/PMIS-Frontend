import { useState } from 'react'
import { ArrowLeft, AlertCircle, Check, Users, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Textarea } from '../../ui'
import { StatusBadge } from '../../components/StatusBadge'
import type { ResourceContributionRecord } from '../../types'
import { contributionStore } from './contributionStore'

interface Props {
  contribution: ResourceContributionRecord
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

const EAII_ITEMS = [
  { key: 'staff', label: 'Staff', detailKey: 'staffDetails' },
  { key: 'infrastructure', label: 'Infrastructure', detailKey: 'infrastructureDetails' },
  { key: 'funding', label: 'Funding', detailKey: 'fundingDetails' },
  { key: 'equipment', label: 'Equipment', detailKey: 'equipmentDetails' },
  { key: 'dataResources', label: 'Data Resources', detailKey: 'dataResourcesDetails' },
] as const

const PARTNER_ITEMS = [
  { key: 'staff', label: 'Staff', detailKey: 'staffDetails' },
  { key: 'funding', label: 'Funding', detailKey: 'fundingDetails' },
  { key: 'technology', label: 'Technology', detailKey: 'technologyDetails' },
  { key: 'equipment', label: 'Equipment', detailKey: 'equipmentDetails' },
  { key: 'expertise', label: 'Expertise', detailKey: 'expertiseDetails' },
] as const

export function DivisionDirectorContributionApproval({ contribution, onClose }: Props) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const isPending = contribution.status === 'Pending Approval'
  const eaii = contribution.eaiiContributions
  const partner = contribution.partnerContributions

  const handleApprove = () => {
    contributionStore.update({
      ...contribution,
      status: 'Approved',
      approvedBy: 'Division Director',
      approvedAt: new Date().toISOString(),
    })
    toast.success('Contribution approved successfully')
    onClose()
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    contributionStore.update({
      ...contribution,
      status: 'Rejected',
      rejectedBy: 'Division Director',
      rejectedAt: new Date().toISOString(),
      rejectionReason,
    })
    toast.success('Contribution rejected')
    onClose()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
              Resource Contribution — {contribution.id}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {contribution.partnerName && <>{contribution.partnerName} · </>}
              {contribution.submittedBy && (
                <>
                  Submitted by <span className="font-medium">{contribution.submittedBy}</span>
                </>
              )}
              {contribution.submittedAt && (
                <> on {new Date(contribution.submittedAt).toLocaleDateString()}</>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={contribution.status} />
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

      {/* Approved banner */}
      {contribution.status === 'Approved' && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">Contribution Approved</p>
            {contribution.approvedAt && (
              <p className="text-xs text-green-600">
                Approved on {new Date(contribution.approvedAt).toLocaleString()} by{' '}
                {contribution.approvedBy}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Rejected banner */}
      {contribution.status === 'Rejected' && contribution.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="mb-1 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm font-semibold text-red-800">Contribution Rejected</p>
          </div>
          <p className="text-sm text-red-700">{contribution.rejectionReason}</p>
          {contribution.rejectedAt && (
            <p className="mt-1 text-xs text-red-500">
              Rejected on {new Date(contribution.rejectedAt).toLocaleString()} by{' '}
              {contribution.rejectedBy}
            </p>
          )}
        </div>
      )}

      {/* EAII + Partner side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section icon={Users} title="EAII Contributions">
          <div className="space-y-3">
            {EAII_ITEMS.map(({ key, label, detailKey }) => {
              const selected = Boolean(eaii[key])
              const detail = eaii[detailKey]
              return (
                <div
                  key={key}
                  className={`rounded-xl border px-4 py-3 ${selected ? 'border-[#161A61] bg-[#161A61]/5' : 'border-slate-200 bg-slate-50 opacity-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${selected ? 'border-[#ff9500] bg-[#ff9500]' : 'border-slate-300 bg-white'}`}
                    >
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span
                      className={`text-sm font-medium ${selected ? 'text-[#161A61]' : 'text-slate-400'}`}
                    >
                      {label}
                    </span>
                  </div>
                  {selected && detail && (
                    <p className="mt-2 pl-8 text-xs leading-relaxed text-slate-600">
                      {String(detail)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </Section>

        <Section icon={Users} title="Partner Contributions">
          <div className="space-y-3">
            {PARTNER_ITEMS.map(({ key, label, detailKey }) => {
              const selected = Boolean(partner[key])
              const detail = partner[detailKey]
              return (
                <div
                  key={key}
                  className={`rounded-xl border px-4 py-3 ${selected ? 'border-[#161A61] bg-[#161A61]/5' : 'border-slate-200 bg-slate-50 opacity-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${selected ? 'border-[#ff9500] bg-[#ff9500]' : 'border-slate-300 bg-white'}`}
                    >
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span
                      className={`text-sm font-medium ${selected ? 'text-[#161A61]' : 'text-slate-400'}`}
                    >
                      {label}
                    </span>
                  </div>
                  {selected && detail && (
                    <p className="mt-2 pl-8 text-xs leading-relaxed text-slate-600">
                      {String(detail)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </Section>
      </div>

      {/* Estimated Value */}
      <Section icon={DollarSign} title="Estimated Value">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Monetary Value
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {contribution.currency}{' '}
              {parseFloat(contribution.monetaryValue || '0').toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Cash, grants, financial transfers</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              In-Kind Value
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {contribution.currency} {parseFloat(contribution.inKindValue || '0').toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Equipment, staff time, infrastructure</p>
          </div>
          <div className="rounded-xl border border-[#161A61]/20 bg-[#161A61]/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#161A61]">Total Value</p>
            <p className="mt-1 text-xl font-extrabold text-[#161A61]">
              {contribution.currency} {parseFloat(contribution.totalValue || '0').toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Monetary + In-Kind combined</p>
          </div>
        </div>
      </Section>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reject Contribution</h3>
                <p className="text-xs text-slate-500">This action will notify the officer</p>
              </div>
            </div>
            <p className="mb-3 text-sm text-slate-600">
              Please provide a clear reason so the officer can revise and resubmit.
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
