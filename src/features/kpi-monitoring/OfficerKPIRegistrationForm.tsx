import { useState } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import type { KPIRecord } from '@/types'
import { kpiStore } from './kpiStore'

interface Props {
  kpi: KPIRecord
  onClose: () => void
}

type StepNumber = 1 | 2 | 3 | 4

const DIVISIONS = [
  'Research & Development',
  'Innovation',
  'Technology',
  'Partnerships',
  'Operations',
]
const REPORTING_YEARS = Array.from({ length: 5 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
)

export function OfficerKPIRegistrationForm({ kpi, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const [formData, setFormData] = useState(kpi)

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as StepNumber)
      window.scrollTo({ top: 0 })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as StepNumber)
      window.scrollTo({ top: 0 })
    }
  }

  const handleSaveDraft = () => {
    kpiStore.update(formData)
    toast.success('Saved as draft')
  }

  const handleSubmit = () => {
    kpiStore.update({
      ...formData,
      status: 'Pending Review',
      submittedAt: new Date().toISOString(),
    } as KPIRecord)
    toast.success('KPI submitted')
    onClose()
  }

  const updateGeneralInfo = (field: keyof typeof formData.generalInfo, value: string) => {
    setFormData(prev => ({ ...prev, generalInfo: { ...prev.generalInfo, [field]: value } }))
  }

  const updatePartnershipIndicators = (
    field: keyof typeof formData.partnershipIndicators,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      partnershipIndicators: { ...prev.partnershipIndicators, [field]: parseInt(value) || 0 },
    }))
  }

  const updateKPIScoring = (field: keyof typeof formData.kpiScoring, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      kpiScoring: {
        ...prev.kpiScoring,
        [field]: field.includes('Score') ? parseInt(String(value)) || 0 : value,
      },
    }))
  }

  const updateRemarks = (field: keyof typeof formData.remarks, value: string) => {
    setFormData(prev => ({ ...prev, remarks: { ...prev.remarks, [field]: value } }))
  }

  const calculateScore = () => {
    const { strategicValueScore, technicalValueScore, financialValueScore, sustainabilityScore } =
      formData.kpiScoring
    const avg = Math.round(
      (strategicValueScore + technicalValueScore + financialValueScore + sustainabilityScore) / 4
    )
    setFormData(prev => ({ ...prev, performanceScore: avg }))
    toast.success('Score calculated')
  }

  const getRatingFromScore = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  const getRatingColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700'
    if (score >= 60) return 'bg-blue-100 text-blue-700'
    if (score >= 40) return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#161A61]">KPI Registration</h1>
            <p className="text-sm text-slate-500">Register Joint Activity</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-l-4 border-[#ff9500] pl-4">
                <h3 className="text-sm font-bold text-[#161A61]">General Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700">
                    KPI Name
                  </label>
                  <input
                    type="text"
                    value={formData.generalInfo.kpiName}
                    onChange={e => updateGeneralInfo('kpiName', e.target.value)}
                    placeholder="KPI Name"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700">
                    Reporting Year
                  </label>
                  <select
                    value={formData.generalInfo.reportingYear}
                    onChange={e => updateGeneralInfo('reportingYear', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    {REPORTING_YEARS.map(y => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700">
                    Division
                  </label>
                  <select
                    value={formData.generalInfo.division}
                    onChange={e => updateGeneralInfo('division', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
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
                  <label className="block text-xs font-semibold uppercase text-slate-700">
                    Focal Person
                  </label>
                  <input
                    type="text"
                    value={formData.generalInfo.focalPerson}
                    onChange={e => updateGeneralInfo('focalPerson', e.target.value)}
                    placeholder="Focal Person"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="border-l-4 border-[#ff9500] pl-4 pt-4">
                <h3 className="text-sm font-bold text-[#161A61]">Partnership Indicators</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { l: 'Joint Projects', k: 'jointProjects' as const },
                  { l: 'Funding Mobilized (ETB)', k: 'fundingMobilized' as const },
                  { l: 'Trainings Conducted', k: 'trainingsConduc' as const },
                  { l: 'Research Outputs', k: 'researchOutputs' as const },
                ].map(({ l, k }) => (
                  <div key={k}>
                    <label className="block text-xs text-slate-600">{l}</label>
                    <input
                      type="number"
                      value={formData.partnershipIndicators[k] || 0}
                      readOnly
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-l-4 border-[#ff9500] pl-4">
                <h3 className="text-sm font-bold text-[#161A61]">Partnership Indicators</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: 'Joint Projects', k: 'jointProjects' as const },
                  { l: 'Funding Mobilized (ETB)', k: 'fundingMobilized' as const },
                  { l: 'Trainings Conducted', k: 'trainingsConduc' as const },
                  { l: 'Research Outputs', k: 'researchOutputs' as const },
                  { l: 'AI Solutions Developed', k: 'aiSolutionsDeveloped' as const },
                  { l: 'Startups Supported', k: 'startupsSupported' as const },
                  { l: 'Experts Exchanged', k: 'expertsExchanged' as const },
                  { l: 'Events Conducted', k: 'eventsConducted' as const },
                ].map(({ l, k }) => (
                  <div key={k}>
                    <label className="block text-xs text-slate-600">{l}</label>
                    <input
                      type="number"
                      value={formData.partnershipIndicators[k] || 0}
                      onChange={e => updatePartnershipIndicators(k, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-l-4 border-[#ff9500] pl-4">
                <h3 className="text-sm font-bold text-[#161A61]">KPI Scoring</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  {[
                    {
                      l: 'Strategic Value Score',
                      k: 'strategicValueScore' as const,
                      d: 'strategicValueDetail' as const,
                    },
                    {
                      l: 'Technical Value Score',
                      k: 'technicalValueScore' as const,
                      d: 'technicalValueDetail' as const,
                    },
                    {
                      l: 'Financial Value Score',
                      k: 'financialValueScore' as const,
                      d: 'financialValueDetail' as const,
                    },
                    {
                      l: 'Sustainability Score',
                      k: 'sustainabilityScore' as const,
                      d: 'sustainabilityDetail' as const,
                    },
                  ].map(({ l, k, d }) => (
                    <div key={k}>
                      <label className="block text-xs text-slate-600">{l}</label>
                      <input
                        type="number"
                        value={formData.kpiScoring[k] || 0}
                        onChange={e => updateKPIScoring(k, e.target.value)}
                        min="0"
                        max="100"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />
                      <p className="mt-1 text-xs text-slate-500">Measures {l.toLowerCase()}</p>
                      <textarea
                        value={formData.kpiScoring[d] || ''}
                        onChange={e => updateKPIScoring(d, e.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6">
                  <div className="text-5xl font-bold text-[#161A61]">
                    {formData.performanceScore}
                  </div>
                  <p className="text-sm text-slate-500">of 100</p>
                  <div
                    className={`mt-3 rounded-lg px-3 py-1 text-xs font-semibold ${getRatingColor(formData.performanceScore)}`}
                  >
                    {getRatingFromScore(formData.performanceScore)}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Performance: {formData.performanceScore}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="border-l-4 border-[#ff9500] pl-4">
                <h3 className="text-sm font-bold text-[#161A61]">Remarks</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { l: 'Major Achievements', k: 'majorAchievements' as const },
                  { l: 'Challenges Encountered', k: 'challengesEncountered' as const },
                  { l: 'Recommendations', k: 'recommendations' as const },
                  { l: 'Supporting Comments', k: 'supportingComments' as const },
                ].map(({ l, k }) => (
                  <div key={k}>
                    <label className="block text-xs text-slate-600">{l}</label>
                    <textarea
                      value={formData.remarks[k]}
                      onChange={e => updateRemarks(k, e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="border-l-4 border-[#ff9500] pl-4 pt-4">
                <h3 className="text-sm font-bold text-[#161A61]">Supporting Evidence</h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { l: 'Report', i: '📄' },
                  { l: 'Agreement', i: '📋' },
                  { l: 'Photo', i: '📸' },
                  { l: 'Publication', i: '📰' },
                  { l: 'Financial Document', i: '💰' },
                ].map(({ l, i }) => (
                  <button
                    key={l}
                    className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 p-3 hover:border-[#161A61]"
                  >
                    <span className="text-2xl">{i}</span>
                    <span className="text-xs font-semibold text-slate-600">{l}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              Previous
            </button>
          )}
          {currentStep < 4 && (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#ff9500] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e68a00]"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
          {currentStep === 4 && (
            <>
              <button
                onClick={handleSaveDraft}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
              >
                Save as Draft
              </button>
              <button
                onClick={calculateScore}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
              >
                Calculate Score
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-[#ff9500] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e68a00]"
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>

      <div className="w-64 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <button className="mb-4 w-full rounded-lg bg-[#161A61] px-3 py-2 text-xs font-bold text-white">
            Status
          </button>
          <div className="space-y-4">
            {[1, 2].map(step => (
              <div key={step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${currentStep >= step ? 'bg-[#161A61]' : 'bg-slate-300'}`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  {step === 1 && (
                    <div
                      className={`my-2 h-8 w-0.5 ${currentStep >= 2 ? 'bg-[#161A61]' : 'bg-slate-200'}`}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-xs font-semibold text-slate-700">
                    {step === 1 ? 'Register KPI metrics and values' : 'Review & Monitor evaluation'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {step === 1 ? 'Focal person' : 'Responsible Division director'}
                  </p>
                  <div
                    className={`mt-2 rounded px-2 py-1 text-center text-xs font-bold text-white ${currentStep >= step ? 'bg-[#161A61]' : 'bg-slate-300'}`}
                  >
                    Pending
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Date: -----</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
          Feedback
        </button>
      </div>
    </div>
  )
}
