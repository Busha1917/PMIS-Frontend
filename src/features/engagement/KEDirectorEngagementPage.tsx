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
import { useGetEngagementsQuery } from '../../store/apiSlice'

const DEPARTMENTS = [
  'Research & Innovation',
  'Partnerships & Collaboration',
  'Digital Transformation',
  'Capacity Building',
  'Policy & Governance',
  'Finance & Administration',
]

const OFFICERS: Record<string, string[]> = {
  'Research & Innovation': ['Dr. Abebe Girma', 'Ms. Tigist Bekele', 'Mr. Yonas Hailu'],
  'Partnerships & Collaboration': ['Ms. Mekdes Tadesse', 'Mr. Henok Alemu'],
  'Digital Transformation': ['Mr. Dawit Tesfaye', 'Ms. Sara Mengistu', 'Mr. Biniyam Kebede'],
  'Capacity Building': ['Ms. Hana Worku', 'Mr. Tesfaye Demeke'],
  'Policy & Governance': ['Dr. Meseret Haile', 'Mr. Robel Tsegay'],
  'Finance & Administration': ['Ms. Azeb Mulugeta', 'Mr. Kaleab Bekele'],
}

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Assigned', value: 'Assigned' },
      { label: 'Pending Approval', value: 'Pending Approval' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

export function KEDirectorEngagementPage() {
  const { data: engagements = [] } = useGetEngagementsQuery()
  const [selected, setSelected] = useState<any | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  // Assign officer modal - Deprecated as unsupported by backend
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [assignDept, setAssignDept] = useState('')
  const [assignOfficer, setAssignOfficer] = useState('')
  const [assignNotes, setAssignNotes] = useState('')

  const filtered = useMemo(() => {
    return engagements.filter(item => {
      const orgName = item.externalParticipants?.[0]?.organizationName || ''
      if (
        searchQuery &&
        !orgName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [engagements, searchQuery, activeFilters])

  const handleConfirmAssign = () => {
    if (!selected || !assignOfficer || !assignDept) return
    toast.error('Assignment feature not currently supported by backend API.')
    setAssignModalOpen(false)
  }

  const officerOptions = OFFICERS[assignDept] ?? []

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selected) {
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
              <h1 className="text-[22px] font-semibold text-[#161A61]">Engagement Details</h1>
              <p className="mt-1 text-sm text-slate-500">View Engagement — {selected.id}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={selected.status} />
            {selected.status === 'Draft' && (
              <button
                type="button"
                onClick={() => {
                  setAssignDept('')
                  setAssignOfficer('')
                  setAssignNotes('')
                  setAssignModalOpen(true)
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
              >
                Assign Officer
              </button>
            )}
          </div>
        </div>

        {/* Opportunity log panel */}
        {selected.opportunityId && selected.opportunity && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h2 className="mb-3 text-sm font-semibold text-blue-800">Linked Opportunity</h2>
            <div className="grid gap-3 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Opportunity ID', value: selected.opportunityId },
                { label: 'Title', value: selected.opportunity?.title || '—' },
                { label: 'Country', value: selected.opportunity?.country || '—' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-blue-600 text-xs">{item.label}</p>
                  <p className="font-semibold text-blue-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignment log */}
        {selected.assignedOfficer && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="mb-3 text-sm font-semibold text-emerald-800">Assignment</h2>
            <div className="grid gap-3 text-[13px] sm:grid-cols-3">
              <div>
                <p className="text-emerald-600 text-xs">Assigned Officer</p>
                <p className="font-semibold text-emerald-900">{selected.assignedOfficer}</p>
              </div>
              <div>
                <p className="text-emerald-600 text-xs">Department</p>
                <p className="font-semibold text-emerald-900">{selected.assignedDepartment}</p>
              </div>
              <div>
                <p className="text-emerald-600 text-xs">Notes</p>
                <p className="font-semibold text-emerald-900">{selected.assignmentNotes || '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main content + timeline side by side */}
        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
          {/* Left: detail cards */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-inner">
              <div className="grid gap-6 lg:grid-cols-3 mb-6">
                <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-sm font-semibold text-[#161A61]">Engagement Details</h2>
                  <dl className="space-y-3 text-[13px]">
                    {[
                      { label: 'Engagement ID', value: selected.id },
                      { label: 'Date', value: selected.engagementDate || '—' },
                      {
                        label: 'Organization Name',
                        value: selected.externalParticipants?.[0]?.organizationName || '—',
                      },
                      { label: 'Engagement Type', value: selected.engagementType?.typeName || '—' },
                    ].map(item => (
                      <div
                        key={item.label}
                        className="flex justify-between border-b border-slate-100 pb-2.5"
                      >
                        <span className="text-slate-500">{item.label}</span>
                        <span className="font-semibold text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-sm font-semibold text-[#161A61]">Participants</h2>
                  {selected.externalParticipants?.length ? (
                    <div className="space-y-2 text-[12px]">
                      {selected.externalParticipants.map((p: any) => (
                        <div
                          key={p.id}
                          className="flex justify-between border-b border-slate-100 pb-2"
                        >
                          <span className="truncate">{p.fullName || '—'}</span>
                          <span className="text-slate-500 mx-2 truncate">
                            {p.organizationName || '—'}
                          </span>
                          <span className="font-semibold shrink-0">{p.position || '—'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[12px] text-slate-400">No participants yet.</p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-sm font-semibold text-[#161A61]">
                    EAII Representatives
                  </h2>
                  {selected.eaiiRepresentatives?.length ? (
                    <div className="space-y-2 text-[12px]">
                      {selected.eaiiRepresentatives.map((r: any) => (
                        <div
                          key={r.id}
                          className="flex justify-between border-b border-slate-100 pb-2"
                        >
                          <span className="truncate">{r.fullName || '—'}</span>
                          <span className="text-slate-500 mx-2 truncate">{r.division || '—'}</span>
                          <span className="font-semibold shrink-0">{r.role || '—'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[12px] text-slate-400">No representatives yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-[#161A61]">Discussion Summary</h2>
                <div className="grid gap-5 md:grid-cols-3 text-[13px]">
                  <div>
                    <p className="font-semibold text-[#ff9500] mb-2">Key Points</p>
                    <p className="text-slate-600 leading-relaxed">{selected.keyPoints || '—'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#ff9500] mb-2">Agreed Action</p>
                    <p className="text-slate-600 leading-relaxed">
                      {selected.agreedActions || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#ff9500] mb-2">Next Steps</p>
                    <p className="text-slate-600 leading-relaxed">{selected.nextSteps || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: timeline */}
          <div className="xl:col-span-1">
            <EngagementTimeline
              engagementStatus={selected.status}
              assignedAt={selected.createdAt}
              submittedAt={selected.createdAt}
              approvedAt={selected.approvalDate}
            />
          </div>
        </div>

        {/* Assign Officer modal */}
        <Modal
          open={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title="Assign Officer"
          size="md"
        >
          <div className="px-6 py-6 space-y-5">
            <p className="text-sm text-slate-500">
              Select an officer to assign this engagement to:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Select Department
                </label>
                <select
                  value={assignDept}
                  onChange={e => {
                    setAssignDept(e.target.value)
                    setAssignOfficer('')
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">select Department</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Select Officer
                </label>
                <select
                  value={assignOfficer}
                  onChange={e => setAssignOfficer(e.target.value)}
                  disabled={!assignDept}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:opacity-50"
                >
                  <option value="">select Officer</option>
                  {officerOptions.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Assignment Notes
              </label>
              <textarea
                value={assignNotes}
                onChange={e => setAssignNotes(e.target.value)}
                placeholder="Any Instruction / note"
                rows={4}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 placeholder:text-slate-400 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors disabled:opacity-40"
                onClick={handleConfirmAssign}
                disabled={!assignDept || !assignOfficer}
              >
                Assign
              </button>
              <Button variant="outline" onClick={() => setAssignModalOpen(false)} className="px-8">
                Cancel
              </Button>
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
        title="Engagement Review"
        subtitle="Review approved opportunities and assign officers to fill engagement details"
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
            render: item => item.externalParticipants?.[0]?.organizationName || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Type',
            render: item => item.engagementType?.typeName || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Date',
            render: item => item.engagementDate,
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
                View
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
