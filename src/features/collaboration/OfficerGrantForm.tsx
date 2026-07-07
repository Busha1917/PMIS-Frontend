import { useState } from 'react'
import { ArrowLeft, Check, Plus, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Select, Textarea } from '../../ui'
import { StatusBadge } from '../../components/StatusBadge'
import type {
  GrantRecord,
  GrantTeamMember,
  GrantMilestone,
  GrantDeliverable,
  GrantRisk,
} from '../../types'
import { grantStore } from './grantStore'

// ── Step labels ─────────────────────────────────────────────────────────────
const STEP_LABELS = [
  'Project Details',
  'Funding',
  'Team',
  'Timeline',
  'Progress',
  'Risks',
  'Preview',
]
const TOTAL_STEPS = 7

// ── Step Indicator ──────────────────────────────────────────────────────────
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
                ) : step === TOTAL_STEPS ? (
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

// ── Section header ───────────────────────────────────────────────────────────
function SH({ title }: { title: string }) {
  return (
    <div className="border-l-4 border-[#ff9500] pl-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  )
}

// ── Empty placeholder ────────────────────────────────────────────────────────
function Empty({ msg = 'None added yet.' }: { msg?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-400">
      {msg}
    </div>
  )
}

// ── Preview section ──────────────────────────────────────────────────────────
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

// ── Main component ───────────────────────────────────────────────────────────
interface Props {
  grant: GrantRecord
  onClose: () => void
}

export function OfficerGrantForm({ grant, onClose }: Props) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<GrantRecord>({ ...grant })

  // ── Local list state ─────────────────────────────────────────────────────
  const [teamMembers, setTeamMembers] = useState<GrantTeamMember[]>(grant.teamMembers ?? [])
  const [milestones, setMilestones] = useState<GrantMilestone[]>(grant.milestones ?? [])
  const [deliverables, setDeliverables] = useState<GrantDeliverable[]>(grant.deliverables ?? [])
  const [risks, setRisks] = useState<GrantRisk[]>(grant.risks ?? [])

  // Team member draft
  const [tmDraft, setTmDraft] = useState<GrantTeamMember>({ id: '', name: '', role: '', email: '' })
  // Milestone draft
  const [msDraft, setMsDraft] = useState<GrantMilestone>({
    id: '',
    milestone: '',
    plannedDate: '',
    actualDate: '',
    status: 'Not Started',
  })
  // Deliverable draft
  const [dlDraft, setDlDraft] = useState<GrantDeliverable>({
    id: '',
    deliverable: '',
    dueDate: '',
    status: 'Pending',
  })
  // Risk draft
  const [rkDraft, setRkDraft] = useState<GrantRisk>({ id: '', description: '', mitigationPlan: '' })

  const set = (field: keyof GrantRecord, value: unknown) => setForm(f => ({ ...f, [field]: value }))

  // ── Team helpers ─────────────────────────────────────────────────────────
  const addTeamMember = () => {
    if (!tmDraft.name.trim()) {
      toast.error('Name is required')
      return
    }
    const member = { ...tmDraft, id: `TM-${Date.now()}` }
    setTeamMembers(t => [...t, member])
    setTmDraft({ id: '', name: '', role: '', email: '' })
  }
  const removeTeamMember = (id: string) => setTeamMembers(t => t.filter(m => m.id !== id))

  // ── Milestone helpers ────────────────────────────────────────────────────
  const addMilestone = () => {
    if (!msDraft.milestone.trim()) {
      toast.error('Milestone is required')
      return
    }
    setMilestones(m => [...m, { ...msDraft, id: `MS-${Date.now()}` }])
    setMsDraft({ id: '', milestone: '', plannedDate: '', actualDate: '', status: 'Not Started' })
  }
  const removeMilestone = (id: string) => setMilestones(m => m.filter(ms => ms.id !== id))

  // ── Deliverable helpers ───────────────────────────────────────────────────
  const addDeliverable = () => {
    if (!dlDraft.deliverable.trim()) {
      toast.error('Deliverable is required')
      return
    }
    setDeliverables(d => [...d, { ...dlDraft, id: `DL-${Date.now()}` }])
    setDlDraft({ id: '', deliverable: '', dueDate: '', status: 'Pending' })
  }
  const removeDeliverable = (id: string) => setDeliverables(d => d.filter(dl => dl.id !== id))

  // ── Risk helpers ──────────────────────────────────────────────────────────
  const addRisk = () => {
    if (!rkDraft.description.trim()) {
      toast.error('Risk description is required')
      return
    }
    setRisks(r => [...r, { ...rkDraft, id: `RK-${Date.now()}` }])
    setRkDraft({ id: '', description: '', mitigationPlan: '' })
  }
  const removeRisk = (id: string) => setRisks(r => r.filter(rk => rk.id !== id))

  // ── Navigation ────────────────────────────────────────────────────────────
  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS))
  const prev = () => setStep(s => Math.max(s - 1, 1))

  // ── Save helpers ──────────────────────────────────────────────────────────
  const buildRecord = (status: string): GrantRecord => ({
    ...form,
    teamMembers,
    milestones,
    deliverables,
    risks,
    status,
  })

  const handleSaveDraft = () => {
    grantStore.update(buildRecord('Draft'))
    toast.success('Grant saved as draft')
    onClose()
  }

  const handleSubmit = () => {
    if (!form.projectName.trim()) {
      toast.error('Project name is required')
      return
    }
    if (!form.amount.trim()) {
      toast.error('Budget amount is required')
      return
    }
    grantStore.update({
      ...buildRecord('Pending Approval'),
      submittedBy: 'Officer',
      submittedAt: new Date().toISOString(),
    })
    toast.success('Grant submitted for approval')
    onClose()
  }

  const isReadOnly = grant.status !== 'Draft'

  // ── Shared card wrapper ───────────────────────────────────────────────────
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {children}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onClose}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#161A61]">{form.projectName || 'New Grant'}</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {form.id} · <StatusBadge status={form.status} />
            </p>
          </div>
        </div>
        {!isReadOnly && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            {step === TOTAL_STEPS && (
              <Button onClick={handleSubmit} className="bg-[#161A61] hover:bg-[#0f1347]">
                <Check className="mr-1.5 h-4 w-4" /> Submit for Approval
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Step Indicator */}
      <div className="rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-sm">
        <StepIndicator currentStep={step} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Main form (2/3 width) ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* ── STEP 1: Project Details ─────────────────────────────────────── */}
          {step === 1 && (
            <Card>
              <SH title="Project Details" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Project ID
                  </label>
                  <Input value={form.id} disabled />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={form.projectName}
                    onChange={e => set('projectName', e.target.value)}
                    placeholder="e.g. AI Research Partnership"
                    disabled={isReadOnly}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Describe the grant project..."
                    rows={4}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Thematic Area
                  </label>
                  <Select
                    value={form.thematicArea}
                    onChange={e => set('thematicArea', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="">Select thematic area...</option>
                    <option>Artificial Intelligence</option>
                    <option>Digital Infrastructure</option>
                    <option>Research & Innovation</option>
                    <option>Capacity Building</option>
                    <option>Policy & Governance</option>
                    <option>Health Technology</option>
                    <option>Agriculture & Food Security</option>
                    <option>Education Technology</option>
                    <option>Other</option>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* ── STEP 2: Funding ─────────────────────────────────────────────── */}
          {step === 2 && (
            <Card>
              <SH title="Funding" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Budget (Amount) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={form.amount}
                    onChange={e => set('amount', e.target.value)}
                    placeholder="e.g. 500000"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Currency
                  </label>
                  <Select
                    value={form.currency}
                    onChange={e => set('currency', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="ETB">ETB — Ethiopian Birr</option>
                    <option value="GBP">GBP — British Pound</option>
                    <option value="JPY">JPY — Japanese Yen</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Funding Source
                  </label>
                  <Input
                    value={form.fundingSource}
                    onChange={e => set('fundingSource', e.target.value)}
                    placeholder="e.g. European Commission, World Bank..."
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Donor Name
                  </label>
                  <Input
                    value={form.donorName}
                    onChange={e => set('donorName', e.target.value)}
                    placeholder="e.g. Bill & Melinda Gates Foundation"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* ── STEP 3: Team ────────────────────────────────────────────────── */}
          {step === 3 && (
            <Card>
              <SH title="Team" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Project Manager
                  </label>
                  <Input
                    value={form.projectManager}
                    onChange={e => set('projectManager', e.target.value)}
                    placeholder="Full name..."
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Partner Lead
                  </label>
                  <Input
                    value={form.partnerLead}
                    onChange={e => set('partnerLead', e.target.value)}
                    placeholder="Full name..."
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="mt-2">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Team Members ({teamMembers.length})
                </p>
                {!isReadOnly && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 mb-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Add Member
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <Input
                        placeholder="Name *"
                        value={tmDraft.name}
                        onChange={e => setTmDraft(d => ({ ...d, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Role / Position"
                        value={tmDraft.role}
                        onChange={e => setTmDraft(d => ({ ...d, role: e.target.value }))}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={tmDraft.email}
                        onChange={e => setTmDraft(d => ({ ...d, email: e.target.value }))}
                      />
                    </div>
                    <Button onClick={addTeamMember} variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" /> Add Member
                    </Button>
                  </div>
                )}
                {teamMembers.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0b265a] text-left text-xs font-semibold text-white">
                          <th className="px-4 py-2.5">Name</th>
                          <th className="px-4 py-2.5">Role</th>
                          <th className="px-4 py-2.5">Email</th>
                          {!isReadOnly && <th className="px-4 py-2.5 w-12" />}
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map((m, i) => (
                          <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-4 py-2.5 font-semibold text-slate-900">{m.name}</td>
                            <td className="px-4 py-2.5 text-slate-600">{m.role || '—'}</td>
                            <td className="px-4 py-2.5 text-slate-400">{m.email || '—'}</td>
                            {!isReadOnly && (
                              <td className="px-4 py-2.5 text-center">
                                <button
                                  onClick={() => removeTeamMember(m.id)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty msg="No team members added yet." />
                )}
              </div>
            </Card>
          )}

          {/* ── STEP 4: Timeline ────────────────────────────────────────────── */}
          {step === 4 && (
            <Card>
              <SH title="Timeline" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={e => set('startDate', e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={e => set('endDate', e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* ── STEP 5: Progress ────────────────────────────────────────────── */}
          {step === 5 && (
            <Card>
              <SH title="Progress" />

              {/* Completion % */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Percentage Completion ({form.percentageCompletion}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.percentageCompletion}
                  onChange={e => set('percentageCompletion', Number(e.target.value))}
                  disabled={isReadOnly}
                  className="w-full accent-[#ff9500]"
                />
                <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#161A61] to-[#ff9500] transition-all"
                    style={{ width: `${form.percentageCompletion}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Milestones ({milestones.length})
                </p>
                {!isReadOnly && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 mb-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Add Milestone
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input
                        placeholder="Milestone description *"
                        value={msDraft.milestone}
                        onChange={e => setMsDraft(d => ({ ...d, milestone: e.target.value }))}
                      />
                      <Select
                        value={msDraft.status}
                        onChange={e =>
                          setMsDraft(d => ({
                            ...d,
                            status: e.target.value as GrantMilestone['status'],
                          }))
                        }
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Delayed">Delayed</option>
                      </Select>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Planned Date</label>
                        <Input
                          type="date"
                          value={msDraft.plannedDate}
                          onChange={e => setMsDraft(d => ({ ...d, plannedDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Actual Date</label>
                        <Input
                          type="date"
                          value={msDraft.actualDate}
                          onChange={e => setMsDraft(d => ({ ...d, actualDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button onClick={addMilestone} variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" /> Add Milestone
                    </Button>
                  </div>
                )}
                {milestones.length > 0 ? (
                  <div className="space-y-2">
                    {milestones.map((m, i) => (
                      <div
                        key={m.id}
                        className="flex items-start justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{m.milestone}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Planned: {m.plannedDate || '—'} · Actual: {m.actualDate || '—'} ·{' '}
                            <span className="font-medium">{m.status}</span>
                          </p>
                        </div>
                        {!isReadOnly && (
                          <button
                            onClick={() => removeMilestone(m.id)}
                            className="ml-4 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty msg="No milestones added yet." />
                )}
              </div>

              {/* Deliverables */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Deliverables ({deliverables.length})
                </p>
                {!isReadOnly && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 mb-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Add Deliverable
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <Input
                        placeholder="Deliverable description *"
                        value={dlDraft.deliverable}
                        onChange={e => setDlDraft(d => ({ ...d, deliverable: e.target.value }))}
                        className="sm:col-span-2"
                      />
                      <Select
                        value={dlDraft.status}
                        onChange={e =>
                          setDlDraft(d => ({
                            ...d,
                            status: e.target.value as GrantDeliverable['status'],
                          }))
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                      </Select>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Due Date</label>
                        <Input
                          type="date"
                          value={dlDraft.dueDate}
                          onChange={e => setDlDraft(d => ({ ...d, dueDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button onClick={addDeliverable} variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" /> Add Deliverable
                    </Button>
                  </div>
                )}
                {deliverables.length > 0 ? (
                  <div className="space-y-2">
                    {deliverables.map(d => (
                      <div
                        key={d.id}
                        className="flex items-start justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{d.deliverable}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Due: {d.dueDate || '—'} ·{' '}
                            <span className="font-medium">{d.status}</span>
                          </p>
                        </div>
                        {!isReadOnly && (
                          <button
                            onClick={() => removeDeliverable(d.id)}
                            className="ml-4 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty msg="No deliverables added yet." />
                )}
              </div>
            </Card>
          )}

          {/* ── STEP 6: Risks ───────────────────────────────────────────────── */}
          {step === 6 && (
            <Card>
              <SH title="Risks" />
              {!isReadOnly && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Add Risk
                  </p>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Risk Description *</label>
                    <Textarea
                      placeholder="Describe the risk..."
                      value={rkDraft.description}
                      onChange={e => setRkDraft(d => ({ ...d, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Mitigation Plan</label>
                    <Textarea
                      placeholder="How will this risk be mitigated?"
                      value={rkDraft.mitigationPlan}
                      onChange={e => setRkDraft(d => ({ ...d, mitigationPlan: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <Button onClick={addRisk} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" /> Add Risk
                  </Button>
                </div>
              )}
              <div className="space-y-3 mt-2">
                {risks.length > 0 ? (
                  risks.map((r, i) => (
                    <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                          Risk #{i + 1}
                        </p>
                        {!isReadOnly && (
                          <button
                            onClick={() => removeRisk(r.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-slate-800 font-semibold leading-relaxed">
                        {r.description}
                      </p>
                      {r.mitigationPlan && (
                        <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
                          <p className="text-xs font-semibold text-slate-500 mb-0.5">
                            Mitigation Plan
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {r.mitigationPlan}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <Empty msg="No risks added yet." />
                )}
              </div>
            </Card>
          )}

          {/* ── STEP 7: Preview ─────────────────────────────────────────────── */}
          {step === TOTAL_STEPS && (
            <div className="space-y-4">
              <PreviewSection step={1} title="Project Details">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Project ID" value={form.id} />
                  <Field label="Project Name" value={form.projectName} />
                  <Field label="Thematic Area" value={form.thematicArea} />
                  <Field label="Description" value={form.description} />
                </div>
              </PreviewSection>
              <PreviewSection step={2} title="Funding">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Budget" value={`${form.currency} ${form.amount}`} />
                  <Field label="Funding Source" value={form.fundingSource} />
                  <Field label="Donor Name" value={form.donorName} />
                </div>
              </PreviewSection>
              <PreviewSection step={3} title="Team">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Project Manager" value={form.projectManager} />
                  <Field label="Partner Lead" value={form.partnerLead} />
                  <Field label="Team Members" value={`${teamMembers.length} member(s)`} />
                </div>
              </PreviewSection>
              <PreviewSection step={4} title="Timeline">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start Date" value={form.startDate} />
                  <Field label="End Date" value={form.endDate} />
                </div>
              </PreviewSection>
              <PreviewSection step={5} title="Progress">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Completion" value={`${form.percentageCompletion}%`} />
                  <Field label="Milestones" value={`${milestones.length}`} />
                  <Field label="Deliverables" value={`${deliverables.length}`} />
                </div>
              </PreviewSection>
              <PreviewSection step={6} title="Risks">
                <Field label="Total Risks" value={`${risks.length}`} />
              </PreviewSection>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={step === 1 ? onClose : prev}>
              {step === 1 ? 'Cancel' : '← Previous'}
            </Button>
            <div className="flex gap-3">
              {!isReadOnly && step < TOTAL_STEPS && (
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
              )}
              {step < TOTAL_STEPS ? (
                <Button onClick={next} className="bg-[#161A61] hover:bg-[#0f1347]">
                  Next →
                </Button>
              ) : !isReadOnly ? (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <Check className="mr-1.5 h-4 w-4" /> Submit for Approval
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex gap-2">
              <span className="rounded-lg bg-[#161A61] px-4 py-2 text-sm font-semibold text-white">
                Status
              </span>
              <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                Feedback
              </span>
            </div>
            <div className="space-y-6">
              {/* Submit step */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    form.status === 'Pending Approval' || form.status === 'Approved'
                      ? 'border-[#161A61] bg-[#161A61]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {form.status === 'Pending Approval' || form.status === 'Approved' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Register Grant</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="inline-block h-3 w-3 rounded-full bg-slate-300" />
                    Officer
                  </div>
                  <div
                    className={`mt-2 inline-block rounded-md px-3 py-1 text-xs font-semibold ${
                      form.status === 'Pending Approval'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {form.status === 'Pending Approval' ? 'Submitted' : 'Pending'}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Date:{' '}
                    {form.submittedAt
                      ? new Date(form.submittedAt).toLocaleDateString()
                      : '- - - - -'}
                  </p>
                </div>
              </div>

              {/* Approve step */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    form.status === 'Approved'
                      ? 'border-green-500 bg-green-500'
                      : form.status === 'Rejected'
                        ? 'border-red-500 bg-red-500'
                        : 'border-slate-300 bg-white'
                  }`}
                >
                  {form.status === 'Approved' || form.status === 'Rejected' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Approve Grant</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="inline-block h-3 w-3 rounded-full bg-slate-300" />
                    Responsible Division Director
                  </div>
                  <div
                    className={`mt-2 inline-block rounded-md px-3 py-1 text-xs font-semibold ${
                      form.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : form.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {form.status === 'Approved'
                      ? 'Approved'
                      : form.status === 'Rejected'
                        ? 'Rejected'
                        : 'Pending'}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">Date: - - - - -</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status badge */}
          <div className="rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Current Status</span>
            <StatusBadge status={form.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
