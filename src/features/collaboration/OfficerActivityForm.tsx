import { useRef, useState } from 'react'
import { ArrowLeft, Check, Eye, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Select, Textarea } from '../../ui'
import { StatusBadge } from '../../components/StatusBadge'
import type { ActivityRecord } from '../../types'
import { activityStore } from './activityStore'

// ── Constants ──────────────────────────────────────────────────────────────
const STEP_LABELS = ['Activity Information', 'Responsibility', 'Planned Outputs']
const TOTAL_STEPS = 3

const ACTIVITY_TYPES = [
  'Workshop',
  'Training',
  'Seminar',
  'Conference',
  'Research',
  'Field Visit',
  'Capacity Building',
  'Knowledge Exchange',
  'Other',
]

const EAII_UNITS = [
  'AI Research Division',
  'Partnerships & Collaboration',
  'Digital Transformation',
  'Capacity Building',
  'Policy & Governance',
  'Finance & Administration',
  'Knowledge Management',
]

const PLANNED_OUTPUT_OPTIONS = [
  'AI Training',
  'Research Paper',
  'Policy Recommendation',
  'Prototype',
  'Workshop',
  'Training Manual',
  'Final Report',
  'Others',
]

// ── Step Indicator ─────────────────────────────────────────────────────────
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
                className={`mx-2 mb-4 h-0.5 w-16 sm:w-24 ${done ? 'bg-[#161A61]' : 'bg-slate-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────────
function SH({ title }: { title: string }) {
  return (
    <div className="border-l-4 border-[#ff9500] pl-4">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
    </div>
  )
}

// ── Props ──────────────────────────────────────────────────────────────────
interface OfficerActivityFormProps {
  activity?: ActivityRecord
  onClose: () => void
}

export function OfficerActivityForm({ activity, onClose }: OfficerActivityFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Partial<ActivityRecord>>(
    activity ?? {
      activityName: '',
      activityType: '',
      description: '',
      startDate: '',
      endDate: '',
      leadOrganization: 'Ethiopian Artificial Intelligence Institute',
      eaiiResponsibleUnit: '',
      partnerResponsibleUnit: '',
      plannedOutputs: [],
      actualOutputs: [],
      attachments: [],
      status: 'Draft',
    }
  )

  // Track uploaded file names in actualOutputs[0] as JSON for display
  const [fileNames, setFileNames] = useState<string[]>(activity?.attachments ?? [])

  const set = <K extends keyof ActivityRecord>(field: K, value: ActivityRecord[K]) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  // ── Planned outputs checkboxes ──────────────────────────────────────────
  const toggleOutput = (label: string) => {
    const current = formData.plannedOutputs ?? []
    if (current.includes(label)) {
      set(
        'plannedOutputs',
        current.filter(o => o !== label)
      )
    } else {
      set('plannedOutputs', [...current, label])
    }
  }

  // ── File handling ───────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const names = files.map(f => f.name)
    const updated = [...fileNames, ...names]
    setFileNames(updated)
    set('attachments', updated)
  }

  const removeFile = (name: string) => {
    const updated = fileNames.filter(f => f !== name)
    setFileNames(updated)
    set('attachments', updated)
  }

  // ── Navigation ──────────────────────────────────────────────────────────
  const handleNext = () => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS))
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 1))

  const handleSaveDraft = () => {
    if (!activity) return
    activityStore.update({
      ...(activity as ActivityRecord),
      ...formData,
      status: 'Draft',
    })
    toast.success('Activity saved as draft')
    onClose()
  }

  const handleSubmit = () => {
    if (!activity) return
    if (!formData.activityName?.trim()) {
      toast.error('Activity name is required')
      setCurrentStep(1)
      return
    }
    activityStore.update({
      ...(activity as ActivityRecord),
      ...formData,
      status: 'Pending Approval',
      submittedBy: 'Focal Person',
      submittedAt: new Date().toISOString(),
    })
    toast.success('Activity submitted for approval!')
    onClose()
  }

  const isLastStep = currentStep === TOTAL_STEPS
  const outputs = formData.plannedOutputs ?? []

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#161A61]">Register Joint Activity</h1>
          <p className="text-sm text-slate-500">{activity?.id} · Register Joint Activity</p>
        </div>
      </div>

      {/* ── Step Indicator ── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm overflow-x-auto">
        <StepIndicator currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Main Form ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm space-y-6">
            {/* ══ STEP 1: Activity Information ══ */}
            {currentStep === 1 && (
              <>
                <SH title="Activity Information" />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Activity Name"
                    placeholder="Project Name"
                    value={formData.activityName ?? ''}
                    onChange={e => set('activityName', e.target.value)}
                  />
                  <Select
                    label="Activity Type"
                    value={formData.activityType ?? ''}
                    onValueChange={v => set('activityType', v)}
                    placeholder="select Activity Type"
                  >
                    {ACTIVITY_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Description..."
                  value={formData.description ?? ''}
                  onChange={e => set('description', e.target.value)}
                  rows={4}
                />
                <SH title="Timeline" />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate ?? ''}
                    onChange={e => set('startDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate ?? ''}
                    onChange={e => set('endDate', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ══ STEP 2: Responsibility ══ */}
            {currentStep === 2 && (
              <>
                <SH title="Responsibility" />
                {/* Lead Organization */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Lead Organization
                  </label>
                  <div className="rounded-xl border-2 border-[#161A61] p-3">
                    <div className="rounded-lg bg-[#ff9500] px-4 py-2.5 text-center">
                      <span className="font-semibold text-white">
                        Ethiopian Artificial Intelligence Institute
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="EAII Responsible Unit"
                    value={formData.eaiiResponsibleUnit ?? ''}
                    onValueChange={v => set('eaiiResponsibleUnit', v)}
                    placeholder="select"
                  >
                    {EAII_UNITS.map(u => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label="Partner Organization"
                    placeholder="Partner Organization"
                    value={formData.partnerResponsibleUnit ?? ''}
                    onChange={e => set('partnerResponsibleUnit', e.target.value)}
                  />
                </div>

                <Textarea
                  label="Description"
                  placeholder="Description..."
                  value={
                    formData.leadOrganization === 'Ethiopian Artificial Intelligence Institute'
                      ? (formData.actualOutputs?.[0] ?? '')
                      : (formData.leadOrganization ?? '')
                  }
                  onChange={e => {
                    // Store responsibility description in actualOutputs[0]
                    const updated = [...(formData.actualOutputs ?? [])]
                    updated[0] = e.target.value
                    set('actualOutputs', updated)
                  }}
                  rows={4}
                />
              </>
            )}

            {/* ══ STEP 3: Planned Outputs ══ */}
            {currentStep === 3 && (
              <>
                <SH title="Planned Outputs" />
                <div className="grid grid-cols-2 gap-3">
                  {PLANNED_OUTPUT_OPTIONS.map(option => {
                    const checked = outputs.includes(option)
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleOutput(option)}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all ${
                          checked
                            ? 'border-[#161A61] bg-[#161A61]/5 text-[#161A61]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                            checked ? 'border-[#ff9500] bg-[#ff9500]' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {checked && <Check className="h-3 w-3 text-white" />}
                        </div>
                        {option}
                      </button>
                    )
                  })}
                </div>

                {/* Additional Description */}
                <Textarea
                  label="Additional Description"
                  placeholder="Description..."
                  value={formData.actualOutputs?.[1] ?? ''}
                  onChange={e => {
                    const updated = [...(formData.actualOutputs ?? [])]
                    updated[1] = e.target.value
                    set('actualOutputs', updated)
                  }}
                  rows={3}
                />

                {/* Attachments */}
                <SH title="Attachments" />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center hover:border-[#161A61]/40 hover:bg-slate-100 transition-colors"
                >
                  <Upload className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">Choose files to upload</p>
                  <p className="mt-1 text-xs text-slate-400">PDF, DOCX, XLSX, Images, ZIP</p>
                </div>

                {fileNames.length > 0 && (
                  <div className="space-y-2">
                    {fileNames.map(name => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5"
                      >
                        <span className="text-sm text-slate-700 truncate">{name}</span>
                        <button
                          onClick={() => removeFile(name)}
                          className="ml-3 shrink-0 text-slate-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-2">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  ← Back
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                {!isLastStep ? (
                  <Button onClick={handleNext} className="bg-[#ff9500] hover:bg-[#e68a00]">
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-[#161A61] hover:bg-[#0f1347]">
                    Submit for Approval
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ──────────────────────────────────────────────── */}
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
              {/* Step 1 — Register */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${formData.status === 'Pending Approval' || formData.status === 'Approved' ? 'border-[#161A61] bg-[#161A61]' : 'border-slate-300 bg-white'}`}
                >
                  {formData.status === 'Pending Approval' || formData.status === 'Approved' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Register Joint Activity</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="inline-block h-3 w-3 rounded-full bg-slate-300" />
                    Focal person
                  </div>
                  <div
                    className={`mt-2 inline-block rounded-md px-3 py-1 text-xs font-semibold ${formData.status === 'Pending Approval' ? 'bg-blue-100 text-blue-800' : 'bg-[#FEF3C7] text-[#92400E]'}`}
                  >
                    {formData.status === 'Pending Approval' ? 'Submitted' : 'Pending'}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Date:{' '}
                    {formData.submittedAt
                      ? new Date(formData.submittedAt).toLocaleDateString()
                      : '- - - - -'}
                  </p>
                </div>
              </div>

              {/* Step 2 — Approve */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${formData.status === 'Approved' ? 'border-green-500 bg-green-500' : formData.status === 'Rejected' ? 'border-red-500 bg-red-500' : 'border-slate-300 bg-white'}`}
                >
                  {formData.status === 'Approved' || formData.status === 'Rejected' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Approve Collaboration</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="inline-block h-3 w-3 rounded-full bg-slate-300" />
                    Responsible Division director
                  </div>
                  <div
                    className={`mt-2 inline-block rounded-md px-3 py-1 text-xs font-semibold ${formData.status === 'Approved' ? 'bg-green-100 text-green-700' : formData.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-[#FEF3C7] text-[#92400E]'}`}
                  >
                    {formData.status === 'Approved'
                      ? 'Approved'
                      : formData.status === 'Rejected'
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
            <StatusBadge status={formData.status ?? 'Draft'} />
          </div>
        </div>
      </div>
    </div>
  )
}
