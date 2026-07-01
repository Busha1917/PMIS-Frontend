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

const statusOptions = ['Draft', 'Approved', 'Accepted', 'Rejected']

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

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-0 bg-transparent p-0 text-slate-700 shadow-none hover:bg-transparent hover:text-slate-950"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Opportunity Details
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {formState.title || 'Opportunity Preview'}
              </h1>
              <p className="mt-2 text-sm text-slate-500">ID: {formState.id}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={formState.status} />
              {formState.status !== 'Accepted' && (
                <Button
                  variant="outline"
                  onClick={onEdit ?? onCancel}
                  className="rounded-full border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Button>
              )}
            </div>
          </div>

          {formState.status === 'Rejected' && formState.rejectionReason && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
              <span className="font-bold">Rejection Reason:</span> {formState.rejectionReason}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Card 1: Key Info */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                    Opportunity Info
                  </p>
                  <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                </div>
                <dl className="divide-y divide-slate-100 text-sm text-slate-700">
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Opportunity Title</dt>
                    <dd className="font-semibold text-slate-950">{formState.title || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Date Identified</dt>
                    <dd className="font-semibold text-slate-950">{formState.date || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Existing Relationship</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.existingRelationship || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Strategic Importance</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.strategicImportance || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Opportunity Category</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.opportunityCategory === 'other(specify)'
                        ? `Other: ${formState.opportunityCategorySpecify || ''}`
                        : formState.opportunityCategory || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Source of Opportunity</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.source === 'other(specify)'
                        ? `Other: ${formState.sourceSpecify || ''}`
                        : formState.source || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Division</dt>
                    <dd className="font-semibold text-slate-950">{formState.division || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              {/* Card 2: Partner & Contact Details */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                    Partner & Contact Details
                  </p>
                  <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                </div>
                <dl className="divide-y divide-slate-100 text-sm text-slate-700">
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Partner Name</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.partnerName || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Acronym</dt>
                    <dd className="font-semibold text-slate-950">{formState.acronym || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Organization Type</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.organizationType === 'other(specify)'
                        ? `Other: ${formState.organizationTypeSpecify || ''}`
                        : formState.organizationType || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Country</dt>
                    <dd className="font-semibold text-slate-950">{formState.country || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Region/State</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.regionState || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">City</dt>
                    <dd className="font-semibold text-slate-950">{formState.city || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Website</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.website ? (
                        <a
                          href={formState.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {formState.website}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Contact Person Name</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.contactPersonName || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Position / Title</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.positionTitle || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="font-semibold text-slate-950">{formState.email || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-slate-500">Partner Interest Area</dt>
                    <dd className="font-semibold text-slate-950">
                      {formState.partnerInterestArea || 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Card 3: Descriptions */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                    Opportunity Description & Scope
                  </p>
                  <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
                </div>
                <div className="space-y-6 text-sm text-slate-700">
                  <div>
                    <h4 className="font-semibold text-slate-950">Opportunity Background</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.opportunityBackground || 'No background information provided.'}
                    </p>
                  </div>
                  <hr className="border-slate-100" />
                  <div>
                    <h4 className="font-semibold text-slate-950">Opportunity Description</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.opportunityDescription || 'No description provided.'}
                    </p>
                  </div>
                  <hr className="border-slate-100" />
                  <div>
                    <h4 className="font-semibold text-slate-950">Proposed Collaboration Area</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.proposedCollaborationArea ||
                        'No proposed collaboration area provided.'}
                    </p>
                  </div>
                  <hr className="border-slate-100" />
                  <div>
                    <h4 className="font-semibold text-slate-950">Strategic Alignment</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.strategicAlignment ||
                        'No strategic alignment information provided.'}
                    </p>
                  </div>
                  <hr className="border-slate-100" />
                  <div>
                    <h4 className="font-semibold text-slate-950">Expected Benefits</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.expectedBenefits || 'No expected benefits provided.'}
                    </p>
                  </div>
                  <hr className="border-slate-100" />
                  <div>
                    <h4 className="font-semibold text-slate-950">Expected Outcome</h4>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {formState.expectedOutcome || 'No expected outcome provided.'}
                    </p>
                  </div>
                </div>
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
        <CardTitle className="text-base font-semibold text-slate-950">
          {mode === 'edit' ? 'Edit Opportunity' : 'Opportunity Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-8" onSubmit={handleFormSubmit}>
          {/* Section 1: Opportunity Information */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900 mb-6 border-b border-slate-100 pb-2">
              1. Opportunity Information
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Opportunity Title
                </label>
                <Input
                  value={formState.title}
                  onChange={e => setFormState(current => ({ ...current, title: e.target.value }))}
                  placeholder="Enter opportunity title"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date Identified
                </label>
                <Input
                  type="date"
                  value={formState.date}
                  onChange={e => setFormState(current => ({ ...current, date: e.target.value }))}
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
                  placeholder="Enter partner name"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Acronym</label>
                <Input
                  value={formState.acronym}
                  onChange={e => setFormState(current => ({ ...current, acronym: e.target.value }))}
                  placeholder="Enter acronym"
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
                  required
                >
                  <option value="">Select organization type</option>
                  {organizationTypes.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {formState.organizationType === 'other(specify)' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Specify Org Type
                  </label>
                  <Input
                    value={formState.organizationTypeSpecify}
                    onChange={e =>
                      setFormState(current => ({
                        ...current,
                        organizationTypeSpecify: e.target.value,
                      }))
                    }
                    placeholder="Specify organization type"
                    required
                  />
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
                <Input
                  value={formState.country}
                  onChange={e => setFormState(current => ({ ...current, country: e.target.value }))}
                  placeholder="Enter country"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Region/State
                </label>
                <Input
                  value={formState.regionState}
                  onChange={e =>
                    setFormState(current => ({ ...current, regionState: e.target.value }))
                  }
                  placeholder="Enter region/state"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
                <Input
                  value={formState.city}
                  onChange={e => setFormState(current => ({ ...current, city: e.target.value }))}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Website</label>
                <Input
                  type="url"
                  value={formState.website}
                  onChange={e => setFormState(current => ({ ...current, website: e.target.value }))}
                  placeholder="https://example.com"
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
                  placeholder="Enter contact name"
                  required
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
                  placeholder="Enter position"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={e => setFormState(current => ({ ...current, email: e.target.value }))}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Existing Relationship
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
                  onChange={e =>
                    setFormState(current => ({ ...current, partnerInterestArea: e.target.value }))
                  }
                  placeholder="e.g. AI Research, Agriculture"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Strategic Importance
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
                  <option value="">Select importance</option>
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
                  required
                >
                  <option value="">Select category</option>
                  {opportunityCategories.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {formState.opportunityCategory === 'other(specify)' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Specify Category
                  </label>
                  <Input
                    value={formState.opportunityCategorySpecify}
                    onChange={e =>
                      setFormState(current => ({
                        ...current,
                        opportunityCategorySpecify: e.target.value,
                      }))
                    }
                    placeholder="Specify category"
                    required
                  />
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Source of Opportunity
                </label>
                <select
                  value={formState.source}
                  onChange={e => setFormState(current => ({ ...current, source: e.target.value }))}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                  required
                >
                  <option value="">Select source</option>
                  {opportunitySources.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {formState.source === 'other(specify)' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Specify Source
                  </label>
                  <Input
                    value={formState.sourceSpecify}
                    onChange={e =>
                      setFormState(current => ({ ...current, sourceSpecify: e.target.value }))
                    }
                    placeholder="Specify source"
                    required
                  />
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Division</label>
                <Input
                  value={formState.division}
                  onChange={e =>
                    setFormState(current => ({ ...current, division: e.target.value }))
                  }
                  placeholder="e.g. Finance, Business"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900 mb-6 border-b border-slate-100 pb-2">
              2. Description & Collaboration Details
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Opportunity Background
                </label>
                <textarea
                  value={formState.opportunityBackground}
                  onChange={e =>
                    setFormState(current => ({ ...current, opportunityBackground: e.target.value }))
                  }
                  placeholder="Describe context / background"
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
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
                  placeholder="Detail the opportunity"
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Proposed Collaboration Area
                </label>
                <textarea
                  value={formState.proposedCollaborationArea}
                  onChange={e =>
                    setFormState(current => ({
                      ...current,
                      proposedCollaborationArea: e.target.value,
                    }))
                  }
                  placeholder="Where can we collaborate?"
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Strategic Alignment
                </label>
                <textarea
                  value={formState.strategicAlignment}
                  onChange={e =>
                    setFormState(current => ({ ...current, strategicAlignment: e.target.value }))
                  }
                  placeholder="Explain how this aligns with EAII strategic goals"
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
                  onChange={e =>
                    setFormState(current => ({ ...current, expectedBenefits: e.target.value }))
                  }
                  placeholder="What benefits will this provide to EAII?"
                  rows={4}
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
                  placeholder="What outcomes are expected?"
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                />
              </div>
            </div>
          </div>

          {/* Status & Submit buttons */}
          <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t border-slate-200">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={formState.status}
                onChange={e => setFormState(prev => ({ ...prev, status: e.target.value }))}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end justify-end gap-3">
              <Button variant="outline" type="button" onClick={onCancel}>
                Close
              </Button>
              {canSubmit && (
                <Button className="!bg-[#ff9500] !text-white hover:!bg-[#e68a00]" type="submit">
                  Save
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
