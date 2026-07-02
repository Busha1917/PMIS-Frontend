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
import { EngagementTimeline } from '../../components/EngagementTimeline'
import type { EngagementRecord } from '../../types'
import { engagementStore } from './engagementStore'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Pending Approval', value: 'Pending Approval' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

export function DivisionDirectorEngagementPage() {
  const [engagements, setEngagements] = useState<EngagementRecord[]>(() => engagementStore.getAll())
  const [selected, setSelected] = useState<EngagementRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => engagementStore.subscribe(setEngagements), [])

  // Only show engagements that have been submitted (Pending Approval, Approved, Rejected)
  const filtered = useMemo(() => {
    return engagements.filter(item => {
      if (item.status === 'Draft' || item.status === 'Assigned') return false
      if (
        searchQuery &&
        !item.organization?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [engagements, searchQuery, activeFilters])

  const handleConfirmApprove = () => {
    if (!selected) return
    const updated: EngagementRecord = {
      ...selected,
      status: 'Approved',
      approvedBy: 'Division Director',
      approvedAt: new Date().toISOString(),
      rejectionReason: '',
    }
    engagementStore.update(updated)
    setSelected(updated)
    toast.success('Engagement approved', { description: updated.organization })
    setApproveModalOpen(false)
  }

  const handleConfirmReject = () => {
    if (!selected) return
    const updated: EngagementRecord = {
      ...selected,
      status: 'Rejected',
      rejectedBy: 'Division Director',
      rejectedAt: new Date().toISOString(),
      rejectionReason: rejectReason,
    }
    engagementStore.update(updated)
    setSelected(updated)
    toast.error('Engagement rejected', { description: updated.organization })
    setRejectModalOpen(false)
  }

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selected) {
    const canAct = selected.status === 'Pending Approval'
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-1 text-[#161A61] hover:text-slate-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[22px] font-semibold text-[#161A61]">Engagement detail</h1>
              <p className="mt-1 text-sm text-slate-500">View Engagement — {selected.id}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {canAct ? (
              <>
                <button
                  type="button"
                  onClick={() => setApproveModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejectReason('')
                    setRejectModalOpen(true)
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </>
            ) : (
              <StatusBadge status={selected.status} />
            )}
          </div>
        </div>

        {/* Rejection banner */}
        {selected.status === 'Rejected' && selected.rejectionReason && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
            <p className="mt-1 text-sm text-red-600">{selected.rejectionReason}</p>
          </div>
        )}

        {/* Main content + timeline side by side */}
        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
          {/* Left: 3-panel detail */}
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              <div className="p-6">
                <h2 className="mb-5 text-sm font-semibold text-[#161A61]">Engagement Details</h2>
                <dl className="space-y-3 text-[13px]">
                  {[
                    { label: 'Engagement ID', value: selected.id },
                    { label: 'Date', value: selected.date || '—' },
                    { label: 'Organization Name', value: selected.organization || '—' },
                    { label: 'Engagement Type', value: selected.type || '—' },
                  ].map(item => (
                    <div
                      key={item.label}
                      className="flex justify-between border-b border-slate-100 pb-2.5"
                    >
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-semibold text-slate-900 text-right">{item.value}</span>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="p-6">
                <h2 className="mb-5 text-sm font-semibold text-[#161A61]">Engagement Details</h2>
                {selected.participants?.length ? (
                  <div className="space-y-3 text-[13px]">
                    {selected.participants.map(p => (
                      <div key={p.id} className="flex gap-3 border-b border-slate-100 pb-2.5">
                        <span className="flex-1 font-medium text-slate-800">
                          {p.fullName || '—'}
                        </span>
                        <span className="flex-1 text-slate-500 text-center">
                          {p.organizationName || '—'}
                        </span>
                        <span className="flex-1 font-semibold text-slate-900 text-right">
                          {p.position || '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-400">No participants.</p>
                )}
              </div>

              <div className="p-6">
                <h2 className="mb-5 text-sm font-semibold text-[#161A61]">EAII Representatives</h2>
                {selected.eaiiRepresentatives?.length ? (
                  <div className="space-y-3 text-[13px]">
                    {selected.eaiiRepresentatives.map(r => (
                      <div key={r.id} className="flex gap-3 border-b border-slate-100 pb-2.5">
                        <span className="flex-1 font-medium text-slate-800">
                          {r.fullName || '—'}
                        </span>
                        <span className="flex-1 text-slate-500 text-center">
                          {r.departmentName || '—'}
                        </span>
                        <span className="flex-1 font-semibold text-slate-900 text-right">
                          {r.position || '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-400">No representatives.</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 p-6">
              <h2 className="mb-4 text-sm font-semibold text-[#161A61]">Discussion Summary</h2>
              <div className="grid gap-6 md:grid-cols-3 text-[13px]">
                <div>
                  <p className="font-semibold text-[#ff9500] mb-2">Key Points</p>
                  <p className="text-slate-600 leading-relaxed">{selected.keyPoints || '—'}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#ff9500] mb-2">Agreed Action</p>
                  <p className="text-slate-600 leading-relaxed">{selected.agreedAction || '—'}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#ff9500] mb-2">Next Steps</p>
                  <p className="text-slate-600 leading-relaxed">{selected.nextSteps || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: timeline */}
          <div>
            <EngagementTimeline
              engagementStatus={selected.status}
              assignedAt={selected.assignedAt}
              submittedAt={selected.submittedAt}
              approvedAt={selected.approvedAt}
              rejectedAt={selected.rejectedAt}
            />
          </div>
        </div>

        {/* Approve modal */}
        <Modal
          open={approveModalOpen}
          onClose={() => setApproveModalOpen(false)}
          title="Approve Engagement"
          size="sm"
        >
          <div className="px-6 py-6 space-y-4">
            <p className="text-sm text-slate-600">
              Approve engagement <span className="font-semibold text-slate-900">{selected.id}</span>{' '}
              for <span className="font-semibold">{selected.organization}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
                Cancel
              </Button>
              <button
                type="button"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                onClick={handleConfirmApprove}
              >
                Approve
              </button>
            </div>
          </div>
        </Modal>

        {/* Reject modal */}
        <Modal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Engagement"
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
                className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <button
                type="button"
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-40"
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  // ── Table view ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Engagement Approval"
        subtitle="Review submitted engagements and make final decisions"
      />
      <PageToolbar
        searchPlaceholder="Search engagements..."
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        showSearchAndFilters
      />
      <DataTable
        items={filtered}
        rowKey={item => item.id}
        emptyVariant="engagement"
        columns={[
          {
            label: 'No.',
            render: (_item, i) => (
              <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
            ),
            headClassName: 'bg-[#0b265a] text-white text-center',
          },
          {
            label: 'Engagement ID',
            render: item => <span className="font-medium text-slate-900">{item.id}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Organization',
            render: item => item.organization || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          { label: 'Type', render: item => item.type, headClassName: 'bg-[#0b265a] text-white' },
          { label: 'Date', render: item => item.date, headClassName: 'bg-[#0b265a] text-white' },
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
                Review
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
        title="Filter Engagements"
      />
    </div>
  )
}
