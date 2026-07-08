import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import { EngagementForm } from './EngagementForm'
import type { EngagementRecord } from '../../types'
import {
  useGetEngagementsQuery,
  useCreateEngagementMutation,
  useUpdateEngagementMutation,
  useCompleteEngagementMutation,
} from '../../store/apiSlice'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'In Progress', value: 'In Progress' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Cancelled', value: 'Cancelled' },
    ],
  },
]

export function OfficerEngagementPage() {
  const { data: engagements = [] } = useGetEngagementsQuery()
  const [createEngagement] = useCreateEngagementMutation()
  const [updateEngagement] = useUpdateEngagementMutation()
  const [completeEngagement] = useCompleteEngagementMutation()

  const [selected, setSelected] = useState<any | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  const handleCreateNew = () => {
    setSelected({ status: 'Draft' })
  }

  const filtered = useMemo(() => {
    return engagements.filter(item => {
      const orgName = item.externalParticipants?.[0]?.organizationName || ''
      if (
        searchQuery &&
        !orgName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [engagements, searchQuery, activeFilters])

  const handleSaveDraft = async (data: any) => {
    try {
      if (data.id && !data.id.startsWith('ENG-2026-')) {
        // Real ID exists
        await updateEngagement({ id: data.id, data }).unwrap()
      } else {
        await createEngagement(data).unwrap()
      }
      setSelected(null)
      toast.success('Engagement saved successfully.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save engagement')
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (data.id && !data.id.startsWith('ENG-2026-')) {
        await updateEngagement({ id: data.id, data }).unwrap()
        await completeEngagement(data.id).unwrap()
      } else {
        const created = await createEngagement(data).unwrap()
        await completeEngagement(created.id).unwrap()
      }
      setSelected(null)
      toast.success('Engagement marked as completed.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to complete engagement')
    }
  }

  // ── Form view ────────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <EngagementForm
        engagement={selected}
        mode="edit"
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        onCancel={() => setSelected(null)}
      />
    )
  }

  // ── Table view ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="My Engagements"
        subtitle="Fill in the details for engagements assigned to you"
      />
      <PageToolbar
        searchPlaceholder="Search engagements..."
        addLabel="Add Engagement"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        onAdd={handleCreateNew}
        showSearchAndFilters
      />
      <DataTable
        items={filtered}
        rowKey={item => item.id}
        emptyVariant="engagement"
        columns={[
          {
            label: 'No.',
            render: (_item, i) => (
              <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
            ),
            headClassName: 'bg-[#0b265a] text-white text-center',
          },
          {
            label: 'Engagement ID',
            render: item => <span className="font-medium text-slate-900">{item.id}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Organization',
            render: item => item.externalParticipants?.[0]?.organizationName || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Type',
            render: item => item.engagementType?.typeName || '—',
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Date',
            render: item => item.engagementDate,
            headClassName: 'bg-[#0b265a] text-white',
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
                onClick={() => setSelected(item)}
                className={
                  item.status === 'Draft' || item.status === 'In Progress'
                    ? 'rounded-lg bg-[#ff9500] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#e68a00]'
                    : 'rounded-lg bg-[#161A61] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0f1347]'
                }
              >
                {item.status === 'Draft' || item.status === 'In Progress' ? 'Edit Details' : 'View'}
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
        title="Filter Engagements"
      />
    </div>
  )
}
