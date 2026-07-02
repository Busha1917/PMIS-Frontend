import { useMemo, useState } from 'react'
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
import { opportunities as initialOpportunities } from '../../data'
import { engagementStore } from '../engagement/engagementStore'

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

export function DivisionDirectorPage() {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(initialOpportunities)
  const [selected, setSelected] = useState<OpportunityRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  // Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  // Show all opportunities that have been sent to Division Director (Pending Approval, Approved, Rejected)
  const queue = useMemo(() => {
    return opportunities.filter(item => {
      if (item.status === 'Draft') return false
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.division && item.division !== activeFilters.division) return false
      return true
    })
  }, [opportunities, searchQuery, activeFilters])

  const updateOpportunity = (updated: OpportunityRecord) => {
    setOpportunities(cur => cur.map(o => (o.id === updated.id ? updated : o)))
    setSelected(updated)
  }

  const handleConfirmApprove = () => {
    if (!selected) return
    const updated: OpportunityRecord = {
      ...selected,
      status: 'Approved',
      approvedBy: 'Division Director',
      approvedAt: new Date().toISOString(),
      rejectionReason: '',
    }
    updateOpportunity(updated)
    engagementStore.addFromOpportunity(updated)
    toast.success('Opportunity approved — added to Engagement list', { description: updated.title })
    setApproveModalOpen(false)
  }

  const handleConfirmReject = () => {
    if (!selected) return
    const updated: OpportunityRecord = {
      ...selected,
      status: 'Rejected',
      rejectionReason: rejectReason,
      rejectedBy: 'Division Director',
      rejectedAt: new Date().toISOString(),
    }
    updateOpportunity(updated)
    toast.error('Opportunity rejected', { description: updated.title })
    setRejectModalOpen(false)
  }

  // Only show action buttons when the opportunity is still Pending Approval
  const actionButtons =
    selected && selected.status === 'Pending Approval' ? (
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
    ) : null

  return (
    <div className="space-y-6">
      {!selected && (
        <PageHeaderCard
          title="Opportunity Approval"
          subtitle="Review opportunities sent for approval and make final decisions"
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

          {/* Approve modal */}
          <Modal
            open={approveModalOpen}
            onClose={() => setApproveModalOpen(false)}
            title="Approve Opportunity"
            size="sm"
          >
            <div className="px-6 py-6 space-y-4">
              <p className="text-sm text-slate-600">
                Approve <span className="font-semibold text-slate-900">{selected.title}</span>? It
                will be added to the Engagement waiting list.
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
