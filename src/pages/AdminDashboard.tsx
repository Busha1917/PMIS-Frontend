import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  Handshake,
  TrendingUp,
  Users,
  BarChart3,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
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

// Module breakdown for bar chart
const moduleData = [
  { name: 'Partners', total: partners.length, color: '#161A61' },
  { name: 'Opportunities', total: opportunities.length, color: '#ff9500' },
  { name: 'Events', total: events.length, color: '#8b5cf6' },
  { name: 'Agreements', total: agreements.length, color: '#10b981' },
  { name: 'Engagements', total: engagements.length, color: '#3b82f6' },
]

// Donut chart data
const donutData = Object.entries(statusCounts).map(([status, count]) => ({
  name: status,
  value: count,
}))
const STATUS_COLORS: Record<string, string> = {
  Draft: '#94a3b8',
  Approved: '#3b82f6',
  Accepted: '#10b981',
  Rejected: '#ef4444',
}

// Monthly trend (mock data — ready for real API)
const monthlyTrend = [
  { month: 'Jan', partners: 2, opportunities: 3, agreements: 1 },
  { month: 'Feb', partners: 4, opportunities: 5, agreements: 2 },
  { month: 'Mar', partners: 3, opportunities: 4, agreements: 3 },
  { month: 'Apr', partners: 5, opportunities: 6, agreements: 2 },
  { month: 'May', partners: 6, opportunities: 8, agreements: 4 },
  {
    month: 'Jun',
    partners: partners.length,
    opportunities: opportunities.length,
    agreements: agreements.length,
  },
]

const metrics = [
  {
    label: 'Total Partners',
    value: partners.length,
    icon: Users,
    color: '#161A61',
    bg: 'from-[#161A61]/10 to-blue-50',
    trend: '+12% this month',
    trendUp: true,
  },
  {
    label: 'Open Opportunities',
    value: opportunities.filter(o => o.status === 'Draft' || o.status === 'Approved').length,
    icon: Handshake,
    color: '#ff9500',
    bg: 'from-[#ff9500]/10 to-orange-50',
    trend: '+3 this week',
    trendUp: true,
  },
  {
    label: 'Active Engagements',
    value: engagements.filter(e => e.status === 'Assigned' || e.status === 'Approved').length,
    icon: Activity,
    color: '#10b981',
    bg: 'from-emerald-100 to-emerald-50',
    trend: 'Ongoing sessions',
    trendUp: true,
  },
  {
    label: 'Total Agreements',
    value: agreements.length,
    icon: FileText,
    color: '#8b5cf6',
    bg: 'from-violet-100 to-violet-50',
    trend: `${agreements.filter(a => a.status === 'Accepted').length} signed`,
    trendUp: false,
  },
]

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((entry: { name: string; value: number; color: string }) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* ── Metric Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(metric => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-4xl font-extrabold text-slate-900">{metric.value}</p>
                  </div>
                  <div className={`rounded-2xl bg-gradient-to-br ${metric.bg} p-3.5 flex-shrink-0`}>
                    <Icon className="h-6 w-6" style={{ color: metric.color }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs">
                  <TrendingUp
                    className={`h-3.5 w-3.5 ${metric.trendUp ? 'text-emerald-500' : 'text-violet-400'}`}
                  />
                  <span className="font-medium text-slate-500">{metric.trend}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ── Row 2: Monthly Trend + Donut ── */}
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        {/* Area Chart — Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-[#ff9500]" />
              Monthly Partnership Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPartners" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#161A61" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#161A61" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOpps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9500" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ff9500" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAgreements" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="partners"
                  name="Partners"
                  stroke="#161A61"
                  strokeWidth={2}
                  fill="url(#colorPartners)"
                />
                <Area
                  type="monotone"
                  dataKey="opportunities"
                  name="Opportunities"
                  stroke="#ff9500"
                  strokeWidth={2}
                  fill="url(#colorOpps)"
                />
                <Area
                  type="monotone"
                  dataKey="agreements"
                  name="Agreements"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorAgreements)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut — Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowUpRight className="h-4 w-4 text-[#ff9500]" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map(entry => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip formatter={(val, name) => [`${val} records`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 w-full">
              {donutData.map(entry => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLORS[entry.name] ?? '#cbd5e1' }}
                  />
                  <span className="text-xs text-slate-600 truncate">{entry.name}</span>
                  <span className="ml-auto text-xs font-bold text-slate-800">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Bar Chart + Recent Activity ── */}
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        {/* Bar Chart — Module Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-[#ff9500]" />
              Records by Module
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={moduleData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                barSize={36}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Records" radius={[6, 6, 0, 0]}>
                  {moduleData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
                <div className="mt-0.5 rounded-lg bg-white p-1.5 shadow-sm flex-shrink-0">
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

      {/* ── Row 4: System Info Footer ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="col-span-1">
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
        <Card className="col-span-1">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-xl bg-gradient-to-br from-[#ff9500]/10 to-orange-50 p-3">
              <TrendingUp className="h-5 w-5 text-[#ff9500]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
                Total Records
              </p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">{totalAll} entries</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 p-3">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
                Active Users
              </p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {users.filter(u => u.status === 'Active').length} online
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
