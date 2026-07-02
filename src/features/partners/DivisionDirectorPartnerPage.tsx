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
import type { PartnerRecord } from '../../types'
import { partnerStore } from './partnerStore'

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

// ── Detail / Approval View ───────────────────────────────────────────────────

type DetailViewProps = {
  partner: PartnerRecord
  onApprove: () => void
  onReject: (reason: string) => void
  onBack: () => void
}

function DetailView({ partner, onApprove, onReject, onBack }: DetailViewProps) {
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const canAct = partner.status === 'Verified'

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
      {/* Header with actions */}
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
            <h1 className="text-[22px] font-semibold text-[#161A61]">Partner Registration</h1>
            <p className="mt-1 text-sm text-slate-500">
              Register and manage partnership organizations — {partner.id}
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
          <StatusBadge status={partner.status} />
        )}
      </div>

      {/* Status banners */}
      {partner.status === 'Rejected' && partner.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
          <p className="mt-1 text-sm text-red-600">{partner.rejectionReason}</p>
        </div>
      )}

      {partner.status === 'Approved' && (
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
            <p className="text-sm font-semibold text-emerald-800">Approved by Division Director</p>
            {partner.approvedAt && (
              <p className="text-xs text-emerald-600">
                {new Date(partner.approvedAt).toLocaleDateString()} — {partner.approvedBy}
              </p>
            )}
          </div>
        </div>
      )}

      {/* KE verification info */}
      {partner.verifiedAt && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-[13px]">
          <p className="text-xs font-semibold text-blue-700 mb-2">KE Director Verification</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 text-blue-900">
            <div>
              <span className="text-blue-500 text-xs">Verified By</span>
              <p className="font-semibold">{partner.verifiedBy || '—'}</p>
            </div>
            <div>
              <span className="text-blue-500 text-xs">Verified At</span>
              <p className="font-semibold">{new Date(partner.verifiedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main detail card with logo preview */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* Logo Preview */}
          <div className="p-6 flex flex-col items-center justify-center bg-slate-50">
            {partner.partnerLogo ? (
              <div className="w-40 h-40 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                <div className="text-center p-4">
                  <svg
                    className="h-16 w-16 text-slate-400 mx-auto mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs font-medium text-slate-600">{partner.partnerLogo}</p>
                </div>
              </div>
            ) : (
              <div className="w-40 h-40 rounded-xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center">
                <p className="text-xs text-slate-400">No logo</p>
              </div>
            )}
            <p className="mt-3 text-sm font-semibold text-[#161A61]">Partner Logo</p>
            <p className="text-xs text-slate-500">Preview</p>
          </div>

          {/* Basic Info & Org Details */}
          <div className="p-6">
            {sectionHeader('Basic Information')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mb-6">
              <div>
                {row('Partner ID', partner.id)}
                {row('Partner Name', partner.name)}
                {row('Acronym', partner.acronym)}
                {row('Organization Type', partner.organizationType)}
                {row('Country', partner.country)}
                {row('Website', partner.website)}
              </div>
              <div>
                {row('Year Established', partner.yearEstablished)}
                {row('Registration/License Number', partner.registrationLicenseNumber)}
                {row('Tax Number', partner.taxNumber)}
                {row('Partnership Classification', partner.partnershipClassification)}
                {row('Region', partner.region)}
              </div>
            </div>

            {sectionHeader('Organizational Details')}
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Mission</p>
                <p className="text-slate-700 leading-relaxed">{partner.mission || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Vision</p>
                <p className="text-slate-700 leading-relaxed">{partner.vision || '—'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Strategic Focus Areas</p>
                  <p className="text-slate-700">{partner.strategicFocusAreas || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Key Expertise Areas</p>
                  <p className="text-slate-700">{partner.keyExpertiseAreas || '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>{row('Annual Budget', partner.annualBudget)}</div>
                <div>{row('Number of Employees', partner.numberOfEmployees)}</div>
                <div>{row('Geographic Coverage', partner.geographicCoverage)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Contact */}
        <div className="border-t border-slate-100 p-6">
          {sectionHeader('Primary Contact')}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>{row('Full Name', partner.primaryContact?.fullName)}</div>
            <div>{row('Position', partner.primaryContact?.position)}</div>
            <div>{row('Department', partner.primaryContact?.department)}</div>
            <div>{row('Email', partner.primaryContact?.email)}</div>
            <div>{row('Mobile Phone', partner.primaryContact?.mobilePhone)}</div>
            <div>{row('Office Phone', partner.primaryContact?.officePhone)}</div>
          </div>
        </div>

        {/* Additional Contact */}
        {partner.additionalContact && (
          <div className="border-t border-slate-100 p-6">
            {sectionHeader('Additional Contact')}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>{row('Name', partner.additionalContact.fullName)}</div>
              <div>{row('Title', partner.additionalContact.title)}</div>
              <div>{row('Email', partner.additionalContact.email)}</div>
              <div>{row('Phone', partner.additionalContact.phone)}</div>
              <div>{row('Role in Partnership', partner.additionalContact.roleInPartnership)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Approve modal */}
      <Modal
        open={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Approve Partner"
        size="sm"
      >
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-slate-600">
            Approve partner <span className="font-semibold text-slate-900">{partner.id}</span> —{' '}
            <span className="font-semibold">{partner.name}</span>?
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
        title="Reject Partner"
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

export function DivisionDirectorPartnerPage() {
  const [partners, setPartners] = useState<PartnerRecord[]>(() => partnerStore.getAll())
  const [selected, setSelected] = useState<PartnerRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  useEffect(() => partnerStore.subscribe(setPartners), [])

  const filtered = useMemo(() => {
    return partners.filter(item => {
      if (item.status === 'Draft' || item.status === 'Pending Verification') return false
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [partners, searchQuery, activeFilters])

  const handleApprove = () => {
    if (!selected) return
    const updated: PartnerRecord = {
      ...selected,
      status: 'Approved',
      approvedBy: 'Division Director',
      approvedAt: new Date().toISOString(),
      rejectionReason: '',
    }
    partnerStore.update(updated)
    setSelected(updated)
    toast.success('Partner approved', { description: updated.name })
  }

  const handleReject = (reason: string) => {
    if (!selected) return
    const updated: PartnerRecord = {
      ...selected,
      status: 'Rejected',
      rejectedBy: 'Division Director',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    }
    partnerStore.update(updated)
    setSelected(updated)
    toast.error('Partner rejected', { description: updated.name })
  }

  if (selected) {
    return (
      <DetailView
        partner={selected}
        onApprove={handleApprove}
        onReject={handleReject}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Partner Approval"
        subtitle="Review verified partners and make final approval decisions"
      />
      <PageToolbar
        searchPlaceholder="Search partners..."
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        showSearchAndFilters
      />
      <DataTable
        items={filtered}
        rowKey={item => item.id}
        emptyVariant="partners"
        columns={[
          {
            label: 'No.',
            render: (_item, i) => (
              <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
            ),
            headClassName: 'bg-[#0b265a] text-white text-center',
          },
          {
            label: 'Partner ID',
            render: item => <span className="font-medium text-slate-900">{item.id}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Partner Name',
            render: item => <span className="block truncate max-w-[200px]">{item.name}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Type',
            render: item => item.type || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Country',
            render: item => item.country || '—',
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
        title="Filter Partners"
      />
    </div>
  )
}
