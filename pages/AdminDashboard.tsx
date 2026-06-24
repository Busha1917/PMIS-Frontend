import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  Handshake,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui'
import { agreements, engagements, events, opportunities, partners, users } from '../data'
import { StatusBadge } from '../components/StatusBadge'

const allRecords = [
  ...events.map(e => ({ ...e, module: 'Event' })),
  ...opportunities.map(o => ({ ...o, module: 'Opportunity' })),
  ...engagements.map(e => ({ ...e, module: 'Engagement' })),
  ...agreements.map(a => ({ ...a, module: 'Agreement' })),
  ...partners.map(p => ({ ...p, module: 'Partner' })),
]

const statusCounts = allRecords.reduce<Record<string, number>>((acc, r) => {
  acc[r.status] = (acc[r.status] ?? 0) + 1
  return acc
}, {})

const totalAll = allRecords.length

const recentRecords = [...allRecords].slice(-5).reverse()

const metrics = [
  {
    label: 'Total Partners',
    value: partners.length,
    icon: Users,
    color: '#161A61',
    bg: 'from-[#161A61]/10 to-blue-50',
    trend: '+12% this month',
  },
  {
    label: 'Open Opportunities',
    value: opportunities.filter(o => o.status === 'Draft' || o.status === 'Approved').length,
    icon: Handshake,
    color: '#ff9500',
    bg: 'from-[#ff9500]/10 to-orange-50',
    trend: '+3 this week',
  },
  {
    label: 'Active Engagements',
    value: engagements.filter(e => e.status === 'Accepted' || e.status === 'Approved').length,
    icon: Activity,
    color: '#10b981',
    bg: 'from-emerald-100 to-emerald-50',
    trend: 'Ongoing sessions',
  },
  {
    label: 'Total Agreements',
    value: agreements.length,
    icon: FileText,
    color: '#8b5cf6',
    bg: 'from-violet-100 to-violet-50',
    trend: `${agreements.filter(a => a.status === 'Accepted').length} signed`,
  },
]

const STATUS_COLORS: Record<string, string> = {
  Draft: '#94a3b8',
  Approved: '#3b82f6',
  Accepted: '#10b981',
  Rejected: '#ef4444',
}

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(metric => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{metric.value}</p>
                  </div>
                  <div className={`rounded-xl bg-gradient-to-br ${metric.bg} p-3`}>
                    <Icon className="h-6 w-6" style={{ color: metric.color }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="font-medium text-slate-500">{metric.trend}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowUpRight className="h-4 w-4 text-[#ff9500]" />
              Status Breakdown — All Records
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = Math.round((count / totalAll) * 100)
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={status} />
                    </div>
                    <span className="font-semibold text-slate-700">
                      {count} <span className="font-normal text-slate-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: STATUS_COLORS[status] ?? '#cbd5e1',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-[#ff9500]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRecords.map((record, index) => (
              <div
                key={`${record.module}-${record.id}-${index}`}
                className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100"
              >
                <div className="mt-0.5 rounded-lg bg-white p-1.5 shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ff9500]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {'title' in record ? String(record.title) : String(record.type)}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-slate-400">{record.module}</span>
                    <StatusBadge status={record.status} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-xl bg-gradient-to-br from-[#161A61]/10 to-blue-50 p-3">
              <Activity className="h-5 w-5 text-[#161A61]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
                System Status
              </p>
              <p className="mt-0.5 text-lg font-bold text-emerald-600">● Online</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-xl bg-gradient-to-br from-[#ff9500]/10 to-orange-50 p-3">
              <TrendingUp className="h-5 w-5 text-[#ff9500]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
                Total Records
              </p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {totalAll} entries across all modules
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
