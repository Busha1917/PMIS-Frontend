import { CheckCircle2 } from 'lucide-react'
import type { EventRecord } from '../types'

type TimelinePanelProps = {
  record: EventRecord
  activeTab: 'Status' | 'Feedback' | 'History'
  onTabChange: (tab: 'Status' | 'Feedback' | 'History') => void
}

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  Draft: { color: 'text-slate-600', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  'Pending Review': { color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  Approved: { color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-400' },
  'Pending Final Review': { color: 'text-purple-700', bg: 'bg-purple-50', dot: 'bg-purple-400' },
  Rejected: { color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-400' },
  Completed: { color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' },
}

const TABS = ['Status', 'Feedback', 'History'] as const

export function TimelinePanel({ record, activeTab, onTabChange }: TimelinePanelProps) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-100">
        {TABS.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
              activeTab === tab ? 'bg-[#161A61] text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Status' && <StatusTab record={record} />}
      {activeTab === 'Feedback' && <FeedbackTab record={record} />}
      {activeTab === 'History' && <HistoryTab record={record} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Status tab — four-node workflow pipeline
// ---------------------------------------------------------------------------

function StatusTab({ record }: { record: EventRecord }) {
  const s = record.status

  const registerStatus = s === 'Draft' ? 'Draft' : 'Completed'

  let reviewStatus = 'Draft'
  if (s === 'Pending Review') reviewStatus = 'Pending'
  else if (['Approved', 'Pending Final Review', 'Completed', 'Rejected'].includes(s))
    reviewStatus = 'Completed'
  if (s === 'Rejected') reviewStatus = 'Rejected'

  let outcomeStatus = 'Draft'
  if (s === 'Approved') outcomeStatus = 'Pending'
  else if (['Pending Final Review', 'Completed'].includes(s)) outcomeStatus = 'Completed'

  let finalStatus = 'Draft'
  if (s === 'Pending Final Review') finalStatus = 'Pending'
  else if (s === 'Completed') finalStatus = 'Completed'

  const nodes = [
    {
      title: 'Register Event / Visit',
      role: 'Officer',
      status: registerStatus,
      date: record.date || 'Pending',
    },
    { title: 'Review & Assign', role: 'Director General', status: reviewStatus, date: 'Pending' },
    {
      title: 'Outcome Registration',
      role: 'Assigned Person',
      status: outcomeStatus,
      date: 'Pending',
    },
    { title: 'Final Review', role: 'Director General', status: finalStatus, date: 'Pending' },
  ]

  return (
    <div className="p-6 relative">
      <div className="absolute left-9 top-8 bottom-8 w-[2px] bg-slate-200 z-0" />
      <div className="space-y-8 relative z-10">
        {nodes.map((n, i) => {
          const isCompleted = n.status === 'Completed'
          const isPending = n.status === 'Pending'
          const dotColor = isCompleted
            ? 'border-[#ff9500] bg-[#ff9500]'
            : isPending
              ? 'border-[#ff9500] bg-white'
              : 'border-slate-300 bg-white'
          const dotInner = isPending ? 'bg-[#ff9500]' : 'bg-transparent'
          const badgeColor = isCompleted
            ? 'bg-[#161A61] text-white'
            : isPending
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-500'

          return (
            <div key={i} className="flex gap-4">
              <div
                className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${dotColor}`}
              >
                {isPending && <span className={`h-2.5 w-2.5 rounded-full ${dotInner}`} />}
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-white" />}
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
                  <span className="text-[10px] text-slate-400">
                    {n.date?.split('T')[0] || 'TBD'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Feedback tab — reverse-chronological list of feedback entries
// ---------------------------------------------------------------------------

function formatFeedbackTimestamp(iso: string): string {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function FeedbackTab({ record }: { record: EventRecord }) {
  const entries = record.feedbackEntries

  if (!entries || entries.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm text-slate-400">No feedback yet</p>
      </div>
    )
  }

  // Sort by timestamp descending; ties broken by insertion index descending
  const sorted = entries
    .map((entry, idx) => ({ entry, idx }))
    .sort((a, b) => {
      const timeDiff = new Date(b.entry.timestamp).getTime() - new Date(a.entry.timestamp).getTime()
      if (timeDiff !== 0) return timeDiff
      return b.idx - a.idx
    })

  return (
    <div className="p-4 space-y-3 overflow-y-auto">
      {sorted.map(({ entry, idx }) => {
        const isRejection = entry.type === 'Rejection'
        const typeBadgeClass = isRejection
          ? 'bg-red-100 text-red-700'
          : 'bg-amber-100 text-amber-700'
        const sc = statusConfig[entry.statusAtTime] ?? {
          color: 'text-slate-600',
          bg: 'bg-slate-100',
        }

        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm space-y-2"
          >
            {/* Header row: type badge + status badge */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${typeBadgeClass}`}
              >
                {entry.type}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${sc.bg} ${sc.color}`}
              >
                {entry.statusAtTime}
              </span>
            </div>

            {/* Author + timestamp */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-700">{entry.authorName}</span>
              <span className="text-[11px] text-slate-400">
                {formatFeedbackTimestamp(entry.timestamp)}
              </span>
            </div>

            {/* Comment */}
            {entry.comment && (
              <p className="text-xs text-slate-600 leading-relaxed">{entry.comment}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// History tab — audit trail in reverse-chronological order
// ---------------------------------------------------------------------------

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function HistoryTab({ record }: { record: EventRecord }) {
  const trail = record.auditTrail

  if (!trail || trail.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-sm text-slate-400 text-center">No history yet</p>
      </div>
    )
  }

  // Sort descending by timestamp (most recent first)
  const sorted = [...trail].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className="p-4 overflow-y-auto flex-1 space-y-3">
      {sorted.map((entry, i) => {
        const isSentBack = entry.actionLabel === 'Sent Back for Revision'
        // For "Sent Back for Revision" use Approved colors; otherwise use newStatus colors
        const badgeKey = isSentBack ? 'Approved' : entry.newStatus
        const cfg = statusConfig[badgeKey] ?? statusConfig['Draft']

        const displayLabel = isSentBack
          ? `Revision Requested → ${entry.actionLabel}`
          : entry.actionLabel

        return (
          <div
            key={i}
            className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm space-y-2"
          >
            {/* Top row: badge + action label */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cfg.bg} ${cfg.color}`}
              >
                {entry.newStatus}
              </span>
              <span className="text-sm font-semibold text-slate-700">{displayLabel}</span>
            </div>

            {/* Actor info */}
            <p className="text-xs text-slate-400">
              {entry.actorName} <span className="text-slate-300">·</span> {entry.actorRole}
            </p>

            {/* Timestamp */}
            <p className="text-[10px] text-slate-400">{formatTimestamp(entry.timestamp)}</p>

            {/* Comment block */}
            {entry.comment && entry.comment.trim() !== '' && (
              <div className="bg-slate-50 rounded p-2">
                <p className="text-xs text-slate-600 whitespace-pre-wrap">{entry.comment}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { statusConfig }
