import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PageHeaderCard } from '../../components/PageHeaderCard'
import { PageToolbar } from '../../components/PageToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { FilterDrawer } from '../../components/FilterDrawer'
import type { FilterValues } from '../../components/FilterDrawer'
import type { ProjectRecord } from '../../types'
import { projectStore } from './projectStore'
import { OfficerProjectForm } from './OfficerProjectForm'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Pending Approval', value: 'Pending Approval' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
]

export function OfficerProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>(() => projectStore.getAll())
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})
  const [showForm, setShowForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | undefined>()

  useEffect(() => projectStore.subscribe(setProjects), [])

  // Filter to show only officer's projects (Draft, Pending Approval, Approved, Rejected)
  const officerProjects = useMemo(() => {
    return projects.filter(item => {
      if (
        searchQuery &&
        !item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      return true
    })
  }, [projects, searchQuery, activeFilters])

  const handleAddNew = () => {
    const newProject = projectStore.create()
    setSelectedProject(newProject)
    setShowForm(true)
  }

  const handleView = (project: ProjectRecord) => {
    setSelectedProject(project)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedProject(undefined)
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <PageHeaderCard
            title="Projects — Officer"
            subtitle="Create and manage project collaboration records"
          />
          <PageToolbar
            searchPlaceholder="Search projects..."
            addLabel="Add Project"
            onSearch={setSearchQuery}
            onFilter={() => setShowFilter(true)}
            onAdd={handleAddNew}
            showSearchAndFilters
          />
          <DataTable
            items={officerProjects}
            rowKey={item => item.id}
            emptyVariant="empty"
            emptyMessage="No projects found. Start by adding a project collaboration."
            emptyAction={
              <button
                onClick={handleAddNew}
                className="rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e68a00]"
              >
                Add Project
              </button>
            }
            columns={[
              {
                label: 'No.',
                render: (_item, i) => (
                  <span className="font-semibold text-slate-900">{(i ?? 0) + 1}</span>
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
              },
              {
                label: 'Project ID',
                render: item => <span className="font-medium text-slate-900">{item.id}</span>,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Project Name',
                render: item => item.projectName || '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Partner',
                render: item => item.partnerName,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Thematic Area',
                render: item => item.thematicArea || '—',
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Progress',
                render: item => (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-[#ff9500]"
                        style={{ width: `${item.percentageCompletion}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">{item.percentageCompletion}%</span>
                  </div>
                ),
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
                    onClick={() => handleView(item)}
                    className="rounded-lg bg-[#161A61] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0f1347]"
                  >
                    View
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
            title="Filter Projects"
          />
        </>
      ) : (
        /* Officer Form */
        selectedProject && (
          <OfficerProjectForm project={selectedProject} onClose={handleCloseForm} />
        )
      )}
    </div>
  )
}
