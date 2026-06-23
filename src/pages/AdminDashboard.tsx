import { Activity, ArrowUpRight, CheckCircle2, ShieldCheck, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui'
import { dashboardActivity, dashboardMetrics } from '../data'

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="mt-3 text-3xl font-bold text-[#161A61]">{metric.value}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-[#ff9500]/10 to-orange-50 p-3 text-[#ff9500]">
                  {metric.label === 'Total Partners' ? (
                    <Users className="h-6 w-6" />
                  ) : metric.label === 'Open Opportunities' ? (
                    <ShieldCheck className="h-6 w-6" />
                  ) : (
                    <Activity className="h-6 w-6" />
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-[#ff9500]" />
                <span className="font-medium text-slate-600">Live partnership intelligence</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Key Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardActivity.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl bg-gradient-to-r from-orange-50 to-transparent p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#ff9500] flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">{item}</p>
                  <p className="text-xs text-slate-500">Partnership update</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              This report is a mock dashboard built for the EAII Partnership Management Information System.
            </p>
            <div className="grid gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 p-4">
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">System status</p>
                <p className="mt-2 text-lg font-bold text-[#161A61]">Online</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-orange-50 to-slate-50 p-4">
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Latest update</p>
                <p className="mt-2 text-lg font-bold text-[#161A61]">Real-time analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
