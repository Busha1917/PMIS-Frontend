import { useState } from 'react'
import { ArrowLeft, AlertCircle, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Textarea } from '../../ui'
import { StatusBadge } from '../../components/StatusBadge'
import type { ProjectRecord } from '../../types'
import { projectStore } from './projectStore'

interface Props {
  project: ProjectRecord
  onClose: () => void
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-slate-900 border-l-4 border-[#ff9500] pl-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function DataRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{value || '—'}</p>
    </div>
  )
}

export function DivisionDirectorProjectApproval({ project, onClose }: Props) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const isPending = project.status === 'Pending Approval'

  const handleApprove = () => {
    projectStore.update({
      ...project,
      status: 'Approved',
      approvedBy: 'Division Director',
      approvedAt: new Date().toISOString(),
    })
    toast.success('Project approved successfully')
    onClose()
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    projectStore.update({
      ...project,
      status: 'Rejected',
      rejectedBy: 'Division Director',
      rejectedAt: new Date().toISOString(),
      rejectionReason,
    })
    toast.success('Project rejected')
    onClose()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#161A61]">
              {project.projectName || 'Project Detail'}
            </h1>
            <p className="text-sm text-slate-500">
              {project.id} · {project.partnerName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={project.status} />
          {isPending && (
            <>
              <Button onClick={handleApprove} className="bg-green-600 px-6 hover:bg-green-700">
                Approve
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
                className="bg-red-600 px-6 hover:bg-red-700"
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Rejection banner */}
      {project.status === 'Rejected' && project.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">Rejection Reason</p>
          <p className="mt-1 text-sm text-red-700">{project.rejectionReason}</p>
          {project.rejectedAt && (
            <p className="mt-1 text-xs text-red-500">
              Rejected on {new Date(project.rejectedAt).toLocaleDateString()} by{' '}
              {project.rejectedBy}
            </p>
          )}
        </div>
      )}

      {/* Approval banner */}
      {project.status === 'Approved' && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Project Approved</p>
            {project.approvedAt && (
              <p className="text-xs text-green-600">
                Approved on {new Date(project.approvedAt).toLocaleDateString()} by{' '}
                {project.approvedBy}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Submission info */}
      {project.submittedAt && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs text-blue-600">
            Submitted by <span className="font-semibold">{project.submittedBy}</span> on{' '}
            {new Date(project.submittedAt).toLocaleString()}
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Progress</span>
          <span className="text-sm font-bold text-slate-900">
            {project.percentageCompletion}% · {project.currentPhase || 'Planning'}
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#161A61] to-[#2e3875]"
            style={{ width: `${project.percentageCompletion}%` }}
          />
        </div>
      </div>

      {/* Top row: Project Info / Team / Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InfoCard title="Project Information">
          <div className="space-y-4">
            <DataRow label="Project ID" value={project.id} />
            <DataRow label="Project Name" value={project.projectName} />
            <DataRow label="Thematic Area" value={project.thematicArea} />
            <div>
              <p className="text-xs font-medium text-slate-500">Description</p>
              <p className="mt-0.5 text-sm text-slate-700 leading-relaxed">
                {project.description || '—'}
              </p>
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Project Team">
          <div className="space-y-4">
            <DataRow label="Project Manager" value={project.projectManager} />
            <DataRow label="Partner Lead" value={project.partnerLead} />
            <DataRow
              label="Team Members"
              value={project.teamMembers?.length ? `${project.teamMembers.length} members` : '—'}
            />
            {(project.teamMembers ?? []).length > 0 && (
              <div className="space-y-1.5">
                {project.teamMembers.map(m => (
                  <div
                    key={m.id}
                    className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                  >
                    <span className="font-semibold text-slate-900">{m.name}</span>
                    <span className="mx-2 text-slate-400">·</span>
                    <span className="text-slate-600">{m.role}</span>
                    {m.email && (
                      <>
                        <span className="mx-2 text-slate-300">·</span>
                        <span className="text-slate-400">{m.email}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </InfoCard>

        <InfoCard title="Timeline">
          <div className="space-y-4">
            <DataRow label="Start Date" value={project.startDate} />
            <DataRow label="End Date" value={project.endDate} />
            <DataRow label="Current Phase" value={project.currentPhase} />
          </div>
        </InfoCard>
      </div>

      {/* Budget / Milestones / Risks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InfoCard title="Funding Information">
          <div className="space-y-4">
            <DataRow label="Budget" value={`${project.currency} ${project.budget}`} />
            <DataRow label="Funding Source" value={project.fundingSource} />
            <DataRow label="Cost Sharing" value={project.costSharing ? 'Yes' : 'No'} />
            {project.costSharing && (
              <>
                <DataRow label="Org Contribution" value={project.orgContribution} />
                <DataRow label="Partner Contribution" value={project.partnerContribution} />
              </>
            )}
          </div>
        </InfoCard>

        <InfoCard title="Milestones">
          {(project.milestones ?? []).length > 0 ? (
            <div className="space-y-3">
              {project.milestones.map(m => (
                <div key={m.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{m.milestone}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${m.status === 'Completed' ? 'bg-green-100 text-green-700' : m.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : m.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-slate-500">
                    <span>Planned: {m.plannedDate}</span>
                    {m.actualDate && <span>Actual: {m.actualDate}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-400">
              None added.
            </div>
          )}
        </InfoCard>

        <InfoCard title="Risk Register">
          {(project.risks ?? []).length > 0 ? (
            <div className="space-y-3">
              {project.risks.map(r => (
                <div key={r.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#161A61]">{r.riskId}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.impact === 'High' || r.impact === 'Critical' ? 'bg-red-100 text-red-700' : r.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {r.impact}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{r.description}</p>
                  {r.mitigation && (
                    <p className="mt-1 text-xs text-slate-500">
                      <span className="font-medium">Mitigation:</span> {r.mitigation}
                    </p>
                  )}
                  <span className="mt-1.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-400">
              None added.
            </div>
          )}
        </InfoCard>
      </div>

      {/* Deliverables */}
      {(project.deliverables ?? []).length > 0 && (
        <InfoCard title="Deliverables">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {project.deliverables.map(d => (
              <div key={d.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{d.deliverable}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-slate-400">{d.dueDate}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${d.status === 'Completed' ? 'bg-green-100 text-green-700' : d.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {/* Partner Organizations */}
      {(project.partnerOrganizations ?? []).length > 0 && (
        <InfoCard title="Partner Organizations">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(project.partnerOrganizations ?? []).map(o => (
              <div key={o.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{o.name}</p>
                <p className="text-xs text-slate-500">
                  {o.lead} · {o.country}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reject Project</h3>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              Please provide a reason for rejecting this project.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
