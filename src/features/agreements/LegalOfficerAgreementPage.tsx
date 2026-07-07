import { useEffect, useMemo, useState, useRef } from 'react'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import { Button, Modal } from '../../ui'
import type { AgreementRecord, AgreementAmendment } from '../../types'
import { agreementStore } from './agreementStore'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Pending Verification', value: 'Pending Verification' },
      { label: 'Verified', value: 'Verified' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

// ── Detail / Review view ──────────────────────────────────────────────────────

type DetailViewProps = {
  agreement: AgreementRecord
  onVerify: () => void
  onReject: (reason: string) => void
  onAmend: (comments: string, files: File[]) => void
  onBack: () => void
}

function DetailView({ agreement, onVerify, onReject, onAmend, onBack }: DetailViewProps) {
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [amendModalOpen, setAmendModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [amendComments, setAmendComments] = useState('')
  const [amendmentFiles, setAmendmentFiles] = useState<File[]>([])
  const amendFileInputRef = useRef<HTMLInputElement>(null)

  const canAct = agreement.status === 'Pending Verification'

  const sectionHeader = (title: string) => (
    <h2 className="text-sm font-semibold text-[#161A61] mb-4 pb-2 border-b border-slate-100">
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
            <h1 className="text-[22px] font-semibold text-[#161A61]">Agreement Review</h1>
            <p className="mt-1 text-sm text-slate-500">
              Register Create New Agreement — {agreement.id}
            </p>
          </div>
        </div>

        {canAct ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setAmendComments('')
                setAmendModalOpen(true)
              }}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
            >
              Amend
            </button>
            <button
              type="button"
              onClick={() => setVerifyModalOpen(true)}
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Verify
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

      {/* Rejection banner */}
      {agreement.status === 'Rejected' && agreement.legalRejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
          <p className="mt-1 text-sm text-red-600">{agreement.legalRejectionReason}</p>
        </div>
      )}

      {/* Verified banner */}
      {agreement.status === 'Verified' && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
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
            <p className="text-sm font-semibold text-emerald-800">Verified by Legal Officer</p>
            {agreement.verifiedAt && (
              <p className="text-xs text-emerald-600">
                {new Date(agreement.verifiedAt).toLocaleDateString()} — {agreement.verifiedBy}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main detail card — 3 columns matching the image */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
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
          <h2 className="text-sm font-semibold text-[#ff9500] mb-3 pb-1 border-b border-orange-100">
            Discussion Summary
          </h2>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Key Points</p>
            <p className="text-sm text-slate-700 leading-relaxed">{agreement.description || '—'}</p>
          </div>
        </div>

        {/* Attachments */}
        {agreement.attachments && agreement.attachments.length > 0 && (
          <div className="border-t border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-[#ff9500] mb-3 pb-1 border-b border-orange-100">
              Attachments
            </h2>
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

        {/* Amendments/Versions Timeline */}
        {agreement.amendments && agreement.amendments.length > 0 && (
          <div className="border-t border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-[#ff9500] mb-4 pb-1 border-b border-orange-100">
              Amendment History
            </h2>
            <div className="space-y-4">
              {agreement.amendments.map((amendment, i) => (
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
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
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
                      <span>Attachment</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verify modal */}
      <Modal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Verify Agreement"
        size="sm"
      >
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-slate-600">
            Verify agreement <span className="font-semibold text-slate-900">{agreement.id}</span>?
            <br />
            This will forward it to the KE Director for final approval.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setVerifyModalOpen(false)}>
              Cancel
            </Button>
            <button
              type="button"
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
              onClick={() => {
                setVerifyModalOpen(false)
                onVerify()
              }}
            >
              Confirm Verify
            </button>
          </div>
        </div>
      </Modal>

      {/* Amend modal */}
      <Modal
        open={amendModalOpen}
        onClose={() => {
          setAmendModalOpen(false)
          setAmendmentFiles([])
        }}
        title="Amend Agreement"
        size="md"
      >
        <div className="px-6 py-6 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">
              Comments on Agreement Details <span className="text-red-500">*</span>
            </label>
            <textarea
              value={amendComments}
              onChange={e => setAmendComments(e.target.value)}
              placeholder="Enter your comments for the officer to address..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 resize-none"
            />
          </div>

          {/* File Attachment */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">
              Attachments (Optional)
            </label>
            {amendmentFiles.length > 0 && (
              <div className="mb-3 space-y-2">
                {amendmentFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAmendmentFiles(prev => prev.filter((_, j) => j !== i))}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div
              onClick={() => amendFileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 cursor-pointer hover:border-amber-500 transition-colors"
            >
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-sm font-medium text-slate-600">Upload attachment</p>
              <p className="text-xs text-slate-400">pdf, doc, docx, xlsx accepted</p>
            </div>
            <input
              ref={amendFileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.xlsx,.xls"
              onChange={e =>
                setAmendmentFiles(prev => [
                  ...prev,
                  ...(e.target.files ? Array.from(e.target.files) : []),
                ])
              }
            />
          </div>

          <p className="text-xs text-slate-500">
            These comments and attachments will be sent back to the officer who can then revise and
            resubmit the agreement.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setAmendModalOpen(false)
                setAmendmentFiles([])
              }}
            >
              Cancel
            </Button>
            <button
              type="button"
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40"
              disabled={!amendComments.trim()}
              onClick={() => {
                setAmendModalOpen(false)
                onAmend(amendComments, amendmentFiles)
                setAmendComments('')
                setAmendmentFiles([])
              }}
            >
              Send for Amendment
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

export function LegalOfficerAgreementPage() {
  const [agreements, setAgreements] = useState<AgreementRecord[]>(() => agreementStore.getAll())
  const [selected, setSelected] = useState<AgreementRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  useEffect(() => agreementStore.subscribe(setAgreements), [])

  // Legal Officer only sees submitted agreements (Pending Verification, Verified, Rejected)
  const filtered = useMemo(() => {
    return agreements.filter(item => {
      if (item.status === 'Draft') return false
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

  const handleVerify = () => {
    if (!selected) return
    const updated: AgreementRecord = {
      ...selected,
      status: 'Verified',
      verifiedBy: 'Legal Officer',
      verifiedAt: new Date().toISOString(),
    }
    agreementStore.update(updated)
    setSelected(updated)
    toast.success('Agreement verified', { description: updated.title })
  }

  const handleReject = (reason: string) => {
    if (!selected) return
    const updated: AgreementRecord = {
      ...selected,
      status: 'Rejected',
      legalRejectedBy: 'Legal Officer',
      legalRejectedAt: new Date().toISOString(),
      legalRejectionReason: reason,
    }
    agreementStore.update(updated)
    setSelected(updated)
    toast.error('Agreement rejected', { description: updated.title })
  }

  const handleAmend = (comments: string, files: File[]) => {
    if (!selected) return

    // Convert files to attachment names/references
    const attachmentRefs = files.map(f => f.name)

    // Create new amendment
    const newAmendment: AgreementAmendment = {
      versionId: `AMN-${Date.now()}`,
      versionNumber: (selected.amendments?.length ?? 0) + 1,
      createdBy: 'Legal Officer',
      createdAt: new Date().toISOString(),
      comments,
      attachmentUrl: attachmentRefs.length > 0 ? attachmentRefs.join(', ') : undefined,
      status: 'Pending',
    }

    // Update agreement with new amendment, keep status as Pending Verification
    const updated: AgreementRecord = {
      ...selected,
      amendments: [...(selected.amendments ?? []), newAmendment],
      currentVersion: newAmendment.versionNumber,
    }

    agreementStore.update(updated)
    setSelected(updated)
    toast.success('Amendment sent to officer', {
      description: `Version ${newAmendment.versionNumber} amendments requested${files.length > 0 ? ` with ${files.length} attachment(s)` : ''}`,
    })
  }

  if (selected) {
    return (
      <DetailView
        agreement={selected}
        onVerify={handleVerify}
        onReject={handleReject}
        onAmend={handleAmend}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Agreement Verification"
        subtitle="Review submitted agreements and verify or reject them"
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
            label: 'Submitted By',
            render: item => item.submittedBy || '—',
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
                {item.status === 'Pending Verification' ? 'Verify' : 'View'}
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
