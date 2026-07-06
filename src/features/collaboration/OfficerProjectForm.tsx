import { useState } from 'react'
import { ArrowLeft, Check, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Select, Textarea } from '../../ui'
import type { ProjectRecord } from '../../types'
import { projectStore } from './projectStore'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => {
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? 'border-[#161A61] bg-[#161A61]'
                    : isCurrent
                      ? 'border-[#161A61] bg-white'
                      : 'border-slate-300 bg-white'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" />
                ) : isCurrent ? (
                  <User className="h-5 w-5 text-[#161A61]" />
                ) : (
                  <span className="text-sm font-semibold text-slate-400">{step}</span>
                )}
              </div>
              <span className="mt-1 text-xs font-medium text-slate-600">Step {step}</span>
            </div>
            {step < totalSteps && (
              <div className={`mx-2 h-0.5 w-16 ${isCompleted ? 'bg-[#161A61]' : 'bg-slate-300'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface OfficerProjectFormProps {
  project?: ProjectRecord
  onClose: () => void
}

export function OfficerProjectForm({ project, onClose }: OfficerProjectFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6

  // Form state
  const [formData, setFormData] = useState<Partial<ProjectRecord>>(
    project || {
      partnerId: '',
      partnerName: '',
      projectName: '',
      description: '',
      thematicArea: '',
      budget: '',
      fundingSource: '',
      currency: 'ETB',
      projectManager: '',
      partnerLead: '',
      teamMembers: [],
      startDate: '',
      endDate: '',
      milestones: [],
      deliverables: [],
      risks: [],
      status: 'Draft',
    }
  )

  const [costSharing, setCostSharing] = useState(false)
  const [orgContribution, setOrgContribution] = useState('')
  const [partnerContribution, setPartnerContribution] = useState('')

  // Deliverables and Milestones state
  const [currentDeliverable, setCurrentDeliverable] = useState({
    deliverable: '',
    dueDate: '',
    status: 'Pending' as const,
  })
  const [currentMilestone, setCurrentMilestone] = useState({
    milestone: '',
    plannedDate: '',
    actualDate: '',
    status: 'Not Started' as const,
  })

  const updateField = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    toast.success('Project saved as draft')
    onClose()
  }

  const handleSubmit = () => {
    toast.success('Project submitted for approval')
    onClose()
  }

  const addDeliverable = () => {
    if (currentDeliverable.deliverable && currentDeliverable.dueDate) {
      const newDeliverable = {
        id: `DEL-${Date.now()}`,
        ...currentDeliverable,
      }
      setFormData(prev => ({
        ...prev,
        deliverables: [...(prev.deliverables || []), newDeliverable],
      }))
      setCurrentDeliverable({ deliverable: '', dueDate: '', status: 'Pending' })
    }
  }

  const addMilestone = () => {
    if (currentMilestone.milestone && currentMilestone.plannedDate) {
      const newMilestone = {
        id: `MIL-${Date.now()}`,
        ...currentMilestone,
      }
      setFormData(prev => ({
        ...prev,
        milestones: [...(prev.milestones || []), newMilestone],
      }))
      setCurrentMilestone({ milestone: '', plannedDate: '', actualDate: '', status: 'Not Started' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#161A61]">New Collaboration</h1>
          <p className="text-sm text-slate-600">Register a project collaboration and submit</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-4">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            {/* Step 1: Partners & Team */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-l-4 border-[#ff9500] pl-4">
                  <h2 className="text-lg font-bold text-slate-900">Partners & Team</h2>
                </div>

                {/* Lead Organization */}
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

                {/* Partner Organizations */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Partner Organizations
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <Select
                      value={formData.partnerName || ''}
                      onValueChange={val => updateField('partnerName', val)}
                      placeholder="select Partner Organizations"
                    >
                      <option value="Ministry of Innovation">Ministry of Innovation</option>
                      <option value="Tech University">Tech University</option>
                    </Select>
                    <Input
                      placeholder="Partner Lead"
                      value={formData.partnerLead || ''}
                      onChange={e => updateField('partnerLead', e.target.value)}
                    />
                    <Select value="" onValueChange={() => {}} placeholder="select Country">
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Kenya">Kenya</option>
                    </Select>
                  </div>
                </div>

                {/* Project Team */}
                <div className="space-y-3">
                  <div className="border-l-4 border-[#ff9500] pl-4">
                    <h3 className="text-base font-bold text-slate-900">Project Team</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="Project Manager"
                      value={formData.projectManager || ''}
                      onChange={e => updateField('projectManager', e.target.value)}
                    />
                    <Input
                      placeholder="Partner Lead"
                      value={formData.partnerLead || ''}
                      onChange={e => updateField('partnerLead', e.target.value)}
                    />
                    <Input placeholder="Thematic Area" />
                  </div>

                  <button className="flex items-center gap-2 rounded-lg bg-[#161A61] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f1347]">
                    <span className="text-lg">+</span> Add Team member
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-l-4 border-[#ff9500] pl-4">
                  <h2 className="text-lg font-bold text-slate-900">Project details</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Project Name"
                    placeholder="Project Name"
                    value={formData.projectName || ''}
                    onChange={e => updateField('projectName', e.target.value)}
                  />
                  <Input
                    label="Thematic Area"
                    placeholder="Thematic Area"
                    value={formData.thematicArea || ''}
                    onChange={e => updateField('thematicArea', e.target.value)}
                  />
                </div>

                <Textarea
                  label="Description"
                  placeholder="Description..."
                  value={formData.description || ''}
                  onChange={e => updateField('description', e.target.value)}
                  rows={4}
                />

                <div className="border-l-4 border-[#ff9500] pl-4">
                  <h3 className="text-base font-bold text-slate-900">Funding</h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Budget"
                    placeholder="Enter Budget"
                    value={formData.budget || ''}
                    onChange={e => updateField('budget', e.target.value)}
                  />
                  <Input
                    label="Funding Source"
                    placeholder="Funding Source"
                    value={formData.fundingSource || ''}
                    onChange={e => updateField('fundingSource', e.target.value)}
                  />
                  <Select
                    label="Currency"
                    value={formData.currency || 'ETB'}
                    onValueChange={val => updateField('currency', val)}
                  >
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Budget & Funding */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-l-4 border-[#ff9500] pl-4">
                  <h2 className="text-lg font-bold text-slate-900">Budget & Funding</h2>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Budget"
                    placeholder="Enter Budget"
                    value={formData.budget || ''}
                    onChange={e => updateField('budget', e.target.value)}
                  />
                  <Input
                    label="Funding Source"
                    placeholder="Funding Source"
                    value={formData.fundingSource || ''}
                    onChange={e => updateField('fundingSource', e.target.value)}
                  />
                  <Select
                    label="Currency"
                    value={formData.currency || 'ETB'}
                    onValueChange={val => updateField('currency', val)}
                  >
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </Select>
                </div>

                {/* Cost Sharing Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCostSharing(!costSharing)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      costSharing ? 'bg-[#161A61]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        costSharing ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-slate-700">Cost Sharing</span>
                </div>

                {costSharing && (
                  <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="border-l-4 border-[#ff9500] pl-4">
                      <h3 className="text-base font-bold text-slate-900">
                        Project Cost Contribution
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Organization Contribution"
                        placeholder="Organization Contribution"
                        value={orgContribution}
                        onChange={e => setOrgContribution(e.target.value)}
                      />
                      <Input
                        label="Partner Contribution"
                        placeholder="Partner Contribution"
                        value={partnerContribution}
                        onChange={e => setPartnerContribution(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Timeline */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-l-4 border-[#ff9500] pl-4">
                  <h2 className="text-lg font-bold text-slate-900">Timeline</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={e => updateField('startDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={e => updateField('endDate', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Milestones & Deliverables */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-l-4 border-[#ff9500] pl-4">
                  <h2 className="text-lg font-bold text-slate-900">Milestones & Deliverables</h2>
                </div>

                {/* Deliverables */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Deliverables</label>
                    <button
                      onClick={addDeliverable}
                      className="text-sm font-semibold text-[#161A61] hover:underline"
                    >
                      + Add deliverable
                    </button>
                  </div>
                  {formData.deliverables && formData.deliverables.length > 0 ? (
                    <div className="space-y-2">
                      {formData.deliverables.map(del => (
                        <div
                          key={del.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <span className="text-sm text-slate-700">{del.deliverable}</span>
                          <span className="text-xs text-slate-500">{del.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <p className="text-sm text-slate-500">None added yet.</p>
                    </div>
                  )}

                  {/* Add Deliverable Form */}
                  <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-white p-4">
                    <Input
                      placeholder="Deliverable"
                      value={currentDeliverable.deliverable}
                      onChange={e =>
                        setCurrentDeliverable(prev => ({ ...prev, deliverable: e.target.value }))
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Due Date"
                      value={currentDeliverable.dueDate}
                      onChange={e =>
                        setCurrentDeliverable(prev => ({ ...prev, dueDate: e.target.value }))
                      }
                    />
                    <Select
                      value={currentDeliverable.status}
                      onValueChange={val =>
                        setCurrentDeliverable(prev => ({
                          ...prev,
                          status: val as 'Pending' | 'In Progress' | 'Completed' | 'Overdue',
                        }))
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Select>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Milestones</label>
                    <button
                      onClick={addMilestone}
                      className="text-sm font-semibold text-[#161A61] hover:underline"
                    >
                      + Add deliverable
                    </button>
                  </div>
                  {formData.milestones && formData.milestones.length > 0 ? (
                    <div className="space-y-2">
                      {formData.milestones.map(mil => (
                        <div
                          key={mil.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <span className="text-sm text-slate-700">{mil.milestone}</span>
                          <span className="text-xs text-slate-500">{mil.plannedDate}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <p className="text-sm text-slate-500">None added yet.</p>
                    </div>
                  )}

                  {/* Add Milestone Form */}
                  <div className="grid grid-cols-4 gap-3 rounded-lg border border-slate-200 bg-white p-4">
                    <Input
                      placeholder="Milestone"
                      value={currentMilestone.milestone}
                      onChange={e =>
                        setCurrentMilestone(prev => ({ ...prev, milestone: e.target.value }))
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Planned Date"
                      value={currentMilestone.plannedDate}
                      onChange={e =>
                        setCurrentMilestone(prev => ({ ...prev, plannedDate: e.target.value }))
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Actual Date"
                      value={currentMilestone.actualDate || ''}
                      onChange={e =>
                        setCurrentMilestone(prev => ({ ...prev, actualDate: e.target.value }))
                      }
                    />
                    <Select
                      value={currentMilestone.status}
                      onValueChange={val =>
                        setCurrentMilestone(prev => ({
                          ...prev,
                          status: val as 'Not Started' | 'In Progress' | 'Completed' | 'Delayed',
                        }))
                      }
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Risks */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="border-l-4 border-[#ff9500] pl-4">
                  <h2 className="text-lg font-bold text-slate-900">Risks</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Risk Id" placeholder="Risk..." />
                  <Select label="Impact">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Select>
                </div>

                <Textarea label="Description" placeholder="Description..." rows={3} />
                <Textarea label="Mitigation Plan" placeholder="Mitigation Plan..." rows={3} />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <div className="ml-auto flex gap-3">
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} className="bg-[#ff9500] hover:bg-[#e68a00]">
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-[#ff9500] hover:bg-[#e68a00]">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Status & Feedback */}
        <div className="space-y-4">
          {/* Status Tab */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex gap-2">
              <button className="rounded-lg bg-[#161A61] px-4 py-2 text-sm font-semibold text-white">
                Status
              </button>
              <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">
                Feedback
              </button>
            </div>

            {/* Workflow Status */}
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
                  <div className="h-3 w-3 rounded-full bg-slate-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Add collaboration</p>
                  <p className="text-xs text-slate-600">Partnership Officer</p>
                  <div className="mt-2 inline-block rounded-md bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#92400E]">
                    Pending
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Date: - - - - -</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
                  <div className="h-3 w-3 rounded-full bg-slate-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Approve Collaboration</p>
                  <p className="text-xs text-slate-600">Knowledge and ecosystem director</p>
                  <div className="mt-2 inline-block rounded-md bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#92400E]">
                    Pending
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Date: - - - - -</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
