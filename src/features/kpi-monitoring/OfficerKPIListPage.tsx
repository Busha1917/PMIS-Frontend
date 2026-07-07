import { useEffect, useMemo, useState } from 'react'
import { Filter, Plus, Eye, Flag } from 'lucide-react'
import type { KPIRecord } from '@/types'
import { kpiStore } from './kpiStore'
import { OfficerKPIRegistrationForm } from './OfficerKPIRegistrationForm'

function getRatingColor(score: number) {
  if (score >= 80) return 'bg-green-100 text-green-700'
  if (score >= 60) return 'bg-blue-100 text-blue-700'
  if (score >= 40) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

function getRatingLabel(score: number) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { bg: string; text: string; label: string }> = {
    Draft: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Draft' },
    'Pending Review': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Under Review' },
    Approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    Returned: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
  }
  const s = statusMap[status] || statusMap['Draft']
  return `${s.bg} ${s.text}`
}

export function OfficerKPIListPage() {
  const [kpis, setKpis] = useState<KPIRecord[]>(() => kpiStore.getAll())
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedKPI, setSelectedKPI] = useState<KPIRecord | undefined>()

  useEffect(() => kpiStore.subscribe(setKpis), [])

  const filtered = useMemo(() => {
    return kpis.filter(item => {
      if (
        searchQuery &&
        !item.kpiId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.kpiName.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      return true
    })
  }, [kpis, searchQuery])

  const handleAddNew = () => {
    const newKPI = kpiStore.create()
    setSelectedKPI(newKPI)
    setShowForm(true)
  }

  const handleView = (kpi: KPIRecord) => {
    setSelectedKPI(kpi)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setSelectedKPI(undefined)
  }

  if (showForm && selectedKPI) {
    return <OfficerKPIRegistrationForm kpi={selectedKPI} onClose={handleClose} />
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#161A61]">KPI List</h1>
        <p className="mt-0.5 text-sm text-slate-500">All partnership KPI evaluations</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder-slate-400 focus:border-[#161A61] focus:outline-none focus:ring-1 focus:ring-[#161A61]"
          />
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 rounded-lg bg-[#ff9500] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e68a00]"
          >
            <Plus className="h-5 w-5" />
            New KPI
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-[#0b265a]">
              <th className="px-4 py-3 text-left text-xs font-bold text-white">No.</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white">KPI ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white">KPI Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white">Period</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white">Division</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-white">Score</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-white">Rating</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-white">Status</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500">
                  No KPIs found
                </td>
              </tr>
            ) : (
              filtered.map((kpi, idx) => (
                <tr key={kpi.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{kpi.kpiId}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{kpi.kpiName || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{kpi.period || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{kpi.division || '—'}</td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-slate-900">
                    {kpi.performanceScore}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getRatingColor(kpi.performanceScore)}`}
                    >
                      ✓ {getRatingLabel(kpi.performanceScore)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadge(kpi.status)}`}
                    >
                      {kpi.status === 'Pending Review'
                        ? '⏳ Under Review'
                        : `${kpi.status === 'Draft' ? '○' : '✓'} ${kpi.status}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleView(kpi)}
                        className="text-slate-400 hover:text-slate-600"
                        title={kpi.status === 'Draft' ? 'Edit' : 'View'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-slate-400 hover:text-slate-600" title="Flag">
                        <Flag className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Rows per page: <span className="font-semibold">10</span>
        </div>
        <div className="text-sm text-slate-600">
          Showing 1 to {Math.min(10, filtered.length)} of {filtered.length} entries
        </div>
        <div className="flex gap-1">
          <button className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">
            ← Back
          </button>
          <button className="rounded bg-[#ff9500] px-2 py-1 text-sm font-semibold text-white">
            1
          </button>
          <button className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">2</button>
          <button className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">3</button>
          <button className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
