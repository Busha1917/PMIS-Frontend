import { useState } from 'react'
import { ArrowLeft, Check, Plus, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Select, Textarea } from '../../ui'
import { StatusBadge } from '../../components/StatusBadge'
import type {
  ProjectRecord,
  ProjectTeamMember,
  ProjectPartnerOrg,
  ProjectDeliverable,
  ProjectMilestone,
  ProjectRisk,
} from '../../types'
import { projectStore } from './projectStore'

// ── Step labels ────────────────────────────────────────────────────────────
const STEP_LABELS = [
  'Partners & Team',
  'Project Details',
  'Budget & Funding',
  'Timeline',
  'Milestones',
  'Risks',
  'Preview',
]
const TOTAL_STEPS = 7

// ── Step Indicator ─────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center flex-wrap gap-0">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(step => {
        const done = step < currentStep
        const active = step === currentStep
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                  done
                    ? 'border-[#161A61] bg-[#161A61] text-white'
                    : active
                      ? 'border-[#ff9500] bg-white text-[#ff9500]'
                      : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {done ? (
                  <Check className="h-4 w-4" />
                ) : step === 7 ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  step
                )}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium whitespace-nowrap ${
                  active ? 'text-[#ff9500]' : done ? 'text-[#161A61]' : 'text-slate-400'
                }`}
              >
                {STEP_LABELS[step - 1]}
              </span>
            </div>
            {step < TOTAL_STEPS && (
              <div
                className={`mx-1 mb-4 h-0.5 w-8 sm:w-10 ${done ? 'bg-[#161A61]' : 'bg-slate-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Section header helper ──────────────────────────────────────────────────
function SH({ title }: { title: string }) {
  return (
    <div className="border-l-4 border-[#ff9500] pl-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  )
}

// ── Empty placeholder ──────────────────────────────────────────────────────
function Empty({ msg = 'None added yet.' }: { msg?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-400">
      {msg}
    </div>
  )
}

// ── Preview row ────────────────────────────────────────────────────────────
function PreviewSection({
  step,
  title,
  children,
}: {
  step: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
      <h3 className="font-bold text-[#161A61] flex items-center gap-2 text-sm">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#161A61] text-white text-xs font-bold">
          {step}
        </span>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value || '—'}</p>
    </div>
  )
}

// ── Props ──────────────────────────────────────────────────────────────────
interface OfficerProjectFormProps {
  project?: ProjectRecord
  onClose: () => void
}
export function OfficerProjectForm({ project, onClose }: OfficerProjectFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ProjectRecord>>(
    project ?? {
      partnerId: '',
      partnerName: '',
      partnerCountry: '',
      partnerLead: '',
      projectName: '',
      description: '',
      thematicArea: '',
      budget: '',
      fundingSource: '',
      currency: 'ETB',
      projectManager: '',
      teamMembers: [],
      partnerOrganizations: [],
      startDate: '',
      endDate: '',
      currentPhase: 'Planning',
      milestones: [],
      deliverables: [],
      risks: [],
      status: 'Draft',
    }
  )
  const [costSharing, setCostSharing] = useState(project?.costSharing ?? false)
  const [orgContribution, setOrgContribution] = useState(project?.orgContribution ?? '')
  const [partnerContribution, setPartnerContribution] = useState(project?.partnerContribution ?? '')
  const [memberDraft, setMemberDraft] = useState<Omit<ProjectTeamMember, 'id'>>({
    name: '',
    role: '',
    email: '',
  })
  const [orgDraft, setOrgDraft] = useState<Omit<ProjectPartnerOrg, 'id'>>({
    name: '',
    lead: '',
    country: '',
  })
  const [delivDraft, setDelivDraft] = useState<Omit<ProjectDeliverable, 'id'>>({
    deliverable: '',
    dueDate: '',
    status: 'Pending',
  })
  const [mileDraft, setMileDraft] = useState<Omit<ProjectMilestone, 'id'>>({
    milestone: '',
    plannedDate: '',
    actualDate: '',
    status: 'Not Started',
  })
  const [riskDraft, setRiskDraft] = useState<Omit<ProjectRisk, 'id'>>({
    riskId: '',
    impact: 'Low',
    description: '',
    mitigation: '',
    status: 'Open',
  })

  const set = <K extends keyof ProjectRecord>(field: K, value: ProjectRecord[K]) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const removeById = <K extends keyof ProjectRecord>(field: K, id: string) => {
    const arr = (formData[field] as { id: string }[] | undefined) ?? []
    set(field, arr.filter(x => x.id !== id) as ProjectRecord[K])
  }

  const addMember = () => {
    if (!memberDraft.name.trim()) return
    set('teamMembers', [
      ...(formData.teamMembers ?? []),
      { id: `TM-${Date.now()}`, ...memberDraft },
    ])
    setMemberDraft({ name: '', role: '', email: '' })
  }
  const addOrg = () => {
    if (!orgDraft.name.trim()) return
    set('partnerOrganizations', [
      ...(formData.partnerOrganizations ?? []),
      { id: `PO-${Date.now()}`, ...orgDraft },
    ])
    setOrgDraft({ name: '', lead: '', country: '' })
  }
  const addDeliverable = () => {
    if (!delivDraft.deliverable.trim() || !delivDraft.dueDate) return
    set('deliverables', [
      ...(formData.deliverables ?? []),
      { id: `DEL-${Date.now()}`, ...delivDraft },
    ])
    setDelivDraft({ deliverable: '', dueDate: '', status: 'Pending' })
  }
  const addMilestone = () => {
    if (!mileDraft.milestone.trim() || !mileDraft.plannedDate) return
    set('milestones', [...(formData.milestones ?? []), { id: `MIL-${Date.now()}`, ...mileDraft }])
    setMileDraft({ milestone: '', plannedDate: '', actualDate: '', status: 'Not Started' })
  }
  const addRisk = () => {
    if (!riskDraft.riskId.trim() || !riskDraft.description.trim()) return
    set('risks', [...(formData.risks ?? []), { id: `RSK-${Date.now()}`, ...riskDraft }])
    setRiskDraft({ riskId: '', impact: 'Low', description: '', mitigation: '', status: 'Open' })
  }

  const handleNext = () => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS))
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 1))

  const handleSaveDraft = () => {
    if (!project) return
    projectStore.update({
      ...(project as ProjectRecord),
      ...formData,
      costSharing,
      orgContribution,
      partnerContribution,
      status: 'Draft',
    })
    toast.success('Project saved as draft')
    onClose()
  }

  const handleSubmit = () => {
    if (!project) return
    if (!formData.projectName?.trim()) {
      toast.error('Project name is required')
      setCurrentStep(2)
      return
    }
    projectStore.update({
      ...(project as ProjectRecord),
      ...formData,
      costSharing,
      orgContribution,
      partnerContribution,
      status: 'Pending Approval',
      submittedBy: 'Partnership Officer',
      submittedAt: new Date().toISOString(),
    })
    toast.success('Project submitted for approval!')
    onClose()
  }

  const members = formData.teamMembers ?? []
  const orgs = formData.partnerOrganizations ?? []
  const deliverables = formData.deliverables ?? []
  const milestones = formData.milestones ?? []
  const risks = formData.risks ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#161A61]">
            {formData.projectName || 'New Collaboration'}
          </h1>
          <p className="text-sm text-slate-500">
            {project?.id} · Fill all steps and submit for approval
          </p>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm overflow-x-auto">
        <StepIndicator currentStep={currentStep} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            {/* ── STEP 1: Partners & Team ── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <SH title="Partners & Team" />
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Lead Organization
                  </label>
                  <div className="rounded-lg bg-[#ff9500] px-4 py-3">
                    <span className="font-semibold text-white">
                      Ethiopian Artificial Intelligence Institute
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Partner Organizations
                  </label>
                  {orgs.length > 0 ? (
                    <div className="space-y-2">
                      {orgs.map(o => (
                        <div
                          key={o.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <div className="flex gap-4 text-sm">
                            <span className="font-semibold">{o.name}</span>
                            <span className="text-slate-500">{o.lead}</span>
                            <span className="text-slate-400">{o.country}</span>
                          </div>
                          <button
                            onClick={() => removeById('partnerOrganizations', o.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty />
                  )}
                  <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-white p-4">
                    <Input
                      placeholder="Organization name"
                      value={orgDraft.name}
                      onChange={e => setOrgDraft(p => ({ ...p, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Partner Lead"
                      value={orgDraft.lead}
                      onChange={e => setOrgDraft(p => ({ ...p, lead: e.target.value }))}
                    />
                    <Input
                      placeholder="Country"
                      value={orgDraft.country}
                      onChange={e => setOrgDraft(p => ({ ...p, country: e.target.value }))}
                    />
                  </div>
                  <button
                    onClick={addOrg}
                    className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    <Plus className="h-4 w-4" /> Add Partner Organization
                  </button>
                </div>
                <div className="space-y-3">
                  <SH title="Project Team" />
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Project Manager
                    </label>
                    <Input
                      placeholder="Full name"
                      value={formData.projectManager ?? ''}
                      onChange={e => set('projectManager', e.target.value)}
                    />
                  </div>
                  {members.length > 0 && (
                    <div className="space-y-2">
                      {members.map(m => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <div className="flex gap-4 text-sm">
                            <span className="font-semibold">{m.name}</span>
                            <span className="text-slate-500">{m.role}</span>
                            <span className="text-slate-400">{m.email}</span>
                          </div>
                          <button
                            onClick={() => removeById('teamMembers', m.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-white p-4">
                    <Input
                      placeholder="Full Name"
                      value={memberDraft.name}
                      onChange={e => setMemberDraft(p => ({ ...p, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Role / Position"
                      value={memberDraft.role}
                      onChange={e => setMemberDraft(p => ({ ...p, role: e.target.value }))}
                    />
                    <Input
                      placeholder="Email"
                      value={memberDraft.email}
                      onChange={e => setMemberDraft(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <button
                    onClick={addMember}
                    className="flex items-center gap-2 rounded-lg bg-[#161A61] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f1347]"
                  >
                    <Plus className="h-4 w-4" /> Add Team Member
                  </button>
                </div>
              </div>
            )}
            {/* ── STEP 2 ── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <SH title="Project Details" />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Project Name"
                    placeholder="Enter project name"
                    value={formData.projectName ?? ''}
                    onChange={e => set('projectName', e.target.value)}
                  />
                  <Input
                    label="Thematic Area"
                    placeholder="e.g. Clean Energy"
                    value={formData.thematicArea ?? ''}
                    onChange={e => set('thematicArea', e.target.value)}
                  />
                </div>
                <Textarea
                  label="Description"
                  placeholder="Describe the project objectives..."
                  value={formData.description ?? ''}
                  onChange={e => set('description', e.target.value)}
                  rows={5}
                />
              </div>
            )}
            {/* ── STEP 3 ── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <SH title="Budget & Funding" />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Budget"
                    placeholder="e.g. 12,000,000"
                    value={formData.budget ?? ''}
                    onChange={e => set('budget', e.target.value)}
                  />
                  <Input
                    label="Funding Source"
                    placeholder="e.g. World Bank"
                    value={formData.fundingSource ?? ''}
                    onChange={e => set('fundingSource', e.target.value)}
                  />
                  <Select
                    label="Currency"
                    value={formData.currency ?? 'ETB'}
                    onValueChange={v => set('currency', v)}
                  >
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCostSharing(v => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${costSharing ? 'bg-[#161A61]' : 'bg-slate-300'}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${costSharing ? 'translate-x-5' : 'translate-x-0.5'}`}
                    />
                  </button>
                  <span className="text-sm font-medium text-slate-700">Cost Sharing</span>
                </div>
                {costSharing && (
                  <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <SH title="Project Cost Contribution" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Organization Contribution"
                        placeholder="e.g. 5,000,000"
                        value={orgContribution}
                        onChange={e => setOrgContribution(e.target.value)}
                      />
                      <Input
                        label="Partner Contribution"
                        placeholder="e.g. 7,000,000"
                        value={partnerContribution}
                        onChange={e => setPartnerContribution(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* ── STEP 4: Timeline ── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <SH title="Timeline" />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate ?? ''}
                    onChange={e => set('startDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate ?? ''}
                    onChange={e => set('endDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Current Phase
                  </label>
                  <Select
                    value={formData.currentPhase ?? 'Planning'}
                    onValueChange={v => set('currentPhase', v)}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Initiation">Initiation</option>
                    <option value="Execution">Execution</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Closure">Closure</option>
                  </Select>
                </div>
              </div>
            )}
            {/* ── STEP 5: Milestones & Deliverables ── */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <SH title="Deliverables" />
                  {deliverables.length > 0 ? (
                    <div className="space-y-2">
                      {deliverables.map(d => (
                        <div
                          key={d.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <div className="flex flex-1 gap-4 text-sm min-w-0">
                            <span className="font-semibold truncate">{d.deliverable}</span>
                            <span className="shrink-0 text-slate-400">{d.dueDate}</span>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${d.status === 'Completed' ? 'bg-green-100 text-green-700' : d.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}
                            >
                              {d.status}
                            </span>
                          </div>
                          <button
                            onClick={() => removeById('deliverables', d.id)}
                            className="ml-3 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty msg="No deliverables added yet." />
                  )}
                  <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-white p-4">
                    <Input
                      placeholder="Deliverable title"
                      value={delivDraft.deliverable}
                      onChange={e => setDelivDraft(p => ({ ...p, deliverable: e.target.value }))}
                    />
                    <Input
                      type="date"
                      value={delivDraft.dueDate}
                      onChange={e => setDelivDraft(p => ({ ...p, dueDate: e.target.value }))}
                    />
                    <Select
                      value={delivDraft.status}
                      onValueChange={v =>
                        setDelivDraft(p => ({ ...p, status: v as ProjectDeliverable['status'] }))
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Overdue">Overdue</option>
                    </Select>
                  </div>
                  <button
                    onClick={addDeliverable}
                    className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    <Plus className="h-4 w-4" /> Add Deliverable
                  </button>
                </div>
                <div className="space-y-3">
                  <SH title="Milestones" />
                  {milestones.length > 0 ? (
                    <div className="space-y-2">
                      {milestones.map(m => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <div className="flex flex-1 gap-4 text-sm min-w-0">
                            <span className="font-semibold truncate">{m.milestone}</span>
                            <span className="shrink-0 text-slate-400">
                              Planned: {m.plannedDate}
                            </span>
                            {m.actualDate && (
                              <span className="shrink-0 text-slate-400">
                                Actual: {m.actualDate}
                              </span>
                            )}
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${m.status === 'Completed' ? 'bg-green-100 text-green-700' : m.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : m.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}
                            >
                              {m.status}
                            </span>
                          </div>
                          <button
                            onClick={() => removeById('milestones', m.id)}
                            className="ml-3 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty msg="No milestones added yet." />
                  )}
                  <div className="grid grid-cols-4 gap-3 rounded-lg border border-slate-200 bg-white p-4">
                    <Input
                      placeholder="Milestone title"
                      value={mileDraft.milestone}
                      onChange={e => setMileDraft(p => ({ ...p, milestone: e.target.value }))}
                    />
                    <Input
                      type="date"
                      value={mileDraft.plannedDate}
                      onChange={e => setMileDraft(p => ({ ...p, plannedDate: e.target.value }))}
                    />
                    <Input
                      type="date"
                      value={mileDraft.actualDate ?? ''}
                      onChange={e => setMileDraft(p => ({ ...p, actualDate: e.target.value }))}
                    />
                    <Select
                      value={mileDraft.status}
                      onValueChange={v =>
                        setMileDraft(p => ({ ...p, status: v as ProjectMilestone['status'] }))
                      }
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                    </Select>
                  </div>
                  <button
                    onClick={addMilestone}
                    className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    <Plus className="h-4 w-4" /> Add Milestone
                  </button>
                </div>
              </div>
            )}
            {/* ── STEP 6: Risks ── */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <SH title="Risk Register" />
                {risks.length > 0 ? (
                  <div className="space-y-3">
                    {risks.map(r => (
                      <div
                        key={r.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-[#161A61]">{r.riskId}</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.impact === 'Critical' || r.impact === 'High' ? 'bg-red-100 text-red-700' : r.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                              >
                                {r.impact}
                              </span>
                              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                                {r.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700">{r.description}</p>
                            {r.mitigation && (
                              <p className="text-xs text-slate-500">
                                <span className="font-medium">Mitigation:</span> {r.mitigation}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeById('risks', r.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty msg="No risks added yet." />
                )}
                <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Risk ID"
                      placeholder="e.g. RISK-001"
                      value={riskDraft.riskId}
                      onChange={e => setRiskDraft(p => ({ ...p, riskId: e.target.value }))}
                    />
                    <Select
                      label="Impact"
                      value={riskDraft.impact}
                      onValueChange={v =>
                        setRiskDraft(p => ({ ...p, impact: v as ProjectRisk['impact'] }))
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </Select>
                  </div>
                  <Textarea
                    label="Description"
                    placeholder="Describe the risk..."
                    value={riskDraft.description}
                    onChange={e => setRiskDraft(p => ({ ...p, description: e.target.value }))}
                    rows={3}
                  />
                  <Textarea
                    label="Mitigation Plan"
                    placeholder="How will this be mitigated?"
                    value={riskDraft.mitigation}
                    onChange={e => setRiskDraft(p => ({ ...p, mitigation: e.target.value }))}
                    rows={2}
                  />
                  <Select
                    label="Status"
                    value={riskDraft.status}
                    onValueChange={v =>
                      setRiskDraft(p => ({ ...p, status: v as ProjectRisk['status'] }))
                    }
                  >
                    <option value="Open">Open</option>
                    <option value="Mitigating">Mitigating</option>
                    <option value="Resolved">Resolved</option>
                  </Select>
                  <button
                    onClick={addRisk}
                    className="flex items-center gap-2 rounded-lg bg-[#161A61] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f1347]"
                  >
                    <Plus className="h-4 w-4" /> Add Risk
                  </button>
                </div>
              </div>
            )}
            {/* ── STEP 7: Preview ── */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">
                    Review all information below before submitting. Go back to any step to make
                    changes.
                  </p>
                </div>
                <PreviewSection step={1} title="Partners & Team">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Project Manager" value={formData.projectManager} />
                    <Field label="Team Members" value={`${members.length} added`} />
                    <Field label="Partner Organizations" value={`${orgs.length} added`} />
                  </div>
                  {orgs.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {orgs.map(o => (
                        <div
                          key={o.id}
                          className="flex gap-4 rounded border border-slate-200 bg-white p-2 text-xs"
                        >
                          <span className="font-semibold">{o.name}</span>
                          <span className="text-slate-500">{o.lead}</span>
                          <span className="text-slate-400">{o.country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {members.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {members.map(m => (
                        <div
                          key={m.id}
                          className="flex gap-4 rounded border border-slate-200 bg-white p-2 text-xs"
                        >
                          <span className="font-semibold">{m.name}</span>
                          <span className="text-slate-500">{m.role}</span>
                          <span className="text-slate-400">{m.email}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </PreviewSection>
                <PreviewSection step={2} title="Project Details">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Project Name" value={formData.projectName} />
                    <Field label="Thematic Area" value={formData.thematicArea} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Description</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {formData.description || '—'}
                    </p>
                  </div>
                </PreviewSection>
                <PreviewSection step={3} title="Budget & Funding">
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Budget" value={`${formData.currency} ${formData.budget}`} />
                    <Field label="Funding Source" value={formData.fundingSource} />
                    <Field label="Cost Sharing" value={costSharing ? 'Yes' : 'No'} />
                    {costSharing && (
                      <>
                        <Field label="Org Contribution" value={orgContribution} />
                        <Field label="Partner Contribution" value={partnerContribution} />
                      </>
                    )}
                  </div>
                </PreviewSection>
                <PreviewSection step={4} title="Timeline">
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Start Date" value={formData.startDate} />
                    <Field label="End Date" value={formData.endDate} />
                    <Field label="Current Phase" value={formData.currentPhase} />
                  </div>
                </PreviewSection>
                <PreviewSection step={5} title="Milestones & Deliverables">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Deliverables" value={`${deliverables.length} added`} />
                    <Field label="Milestones" value={`${milestones.length} added`} />
                  </div>
                  {deliverables.length > 0 && (
                    <div className="space-y-1">
                      {deliverables.map(d => (
                        <div
                          key={d.id}
                          className="flex gap-4 rounded border border-slate-200 bg-white p-2 text-xs"
                        >
                          <span className="font-semibold">{d.deliverable}</span>
                          <span className="text-slate-400">{d.dueDate}</span>
                          <span
                            className={`rounded-full px-2 font-semibold ${d.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                          >
                            {d.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </PreviewSection>
                <PreviewSection step={6} title="Risks">
                  {risks.length > 0 ? (
                    <div className="space-y-1">
                      {risks.map(r => (
                        <div
                          key={r.id}
                          className="flex gap-4 rounded border border-slate-200 bg-white p-2 text-xs"
                        >
                          <span className="font-bold text-[#161A61]">{r.riskId}</span>
                          <span
                            className={`rounded-full px-2 font-semibold ${r.impact === 'High' || r.impact === 'Critical' ? 'bg-red-100 text-red-700' : r.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                          >
                            {r.impact}
                          </span>
                          <span className="text-slate-600 truncate">{r.description}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No risks added.</p>
                  )}
                </PreviewSection>
              </div>
            )}
            {/* ── Navigation ── */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  ← Back
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                {currentStep < TOTAL_STEPS ? (
                  <Button onClick={handleNext} className="bg-[#ff9500] hover:bg-[#e68a00]">
                    {currentStep === TOTAL_STEPS - 1 ? 'Preview →' : 'Next →'}
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-[#161A61] hover:bg-[#0f1347]">
                    Submit for Approval
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ── Right Sidebar ── */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-bold text-[#161A61]">Workflow Status</p>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${formData.status === 'Pending Approval' || formData.status === 'Approved' ? 'border-[#161A61] bg-[#161A61]' : 'border-slate-300 bg-white'}`}
                >
                  {formData.status === 'Pending Approval' || formData.status === 'Approved' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Submit Collaboration</p>
                  <p className="text-xs text-slate-500">Partnership Officer</p>
                  <div
                    className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${formData.status === 'Pending Approval' ? 'bg-blue-100 text-blue-800' : 'bg-[#FEF3C7] text-[#92400E]'}`}
                  >
                    {formData.status === 'Pending Approval' ? 'Submitted' : 'Pending'}
                  </div>
                  {formData.submittedAt && (
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(formData.submittedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${formData.status === 'Approved' ? 'border-green-500 bg-green-500' : formData.status === 'Rejected' ? 'border-red-500 bg-red-500' : 'border-slate-300 bg-white'}`}
                >
                  {formData.status === 'Approved' || formData.status === 'Rejected' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Approve Collaboration</p>
                  <p className="text-xs text-slate-500">Division Director</p>
                  <div
                    className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${formData.status === 'Approved' ? 'bg-green-100 text-green-700' : formData.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-[#FEF3C7] text-[#92400E]'}`}
                  >
                    {formData.status === 'Approved'
                      ? 'Approved'
                      : formData.status === 'Rejected'
                        ? 'Rejected'
                        : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Current Status</span>
            <StatusBadge status={formData.status ?? 'Draft'} />
          </div>
        </div>
      </div>
    </div>
  )
}
