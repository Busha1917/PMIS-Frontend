import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Modal } from '../ui'
import { StatusBadge } from './StatusBadge'
import type { OpportunityRecord } from '../types'

type OpportunityFormMode = 'create' | 'edit' | 'preview'

type OpportunityFormProps = {
  opportunity?: OpportunityRecord | null
  mode?: OpportunityFormMode
  onSubmit?: (opportunity: OpportunityRecord) => void
  onCancel?: () => void
  onEdit?: () => void
}

const statusOptions = ['Draft', 'Pending Approval', 'Approved', 'Accepted', 'Rejected']

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

export function OpportunityForm({
  opportunity,
  mode = 'create',
  onSubmit,
  onCancel,
  onEdit,
}: OpportunityFormProps) {
  const [formState, setFormState] = useState<OpportunityRecord>(() => {
    const base = opportunity ?? {
      id: `opp-${Date.now()}`,
      no: 0,
      title: '',
      source: '',
      date: '',
      division: '',
      status: 'Draft',
    }
    return {
      ...base,
      partnerName: base.partnerName ?? '',
      acronym: base.acronym ?? '',
      organizationType: base.organizationType ?? '',
      organizationTypeSpecify: base.organizationTypeSpecify ?? '',
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
      opportunityCategorySpecify: base.opportunityCategorySpecify ?? '',
      sourceSpecify: base.sourceSpecify ?? '',
      opportunityBackground: base.opportunityBackground ?? '',
      opportunityDescription: base.opportunityDescription ?? '',
      proposedCollaborationArea: base.proposedCollaborationArea ?? '',
      strategicAlignment: base.strategicAlignment ?? '',
      expectedBenefits: base.expectedBenefits ?? '',
      expectedOutcome: base.expectedOutcome ?? '',
      rejectionReason: base.rejectionReason ?? '',
    }
  })

  useEffect(() => {
    if (opportunity) {
      setFormState({
        ...opportunity,
        partnerName: opportunity.partnerName ?? '',
        acronym: opportunity.acronym ?? '',
        organizationType: opportunity.organizationType ?? '',
        organizationTypeSpecify: opportunity.organizationTypeSpecify ?? '',
        country: opportunity.country ?? '',
        regionState: opportunity.regionState ?? '',
        city: opportunity.city ?? '',
        website: opportunity.website ?? '',
        contactPersonName: opportunity.contactPersonName ?? '',
        positionTitle: opportunity.positionTitle ?? '',
        email: opportunity.email ?? '',
        existingRelationship: opportunity.existingRelationship ?? undefined,
        partnerInterestArea: opportunity.partnerInterestArea ?? '',
        strategicImportance: opportunity.strategicImportance ?? undefined,
        opportunityCategory: opportunity.opportunityCategory ?? '',
        opportunityCategorySpecify: opportunity.opportunityCategorySpecify ?? '',
        sourceSpecify: opportunity.sourceSpecify ?? '',
        opportunityBackground: opportunity.opportunityBackground ?? '',
        opportunityDescription: opportunity.opportunityDescription ?? '',
        proposedCollaborationArea: opportunity.proposedCollaborationArea ?? '',
        strategicAlignment: opportunity.strategicAlignment ?? '',
        expectedBenefits: opportunity.expectedBenefits ?? '',
        expectedOutcome: opportunity.expectedOutcome ?? '',
        rejectionReason: opportunity.rejectionReason ?? '',
      })
    }
  }, [opportunity])

  const isPreview = mode === 'preview'
  const canSubmit = mode !== 'preview'
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmModalType, setConfirmModalType] = useState<'sendForApproval' | 'approve' | null>(
    null
  )
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState(formState.rejectionReason || '')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    setAttachedFiles(Array.from(files))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      const finalState = { ...formState }
      if (finalState.status === 'Rejected') {
        finalState.status = 'Draft'
        finalState.rejectionReason = ''
      }
      onSubmit?.(finalState)
    }
  }

  const handleVerifyClick = () => {
    const type = formState.status === 'Pending Approval' ? 'approve' : 'sendForApproval'
    setConfirmModalType(type)
    setConfirmModalOpen(true)
  }

  const handleRejectClick = () => {
    setRejectReason(formState.rejectionReason || '')
    setRejectModalOpen(true)
  }

  const handleConfirmAction = () => {
    const updated = { ...formState }

    if (confirmModalType === 'sendForApproval') {
      updated.status = 'Pending Approval'
      updated.rejectionReason = ''
    }

    if (confirmModalType === 'approve') {
      updated.status = 'Approved'
      updated.rejectionReason = ''
    }

    setFormState(updated)
    onSubmit?.(updated)
    setConfirmModalOpen(false)
    setConfirmModalType(null)
  }

  const handleConfirmReject = () => {
    const updated = {
      ...formState,
      status: 'Rejected',
      rejectionReason: rejectReason,
    }
    setFormState(updated)
    onSubmit?.(updated)
    setRejectModalOpen(false)
  }

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="mt-4 sm:mt-0">
                <h1 className="text-2xl font-semibold text-slate-950">Register Events & Visits</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Register events, visits, and track outcomes
                </p>
                <div className="mt-4">
                  <StatusBadge status={formState.status} />
                </div>
              </div>
            </div>
            {formState.status !== 'Approved' && (
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="!bg-emerald-500 !text-white hover:!bg-emerald-600"
                  type="button"
                  onClick={handleVerifyClick}
                >
                  {formState.status === 'Pending Approval' ? 'Approve' : 'Send for approval'}
                </Button>
                <Button
                  className="!bg-red-500 !text-white hover:!bg-red-600"
                  type="button"
                  onClick={handleRejectClick}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="h-9 w-1 rounded-full bg-orange-500" />
                <h2 className="text-lg font-semibold text-slate-900">Opportunity information</h2>
              </div>
              <dl className="grid gap-4 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Opportunity ID</dt>
                  <dd className="font-semibold text-slate-950">{formState.id}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Opportunity Title</dt>
                  <dd className="font-semibold text-slate-950">{formState.title || 'N/A'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Partner name</dt>
                  <dd className="font-semibold text-slate-950">{formState.partnerName || 'N/A'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Division</dt>
                  <dd className="font-semibold text-slate-950">{formState.division || 'N/A'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Acronym</dt>
                  <dd className="font-semibold text-slate-950">{formState.acronym || 'N/A'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">organization type</dt>
                  <dd className="font-semibold text-slate-950">
                    {formState.organizationType || 'N/A'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Country</dt>
                  <dd className="font-semibold text-slate-950">{formState.country || 'N/A'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Region/State</dt>
                  <dd className="font-semibold text-slate-950">{formState.regionState || 'N/A'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">City</dt>
                  <dd className="font-semibold text-slate-950">{formState.city || 'N/A'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Website</dt>
                  <dd className="font-semibold text-slate-950">{formState.website || 'N/A'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Contact Person Name</dt>
                  <dd className="font-semibold text-slate-950">
                    {formState.contactPersonName || 'N/A'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Email</dt>
                  <dd className="font-semibold text-slate-950">{formState.email || 'N/A'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Partner interest Area</dt>
                  <dd className="font-semibold text-slate-950">
                    {formState.partnerInterestArea || 'N/A'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="font-medium text-slate-600">Opportunity Category</dt>
                  <dd className="font-semibold text-slate-950">
                    {formState.opportunityCategory || 'N/A'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-slate-600">Source of Opportunity</dt>
                  <dd className="font-semibold text-slate-950">{formState.source || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="h-9 w-1 rounded-full bg-orange-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Outcomes</h2>
                </div>
                <div className="space-y-4 text-sm text-slate-700">
                  <div>
                    <p className="font-semibold text-slate-900">Key Discussions:</p>
                    <p className="mt-2 text-slate-600">
                      {formState.opportunityBackground || 'No discussions provided.'}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Agreements Reached:</p>
                    <p className="mt-2 text-slate-600">
                      {formState.opportunityDescription || 'No agreements provided.'}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Action Points:</p>
                    <p className="mt-2 text-slate-600">
                      {formState.expectedOutcome || 'No action points provided.'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="h-9 w-1 rounded-full bg-orange-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
                </div>
                <div className="space-y-4">
                  {attachedFiles.length > 0 ? (
                    attachedFiles.map(file => (
                      <div
                        key={file.name}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                              <span className="text-lg font-semibold">DOC</span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-950">{file.name}</p>
                              <p className="text-xs text-slate-500">
                                {(file.size / 1024 / 1024).toFixed(1)} Mb
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm hover:bg-slate-100"
                          >
                            <span className="text-xl">👁</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                      No attached documents yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          title={confirmModalType === 'approve' ? 'Approval Confirmation' : 'Send for Approval'}
          size="sm"
        >
          <div className="px-6 py-6">
            <p className="text-sm leading-7 text-slate-600">
              {confirmModalType === 'approve'
                ? 'Are you sure you want to approve this opportunity?'
                : 'Send this opportunity for approval?'}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleConfirmAction}
                className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Rejection Reason"
          size="md"
        >
          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-700">
                Please provide a reason for rejecting this opportunity:
              </label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason here..."
                rows={4}
                className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                required
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="rounded-full"
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">
          {mode === 'edit' ? 'Edit Opportunity' : 'Opportunity Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-8" onSubmit={handleFormSubmit}>
          {/* Section 1: Opportunity Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="h-9 w-1 rounded-full bg-orange-500" />
              <h3 className="text-lg font-semibold text-slate-900">Opportunity Information</h3>
            </div>
            <div className="grid gap-8 xl:grid-cols-4 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Opportunity ID
                </label>
                <Input value={formState.id} disabled placeholder="Enter Opportunity ID" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Opportunity Title
                </label>
                <Input
                  value={formState.title}
                  onChange={e => setFormState(current => ({ ...current, title: e.target.value }))}
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
                  onChange={e =>
                    setFormState(current => ({ ...current, partnerName: e.target.value }))
                  }
                  placeholder="Enter Partner name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Acronym</label>
                <Input
                  value={formState.acronym}
                  onChange={e => setFormState(current => ({ ...current, acronym: e.target.value }))}
                  placeholder="Enter Acronym"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Organization Type
                </label>
                <select
                  value={formState.organizationType}
                  onChange={e =>
                    setFormState(current => ({ ...current, organizationType: e.target.value }))
                  }
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
                  onChange={e => setFormState(current => ({ ...current, country: e.target.value }))}
                  placeholder="Select Country"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Region/State
                </label>
                <select
                  value={formState.regionState}
                  onChange={e =>
                    setFormState(current => ({ ...current, regionState: e.target.value }))
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Region/State</option>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Amhara">Amhara</option>
                  <option value="Oromia">Oromia</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
                <select
                  value={formState.city}
                  onChange={e => setFormState(current => ({ ...current, city: e.target.value }))}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">City</option>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Bahir Dar">Bahir Dar</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Website</label>
                <Input
                  type="url"
                  value={formState.website}
                  onChange={e => setFormState(current => ({ ...current, website: e.target.value }))}
                  placeholder="Website"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Contact Person Name
                </label>
                <Input
                  value={formState.contactPersonName}
                  onChange={e =>
                    setFormState(current => ({ ...current, contactPersonName: e.target.value }))
                  }
                  placeholder="Contact Person Name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Position / Title
                </label>
                <Input
                  value={formState.positionTitle}
                  onChange={e =>
                    setFormState(current => ({ ...current, positionTitle: e.target.value }))
                  }
                  placeholder="Position / Title"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={e => setFormState(current => ({ ...current, email: e.target.value }))}
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Existing relationship with EAII
                </label>
                <select
                  value={formState.existingRelationship || ''}
                  onChange={e =>
                    setFormState(current => ({
                      ...current,
                      existingRelationship: (e.target.value as any) || undefined,
                    }))
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Select organization type</option>
                  {existingRelationships.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Partner interest Area
                </label>
                <Input
                  value={formState.partnerInterestArea}
                  onChange={e =>
                    setFormState(current => ({ ...current, partnerInterestArea: e.target.value }))
                  }
                  placeholder="Partner interest Area"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Strategic importance level
                </label>
                <select
                  value={formState.strategicImportance || ''}
                  onChange={e =>
                    setFormState(current => ({
                      ...current,
                      strategicImportance: (e.target.value as any) || undefined,
                    }))
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Strategic importance level</option>
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
                  onChange={e =>
                    setFormState(current => ({ ...current, opportunityCategory: e.target.value }))
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">Opportunity Category</option>
                  {opportunityCategories.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Source of Opportunity
                </label>
                <select
                  value={formState.source}
                  onChange={e => setFormState(current => ({ ...current, source: e.target.value }))}
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
                <label className="mb-2 block text-sm font-medium text-slate-700">Division</label>
                <select
                  value={formState.division}
                  onChange={e =>
                    setFormState(current => ({ ...current, division: e.target.value }))
                  }
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
            </div>
          </div>

          {/* Section 2: Outcomes */}
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
                    setFormState(current => ({
                      ...current,
                      opportunityDescription: e.target.value,
                    }))
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
                  onChange={e =>
                    setFormState(current => ({ ...current, expectedOutcome: e.target.value }))
                  }
                  placeholder="Expected Outcome"
                  rows={5}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Attachments */}
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
              <p className="mt-2 text-sm text-slate-500">select your file or drag and drop</p>
              <p className="text-sm text-slate-500">png, pdf, jpg, docx accepted</p>
              <label className="mt-4 inline-flex cursor-pointer items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#161A61] shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                browse
                <input type="file" multiple onChange={handleFileChange} className="sr-only" />
              </label>
              {attachedFiles.length > 0 && (
                <div className="mt-4 text-left text-sm text-slate-700">
                  <p className="font-semibold">Selected files:</p>
                  <ul className="mt-2 space-y-1 pl-4 list-disc">
                    {attachedFiles.map(file => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="!bg-[#ff9500] !text-white hover:!bg-[#e68a00]" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
