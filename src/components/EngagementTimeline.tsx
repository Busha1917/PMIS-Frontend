import { CheckCircle2 } from 'lucide-react'

type TimelineNode = {
  title: string
  role: string
  status: 'Completed' | 'Pending' | 'Draft' | 'Rejected'
  date?: string
}

type Props = {
  engagementStatus: 'Draft' | 'In Progress' | 'Completed' | 'Cancelled' | string
  registeredAt?: string
  assignedAt?: string
  submittedAt?: string
  approvedAt?: string
  rejectedAt?: string
}

function deriveNodes(props: Props): TimelineNode[] {
  const s = props.engagementStatus

  // Register — always completed once it exists
  const registerStatus: TimelineNode['status'] = 'Completed'

  // Review & Assign
  let reviewStatus: TimelineNode['status'] = 'Draft'
  if (['In Progress', 'Completed'].includes(s)) reviewStatus = 'Completed'
  else if (s === 'Cancelled') reviewStatus = 'Rejected'

  // Officer fills details
  let outcomeStatus: TimelineNode['status'] = 'Draft'
  if (s === 'In Progress') outcomeStatus = 'Pending'
  else if (s === 'Completed') outcomeStatus = 'Completed'
  else if (s === 'Cancelled') outcomeStatus = 'Rejected'

  // Division Director final review
  let finalStatus: TimelineNode['status'] = 'Draft'
  if (s === 'Completed') finalStatus = 'Completed'
  else if (s === 'Cancelled') finalStatus = 'Rejected'

  return [
    {
      title: 'Register Engagement',
      role: 'KE Director',
      status: registerStatus,
      date: props.registeredAt
        ? new Date(props.registeredAt).toISOString().split('T')[0]
        : 'Pending',
    },
    {
      title: 'Review & Assign Officer',
      role: 'KE Director',
      status: reviewStatus,
      date: props.assignedAt ? new Date(props.assignedAt).toISOString().split('T')[0] : 'Pending',
    },
    {
      title: 'Fill Engagement Details',
      role: 'Officer',
      status: outcomeStatus,
      date: props.submittedAt ? new Date(props.submittedAt).toISOString().split('T')[0] : 'Pending',
    },
    {
      title: 'Final Approval',
      role: 'Division Director',
      status: finalStatus,
      date: props.approvedAt
        ? new Date(props.approvedAt).toISOString().split('T')[0]
        : props.rejectedAt
          ? new Date(props.rejectedAt).toISOString().split('T')[0]
          : 'Pending',
    },
  ]
}

export function EngagementTimeline(props: Props) {
  const nodes = deriveNodes(props)

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden h-full">
      {/* Tab header — matches Event/Visit exactly */}
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
                {/* Dot */}
                <div
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${dotColor}`}
                >
                  {isPending && <span className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />}
                  {isCompleted && <CheckCircle2 className="h-4 w-4 text-white" />}
                  {isRejected && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                </div>

                {/* Card */}
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
