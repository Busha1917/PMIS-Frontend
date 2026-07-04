import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, Check, Upload, User } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import { Button, Modal } from '../../ui'
import type { PartnerContact, PartnerAdditionalContact, PartnerRecord } from '../../types'
import { partnerStore } from './partnerStore'

const ORGANIZATION_TYPES = [
  'Government',
  'Private Sector',
  'NGO',
  'Academic',
  'International Organization',
  'Regional Organization',
]
const COUNTRIES = [
  'Ethiopia',
  'Kenya',
  'USA',
  'UK',
  'Germany',
  'France',
  'Japan',
  'China',
  'South Africa',
]
const REGIONS = [
  'Africa',
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Middle East',
  'Oceania',
]
const PARTNERSHIP_CLASSIFICATIONS = [
  'Strategic Partner',
  'Operational Partner',
  'Technical Partner',
  'Financial Partner',
]
const GEOGRAPHIC_COVERAGES = ['International', 'Regional', 'National', 'Local']

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Pending Verification', value: 'Pending Verification' },
      { label: 'Verified', value: 'Verified' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

// ── Stepper Component (Top Navigation) ──────────────────────────────────────

type StepperProps = {
  currentStep: number
  totalSteps: number
}

function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isComplete = step < currentStep
        const isCurrent = step === currentStep
        const isLast = step === totalSteps

        return (
          <div key={step} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  isComplete
                    ? 'bg-[#2e3875] text-white'
                    : isCurrent
                      ? 'bg-[#2e3875] text-white'
                      : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isComplete ? (
                  <Check className="h-5 w-5" />
                ) : step === 5 ? (
                  <User className="h-5 w-5" />
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${isCurrent || isComplete ? 'text-[#2e3875]' : 'text-slate-400'}`}
              >
                Step {step}
              </span>
            </div>
            {/* Connector line */}
            {!isLast && (
              <div className={`mx-3 h-0.5 w-16 ${isComplete ? 'bg-[#2e3875]' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Status Timeline Sidebar ──────────────────────────────────────────────────

type TimelineItemProps = {
  title: string
  actor: string
  status: 'completed' | 'pending'
  date?: string
}

function TimelineItem({ title, actor, status, date }: TimelineItemProps) {
  return (
    <div className="flex items-start gap-3 border-l-2 border-slate-200 pl-4 pb-6 last:pb-0 relative">
      <div
        className={`absolute -left-[9px] mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          status === 'completed' ? 'border-white bg-[#2e3875]' : 'border-white bg-slate-300'
        }`}
      />
      <div className="flex-1 mt-0.5">
        <p className="text-xs font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-500">
          <User className="h-3 w-3" />
          {actor}
        </p>
        <div
          className={`mt-2 inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
            status === 'completed' ? 'bg-[#2e3875] text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {status === 'completed' ? 'Completed' : 'Pending'}
        </div>
        {date && <p className="mt-1 text-[10px] text-slate-400">Date: {date}</p>}
      </div>
    </div>
  )
}

type StatusSidebarProps = {
  partner: PartnerRecord
}

function StatusSidebar({ partner }: StatusSidebarProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'feedback'>('status')

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Tabs */}
      <div className="mb-4 flex gap-2 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('status')}
          className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'status'
              ? 'bg-[#2e3875] text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Status
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'feedback'
              ? 'bg-[#2e3875] text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Feedback
        </button>
      </div>

      {/* Timeline */}
      {activeTab === 'status' && (
        <div className="space-y-0">
          <TimelineItem
            title="Register Partner Information"
            actor="Partnership Officer"
            status={partner.submittedAt ? 'completed' : 'pending'}
            date={
              partner.submittedAt ? new Date(partner.submittedAt).toLocaleDateString() : undefined
            }
          />
          <TimelineItem
            title="Verify Partner"
            actor="Knowledge and ecosystem director"
            status={partner.verifiedAt ? 'completed' : 'pending'}
            date={
              partner.verifiedAt ? new Date(partner.verifiedAt).toLocaleDateString() : undefined
            }
          />
          <TimelineItem
            title="Approve Partner"
            actor="Responsible Division director"
            status={partner.approvedAt ? 'completed' : 'pending'}
            date={
              partner.approvedAt ? new Date(partner.approvedAt).toLocaleDateString() : undefined
            }
          />
        </div>
      )}
      {activeTab === 'feedback' && (
        <div className="text-sm text-slate-500">
          <p>No feedback yet</p>
        </div>
      )}
    </div>
  )
}

// ── Partner Stepper Form ─────────────────────────────────────────────────────

type FormState = {
  // Step 1
  name: string
  acronym: string
  organizationType: string
  country: string
  region: string
  website: string
  yearEstablished: string
  registrationLicenseNumber: string
  partnershipClassification: string
  // Step 2
  partnerLogo: string
  mission: string
  vision: string
  strategicFocusAreas: string
  keyExpertiseAreas: string
  aiRelatedFocusAreas: string
  // Step 3
  annualBudget: string
  numberOfEmployees: string
  geographicCoverage: string
  taxNumber: string
  // Step 4
  primaryContact: PartnerContact
  additionalContact: PartnerAdditionalContact
}

function buildForm(partner: PartnerRecord): FormState {
  return {
    name: partner.name || '',
    acronym: partner.acronym || '',
    organizationType: partner.organizationType || '',
    country: partner.country || '',
    region: partner.region || '',
    website: partner.website || '',
    yearEstablished: partner.yearEstablished || '',
    registrationLicenseNumber: partner.registrationLicenseNumber || '',
    partnershipClassification: partner.partnershipClassification || '',
    partnerLogo: partner.partnerLogo || '',
    mission: partner.mission || '',
    vision: partner.vision || '',
    strategicFocusAreas: partner.strategicFocusAreas || '',
    keyExpertiseAreas: partner.keyExpertiseAreas || '',
    aiRelatedFocusAreas: partner.aiRelatedFocusAreas || '',
    annualBudget: partner.annualBudget || '',
    numberOfEmployees: partner.numberOfEmployees || '',
    geographicCoverage: partner.geographicCoverage || '',
    taxNumber: partner.taxNumber || '',
    primaryContact: partner.primaryContact || {
      id: '1',
      fullName: '',
      position: '',
      department: '',
      email: '',
      mobilePhone: '',
      officePhone: '',
    },
    additionalContact: partner.additionalContact || {
      id: '1',
      fullName: '',
      title: '',
      email: '',
      phone: '',
      roleInPartnership: '',
    },
  }
}

type PartnerStepperFormProps = {
  partner: PartnerRecord
  onSave: (updated: PartnerRecord) => void
  onSubmit: (updated: PartnerRecord) => void
  onCancel: () => void
}

function PartnerStepperForm({ partner, onSave, onSubmit, onCancel }: PartnerStepperFormProps) {
  const [currentStep, setCurrentStep] = useState(partner.currentStep || 1)
  const [form, setForm] = useState<FormState>(() => buildForm(partner))
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isReadOnly = partner.status !== 'Draft'

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const setContact = <K extends keyof PartnerContact>(key: K, value: PartnerContact[K]) =>
    setForm(prev => ({ ...prev, primaryContact: { ...prev.primaryContact, [key]: value } }))

  const setAdditional = <K extends keyof PartnerAdditionalContact>(
    key: K,
    value: PartnerAdditionalContact[K]
  ) =>
    setForm(prev => ({ ...prev, additionalContact: { ...prev.additionalContact, [key]: value } }))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      set('partnerLogo', file.name)
    }
    e.target.value = ''
  }

  const applyForm = (): PartnerRecord => ({
    ...partner,
    ...form,
    currentStep,
  })

  const handleNext = () => {
    if (currentStep < 5) {
      const updated = applyForm()
      onSave(updated)
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const inputCls =
    'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#2e3875] focus:ring-2 focus:ring-[#2e3875]/10 disabled:bg-slate-100 disabled:text-slate-400'

  const sectionLabel = (text: string) => (
    <div className="flex items-center gap-2 mb-5">
      <span className="w-1 h-5 rounded-full bg-[#ff9500] inline-block" />
      <h2 className="text-sm font-semibold text-slate-900">{text}</h2>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main form area */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="text-[#2e3875] hover:text-slate-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#2e3875]">Partner Registration</h1>
                <p className="text-sm text-slate-500">
                  Register and manage partnership organizations
                </p>
              </div>
            </div>

            {/* Stepper */}
            <Stepper currentStep={currentStep} totalSteps={5} />

            {/* Form card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {sectionLabel('Basic Information')}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Partner Name
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Partner Name"
                        value={form.name}
                        disabled={isReadOnly}
                        onChange={e => set('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Acronym
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Acronym"
                        value={form.acronym}
                        disabled={isReadOnly}
                        onChange={e => set('acronym', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Organization Type
                      </label>
                      <select
                        className={inputCls}
                        value={form.organizationType}
                        disabled={isReadOnly}
                        onChange={e => set('organizationType', e.target.value)}
                      >
                        <option value="">Organization Type</option>
                        {ORGANIZATION_TYPES.map(t => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Country
                      </label>
                      <select
                        className={inputCls}
                        value={form.country}
                        disabled={isReadOnly}
                        onChange={e => set('country', e.target.value)}
                      >
                        <option value="">Country</option>
                        {COUNTRIES.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Region
                      </label>
                      <select
                        className={inputCls}
                        value={form.region}
                        disabled={isReadOnly}
                        onChange={e => set('region', e.target.value)}
                      >
                        <option value="">Region</option>
                        {REGIONS.map(r => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Website
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Website"
                        value={form.website}
                        disabled={isReadOnly}
                        onChange={e => set('website', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Year Established
                      </label>
                      <input
                        type="date"
                        className={inputCls}
                        placeholder="dd / mm / yyyy"
                        value={form.yearEstablished}
                        disabled={isReadOnly}
                        onChange={e => set('yearEstablished', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Registration/License Number
                      </label>
                      <input
                        className={inputCls}
                        placeholder="License Number"
                        value={form.registrationLicenseNumber}
                        disabled={isReadOnly}
                        onChange={e => set('registrationLicenseNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Organizational Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {sectionLabel('Organizational Details')}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Partner Logo
                    </label>
                    {form.partnerLogo ? (
                      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <svg
                            className="h-5 w-5 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {form.partnerLogo}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 cursor-pointer hover:border-[#2e3875] transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-6 w-6 text-slate-400" />
                        <p className="text-xs font-semibold text-slate-600">Select File</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.svg"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Partnership Classification
                      </label>
                      <select
                        className={inputCls}
                        value={form.partnershipClassification}
                        disabled={isReadOnly}
                        onChange={e => set('partnershipClassification', e.target.value)}
                      >
                        <option value="">Partnership Classification</option>
                        {PARTNERSHIP_CLASSIFICATIONS.map(p => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Partner Name
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Partner Name"
                        value={form.name}
                        disabled={isReadOnly}
                        onChange={e => set('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Acronym
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Acronym"
                        value={form.acronym}
                        disabled={isReadOnly}
                        onChange={e => set('acronym', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Organization Type
                      </label>
                      <select
                        className={inputCls}
                        value={form.organizationType}
                        disabled={isReadOnly}
                        onChange={e => set('organizationType', e.target.value)}
                      >
                        <option value="">Organization Type</option>
                        {ORGANIZATION_TYPES.map(t => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Country
                      </label>
                      <select
                        className={inputCls}
                        value={form.country}
                        disabled={isReadOnly}
                        onChange={e => set('country', e.target.value)}
                      >
                        <option value="">Country</option>
                        {COUNTRIES.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Region
                      </label>
                      <select
                        className={inputCls}
                        value={form.region}
                        disabled={isReadOnly}
                        onChange={e => set('region', e.target.value)}
                      >
                        <option value="">Region</option>
                        {REGIONS.map(r => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Website
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Website"
                        value={form.website}
                        disabled={isReadOnly}
                        onChange={e => set('website', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Year Established
                      </label>
                      <input
                        type="date"
                        className={inputCls}
                        placeholder="dd / mm / yyyy"
                        value={form.yearEstablished}
                        disabled={isReadOnly}
                        onChange={e => set('yearEstablished', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Registration/License Number
                      </label>
                      <input
                        className={inputCls}
                        placeholder="License Number"
                        value={form.registrationLicenseNumber}
                        disabled={isReadOnly}
                        onChange={e => set('registrationLicenseNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Organizational Details (continued) */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {sectionLabel('Organizational Details')}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Mission
                      </label>
                      <textarea
                        rows={3}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#2e3875] focus:ring-2 focus:ring-[#2e3875]/10 resize-none disabled:bg-slate-100"
                        placeholder="Mission"
                        value={form.mission}
                        disabled={isReadOnly}
                        onChange={e => set('mission', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Vision
                      </label>
                      <textarea
                        rows={3}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#2e3875] focus:ring-2 focus:ring-[#2e3875]/10 resize-none disabled:bg-slate-100"
                        placeholder="Vision"
                        value={form.vision}
                        disabled={isReadOnly}
                        onChange={e => set('vision', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Strategic Focus Areas
                    </label>
                    <textarea
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#2e3875] focus:ring-2 focus:ring-[#2e3875]/10 resize-none disabled:bg-slate-100"
                      placeholder="Strategic Focus Areas"
                      value={form.strategicFocusAreas}
                      disabled={isReadOnly}
                      onChange={e => set('strategicFocusAreas', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Key Expertise Areas
                    </label>
                    <textarea
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#2e3875] focus:ring-2 focus:ring-[#2e3875]/10 resize-none disabled:bg-slate-100"
                      placeholder="Key Expertise Areas"
                      value={form.keyExpertiseAreas}
                      disabled={isReadOnly}
                      onChange={e => set('keyExpertiseAreas', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      AI-related Focus Areas
                    </label>
                    <input
                      className={inputCls}
                      placeholder="AI-related Focus Areas"
                      value={form.aiRelatedFocusAreas}
                      disabled={isReadOnly}
                      onChange={e => set('aiRelatedFocusAreas', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Annual Budget
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Annual Budget"
                        value={form.annualBudget}
                        disabled={isReadOnly}
                        onChange={e => set('annualBudget', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Number of Employees
                      </label>
                      <input
                        type="number"
                        className={inputCls}
                        placeholder="Number of Employees"
                        value={form.numberOfEmployees}
                        disabled={isReadOnly}
                        onChange={e => set('numberOfEmployees', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Geographic Coverage
                      </label>
                      <select
                        className={inputCls}
                        value={form.geographicCoverage}
                        disabled={isReadOnly}
                        onChange={e => set('geographicCoverage', e.target.value)}
                      >
                        <option value="">Geographic Coverage</option>
                        {GEOGRAPHIC_COVERAGES.map(g => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Tax Number
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Tax Number"
                        value={form.taxNumber}
                        disabled={isReadOnly}
                        onChange={e => set('taxNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Primary Contact */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {sectionLabel('Primary Contact')}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Full Name
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Full Name"
                        value={form.primaryContact.fullName}
                        disabled={isReadOnly}
                        onChange={e => setContact('fullName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Position
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Position"
                        value={form.primaryContact.position}
                        disabled={isReadOnly}
                        onChange={e => setContact('position', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Department
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Department"
                        value={form.primaryContact.department}
                        disabled={isReadOnly}
                        onChange={e => setContact('department', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Email
                      </label>
                      <input
                        type="email"
                        className={inputCls}
                        placeholder="Email"
                        value={form.primaryContact.email}
                        disabled={isReadOnly}
                        onChange={e => setContact('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Mobile Phone
                      </label>
                      <input
                        type="tel"
                        className={inputCls}
                        placeholder="Mobile Phone"
                        value={form.primaryContact.mobilePhone}
                        disabled={isReadOnly}
                        onChange={e => setContact('mobilePhone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Office Phone
                      </label>
                      <input
                        type="tel"
                        className={inputCls}
                        placeholder="Office Phone"
                        value={form.primaryContact.officePhone}
                        disabled={isReadOnly}
                        onChange={e => setContact('officePhone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6 mt-6">
                    {sectionLabel('Additional Contact (if any)')}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                          Full Name
                        </label>
                        <input
                          className={inputCls}
                          placeholder="Full Name"
                          value={form.additionalContact.fullName}
                          disabled={isReadOnly}
                          onChange={e => setAdditional('fullName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                          Title
                        </label>
                        <input
                          className={inputCls}
                          placeholder="Title"
                          value={form.additionalContact.title}
                          disabled={isReadOnly}
                          onChange={e => setAdditional('title', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                          Email
                        </label>
                        <input
                          type="email"
                          className={inputCls}
                          placeholder="Email"
                          value={form.additionalContact.email}
                          disabled={isReadOnly}
                          onChange={e => setAdditional('email', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                          Phone
                        </label>
                        <input
                          type="tel"
                          className={inputCls}
                          placeholder="Phone"
                          value={form.additionalContact.phone}
                          disabled={isReadOnly}
                          onChange={e => setAdditional('phone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Role in Partnership
                      </label>
                      <input
                        className={inputCls}
                        placeholder="Role in Partnership"
                        value={form.additionalContact.roleInPartnership}
                        disabled={isReadOnly}
                        onChange={e => setAdditional('roleInPartnership', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  {sectionLabel('Review Partner Information')}

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Column 1 */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Partner Name</p>
                        <p className="text-sm text-slate-900">{form.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Acronym</p>
                        <p className="text-sm text-slate-900">{form.acronym || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Organization Type
                        </p>
                        <p className="text-sm text-slate-900">{form.organizationType || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Country</p>
                        <p className="text-sm text-slate-900">{form.country || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Region</p>
                        <p className="text-sm text-slate-900">{form.region || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Website</p>
                        <p className="text-sm text-slate-900">{form.website || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Year Established
                        </p>
                        <p className="text-sm text-slate-900">{form.yearEstablished || '—'}</p>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Registration/License Number
                        </p>
                        <p className="text-sm text-slate-900">
                          {form.registrationLicenseNumber || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Partnership Classification
                        </p>
                        <p className="text-sm text-slate-900">
                          {form.partnershipClassification || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Mission</p>
                        <p className="text-sm text-slate-900">{form.mission || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Vision</p>
                        <p className="text-sm text-slate-900">{form.vision || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Strategic Focus Areas
                        </p>
                        <p className="text-sm text-slate-900">{form.strategicFocusAreas || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Key Expertise Areas
                        </p>
                        <p className="text-sm text-slate-900">{form.keyExpertiseAreas || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          AI-related Focus Areas
                        </p>
                        <p className="text-sm text-slate-900">{form.aiRelatedFocusAreas || '—'}</p>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Annual Budget</p>
                        <p className="text-sm text-slate-900">{form.annualBudget || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Number of Employees
                        </p>
                        <p className="text-sm text-slate-900">{form.numberOfEmployees || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Geographic Coverage
                        </p>
                        <p className="text-sm text-slate-900">{form.geographicCoverage || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Tax Number</p>
                        <p className="text-sm text-slate-900">{form.taxNumber || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Primary Contact</p>
                        <p className="text-sm text-slate-900">
                          {form.primaryContact.fullName || '—'}
                        </p>
                        <p className="text-xs text-slate-600">{form.primaryContact.email || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Additional Contact
                        </p>
                        <p className="text-sm text-slate-900">
                          {form.additionalContact.fullName || '—'}
                        </p>
                        <p className="text-xs text-slate-600">
                          {form.additionalContact.email || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                </div>
                <div>
                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isReadOnly}
                      className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                      style={{ backgroundColor: '#ff9500' }}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSubmitModalOpen(true)}
                      disabled={isReadOnly}
                      className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                      style={{ backgroundColor: '#ff9500' }}
                    >
                      Submit for Verification
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <StatusSidebar partner={partner} />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Partner Registration"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to submit this partner registration for verification?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const updated = applyForm()
                onSubmit(updated)
                setSubmitModalOpen(false)
              }}
              style={{ backgroundColor: '#ff9500', color: 'white' }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── Main Page Component ──────────────────────────────────────────────────────

export default function OfficerPartnerPage() {
  const [partners, setPartners] = useState<PartnerRecord[]>([])
  const [selectedPartner, setSelectedPartner] = useState<PartnerRecord | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({})

  useEffect(() => {
    setPartners(partnerStore.getAll())
  }, [])

  const filteredPartners = useMemo(() => {
    let result = partners
    if (filters.status) {
      result = result.filter(p => p.status === filters.status)
    }
    return result
  }, [partners, filters])

  const handleCreate = () => {
    const newPartner = partnerStore.create()
    setPartners(partnerStore.getAll())
    setSelectedPartner(newPartner)
    setShowForm(true)
  }

  const handleEdit = (partner: PartnerRecord) => {
    setSelectedPartner(partner)
    setShowForm(true)
  }

  const handleSave = (updated: PartnerRecord) => {
    partnerStore.update(updated)
    setPartners(partnerStore.getAll())
  }

  const handleSubmit = (updated: PartnerRecord) => {
    const submitted = {
      ...updated,
      status: 'Pending Verification' as const,
      submittedAt: new Date().toISOString(),
    }
    partnerStore.update(submitted)
    setPartners(partnerStore.getAll())
    setShowForm(false)
    setSelectedPartner(null)
    toast.success('Partner registration submitted for verification')
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedPartner(null)
  }

  const columns = [
    {
      label: 'No.',
      render: (_item: PartnerRecord, index?: number) => (
        <span className="font-semibold text-slate-900">{index || 1}</span>
      ),
      headClassName: 'bg-[#0b265a] text-white text-center',
    },
    {
      label: 'Partner Name',
      render: (item: PartnerRecord) => item.name,
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Acronym',
      render: (item: PartnerRecord) => item.acronym || '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Type',
      render: (item: PartnerRecord) => item.organizationType || '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Country',
      render: (item: PartnerRecord) => item.country || '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Classification',
      render: (item: PartnerRecord) => item.partnershipClassification || '—',
      headClassName: 'bg-[#0b265a] text-white',
    },
    {
      label: 'Status',
      render: (item: PartnerRecord) => <StatusBadge status={item.status} />,
      headClassName: 'bg-[#0b265a] text-white text-center',
      cellClassName: 'text-center',
    },
    {
      label: 'Action',
      render: (item: PartnerRecord) => (
        <button
          onClick={() => handleEdit(item)}
          className="text-sm font-medium text-[#ff9500] hover:text-[#e68a00]"
        >
          Edit
        </button>
      ),
      headClassName: 'bg-[#0b265a] text-white text-center',
      cellClassName: 'text-center',
    },
  ]

  if (showForm && selectedPartner) {
    return (
      <PartnerStepperForm
        partner={selectedPartner}
        onSave={handleSave}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="space-y-4 p-6">
      <PageHeaderCard
        title="Partner Management"
        description="Register and manage partnership organizations"
      />
      <PageToolbar
        searchPlaceholder="Search partners..."
        addLabel="Register Partner"
        onAdd={handleCreate}
        onFilter={() => setFilterDrawerOpen(true)}
      />
      <DataTable
        items={filteredPartners}
        rowKey={item => item.id}
        columns={columns}
        emptyVariant="empty"
        emptyMessage="No partners found"
        emptyAction={
          <button
            onClick={handleCreate}
            className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
          >
            Register Partner
          </button>
        }
      />
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        fields={FILTER_FIELDS}
        onApply={setFilters}
        title="Filter Partners"
      />
    </div>
  )
}
