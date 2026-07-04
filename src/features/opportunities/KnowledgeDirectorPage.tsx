import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import { Button, Modal } from '../../ui'
import { OpportunityReviewView } from './OpportunityReviewView'
import type { OpportunityRecord } from '../../types'
import { opportunityStore } from './opportunityStore'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Pending Approval', value: 'Pending Approval' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
  {
    key: 'division',
    label: 'Division',
    type: 'select' as const,
    options: [
      { label: 'Finance', value: 'Finance' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Product', value: 'Product' },
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Business', value: 'Business' },
      { label: 'Design', value: 'Design' },
    ],
  },
]

export function KnowledgeDirectorPage() {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(() =>
    opportunityStore.getAll()
  )
  const [selected, setSelected] = useState<OpportunityRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  // Modals
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [reviewComment, setReviewComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => opportunityStore.subscribe(setOpportunities), [])

  // Show all opportunities to KE Director (not filtered by status)
  const queue = useMemo(() => {
    return opportunities.filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.division && item.division !== activeFilters.division) return false
      return true
    })
  }, [opportunities, searchQuery, activeFilters])

  const updateOpportunity = (updated: OpportunityRecord) => {
    opportunityStore.update(updated)
    setSelected(updated)
  }

  const handleConfirmSend = () => {
    if (!selected) return
    const updated: OpportunityRecord = {
      ...selected,
      status: 'Pending Approval',
      reviewComment,
      reviewedBy: 'Knowledge & Ecosystem Director',
      sentForApprovalAt: new Date().toISOString(),
      rejectionReason: '',
    }
    updateOpportunity(updated)
    toast.success('Sent for approval', { description: updated.title })
    setSendModalOpen(false)
  }

  const handleConfirmReject = () => {
    if (!selected) return
    const updated: OpportunityRecord = {
      ...selected,
      status: 'Rejected',
      rejectionReason: rejectReason,
      rejectedBy: 'Knowledge & Ecosystem Director',
      rejectedAt: new Date().toISOString(),
    }
    updateOpportunity(updated)
    toast.error('Opportunity rejected', { description: updated.title })
    setRejectModalOpen(false)
  }

  // Only show action buttons when the opportunity is still in Draft
  const actionButtons =
    selected && selected.status === 'Draft' ? (
      <>
        <button
          type="button"
          onClick={() => {
            setReviewComment('')
            setSendModalOpen(true)
          }}
          className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
        >
          Send for Approval
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
    ) : null

  return (
    <div className="space-y-6">
      {!selected && (
        <PageHeaderCard
          title="Opportunity Review"
          subtitle="Review registered opportunities and send approved ones to the Division Director"
        />
      )}
      <PageToolbar
        searchPlaceholder="Search opportunities..."
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        showSearchAndFilters={!selected}
      />

      {selected ? (
        <>
          <OpportunityReviewView
            opportunity={selected}
            onBack={() => setSelected(null)}
            actions={actionButtons}
          />

          {/* Send for Approval modal */}
          <Modal
            open={sendModalOpen}
            onClose={() => setSendModalOpen(false)}
            title="Send for Approval"
            size="md"
          >
            <div className="px-6 py-6 space-y-4">
              <p className="text-sm text-slate-600">
                You are sending{' '}
                <span className="font-semibold text-slate-900">{selected.title}</span> to the
                Division Director for approval.
              </p>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">
                  Review note <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Add a note for the Division Director..."
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSendModalOpen(false)}>
                  Cancel
                </Button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
                  onClick={handleConfirmSend}
                >
                  Confirm &amp; Send
                </button>
              </div>
            </div>
          </Modal>

          {/* Reject modal */}
          <Modal
            open={rejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            title="Reject Opportunity"
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
        </>
      ) : (
        <>
          <DataTable
            items={queue}
            rowKey={item => item.id}
            emptyVariant="opportunities"
            columns={[
              {
                label: 'No.',
                render: (_item, index) => (
                  <span className="font-semibold text-slate-900">{index}</span>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
              },
              {
                label: 'Title',
                render: item => item.title,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Source',
                render: item => item.source,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Division',
                render: item => item.division,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Date',
                render: item => item.date,
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
            title="Filter Opportunities"
          />
        </>
      )}
    </div>
  )
}
