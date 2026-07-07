import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import { Button, Modal } from '../../ui'
import type { AgreementRecord } from '../../types'
import { agreementStore } from './agreementStore'
import { partnerStore } from '../partners/partnerStore'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Verified', value: 'Verified' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

// ── Detail / Approval view ────────────────────────────────────────────────────

type DetailViewProps = {
  agreement: AgreementRecord
  onApprove: () => void
  onReject: (reason: string) => void
  onBack: () => void
}

function DetailView({ agreement, onApprove, onReject, onBack }: DetailViewProps) {
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const canAct = agreement.status === 'Verified'

  const sectionHeader = (title: string, orange = false) => (
    <h2
      className={`text-sm font-semibold mb-4 pb-2 border-b ${
        orange ? 'text-[#ff9500] border-orange-100' : 'text-[#161A61] border-slate-100'
      }`}
    >
      {title}
    </h2>
  )

  const row = (label: string, value: string | undefined) => (
    <div className="flex justify-between border-b border-slate-50 py-2.5 text-[13px] last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900 text-right max-w-[60%]">{value || '—'}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onBack}
            className="mt-1 text-[#161A61] hover:text-slate-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-[22px] font-semibold text-[#161A61]">Agreement Approval</h1>
            <p className="mt-1 text-sm text-slate-500">
              Register Create New Agreement — {agreement.id}
            </p>
          </div>
        </div>

        {canAct ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setApproveModalOpen(true)}
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => {
                setRejectReason('')
                setRejectModalOpen(true)
              }}
              className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
            >
              Reject
            </button>
          </div>
        ) : (
          <StatusBadge status={agreement.status} />
        )}
      </div>

      {/* Status banners */}
      {agreement.status === 'Rejected' && agreement.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
          <p className="mt-1 text-sm text-red-600">{agreement.rejectionReason}</p>
        </div>
      )}

      {agreement.status === 'Approved' && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <svg
              className="h-4 w-4 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Approved by KE Director</p>
            {agreement.approvedAt && (
              <p className="text-xs text-emerald-600">
                {new Date(agreement.approvedAt).toLocaleDateString()} — {agreement.approvedBy}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Legal verification info */}
      {agreement.verifiedAt && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-[13px]">
          <p className="text-xs font-semibold text-blue-700 mb-2">Legal Officer Verification</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 text-blue-900">
            <div>
              <span className="text-blue-500 text-xs">Verified By</span>
              <p className="font-semibold">{agreement.verifiedBy || '—'}</p>
            </div>
            <div>
              <span className="text-blue-500 text-xs">Verified At</span>
              <p className="font-semibold">{new Date(agreement.verifiedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main detail card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* 3-column top section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* Column 1 — Agreement Details */}
          <div className="p-6">
            {sectionHeader('Agreement Details')}
            {row('Agreement ID', agreement.id)}
            {row('Agreement Title', agreement.title)}
            {row('Agreement Type', agreement.type)}
            {row(
              'Date',
              agreement.date
                ? new Date(agreement.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : undefined
            )}
          </div>

          {/* Column 2 — Parties */}
          <div className="p-6">
            {sectionHeader('Parties')}
            {row('Partner Organization', agreement.partnerOrganization)}
            {row('Contact Person', agreement.contactPerson)}
            {row('Position', agreement.contactPosition)}
          </div>

          {/* Column 3 — EAII Responsible Division */}
          <div className="p-6">
            {sectionHeader('EAII Responsible Division')}
            {agreement.eaiiDivisions && agreement.eaiiDivisions.length > 0 ? (
              <div className="space-y-2 text-[13px]">
                {agreement.eaiiDivisions.map(d => (
                  <div
                    key={d.id}
                    className="flex justify-between border-b border-slate-50 py-2 last:border-0"
                  >
                    <span className="font-medium text-slate-800 truncate">{d.fullName}</span>
                    <span className="text-slate-500 ml-2 shrink-0">{d.division}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-slate-400">No divisions listed.</p>
            )}
          </div>
        </div>

        {/* Discussion Summary */}
        <div className="border-t border-slate-100 p-6">
          {sectionHeader('Discussion Summary', true)}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Key Points</p>
            <p className="text-sm text-slate-700 leading-relaxed">{agreement.description || '—'}</p>
          </div>
        </div>

        {/* Attachments */}
        {agreement.attachments && agreement.attachments.length > 0 && (
          <div className="border-t border-slate-100 p-6">
            {sectionHeader('Attachments', true)}
            <p className="text-xs font-semibold text-slate-500 mb-3">
              Draft Versions — {agreement.attachments.length} document
              {agreement.attachments.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2">
              {agreement.attachments.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{name}</span>
                  </div>
                  <div className="h-5 w-5 rounded-full border-2 border-slate-300 bg-white" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amendment History */}
        {agreement.amendments && agreement.amendments.length > 0 && (
          <div className="border-t border-slate-100 p-6">
            {sectionHeader('Amendment History', true)}
            <div className="space-y-4">
              {agreement.amendments.map(amendment => (
                <div
                  key={amendment.versionId}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Version {amendment.versionNumber} — {amendment.createdBy}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(amendment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        amendment.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : amendment.status === 'Responded'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {amendment.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    {amendment.comments}
                  </p>
                  {amendment.attachmentUrl && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      <span>📎 {amendment.attachmentUrl}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Approve modal */}
      <Modal
        open={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Approve Agreement"
        size="sm"
      >
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-slate-600">
            Approve agreement <span className="font-semibold text-slate-900">{agreement.id}</span> —{' '}
            <span className="font-semibold">{agreement.title}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <button
              type="button"
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
              onClick={() => {
                setApproveModalOpen(false)
                onApprove()
              }}
            >
              Confirm Approve
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Agreement"
        size="md"
      >
        <div className="px-6 py-6 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">
              Reason for rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <button
              type="button"
              className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-40"
              disabled={!rejectReason.trim()}
              onClick={() => {
                setRejectModalOpen(false)
                onReject(rejectReason)
              }}
            >
              Confirm Reject
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function KEDirectorAgreementPage() {
  const [agreements, setAgreements] = useState<AgreementRecord[]>(() => agreementStore.getAll())
  const [selected, setSelected] = useState<AgreementRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  useEffect(() => agreementStore.subscribe(setAgreements), [])

  // KE Director only sees verified (and already decided) agreements
  const filtered = useMemo(() => {
    return agreements.filter(item => {
      if (item.status === 'Draft' || item.status === 'Pending Verification') return false
      if (
        searchQuery &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [agreements, searchQuery, activeFilters])

  const handleApprove = () => {
    if (!selected) return
    const updated: AgreementRecord = {
      ...selected,
      status: 'Approved',
      approvedBy: 'KE Director',
      approvedAt: new Date().toISOString(),
      rejectionReason: '',
    }
    agreementStore.update(updated)
    // Automatically create a partner record for this approved agreement
    partnerStore.addFromAgreement(updated)
    setSelected(updated)
    toast.success('Agreement approved', { description: updated.title })
  }

  const handleReject = (reason: string) => {
    if (!selected) return
    const updated: AgreementRecord = {
      ...selected,
      status: 'Rejected',
      rejectedBy: 'KE Director',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    }
    agreementStore.update(updated)
    setSelected(updated)
    toast.error('Agreement rejected', { description: updated.title })
  }

  if (selected) {
    return (
      <DetailView
        agreement={selected}
        onApprove={handleApprove}
        onReject={handleReject}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Agreement Approval"
        subtitle="Review verified agreements and make final approval decisions"
      />
      <PageToolbar
        searchPlaceholder="Search agreements..."
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        showSearchAndFilters
      />
      <DataTable
        items={filtered}
        rowKey={item => item.id}
        emptyVariant="agreements"
        columns={[
          {
            label: 'No.',
            render: (_item, i) => (
              <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
            ),
            headClassName: 'bg-[#0b265a] text-white text-center',
          },
          {
            label: 'Agreement ID',
            render: item => <span className="font-medium text-slate-900">{item.id}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Title',
            render: item => <span className="block truncate max-w-[200px]">{item.title}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Type',
            render: item => item.type || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Organization',
            render: item => item.engagementOrganization || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Verified By',
            render: item => item.verifiedBy || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Status',
            render: item => <StatusBadge status={item.status} />,
            headClassName: 'bg-[#0b265a] text-white text-center',
            cellClassName: 'text-center',
          },
          {
            label: 'Action',
            render: item => (
              <button
                onClick={() => setSelected(item)}
                className="rounded-lg bg-[#161A61] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0f1347]"
              >
                {item.status === 'Verified' ? 'Review' : 'View'}
              </button>
            ),
            headClassName: 'bg-[#0b265a] text-white text-center',
            cellClassName: 'text-center',
          },
        ]}
      />
      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setActiveFilters}
        fields={FILTER_FIELDS}
        title="Filter Agreements"
      />
    </div>
  )
}
