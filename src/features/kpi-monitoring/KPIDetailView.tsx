import { ArrowLeft, Edit2 } from 'lucide-react'
import { Button } from '@/ui'
import type { KPIRecord, KPIRating } from '@/types'

interface Props {
  kpi: KPIRecord
  onClose: () => void
  onApprove?: () => void
  onReturn?: () => void
  isDirectorView?: boolean
}

function getRatingColor(rating: string) {
  const rating_map: Record<string, string> = {
    Poor: 'bg-red-100 text-red-700',
    Fair: 'bg-amber-100 text-amber-700',
    Good: 'bg-blue-100 text-blue-700',
    Excellent: 'bg-green-100 text-green-700',
  }
  return rating_map[rating] || 'bg-slate-100 text-slate-700'
}

export function KPIDetailView({ kpi, onClose, isDirectorView = false }: Props) {
  const overallScore = kpi.performanceScore
  const getRatingFromScore = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  const rating = getRatingFromScore(overallScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onClose}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#161A61]">{kpi.kpiId}</h1>
            <p className="mt-0.5 text-sm text-slate-500">Research - Q3 2026</p>
          </div>
        </div>

        {isDirectorView && (
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700">✓ Approve</Button>
            <Button className="bg-[#ff9500] hover:bg-[#e68a00]">Return</Button>
          </div>
        )}
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: KPI Information */}
        <div className="col-span-2 space-y-6">
          {/* KPI Information Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b border-[#ff9500] pb-3 text-sm font-bold text-[#161A61]">
              KPI Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">KPI ID</p>
                <p className="font-semibold text-slate-900">{kpi.kpiId}</p>
              </div>
              <div>
                <p className="text-slate-500">KPI Name</p>
                <p className="font-semibold text-slate-900">{kpi.kpiName || 'Project'}</p>
              </div>
              <div>
                <p className="text-slate-500">Lead Organization</p>
                <p className="font-semibold text-slate-900">
                  {kpi.leadOrganization || 'Ethiopian AI Institute'}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Partner Organization</p>
                <p className="font-semibold text-slate-900">
                  {kpi.partnerOrganization || 'Ministry of Agriculture'}
                </p>
              </div>
              <div>
                <p className="text-slate-500">EAII Responsible Unit</p>
                <p className="font-semibold text-slate-900">
                  {kpi.eaiiResponsibleUnit || 'Research & Development Directorate'}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Partner Organization</p>
                <p className="font-semibold text-slate-900">
                  {kpi.partnerOrganization || 'Ministry of Agriculture'}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Start Date</p>
                <p className="font-semibold text-slate-900">{kpi.startDate || '01 Oct 2026'}</p>
              </div>
              <div>
                <p className="text-slate-500">End Date</p>
                <p className="font-semibold text-slate-900">{kpi.endDate || '31 Mar 2027'}</p>
              </div>
            </div>
            {!isDirectorView && (
              <Button className="mt-4 bg-[#161A61] hover:bg-[#0f1347]">
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
          </div>

          {/* Partnership Indicators */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b border-[#ff9500] pb-3 text-sm font-bold text-[#161A61]">
              Partnership Indicators
            </h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              {[
                { label: 'Joint Projects', value: kpi.partnershipIndicators.jointProjects },
                {
                  label: 'Funding Mobilized',
                  value: `ETB ${kpi.partnershipIndicators.fundingMobilized.toLocaleString()}`,
                },
                { label: 'Trainings Conducted', value: kpi.partnershipIndicators.trainingsConduc },
                { label: 'Research Output', value: kpi.partnershipIndicators.researchOutputs },
                {
                  label: 'AI Solutions Developed',
                  value: kpi.partnershipIndicators.aiSolutionsDeveloped,
                },
                { label: 'Startups Supported', value: kpi.partnershipIndicators.startupsSupported },
                { label: 'Experts Exchanged', value: kpi.partnershipIndicators.expertsExchanged },
                { label: 'Events Conducted', value: kpi.partnershipIndicators.eventsConducted },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-slate-500">{label}</p>
                  <p className="font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b border-[#ff9500] pb-3 text-sm font-bold text-[#161A61]">
              Remarks
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-slate-700">Major Achievements</p>
                <p className="mt-1 text-slate-600">{kpi.remarks.majorAchievements || '—'}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Challenges Encountered</p>
                <p className="mt-1 text-slate-600">{kpi.remarks.challengesEncountered || '—'}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Recommendations</p>
                <p className="mt-1 text-slate-600">{kpi.remarks.recommendations || '—'}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Supporting Comments</p>
                <p className="mt-1 text-slate-600">{kpi.remarks.supportingComments || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Score & Status */}
        <div className="space-y-6">
          {/* KPI Score Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b border-[#ff9500] pb-3 text-sm font-bold text-[#161A61]">
              KPI Score
            </h3>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9500] to-[#e68a00]">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{overallScore}</div>
                  <div className="text-xs text-white/80">of 100</div>
                </div>
              </div>
              <div
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${getRatingColor(rating)}`}
              >
                ✓ {rating}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-xs">
              {[
                { label: 'Strategic Value', value: kpi.kpiScoring.strategicValueScore },
                { label: 'Technical Value', value: kpi.kpiScoring.technicalValueScore },
                { label: 'Financial Value', value: kpi.kpiScoring.financialValueScore },
                { label: 'Sustainability', value: kpi.kpiScoring.sustainabilityScore },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Card */}
          {isDirectorView && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 border-b border-[#ff9500] pb-3 text-sm font-bold text-[#161A61]">
                Status
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-600">
                    Register KPI metrics and values
                  </div>
                  <div className="text-xs font-semibold text-[#161A61]">Focal person</div>
                  <div className="rounded bg-[#161A61] px-2 py-1 text-center text-xs font-semibold text-white">
                    Completed
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Date: {kpi.submittedAt ? new Date(kpi.submittedAt).toLocaleDateString() : '—'}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="mb-2 text-xs font-semibold text-slate-600">
                    Review & Monitor evaluation
                  </div>
                  <div className="text-xs font-semibold text-[#161A61]">
                    Responsible Division director
                  </div>
                  <div className="rounded bg-blue-600 px-2 py-1 text-center text-xs font-semibold text-white">
                    Pending
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Date: —</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
