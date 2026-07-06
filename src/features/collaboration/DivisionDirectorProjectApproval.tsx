import { useState } from 'react'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Textarea } from '../../ui'
import type { ProjectRecord } from '../../types'
import { projectStore } from './projectStore'

interface DivisionDirectorProjectApprovalProps {
  project: ProjectRecord
  onClose: () => void
}

export function DivisionDirectorProjectApproval({
  project,
  onClose,
}: DivisionDirectorProjectApprovalProps) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const handleApprove = () => {
    const updated: ProjectRecord = {
      ...project,
      status: 'Approved',
      approvedBy: 'Division Director',
      approvedAt: new Date().toISOString(),
    }
    projectStore.update(updated)
    toast.success('Project approved successfully')
    onClose()
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    const updated: ProjectRecord = {
      ...project,
      status: 'Rejected',
      rejectedBy: 'Division Director',
      rejectedAt: new Date().toISOString(),
      rejectionReason,
    }
    projectStore.update(updated)
    toast.success('Project rejected')
    onClose()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#161A61]">{project.projectName}</h1>
            <p className="text-sm text-slate-600">
              {project.id} • {project.partnerName}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleApprove} className="bg-green-600 px-6 hover:bg-green-700">
            Approve
          </Button>
          <Button
            onClick={() => setShowRejectModal(true)}
            className="bg-red-600 px-6 hover:bg-red-700"
          >
            Reject
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Progress</span>
          <span className="text-sm font-bold text-slate-900">
            {project.percentageCompletion}% • {project.currentPhase || 'Not Started'}
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-slate-400 to-slate-500"
            style={{ width: `${project.percentageCompletion}%` }}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Project Information */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-slate-900">Project Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Project ID</p>
                <p className="text-sm font-semibold text-slate-900">{project.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Lead Organization</p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.partnerName || 'Ministry of Energy'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Description</p>
                <p className="text-sm text-slate-700">
                  {project.description || 'Solar microgrid deployment in rural regions'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Thematic Area</p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.thematicArea || 'Clean Energy'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Project Team */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-slate-900">Project Team</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Project Manager</p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.projectManager || 'Meron Alemu'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Technical Lead</p>
                <p className="text-sm font-semibold text-slate-900">------</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Partner Lead</p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.partnerLead || '------'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Team Members</p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.teamMembers?.length || 8}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-slate-900">Timeline</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Start Date</p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.startDate || '2026-03-01'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">End Date</p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.endDate || '2027-03-01'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Current Phase</p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.currentPhase || 'Planning'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Progress Status</p>
                <p className="text-sm font-semibold text-slate-900">Not Started</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Funding, Milestones, Risk */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Funding Information */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-slate-900">Funding Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500">Budget</p>
              <p className="text-sm font-semibold text-slate-900">
                {project.currency} {project.budget || '12,000,000'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Funding Type</p>
              <p className="text-sm font-semibold text-slate-900">Grant</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Organization Contribution</p>
              <p className="text-sm font-semibold text-slate-900">------</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Partner Contribution</p>
              <p className="text-sm font-semibold text-slate-900">------</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Funding Source</p>
              <p className="text-sm font-semibold text-slate-900">
                {project.fundingSource || 'African Development Bank'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Cost Sharing</p>
              <p className="text-sm font-semibold text-slate-900">No</p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-slate-900">Milestones</h3>
          {project.milestones && project.milestones.length > 0 ? (
            <div className="space-y-3">
              {project.milestones.map(milestone => (
                <div key={milestone.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{milestone.milestone}</p>
                    <span className="rounded-full bg-[#FEF3C7] px-2 py-1 text-xs font-semibold text-[#92400E]">
                      {milestone.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="font-medium">Planned:</span> {milestone.plannedDate}
                    </div>
                    <div>
                      <span className="font-medium">Actual:</span>{' '}
                      {milestone.actualDate || '---------------'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">None added yet.</p>
            </div>
          )}
        </div>

        {/* Risk Register */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-slate-900">Risk Register</h3>
          {project.risks && project.risks.length > 0 ? (
            <div className="space-y-3">
              {project.risks.map(risk => (
                <div key={risk.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{risk.riskId}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        risk.impact === 'High' || risk.impact === 'Critical'
                          ? 'bg-red-100 text-red-700'
                          : risk.impact === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {risk.status}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-slate-600">{risk.description}</p>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Mitigation:</p>
                    <p className="text-xs text-slate-600">{risk.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">None added yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Partner Organizations Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-slate-900">Partner Organizations</h3>
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">None added yet.</p>
        </div>
      </div>

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
