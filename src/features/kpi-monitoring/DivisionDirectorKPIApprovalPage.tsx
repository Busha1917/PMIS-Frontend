import { useEffect, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { PageHeaderCard } from '@/components/PageHeaderCard'
import { PageToolbar } from '@/components/PageToolbar'
import { StatusBadge } from '@/components/StatusBadge'
import { FilterDrawer } from '@/components/FilterDrawer'
import { Button, Textarea } from '@/ui'
import type { FilterValues } from '@/components/FilterDrawer'
import type { KPIRecord } from '@/types'
import { kpiStore } from './kpiStore'
import { KPIDetailView } from './KPIDetailView'
import { toast } from 'sonner'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Pending Review', value: 'Pending Review' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Returned', value: 'Returned' },
    ],
  },
]

export function DivisionDirectorKPIApprovalPage() {
  const [kpis, setKpis] = useState<KPIRecord[]>(() => kpiStore.getAll())
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [showDetail, setShowDetail] = useState(false)
  const [selectedKPI, setSelectedKPI] = useState<KPIRecord | undefined>()
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState('')

  useEffect(() => kpiStore.subscribe(setKpis), [])

  const filtered = useMemo(() => {
    return kpis
      .filter(k => k.status !== 'Draft')
      .filter(item => {
        if (
          searchQuery &&
          !item.kpiId.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.kpiName.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false
        if (activeFilters.status && item.status !== activeFilters.status) return false
        return true
      })
  }, [kpis, searchQuery, activeFilters])

  const handleView = (kpi: KPIRecord) => {
    setSelectedKPI(kpi)
    setShowDetail(true)
  }

  const handleApprove = () => {
    if (!selectedKPI) return
    const updatedKPI = {
      ...selectedKPI,
      status: 'Approved' as const,
      directorReview: {
        ...selectedKPI.directorReview,
        approvedBy: 'Division Director',
        approvedAt: new Date().toISOString(),
      },
    }
    kpiStore.update(updatedKPI)
    toast.success('KPI approved')
    setShowDetail(false)
    setSelectedKPI(undefined)
  }

  const handleReturnClick = () => {
    setShowReturnModal(true)
  }

  const handleConfirmReturn = () => {
    if (!selectedKPI || !returnReason.trim()) {
      toast.error('Please provide a reason for returning')
      return
    }
    const updatedKPI = {
      ...selectedKPI,
      status: 'Returned' as const,
      directorReview: {
        ...selectedKPI.directorReview,
        returnedBy: 'Division Director',
        returnedAt: new Date().toISOString(),
        returnReason,
      },
    }
    kpiStore.update(updatedKPI)
    toast.success('KPI returned for revision')
    setShowDetail(false)
    setSelectedKPI(undefined)
    setShowReturnModal(false)
    setReturnReason('')
  }

  const handleClose = () => {
    setShowDetail(false)
    setSelectedKPI(undefined)
    setShowReturnModal(false)
    setReturnReason('')
  }

  return (
    <div className="space-y-6">
      {!showDetail ? (
        <>
          <PageHeaderCard
            title="KPI Monitoring — Division Director"
            subtitle="Review and approve KPI metrics submitted by officers"
          />

          <PageToolbar
            searchPlaceholder="Search KPIs..."
            onSearch={setSearchQuery}
            onFilter={() => setShowFilter(true)}
            showSearchAndFilters
          />

          <DataTable
            items={filtered}
            rowKey={item => item.id}
            emptyVariant="empty"
            emptyMessage="No KPIs pending review."
            columns={[
              {
                label: 'No.',
                render: (_item, i) => (
                  <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
              },
              {
                label: 'KPI ID',
                render: item => <span className="font-medium text-slate-900">{item.kpiId}</span>,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'KPI Name',
                render: item => item.kpiName || '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Division',
                render: item => item.division || '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Score',
                render: item => `${item.performanceScore}%`,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Rating',
                render: item => {
                  const getRatingFromScore = (score: number) => {
                    if (score >= 80) return 'Excellent'
                    if (score >= 60) return 'Good'
                    if (score >= 40) return 'Fair'
                    return 'Poor'
                  }
                  const ratingMap: Record<string, string> = {
                    Excellent: 'bg-green-100 text-green-700',
                    Good: 'bg-blue-100 text-blue-700',
                    Fair: 'bg-amber-100 text-amber-700',
                    Poor: 'bg-red-100 text-red-700',
                  }
                  const rating = getRatingFromScore(item.performanceScore)
                  return (
                    <span
                      className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${ratingMap[rating]}`}
                    >
                      ✓ {rating}
                    </span>
                  )
                },
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Status',
                render: item => <StatusBadge status={item.status} />,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Action',
                render: item => (
                  <button
                    onClick={() => handleView(item)}
                    className="rounded-lg bg-[#161A61] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0f1347]"
                  >
                    {item.status === 'Pending Review' ? 'Review' : 'View'}
                  </button>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
            ]}
          />

          <FilterDrawer
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={setActiveFilters}
            fields={FILTER_FIELDS}
            title="Filter KPIs"
          />
        </>
      ) : selectedKPI ? (
        <div>
          <KPIDetailView kpi={selectedKPI} onClose={handleClose} isDirectorView />

          {/* Approval Buttons */}
          {selectedKPI.status === 'Pending Review' && (
            <div className="mt-6 flex gap-3">
              <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                ✓ Approve
              </Button>
              <Button
                onClick={handleReturnClick}
                className="flex-1 bg-[#ff9500] hover:bg-[#e68a00]"
              >
                Return
              </Button>
            </div>
          )}

          {/* Return Modal */}
          {showReturnModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Return KPI for Revision</h3>
                    <p className="text-xs text-slate-500">
                      Provide feedback for the officer to revise
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-sm text-slate-600">
                  Please provide a clear reason for returning this KPI.
                </p>
                <Textarea
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  placeholder="Enter reason for return..."
                  rows={4}
                />
                <div className="mt-5 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowReturnModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmReturn} className="bg-[#ff9500] hover:bg-[#e68a00]">
                    Confirm Return
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
