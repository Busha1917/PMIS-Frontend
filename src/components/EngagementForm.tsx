import { useEffect, useState } from 'react'
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react'
import { Button, Input } from '../ui'
import type { EngagementRecord, ParticipantRecord, EaiiRepresentativeRecord } from '../types'

type EngagementFormMode = 'create' | 'edit' | 'preview'

type EngagementFormProps = {
  engagement?: EngagementRecord | null
  mode?: EngagementFormMode
  onSubmit?: (engagement: EngagementRecord) => void
  onCancel?: () => void
  onEdit?: () => void
}

const engagementTypes = ['Negotiation', 'Workshop', 'Meeting', 'Follow-Up', 'Site Visit']

export function EngagementForm({
  engagement,
  mode = 'create',
  onSubmit,
  onCancel,
  onEdit,
}: EngagementFormProps) {
  const [formState, setFormState] = useState<EngagementRecord>({
    id: `ENG-${Date.now().toString().slice(-6)}`,
    no: 0,
    type: '',
    date: '',
    status: 'Draft',
    organization: '',
    participants: [{ id: 'init-p', organizationName: '', fullName: '', position: '' }],
    eaiiRepresentatives: [{ id: 'init-e', departmentName: '', fullName: '', position: '' }],
    discussionSummary: '',
    attachments: null,
  })

  useEffect(() => {
    if (engagement) {
      setFormState({
        ...engagement,
        participants: engagement.participants ?? [],
        eaiiRepresentatives: engagement.eaiiRepresentatives ?? [],
        discussionSummary: engagement.discussionSummary ?? '',
        attachments: engagement.attachments ?? null,
      })
    }
  }, [engagement])

  const canSubmit = mode !== 'preview'

  const addParticipant = () => {
    setFormState(prev => ({
      ...prev,
      participants: [
        ...(prev.participants || []),
        { id: Date.now().toString(), organizationName: '', fullName: '', position: '' },
      ],
    }))
  }

  const updateParticipant = (id: string, field: keyof ParticipantRecord, value: string) => {
    setFormState(prev => ({
      ...prev,
      participants: prev.participants?.map(p => (p.id === id ? { ...p, [field]: value } : p)),
    }))
  }

  const removeParticipant = (id: string) => {
    setFormState(prev => ({
      ...prev,
      participants: prev.participants?.filter(p => p.id !== id),
    }))
  }

  const addRepresentative = () => {
    setFormState(prev => ({
      ...prev,
      eaiiRepresentatives: [
        ...(prev.eaiiRepresentatives || []),
        { id: Date.now().toString(), departmentName: '', fullName: '', position: '' },
      ],
    }))
  }

  const updateRepresentative = (
    id: string,
    field: keyof EaiiRepresentativeRecord,
    value: string
  ) => {
    setFormState(prev => ({
      ...prev,
      eaiiRepresentatives: prev.eaiiRepresentatives?.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    }))
  }

  const removeRepresentative = (id: string) => {
    setFormState(prev => ({
      ...prev,
      eaiiRepresentatives: prev.eaiiRepresentatives?.filter(r => r.id !== id),
    }))
  }

  if (mode === 'preview') {
    return (
      <div className="space-y-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between px-2">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="mt-1 text-[#161A61] hover:text-slate-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[22px] font-semibold text-[#161A61]">Engagement Details</h1>
              <p className="mt-1 text-sm text-slate-500">
                View Engagement details and track outcomes
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-inner">
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            {/* Card 1: Engagement Details */}
            <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm flex flex-col">
              <h2 className="mb-6 text-sm font-semibold text-[#161A61]">Engagement Details</h2>
              <div className="flex-1 space-y-4 text-[13px] text-slate-800">
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Engagement ID</span>
                  <span className="font-semibold">{formState.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Date</span>
                  <span className="font-semibold">{formState.date || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Organization Name</span>
                  <span className="font-semibold">{formState.organization || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Engagement Type</span>
                  <span className="font-semibold">{formState.type || 'N/A'}</span>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={onEdit}
                  className="bg-[#161A61] text-white hover:bg-[#161A61]/90 shadow-none"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </Button>
              </div>
            </div>

            {/* Card 2: Participants */}
            <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm flex flex-col">
              <h2 className="mb-6 text-sm font-semibold text-[#161A61]">Participants List</h2>
              <div className="flex-1 space-y-4 text-[12px] text-slate-800">
                {formState.participants?.map(p => (
                  <div key={p.id} className="flex justify-between border-b border-slate-100 pb-3">
                    <span className="w-1/3 truncate pr-2">{p.fullName || '-'}</span>
                    <span className="w-1/3 truncate px-2 text-slate-500">
                      {p.organizationName || '-'}
                    </span>
                    <span className="w-1/3 text-right font-semibold truncate pl-2">
                      {p.position || '-'}
                    </span>
                  </div>
                ))}
                {(!formState.participants || formState.participants.length === 0) && (
                  <div className="text-slate-400">No participants added.</div>
                )}
              </div>
              <div className="mt-6">
                <Button
                  onClick={onEdit}
                  className="bg-[#161A61] text-white hover:bg-[#161A61]/90 shadow-none"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </Button>
              </div>
            </div>

            {/* Card 3: EAII Representatives */}
            <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm flex flex-col">
              <h2 className="mb-6 text-sm font-semibold text-[#161A61]">EAII Representatives</h2>
              <div className="flex-1 space-y-4 text-[12px] text-slate-800">
                {formState.eaiiRepresentatives?.map(r => (
                  <div key={r.id} className="flex justify-between border-b border-slate-100 pb-3">
                    <span className="w-1/3 truncate pr-2">{r.fullName || '-'}</span>
                    <span className="w-1/3 truncate px-2 text-slate-500">
                      {r.departmentName || '-'}
                    </span>
                    <span className="w-1/3 text-right font-semibold truncate pl-2">
                      {r.position || '-'}
                    </span>
                  </div>
                ))}
                {(!formState.eaiiRepresentatives || formState.eaiiRepresentatives.length === 0) && (
                  <div className="text-slate-400">No representatives added.</div>
                )}
              </div>
              <div className="mt-6">
                <Button
                  onClick={onEdit}
                  className="bg-[#161A61] text-white hover:bg-[#161A61]/90 shadow-none"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Card: Discussion Summary */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm mb-6">
            <h2 className="mb-4 text-sm font-semibold text-[#161A61]">Discussion Summary</h2>
            <div className="border-t border-[#ff9500]/30 pt-4 text-[13px] text-slate-600">
              <div className="whitespace-pre-wrap leading-relaxed">
                {formState.discussionSummary || 'No discussion summary provided.'}
              </div>
            </div>
          </div>

          {/* Bottom Card: Attachments */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-[#161A61]">Attachments</h2>
            <div className="border-t border-[#ff9500]/30 pt-4 text-[13px] text-slate-600">
              {formState.attachments ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <span className="font-medium text-[#161A61] underline cursor-pointer">
                    {typeof formState.attachments === 'string'
                      ? formState.attachments
                      : formState.attachments.name}
                  </span>
                </div>
              ) : (
                'No attachments provided.'
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between px-2">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="mt-1 text-[#161A61] hover:text-slate-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-[22px] font-semibold text-[#161A61]">
              {mode === 'edit' ? 'Edit Engagement' : 'Create New Engagement'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Register Create New Engagement and track outcomes
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        <form
          onSubmit={event => {
            event.preventDefault()
            if (canSubmit) onSubmit?.({ ...formState, status: 'Pending Review' })
          }}
          className="space-y-12"
        >
          {/* Engagement Details */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-5 bg-[#ff9500] rounded-full" />
              <h2 className="text-[#161A61] font-semibold">Engagement Details</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Engagement ID
                </label>
                <Input value={formState.id} readOnly className="bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
                <Input
                  type="date"
                  value={formState.date}
                  onChange={e => setFormState(current => ({ ...current, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Organization Name <span className="text-[#ff9500]">*</span>
                </label>
                <Input
                  value={formState.organization || ''}
                  onChange={e =>
                    setFormState(current => ({ ...current, organization: e.target.value }))
                  }
                  placeholder="Enter Organization Name"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Engagement Type
                </label>
                <select
                  value={formState.type}
                  onChange={e => setFormState(current => ({ ...current, type: e.target.value }))}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
                  required
                >
                  <option value="">select Engagement Type</option>
                  {engagementTypes.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-5 bg-[#ff9500] rounded-full" />
              <h2 className="text-[#161A61] font-semibold">Participants List</h2>
            </div>

            <div className="space-y-4">
              {formState.participants?.map(participant => (
                <div key={participant.id} className="flex items-end gap-4">
                  <div className="flex-1 grid gap-4 grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Organization Name <span className="text-[#ff9500]">*</span>
                      </label>
                      <Input
                        value={participant.organizationName}
                        onChange={e =>
                          updateParticipant(participant.id, 'organizationName', e.target.value)
                        }
                        placeholder="Enter Organization Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Full Name
                      </label>
                      <Input
                        value={participant.fullName}
                        onChange={e =>
                          updateParticipant(participant.id, 'fullName', e.target.value)
                        }
                        placeholder="Enter Full Name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Position
                      </label>
                      <Input
                        value={participant.position}
                        onChange={e =>
                          updateParticipant(participant.id, 'position', e.target.value)
                        }
                        placeholder="Enter Position"
                      />
                    </div>
                  </div>
                  {formState.participants && formState.participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant.id)}
                      className="mb-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={addParticipant}
                className="flex items-center gap-2 text-[#161A61] font-medium hover:text-[#161A61]/80"
              >
                <PlusCircle className="h-5 w-5 fill-[#161A61] text-white" />
                Add Participant
              </button>
            </div>
          </div>

          {/* EAII Representatives */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-5 bg-[#ff9500] rounded-full" />
              <h2 className="text-[#161A61] font-semibold">EAII Representatives</h2>
            </div>

            <div className="space-y-4">
              {formState.eaiiRepresentatives?.map(rep => (
                <div key={rep.id} className="flex items-end gap-4">
                  <div className="flex-1 grid gap-4 grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Department Name <span className="text-[#ff9500]">*</span>
                      </label>
                      <Input
                        value={rep.departmentName}
                        onChange={e =>
                          updateRepresentative(rep.id, 'departmentName', e.target.value)
                        }
                        placeholder="Enter Organization Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Full Name
                      </label>
                      <Input
                        value={rep.fullName}
                        onChange={e => updateRepresentative(rep.id, 'fullName', e.target.value)}
                        placeholder="Enter Full Name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Position
                      </label>
                      <Input
                        value={rep.position}
                        onChange={e => updateRepresentative(rep.id, 'position', e.target.value)}
                        placeholder="Enter Position"
                      />
                    </div>
                  </div>
                  {formState.eaiiRepresentatives && formState.eaiiRepresentatives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRepresentative(rep.id)}
                      className="mb-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={addRepresentative}
                className="flex items-center gap-2 text-[#161A61] font-medium hover:text-[#161A61]/80"
              >
                <PlusCircle className="h-5 w-5 fill-[#161A61] text-white" />
                Add Representatives
              </button>
            </div>
          </div>

          {/* Discussion Summary */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-5 bg-[#ff9500] rounded-full" />
              <h2 className="text-[#161A61] font-semibold">Discussion Summary</h2>
            </div>
            <textarea
              value={formState.discussionSummary || ''}
              onChange={e =>
                setFormState(current => ({ ...current, discussionSummary: e.target.value }))
              }
              placeholder="Enter summary of discussions and key outcomes..."
              className="min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10"
            />
          </div>

          {/* Attachments */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-5 bg-[#ff9500] rounded-full" />
              <h2 className="text-[#161A61] font-semibold">Attachments</h2>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#161A61]/10 file:text-[#161A61] hover:file:bg-[#161A61]/20 cursor-pointer"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFormState(current => ({ ...current, attachments: file.name }))
                  }
                }}
              />
              {formState.attachments && (
                <p className="text-sm text-slate-600">
                  Selected file:{' '}
                  <span className="font-medium">
                    {typeof formState.attachments === 'string'
                      ? formState.attachments
                      : formState.attachments.name}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={onCancel} className="w-24">
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-24 bg-[#ff9500] hover:bg-[#e68a00] text-white border-none shadow-none"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
