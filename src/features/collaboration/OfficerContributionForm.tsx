import { useState } from 'react'
import { ArrowLeft, Check, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Select } from '../../ui'
import { StatusBadge } from '../../components/StatusBadge'
import type { ResourceContributionRecord } from '../../types'
import { contributionStore } from './contributionStore'

const STEP_LABELS = ['EAII Contributions', 'Partner Contributions', 'Estimated Value']
const TOTAL_STEPS = 3

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(step => {
        const done = step < currentStep
        const active = step === currentStep
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                  done
                    ? 'border-[#161A61] bg-[#161A61] text-white'
                    : active
                      ? 'border-[#ff9500] bg-white text-[#ff9500]'
                      : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {done ? (
                  <Check className="h-4 w-4" />
                ) : step === TOTAL_STEPS ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  step
                )}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium whitespace-nowrap ${
                  active ? 'text-[#ff9500]' : done ? 'text-[#161A61]' : 'text-slate-400'
                }`}
              >
                {STEP_LABELS[step - 1]}
              </span>
            </div>
            {step < TOTAL_STEPS && (
              <div
                className={`mx-2 mb-4 h-0.5 w-20 sm:w-32 ${done ? 'bg-[#161A61]' : 'bg-slate-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function SH({ title }: { title: string }) {
  return (
    <div className="border-l-4 border-[#ff9500] pl-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  )
}

// ── Checkbox row with optional details textarea ───────────────────────────────
function ContribRow({
  label,
  checked,
  details,
  disabled,
  onToggle,
  onDetails,
}: {
  label: string
  checked: boolean
  details?: string
  disabled?: boolean
  onToggle: () => void
  onDetails: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
          checked
            ? 'border-[#161A61] bg-[#161A61]/5 text-[#161A61]'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
            checked ? 'border-[#ff9500] bg-[#ff9500]' : 'border-slate-300 bg-white'
          }`}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </button>
      {checked && !disabled && (
        <textarea
          value={details ?? ''}
          onChange={e => onDetails(e.target.value)}
          placeholder={`Details about ${label.toLowerCase()} contribution...`}
          rows={2}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#161A61] focus:ring-1 focus:ring-[#161A61]/10 resize-none"
        />
      )}
    </div>
  )
}

interface Props {
  contribution: ResourceContributionRecord
  onClose: () => void
}

export function OfficerContributionForm({ contribution, onClose }: Props) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<ResourceContributionRecord>({ ...contribution })
  const isReadOnly = contribution.status !== 'Draft'

  // ── EAII toggle + details ───────────────────────────────────────────────────
  const setEaii = (
    key: keyof ResourceContributionRecord['eaiiContributions'],
    value: boolean | string
  ) => setForm(f => ({ ...f, eaiiContributions: { ...f.eaiiContributions, [key]: value } }))

  // ── Partner toggle + details ────────────────────────────────────────────────
  const setPartner = (
    key: keyof ResourceContributionRecord['partnerContributions'],
    value: boolean | string
  ) => setForm(f => ({ ...f, partnerContributions: { ...f.partnerContributions, [key]: value } }))

  // ── Compute total automatically ─────────────────────────────────────────────
  const setMonetary = (v: string) => {
    const monetary = parseFloat(v) || 0
    const inKind = parseFloat(form.inKindValue) || 0
    setForm(f => ({ ...f, monetaryValue: v, totalValue: String(monetary + inKind) }))
  }
  const setInKind = (v: string) => {
    const inKind = parseFloat(v) || 0
    const monetary = parseFloat(form.monetaryValue) || 0
    setForm(f => ({ ...f, inKindValue: v, totalValue: String(monetary + inKind) }))
  }

  const handleSaveDraft = () => {
    contributionStore.update({ ...form, status: 'Draft' })
    toast.success('Contribution saved as draft')
    onClose()
  }

  const handleSubmit = () => {
    contributionStore.update({
      ...form,
      status: 'Pending Approval',
      submittedBy: 'Officer',
      submittedAt: new Date().toISOString(),
    })
    toast.success('Contribution submitted for approval!')
    onClose()
  }

  const eaii = form.eaiiContributions
  const partner = form.partnerContributions

  // ── Count selected items for sidebar ──────────────────────────────────────
  const eaiiCount = [
    eaii.staff,
    eaii.infrastructure,
    eaii.funding,
    eaii.equipment,
    eaii.dataResources,
  ].filter(Boolean).length
  const partnerCount = [
    partner.staff,
    partner.funding,
    partner.technology,
    partner.equipment,
    partner.expertise,
  ].filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#161A61]">Resource Contribution</h1>
          <p className="text-sm text-slate-500">
            {form.id} · Register a resource contribution record
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="rounded-2xl bg-white p-5 shadow-sm overflow-x-auto">
        <StepIndicator currentStep={step} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Main Form ── */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm space-y-6">
            {/* ── STEP 1: EAII Contributions ── */}
            {step === 1 && (
              <>
                <SH title="EAII Contributions" />
                <p className="text-sm text-slate-500">
                  Select all resource types that EAII is contributing to this partnership.
                </p>
                <div className="space-y-3">
                  <ContribRow
                    label="Staff"
                    checked={eaii.staff}
                    details={eaii.staffDetails}
                    disabled={isReadOnly}
                    onToggle={() => setEaii('staff', !eaii.staff)}
                    onDetails={v => setEaii('staffDetails', v)}
                  />
                  <ContribRow
                    label="Infrastructure"
                    checked={eaii.infrastructure}
                    details={eaii.infrastructureDetails}
                    disabled={isReadOnly}
                    onToggle={() => setEaii('infrastructure', !eaii.infrastructure)}
                    onDetails={v => setEaii('infrastructureDetails', v)}
                  />
                  <ContribRow
                    label="Funding"
                    checked={eaii.funding}
                    details={eaii.fundingDetails}
                    disabled={isReadOnly}
                    onToggle={() => setEaii('funding', !eaii.funding)}
                    onDetails={v => setEaii('fundingDetails', v)}
                  />
                  <ContribRow
                    label="Equipment"
                    checked={eaii.equipment}
                    details={eaii.equipmentDetails}
                    disabled={isReadOnly}
                    onToggle={() => setEaii('equipment', !eaii.equipment)}
                    onDetails={v => setEaii('equipmentDetails', v)}
                  />
                  <ContribRow
                    label="Data Resources"
                    checked={eaii.dataResources}
                    details={eaii.dataResourcesDetails}
                    disabled={isReadOnly}
                    onToggle={() => setEaii('dataResources', !eaii.dataResources)}
                    onDetails={v => setEaii('dataResourcesDetails', v)}
                  />
                </div>
              </>
            )}

            {/* ── STEP 2: Partner Contributions ── */}
            {step === 2 && (
              <>
                <SH title="Partner Contributions" />
                <p className="text-sm text-slate-500">
                  Select all resource types the partner organization is contributing.
                </p>
                <div className="space-y-3">
                  <ContribRow
                    label="Staff"
                    checked={partner.staff}
                    details={partner.staffDetails}
                    disabled={isReadOnly}
                    onToggle={() => setPartner('staff', !partner.staff)}
                    onDetails={v => setPartner('staffDetails', v)}
                  />
                  <ContribRow
                    label="Funding"
                    checked={partner.funding}
                    details={partner.fundingDetails}
                    disabled={isReadOnly}
                    onToggle={() => setPartner('funding', !partner.funding)}
                    onDetails={v => setPartner('fundingDetails', v)}
                  />
                  <ContribRow
                    label="Technology"
                    checked={partner.technology}
                    details={partner.technologyDetails}
                    disabled={isReadOnly}
                    onToggle={() => setPartner('technology', !partner.technology)}
                    onDetails={v => setPartner('technologyDetails', v)}
                  />
                  <ContribRow
                    label="Equipment"
                    checked={partner.equipment}
                    details={partner.equipmentDetails}
                    disabled={isReadOnly}
                    onToggle={() => setPartner('equipment', !partner.equipment)}
                    onDetails={v => setPartner('equipmentDetails', v)}
                  />
                  <ContribRow
                    label="Expertise"
                    checked={partner.expertise}
                    details={partner.expertiseDetails}
                    disabled={isReadOnly}
                    onToggle={() => setPartner('expertise', !partner.expertise)}
                    onDetails={v => setPartner('expertiseDetails', v)}
                  />
                </div>
              </>
            )}

            {/* ── STEP 3: Estimated Value ── */}
            {step === 3 && (
              <>
                <SH title="Estimated Value" />
                <p className="text-sm text-slate-500">
                  Provide the estimated monetary and in-kind values for this contribution.
                </p>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Currency
                  </label>
                  <Select
                    value={form.currency}
                    onValueChange={v => setForm(f => ({ ...f, currency: v }))}
                    disabled={isReadOnly}
                  >
                    <option value="ETB">ETB — Ethiopian Birr</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Monetary Value
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 500000"
                      value={form.monetaryValue}
                      onChange={e => setMonetary(e.target.value)}
                      disabled={isReadOnly}
                    />
                    <p className="mt-1 text-xs text-slate-400">Cash, grants, financial transfers</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      In-Kind Value
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 200000"
                      value={form.inKindValue}
                      onChange={e => setInKind(e.target.value)}
                      disabled={isReadOnly}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Equipment, staff time, infrastructure
                    </p>
                  </div>
                </div>

                {/* Total auto-computed */}
                <div className="rounded-xl border border-[#161A61]/20 bg-[#161A61]/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#161A61]">Total Estimated Value</span>
                    <span className="text-lg font-extrabold text-[#161A61]">
                      {form.currency} {parseFloat(form.totalValue || '0').toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Monetary + In-Kind combined</p>
                </div>

                {/* Summary of selected contributions */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <p className="text-sm font-semibold text-slate-700">Contribution Summary</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1.5">
                        EAII ({eaiiCount} selected)
                      </p>
                      {[
                        { key: 'staff', label: 'Staff' },
                        { key: 'infrastructure', label: 'Infrastructure' },
                        { key: 'funding', label: 'Funding' },
                        { key: 'equipment', label: 'Equipment' },
                        { key: 'dataResources', label: 'Data Resources' },
                      ].map(
                        ({ key, label }) =>
                          eaii[key as keyof typeof eaii] === true && (
                            <div
                              key={key}
                              className="flex items-center gap-1.5 text-xs text-[#161A61]"
                            >
                              <Check className="h-3 w-3" /> {label}
                            </div>
                          )
                      )}
                      {eaiiCount === 0 && <p className="text-xs text-slate-400">None selected</p>}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1.5">
                        Partner ({partnerCount} selected)
                      </p>
                      {[
                        { key: 'staff', label: 'Staff' },
                        { key: 'funding', label: 'Funding' },
                        { key: 'technology', label: 'Technology' },
                        { key: 'equipment', label: 'Equipment' },
                        { key: 'expertise', label: 'Expertise' },
                      ].map(
                        ({ key, label }) =>
                          partner[key as keyof typeof partner] === true && (
                            <div
                              key={key}
                              className="flex items-center gap-1.5 text-xs text-[#161A61]"
                            >
                              <Check className="h-3 w-3" /> {label}
                            </div>
                          )
                      )}
                      {partnerCount === 0 && (
                        <p className="text-xs text-slate-400">None selected</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-2">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(s => s - 1)}>
                  ← Back
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-3">
                {!isReadOnly && (
                  <Button variant="outline" onClick={handleSaveDraft}>
                    Save as Draft
                  </Button>
                )}
                {step < TOTAL_STEPS ? (
                  <Button
                    onClick={() => setStep(s => s + 1)}
                    className="bg-[#ff9500] hover:bg-[#e68a00]"
                  >
                    Next →
                  </Button>
                ) : !isReadOnly ? (
                  <Button onClick={handleSubmit} className="bg-[#161A61] hover:bg-[#0f1347]">
                    Submit for Approval
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex gap-2">
              <span className="rounded-lg bg-[#161A61] px-4 py-2 text-sm font-semibold text-white">
                Status
              </span>
              <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                Feedback
              </span>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    form.status === 'Pending Approval' || form.status === 'Approved'
                      ? 'border-[#161A61] bg-[#161A61]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {form.status === 'Pending Approval' || form.status === 'Approved' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Register Contribution</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="inline-block h-3 w-3 rounded-full bg-slate-300" />
                    Officer
                  </div>
                  <div
                    className={`mt-2 inline-block rounded-md px-3 py-1 text-xs font-semibold ${
                      form.status === 'Pending Approval'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {form.status === 'Pending Approval' ? 'Submitted' : 'Pending'}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Date:{' '}
                    {form.submittedAt
                      ? new Date(form.submittedAt).toLocaleDateString()
                      : '- - - - -'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    form.status === 'Approved'
                      ? 'border-green-500 bg-green-500'
                      : form.status === 'Rejected'
                        ? 'border-red-500 bg-red-500'
                        : 'border-slate-300 bg-white'
                  }`}
                >
                  {form.status === 'Approved' || form.status === 'Rejected' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Approve Contribution</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="inline-block h-3 w-3 rounded-full bg-slate-300" />
                    Responsible Division Director
                  </div>
                  <div
                    className={`mt-2 inline-block rounded-md px-3 py-1 text-xs font-semibold ${
                      form.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : form.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {form.status === 'Approved'
                      ? 'Approved'
                      : form.status === 'Rejected'
                        ? 'Rejected'
                        : 'Pending'}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">Date: - - - - -</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Current Status</span>
            <StatusBadge status={form.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
