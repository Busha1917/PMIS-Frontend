import { ArrowLeft } from 'lucide-react'
import { StatusBadge } from '../../components/StatusBadge'
import { OpportunityTimeline } from '../../components/OpportunityTimeline'
import type { OpportunityRecord } from '../../types'

type OpportunityReviewViewProps = {
  opportunity: OpportunityRecord
  onBack: () => void
  actions?: React.ReactNode
}

export function OpportunityReviewView({
  opportunity: opp,
  onBack,
  actions,
}: OpportunityReviewViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
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
            <h1 className="text-[22px] font-semibold text-[#161A61]">
              {opp.title || 'Opportunity Details'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review opportunity information before taking action
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={opp.status} />
          {actions}
        </div>
      </div>

      {/* Rejection banner */}
      {opp.status === 'Rejected' && opp.approvalNotes && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
          <p className="mt-1 text-sm text-red-600">{opp.approvalNotes}</p>
          {opp.reviewedBy && (
            <p className="mt-1 text-xs text-red-400">— {String(opp.reviewedBy)}</p>
          )}
        </div>
      )}

      {/* Review comment banner */}
      {opp.status === 'Reviewed' && opp.reviewNotes && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-700">
            Review Note — Knowledge &amp; Ecosystem Director
          </p>
          <p className="mt-1 text-sm text-blue-600">{opp.reviewNotes}</p>
        </div>
      )}

      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-inner">
        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
          {/* Left: details + outcomes */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-sm font-semibold text-[#161A61]">Opportunity Information</h2>
              <dl className="flex flex-col text-[13px] text-slate-800">
                {[
                  { label: 'Opportunity ID', value: opp.id },
                  { label: 'Title', value: opp.title || 'N/A' },
                  { label: 'Partner Name', value: opp.partnerName || 'N/A' },
                  { label: 'Organization Type', value: opp.organizationType || 'N/A' },
                  { label: 'Country', value: opp.country || 'N/A' },
                  { label: 'Website', value: opp.website || 'N/A' },
                  { label: 'Contact Person', value: opp.contactPersonName || 'N/A' },
                  { label: 'Email', value: opp.contactEmail || 'N/A' },
                  { label: 'Partner Interest Area', value: opp.interestArea || 'N/A' },
                  { label: 'Opportunity Category', value: opp.opportunityCategory?.name || 'N/A' },
                  { label: 'Source', value: opp.opportunitySource?.sourceName || 'N/A' },
                  { label: 'Division', value: opp.division || 'N/A' },
                  {
                    label: 'Strategic Importance',
                    value: opp.strategicImportanceLevel?.levelName || 'N/A',
                  },
                  { label: 'Date', value: opp.dateIdentified || 'N/A' },
                ].map((item, i, arr) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between gap-4 py-3 ${i !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <dt className="text-slate-500">{item.label}</dt>
                    <dd className="font-semibold text-slate-900 text-right">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-[#161A61]">Outcomes</h2>
              <div className="space-y-4 text-[12px] text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Description: </span>
                  {opp.opportunityDescription || 'Not provided.'}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Expected Outcome: </span>
                  {opp.expectedOutcome || 'Not provided.'}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Strategic Alignment: </span>
                  {opp.strategicAlignment || 'Not provided.'}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Expected Benefits: </span>
                  {opp.expectedBenefits || 'Not provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: timeline */}
          <div>
            <OpportunityTimeline
              opportunityStatus={opp.status}
              createdAt={opp.createdAt}
              screenedAt={opp.screenedAt}
              verifiedAt={opp.verifiedAt}
              reviewedAt={opp.reviewedAt}
              approvedAt={opp.approvedAt}
              updatedAt={opp.updatedAt}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
