import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Modal } from '../../ui'
import { StatusBadge } from '../../components/StatusBadge'
import type { OpportunityRecord, OpportunityRole } from '../../types'

type OpportunityFormMode = 'create' | 'edit' | 'preview'

type OpportunityFormProps = {
  opportunity?: OpportunityRecord | null
  mode?: OpportunityFormMode
  role?: OpportunityRole
  onSubmit?: (opportunity: OpportunityRecord) => void
  onCancel?: () => void
  onEdit?: () => void
}

const organizationTypes = [
  'International organization',
  'Government',
  'University',
  'Research institute',
  'Private company',
  'startup',
  'development partner',
  'NGO',
  'Embassy',
  'Civil society',
  'other(specify)',
]

const existingRelationships = ['New Partner', 'Exist Partner', 'Former']

const divisionOptions = [
  'Finance',
  'Marketing',
  'Product',
  'Engineering',
  'Business',
  'Design',
  'Market Management',
  'Core Platform',
  'Production System',
]

const strategicImportanceLevels = ['High', 'Medium', 'Low']

const opportunityCategories = [
  'Research collaboration',
  'Funding opportunity',
  'Capacity building',
  'Technology transfer',
  'Startup support',
  'Infrastructure Development',
  'Policy collaboration',
  'other(specify)',
]

const opportunitySources = [
  'Conference',
  'Official Visit',
  'Email Inquiry',
  'Referral',
  'Government assignment',
  'Funding call',
  'Existing partner recommendation',
  'Website Inquiry',
  'Letter Request',
  'other(specify)',
]

function buildInitialState(opportunity?: OpportunityRecord | null): OpportunityRecord {
  const base = opportunity ?? {
    id: `opp-${Date.now()}`,
    no: 0,
    title: '',
    source: '',
    date: '',
    division: '',
    status: 'Draft' as const,
  }
  return {
    ...base,
    partnerName: base.partnerName ?? '',
    acronym: base.acronym ?? '',
    organizationType: base.organizationType ?? '',
    country: base.country ?? '',
    regionState: base.regionState ?? '',
    city: base.city ?? '',
    website: base.website ?? '',
    contactPersonName: base.contactPersonName ?? '',
    positionTitle: base.positionTitle ?? '',
    email: base.email ?? '',
    existingRelationship: base.existingRelationship ?? undefined,
    partnerInterestArea: base.partnerInterestArea ?? '',
    strategicImportance: base.strategicImportance ?? undefined,
    opportunityCategory: base.opportunityCategory ?? '',
    sourceSpecify: base.sourceSpecify ?? '',
    opportunityBackground: base.opportunityBackground ?? '',
    opportunityDescription: base.opportunityDescription ?? '',
    proposedCollaborationArea: base.proposedCollaborationArea ?? '',
    strategicAlignment: base.strategicAlignment ?? '',
    expectedBenefits: base.expectedBenefits ?? '',
    expectedOutcome: base.expectedOutcome ?? '',
    rejectionReason: base.rejectionReason ?? '',
    reviewComment: base.reviewComment ?? '',
  }
}
export function OpportunityForm({
  opportunity,
  mode = 'create',
  onSubmit,
  onCancel,
}: OpportunityFormProps) {
  const [formState, setFormState] = useState<OpportunityRecord>(() =>
    buildInitialState(opportunity)
  )
  useEffect(() => {
    if (opportunity) setFormState(buildInitialState(opportunity))
  }, [opportunity])

  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [sendModalOpen, setSendModalOpen] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setAttachedFiles(Array.from(e.target.files))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      ...formState,
      registeredAt: formState.registeredAt ?? new Date().toISOString(),
    })
  }

  const isPreview = mode === 'preview'

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="mt-1 text-[#161A61] hover:text-slate-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[22px] font-semibold text-[#161A61]">Opportunity Details</h1>
              <p className="mt-1 text-sm text-slate-500">
                View opportunity information and outcomes
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={formState.status} />
          </div>
        </div>

        {formState.status === 'Rejected' && formState.rejectionReason && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
            <p className="mt-1 text-sm text-red-600">{formState.rejectionReason}</p>
            {formState.rejectedBy && (
              <p className="mt-1 text-xs text-red-400">— {formState.rejectedBy}</p>
            )}
          </div>
        )}

        {formState.status === 'Pending Approval' && formState.reviewComment && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-700">
              Review Note — Knowledge &amp; Ecosystem Director
            </p>
            <p className="mt-1 text-sm text-blue-600">{formState.reviewComment}</p>
          </div>
        )}

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-inner">
          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-sm font-semibold text-[#161A61]">Opportunity Information</h2>
              <dl className="flex flex-col text-[13px] text-slate-800">
                {[
                  { label: 'Opportunity ID', value: formState.id },
                  { label: 'Title', value: formState.title || 'N/A' },
                  { label: 'Partner Name', value: formState.partnerName || 'N/A' },
                  { label: 'Organization Type', value: formState.organizationType || 'N/A' },
                  { label: 'Country', value: formState.country || 'N/A' },
                  { label: 'Website', value: formState.website || 'N/A' },
                  { label: 'Contact Person', value: formState.contactPersonName || 'N/A' },
                  { label: 'Email', value: formState.email || 'N/A' },
                  { label: 'Partner Interest Area', value: formState.partnerInterestArea || 'N/A' },
                  { label: 'Opportunity Category', value: formState.opportunityCategory || 'N/A' },
                  { label: 'Source', value: formState.source || 'N/A' },
                  { label: 'Division', value: formState.division || 'N/A' },
                  { label: 'Strategic Importance', value: formState.strategicImportance || 'N/A' },
                ].map((item, i, arr) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between gap-4 py-4 ${i !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <dt className="text-slate-500">{item.label}</dt>
                    <dd className="font-semibold text-slate-900 text-right">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-[#161A61]">Outcomes</h2>
                <div className="space-y-4 text-[12px] text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">Description: </span>
                    {formState.opportunityDescription || 'Not provided.'}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Expected Outcome: </span>
                    {formState.expectedOutcome || 'Not provided.'}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Strategic Alignment: </span>
                    {formState.strategicAlignment || 'Not provided.'}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Expected Benefits: </span>
                    {formState.expectedBenefits || 'Not provided.'}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-[#161A61]">Workflow Trail</h2>
                <ol className="relative border-l border-slate-200 pl-5 space-y-4 text-[12px]">
                  <li>
                    <span className="absolute -left-1.5 mt-0.5 h-3 w-3 rounded-full border-2 border-white bg-slate-400" />
                    <p className="font-semibold text-slate-700">Registered</p>
                    <p className="text-slate-500">
                      {formState.registeredBy ?? 'Officer'} ·{' '}
                      {formState.registeredAt
                        ? new Date(formState.registeredAt).toLocaleDateString()
                        : formState.date}
                    </p>
                  </li>
                  {formState.sentForApprovalAt && (
                    <li>
                      <span className="absolute -left-1.5 mt-0.5 h-3 w-3 rounded-full border-2 border-white bg-blue-400" />
                      <p className="font-semibold text-slate-700">Sent for Approval</p>
                      <p className="text-slate-500">
                        {formState.reviewedBy} ·{' '}
                        {new Date(formState.sentForApprovalAt).toLocaleDateString()}
                      </p>
                    </li>
                  )}
                  {formState.approvedAt && (
                    <li>
                      <span className="absolute -left-1.5 mt-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                      <p className="font-semibold text-slate-700">Approved</p>
                      <p className="text-slate-500">
                        {formState.approvedBy} ·{' '}
                        {new Date(formState.approvedAt).toLocaleDateString()}
                      </p>
                    </li>
                  )}
                  {formState.rejectedAt && (
                    <li>
                      <span className="absolute -left-1.5 mt-0.5 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
                      <p className="font-semibold text-slate-700">Rejected</p>
                      <p className="text-slate-500">
                        {formState.rejectedBy} ·{' '}
                        {new Date(formState.rejectedAt).toLocaleDateString()}
                      </p>
                    </li>
                  )}
                </ol>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-[#161A61]">Attachments</h2>
                {attachedFiles.length > 0 ? (
                  <ul className="space-y-2">
                    {attachedFiles.map(f => (
                      <li
                        key={f.name}
                        className="flex justify-between rounded-lg bg-slate-50 p-3 text-[12px]"
                      >
                        <span className="font-medium text-slate-800">{f.name}</span>
                        <span className="text-slate-400">
                          {(f.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[12px] text-slate-400">No attachments uploaded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} className="text-[#161A61] hover:text-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <CardTitle className="text-base font-semibold text-slate-950">
            {mode === 'edit' ? 'Edit Opportunity' : 'Register New Opportunity'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-8" onSubmit={handleFormSubmit}>
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="h-9 w-1 rounded-full bg-orange-500" />
              <h3 className="text-lg font-semibold text-slate-900">Opportunity Information</h3>
            </div>
            <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Opportunity ID
                </label>
                <Input value={formState.id} disabled />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Opportunity Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formState.title}
                  onChange={e => setFormState(s => ({ ...s, title: e.target.value }))}
                  placeholder="Enter Opportunity Title"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Partner Name
                </label>
                <Input
                  value={formState.partnerName}
                  onChange={e => setFormState(s => ({ ...s, partnerName: e.target.value }))}
                  placeholder="Enter Partner Name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Acronym</label>
                <Input
                  value={formState.acronym}
                  onChange={e => setFormState(s => ({ ...s, acronym: e.target.value }))}
                  placeholder="Enter Acronym"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Organization Type
                </label>
                <select
                  value={formState.organizationType}
                  onChange={e => setFormState(s => ({ ...s, organizationType: e.target.value }))}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Select organization type</option>
                  {organizationTypes.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
                <Input
                  value={formState.country}
                  onChange={e => setFormState(s => ({ ...s, country: e.target.value }))}
                  placeholder="Country"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Region / State
                </label>
                <Input
                  value={formState.regionState}
                  onChange={e => setFormState(s => ({ ...s, regionState: e.target.value }))}
                  placeholder="Region / State"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
                <Input
                  value={formState.city}
                  onChange={e => setFormState(s => ({ ...s, city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Website</label>
                <Input
                  type="url"
                  value={formState.website}
                  onChange={e => setFormState(s => ({ ...s, website: e.target.value }))}
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Contact Person Name
                </label>
                <Input
                  value={formState.contactPersonName}
                  onChange={e => setFormState(s => ({ ...s, contactPersonName: e.target.value }))}
                  placeholder="Contact Person Name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Position / Title
                </label>
                <Input
                  value={formState.positionTitle}
                  onChange={e => setFormState(s => ({ ...s, positionTitle: e.target.value }))}
                  placeholder="Position / Title"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Existing Relationship with EAII
                </label>
                <select
                  value={formState.existingRelationship ?? ''}
                  onChange={e =>
                    setFormState(s => ({
                      ...s,
                      existingRelationship: (e.target.value as any) || undefined,
                    }))
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Select relationship</option>
                  {existingRelationships.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Partner Interest Area
                </label>
                <Input
                  value={formState.partnerInterestArea}
                  onChange={e => setFormState(s => ({ ...s, partnerInterestArea: e.target.value }))}
                  placeholder="Partner Interest Area"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Strategic Importance
                </label>
                <select
                  value={formState.strategicImportance ?? ''}
                  onChange={e =>
                    setFormState(s => ({
                      ...s,
                      strategicImportance: (e.target.value as any) || undefined,
                    }))
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Select level</option>
                  {strategicImportanceLevels.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Opportunity Category
                </label>
                <select
                  value={formState.opportunityCategory}
                  onChange={e => setFormState(s => ({ ...s, opportunityCategory: e.target.value }))}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Select category</option>
                  {opportunityCategories.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Source of Opportunity <span className="text-red-500">*</span>
                </label>
                <select
                  value={formState.source}
                  onChange={e => setFormState(s => ({ ...s, source: e.target.value }))}
                  required
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Select source</option>
                  {opportunitySources.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Division <span className="text-red-500">*</span>
                </label>
                <select
                  value={formState.division}
                  onChange={e => setFormState(s => ({ ...s, division: e.target.value }))}
                  required
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Select Division</option>
                  {divisionOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formState.date}
                  onChange={e => setFormState(s => ({ ...s, date: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="h-9 w-1 rounded-full bg-orange-500" />
              <h3 className="text-lg font-semibold text-slate-900">Outcomes</h3>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Opportunity Description
                </label>
                <textarea
                  value={formState.opportunityDescription}
                  onChange={e =>
                    setFormState(s => ({ ...s, opportunityDescription: e.target.value }))
                  }
                  placeholder="Opportunity Description"
                  rows={5}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Expected Outcome
                </label>
                <textarea
                  value={formState.expectedOutcome}
                  onChange={e => setFormState(s => ({ ...s, expectedOutcome: e.target.value }))}
                  placeholder="Expected Outcome"
                  rows={5}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Strategic Alignment
                </label>
                <textarea
                  value={formState.strategicAlignment}
                  onChange={e => setFormState(s => ({ ...s, strategicAlignment: e.target.value }))}
                  placeholder="Strategic Alignment"
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Expected Benefits
                </label>
                <textarea
                  value={formState.expectedBenefits}
                  onChange={e => setFormState(s => ({ ...s, expectedBenefits: e.target.value }))}
                  placeholder="Expected Benefits"
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="h-9 w-1 rounded-full bg-orange-500" />
              <h3 className="text-lg font-semibold text-slate-900">Attachments</h3>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 8L12 5L15 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 13.5V17C7 18.1046 7.89543 19 9 19H15C16.1046 19 17 18.1046 17 17V13.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Upload Files</p>
              <p className="mt-1 text-sm text-slate-500">PNG, PDF, JPG, DOCX accepted</p>
              <label className="mt-4 inline-flex cursor-pointer items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#161A61] shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                Browse
                <input type="file" multiple onChange={handleFileChange} className="sr-only" />
              </label>
              {attachedFiles.length > 0 && (
                <ul className="mt-4 space-y-1 text-left text-sm text-slate-700 list-disc pl-6">
                  {attachedFiles.map(f => (
                    <li key={f.name}>{f.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="!bg-[#ff9500] !text-white hover:!bg-[#e68a00]" type="submit">
              {mode === 'edit' ? 'Save Changes' : 'Register Opportunity'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
