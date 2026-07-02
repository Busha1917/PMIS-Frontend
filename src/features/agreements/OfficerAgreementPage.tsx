import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import { Button, Modal } from '../../ui'
import type { AgreementEaiiDivision, AgreementRecord } from '../../types'
import { agreementStore } from './agreementStore'

const AGREEMENT_TYPES = ['MoU', 'MoA', 'Contract', 'Framework Agreement', 'Letter of Intent']
const DIVISIONS = [
  'Research & Innovation',
  'Partnerships & Collaboration',
  'Digital Transformation',
  'Capacity Building',
  'Policy & Governance',
  'Finance & Administration',
  'Legal & Compliance',
]

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Pending Verification', value: 'Pending Verification' },
      { label: 'Verified', value: 'Verified' },
      { label: 'Pending Approval', value: 'Pending Approval' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

// ── Inline Agreement Form ────────────────────────────────────────────────────

type FormState = {
  title: string
  type: string
  date: string
  partnerOrganization: string
  contactPerson: string
  contactPosition: string
  eaiiDivisions: AgreementEaiiDivision[]
  description: string
  attachments: string[]
}

function buildForm(agr: AgreementRecord): FormState {
  return {
    title: agr.title || '',
    type: agr.type || 'MoU',
    date: agr.date || '',
    partnerOrganization: agr.partnerOrganization || '',
    contactPerson: agr.contactPerson || '',
    contactPosition: agr.contactPosition || '',
    eaiiDivisions: agr.eaiiDivisions ? [...agr.eaiiDivisions] : [],
    description: agr.description || '',
    attachments: agr.attachments ? [...agr.attachments] : [],
  }
}

type AgreementFormViewProps = {
  agreement: AgreementRecord
  onSaveDraft: (updated: AgreementRecord) => void
  onSubmit: (updated: AgreementRecord) => void
  onCancel: () => void
}

function AgreementFormView({ agreement, onSaveDraft, onSubmit, onCancel }: AgreementFormViewProps) {
  const [form, setForm] = useState<FormState>(() => buildForm(agreement))
  const [divisionRow, setDivisionRow] = useState({ division: '', fullName: '', position: '' })
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isReadOnly = agreement.status !== 'Draft'

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const addDivisionRow = () => {
    if (!divisionRow.division || !divisionRow.fullName) return
    const row: AgreementEaiiDivision = {
      id: `div-${Date.now()}`,
      division: divisionRow.division,
      fullName: divisionRow.fullName,
      position: divisionRow.position,
    }
    set('eaiiDivisions', [...form.eaiiDivisions, row])
    setDivisionRow({ division: '', fullName: '', position: '' })
  }

  const removeDivisionRow = (id: string) =>
    set(
      'eaiiDivisions',
      form.eaiiDivisions.filter(r => r.id !== id)
    )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const names = files.map(f => f.name)
    set('attachments', [...form.attachments, ...names])
    e.target.value = ''
  }

  const applyForm = (): AgreementRecord => ({
    ...agreement,
    title: form.title,
    type: form.type,
    date: form.date,
    partnerOrganization: form.partnerOrganization,
    contactPerson: form.contactPerson,
    contactPosition: form.contactPosition,
    eaiiDivisions: form.eaiiDivisions,
    description: form.description,
    attachments: form.attachments,
  })

  const sectionLabel = (text: string) => (
    <div className="flex items-center gap-2 mb-5">
      <span className="w-1 h-5 rounded-full bg-[#ff9500] inline-block" />
      <h2 className="text-[15px] font-semibold text-[#161A61]">{text}</h2>
    </div>
  )

  const inputCls =
    'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100 disabled:text-slate-400'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="text-[#161A61] hover:text-slate-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-[22px] font-semibold text-[#161A61]">
            {isReadOnly ? 'View Agreement' : 'Fill Agreement Details'}
          </h1>
          <p className="text-sm text-slate-500">
            {isReadOnly ? 'View Agreement' : 'Register Create New Agreement'} — {agreement.id}
          </p>
        </div>
      </div>

      {/* Linked engagement banner */}
      {agreement.engagementId && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-[13px]">
          <p className="text-xs font-semibold text-blue-700 mb-2">Linked Engagement</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-blue-900">
            <div>
              <span className="text-blue-500 text-xs">Engagement ID</span>
              <p className="font-semibold">{agreement.engagementId}</p>
            </div>
            <div>
              <span className="text-blue-500 text-xs">Organization</span>
              <p className="font-semibold">{agreement.engagementOrganization || '—'}</p>
            </div>
            <div>
              <span className="text-blue-500 text-xs">Type</span>
              <p className="font-semibold">{agreement.engagementType || '—'}</p>
            </div>
            <div>
              <span className="text-blue-500 text-xs">Approved By</span>
              <p className="font-semibold">{agreement.engagementApprovedBy || '—'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main form card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-8">
        {/* Agreement Information */}
        {sectionLabel('Agreement Information')}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Agreement ID</label>
            <input className={inputCls} value={agreement.id} disabled />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Agreement Title
            </label>
            <input
              className={inputCls}
              placeholder="Enter Agreement Title"
              value={form.title}
              disabled={isReadOnly}
              onChange={e => set('title', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Agreement Type
            </label>
            <select
              className={inputCls}
              value={form.type}
              disabled={isReadOnly}
              onChange={e => set('type', e.target.value)}
            >
              {AGREEMENT_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Date</label>
            <input
              type="date"
              className={inputCls}
              value={form.date}
              disabled={isReadOnly}
              onChange={e => set('date', e.target.value)}
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Parties */}
        {sectionLabel('Parties')}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Partner Organization
            </label>
            <input
              className={inputCls}
              placeholder="Partner Organization"
              value={form.partnerOrganization}
              disabled={isReadOnly}
              onChange={e => set('partnerOrganization', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Contact Person
            </label>
            <input
              className={inputCls}
              placeholder="Enter Contact Person"
              value={form.contactPerson}
              disabled={isReadOnly}
              onChange={e => set('contactPerson', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Position</label>
            <input
              className={inputCls}
              placeholder="Enter Position"
              value={form.contactPosition}
              disabled={isReadOnly}
              onChange={e => set('contactPosition', e.target.value)}
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* EAII Responsible Division */}
        {sectionLabel('EAII Responsible Division')}

        {/* Existing rows */}
        {form.eaiiDivisions.length > 0 && (
          <div className="mb-3 space-y-2">
            {form.eaiiDivisions.map(row => (
              <div
                key={row.id}
                className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="w-40 font-medium text-slate-700 truncate">{row.division}</span>
                <span className="flex-1 text-slate-600 truncate">{row.fullName}</span>
                <span className="w-36 text-slate-500 truncate">{row.position || '—'}</span>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => removeDivisionRow(row.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add row inputs */}
        {!isReadOnly && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Division</label>
              <select
                className={inputCls}
                value={divisionRow.division}
                onChange={e => setDivisionRow(p => ({ ...p, division: e.target.value }))}
              >
                <option value="">Select Division</option>
                {DIVISIONS.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Full Name</label>
              <input
                className={inputCls}
                placeholder="Enter Full Name"
                value={divisionRow.fullName}
                onChange={e => setDivisionRow(p => ({ ...p, fullName: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Position</label>
              <input
                className={inputCls}
                placeholder="Enter Position"
                value={divisionRow.position}
                onChange={e => setDivisionRow(p => ({ ...p, position: e.target.value }))}
              />
            </div>
          </div>
        )}
        {!isReadOnly && (
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={addDivisionRow}
              disabled={!divisionRow.division || !divisionRow.fullName}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#161A61] hover:text-[#0f1347] disabled:opacity-40"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#161A61] text-white">
                <Plus className="h-3.5 w-3.5" />
              </span>
              Add
            </button>
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Discussion Summary */}
        {sectionLabel('Discussion Summary')}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Description</label>
          <textarea
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 resize-none disabled:bg-slate-100"
            placeholder="Summarize the key discussion points"
            rows={4}
            value={form.description}
            disabled={isReadOnly}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        <hr className="border-slate-100" />

        {/* Attachments */}
        {sectionLabel('Attachments')}
        {form.attachments.length > 0 && (
          <div className="mb-3 space-y-2">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Draft Versions — {form.attachments.length} document
              {form.attachments.length !== 1 ? 's' : ''}
            </p>
            {form.attachments.map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{name}</span>
                </div>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'attachments',
                        form.attachments.filter((_, j) => j !== i)
                      )
                    }
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {!isReadOnly && (
          <>
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 cursor-pointer hover:border-[#161A61] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-7 w-7 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Upload Files</p>
              <p className="text-xs text-slate-400">Select your file or drag and drop</p>
              <p className="text-xs text-slate-400">png, pdf, jpg, docx accepted</p>
              <span className="text-xs font-semibold text-[#161A61] underline">browse</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".png,.pdf,.jpg,.jpeg,.docx,.doc"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      {/* Action buttons */}
      {!isReadOnly && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={() => onSaveDraft(applyForm())}
            className="rounded-lg border border-[#161A61] px-5 py-2 text-sm font-semibold text-[#161A61] hover:bg-slate-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => setSubmitModalOpen(true)}
            className="rounded-lg bg-[#ff9500] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
          >
            Submit
          </button>
        </div>
      )}

      {/* Submit confirmation modal */}
      <Modal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Agreement"
        size="sm"
      >
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-slate-600">
            Submit agreement <span className="font-semibold">{agreement.id}</span> for Legal Officer
            verification?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSubmitModalOpen(false)}>
              Cancel
            </Button>
            <button
              type="button"
              className="rounded-lg bg-[#ff9500] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e68a00]"
              onClick={() => {
                setSubmitModalOpen(false)
                onSubmit(applyForm())
              }}
            >
              Confirm Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function OfficerAgreementPage() {
  const [agreements, setAgreements] = useState<AgreementRecord[]>(() => agreementStore.getAll())
  const [selected, setSelected] = useState<AgreementRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  useEffect(() => agreementStore.subscribe(setAgreements), [])

  const filtered = useMemo(() => {
    return agreements.filter(item => {
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

  const handleSaveDraft = (updated: AgreementRecord) => {
    agreementStore.update(updated)
    setSelected(updated)
    toast.success('Draft saved', { description: updated.title })
  }

  const handleSubmit = (updated: AgreementRecord) => {
    const final: AgreementRecord = {
      ...updated,
      status: 'Pending Verification',
      submittedBy: 'Officer',
      submittedAt: new Date().toISOString(),
    }
    agreementStore.update(final)
    setSelected(null)
    toast.success('Agreement submitted for Legal Officer verification', {
      description: final.title,
    })
  }

  if (selected) {
    return (
      <AgreementFormView
        agreement={selected}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        onCancel={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="My Agreements"
        subtitle="Fill in and submit agreement details for approved engagements"
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
            render: item => <span className="truncate max-w-[200px] block">{item.title}</span>,
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
            label: 'Date',
            render: item => item.date || '—',
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
                className={
                  item.status === 'Draft'
                    ? 'rounded-lg bg-[#ff9500] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#e68a00]'
                    : 'rounded-lg bg-[#161A61] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0f1347]'
                }
              >
                {item.status === 'Draft' ? 'Fill Details' : 'View'}
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
