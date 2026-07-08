import { CheckCircle2 } from 'lucide-react'
import type { OpportunityStatus } from '../types'

type TimelineNode = {
  title: string
  role: string
  status: 'Completed' | 'Pending' | 'Draft' | 'Rejected'
  date?: string
}

type Props = {
  opportunityStatus: OpportunityStatus
  createdAt?: string
  screenedAt?: string
  verifiedAt?: string
  reviewedAt?: string
  approvedAt?: string
  updatedAt?: string
}

function deriveNodes(props: Props): TimelineNode[] {
  const s = props.opportunityStatus

  // Step 1: Register
  const registerStatus: TimelineNode['status'] = 'Completed'

  // Step 2: KE Director review
  let reviewStatus: TimelineNode['status'] = 'Draft'
  if (s === 'Reviewed') reviewStatus = 'Completed'
  else if (s === 'Approved') reviewStatus = 'Completed'
  else if (s === 'Rejected' && props.screenedAt) reviewStatus = 'Completed'
  else if (s === 'Rejected' && !props.screenedAt) reviewStatus = 'Rejected'
  else if (s === 'Draft') reviewStatus = 'Pending'

  // Step 3: Division Director approval
  let approvalStatus: TimelineNode['status'] = 'Draft'
  if (s === 'Reviewed') approvalStatus = 'Pending'
  else if (s === 'Approved') approvalStatus = 'Completed'
  else if (s === 'Rejected' && props.approvedAt === undefined) approvalStatus = 'Rejected'

  // Step 4: Move to Engagement
  let engagementStatus: TimelineNode['status'] = 'Draft'
  if (s === 'Approved') engagementStatus = 'Completed'

  return [
    {
      title: 'Register Opportunity',
      role: 'Officer',
      status: registerStatus,
      date: props.createdAt ? new Date(props.createdAt).toISOString().split('T')[0] : 'Pending',
    },
    {
      title: 'Review & Send for Approval',
      role: 'KE Director',
      status: reviewStatus,
      date: props.reviewedAt ? new Date(props.reviewedAt).toISOString().split('T')[0] : 'Pending',
    },
    {
      title: 'Final Approval',
      role: 'Division Director',
      status: approvalStatus,
      date: props.approvedAt
        ? new Date(props.approvedAt).toISOString().split('T')[0]
        : props.updatedAt && approvalStatus === 'Rejected'
          ? new Date(props.updatedAt).toISOString().split('T')[0]
          : 'Pending',
    },
    {
      title: 'Added to Engagement',
      role: 'System',
      status: engagementStatus,
      date: props.approvedAt ? new Date(props.approvedAt).toISOString().split('T')[0] : 'Pending',
    },
  ]
}

export function OpportunityTimeline(props: Props) {
  const nodes = deriveNodes(props)

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden h-full">
      {/* Tab header */}
      <div className="flex border-b border-slate-100">
        <button className="flex-1 py-3 text-sm font-semibold text-white bg-[#161A61] text-center">
          Status
        </button>
        <button className="flex-1 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 text-center">
          Feedback
        </button>
      </div>

      <div className="p-6 relative">
        {/* Vertical line */}
        <div className="absolute left-9 top-8 bottom-8 w-[2px] bg-slate-200 z-0" />

        <div className="space-y-8 relative z-10">
          {nodes.map((n, i) => {
            const isCompleted = n.status === 'Completed'
            const isPending = n.status === 'Pending'
            const isRejected = n.status === 'Rejected'

            const dotColor = isCompleted
              ? 'border-[#ff9500] bg-[#ff9500]'
              : isPending
                ? 'border-[#ff9500] bg-white'
                : isRejected
                  ? 'border-red-500 bg-red-500'
                  : 'border-slate-300 bg-white'

            const badgeColor = isCompleted
              ? 'bg-[#161A61] text-white'
              : isPending
                ? 'bg-blue-600 text-white'
                : isRejected
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-500'

            return (
              <div key={i} className="flex gap-4">
                <div
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${dotColor}`}
                >
                  {isPending && <span className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />}
                  {isCompleted && <CheckCircle2 className="h-4 w-4 text-white" />}
                  {isRejected && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                </div>

                <div className="flex-1 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                  <p className="text-sm font-bold text-slate-800">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="w-3 h-3 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    </span>
                    ({n.role})
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${badgeColor}`}
                    >
                      {n.status}
                    </span>
                    <span className="text-[10px] text-slate-400">{n.date}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
