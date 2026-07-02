import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, PlusCircle, Trash2, Upload } from 'lucide-react'
import { Button, Input } from '../../ui'
import type { EngagementRecord, ParticipantRecord, EaiiRepresentativeRecord } from '../../types'

type EngagementFormMode = 'create' | 'edit'

type EngagementFormProps = {
  engagement?: EngagementRecord | null
  mode?: EngagementFormMode
  onSaveDraft?: (engagement: EngagementRecord) => void
  onSubmit?: (engagement: EngagementRecord) => void
  onCancel?: () => void
}

const engagementTypes = [
  'Negotiation',
  'Workshop',
  'Meeting',
  'Follow-Up',
  'Site Visit',
  'Conference',
  'Delegation Visit',
]

export function EngagementForm({
  engagement,
  mode = 'create',
  onSaveDraft,
  onSubmit,
  onCancel,
}: EngagementFormProps) {
  const [formState, setFormState] = useState<EngagementRecord>(() => {
    const base = engagement ?? {
      id: `ENG-2026-${String(Date.now()).slice(-3)}`,
      no: 0,
      type: '',
      date: '',
      status: 'Draft' as const,
      organization: '',
    }
    return {
      ...base,
      participants: base.participants?.length
        ? base.participants
        : [{ id: 'p-init', organizationName: '', fullName: '', position: '' }],
      eaiiRepresentatives: base.eaiiRepresentatives?.length
        ? base.eaiiRepresentatives
        : [{ id: 'r-init', departmentName: '', fullName: '', position: '' }],
      keyPoints: base.keyPoints ?? '',
      agreedAction: base.agreedAction ?? '',
      nextSteps: base.nextSteps ?? '',
    }
  })

  useEffect(() => {
    if (engagement) {
      setFormState({
        ...engagement,
        participants: engagement.participants?.length
          ? engagement.participants
          : [{ id: 'p-init', organizationName: '', fullName: '', position: '' }],
        eaiiRepresentatives: engagement.eaiiRepresentatives?.length
          ? engagement.eaiiRepresentatives
          : [{ id: 'r-init', departmentName: '', fullName: '', position: '' }],
        keyPoints: engagement.keyPoints ?? '',
        agreedAction: engagement.agreedAction ?? '',
        nextSteps: engagement.nextSteps ?? '',
      })
    }
  }, [engagement])

  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Participants helpers
  const addParticipant = () =>
    setFormState(s => ({
      ...s,
      participants: [
        ...(s.participants ?? []),
        { id: `p-${Date.now()}`, organizationName: '', fullName: '', position: '' },
      ],
    }))

  const updateParticipant = (id: string, field: keyof ParticipantRecord, value: string) =>
    setFormState(s => ({
      ...s,
      participants: s.participants?.map(p => (p.id === id ? { ...p, [field]: value } : p)),
    }))

  const removeParticipant = (id: string) =>
    setFormState(s => ({ ...s, participants: s.participants?.filter(p => p.id !== id) }))

  // EAII reps helpers
  const addRepresentative = () =>
    setFormState(s => ({
      ...s,
      eaiiRepresentatives: [
        ...(s.eaiiRepresentatives ?? []),
        { id: `r-${Date.now()}`, departmentName: '', fullName: '', position: '' },
      ],
    }))

  const updateRepresentative = (id: string, field: keyof EaiiRepresentativeRecord, value: string) =>
    setFormState(s => ({
      ...s,
      eaiiRepresentatives: s.eaiiRepresentatives?.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    }))

  const removeRepresentative = (id: string) =>
    setFormState(s => ({
      ...s,
      eaiiRepresentatives: s.eaiiRepresentatives?.filter(r => r.id !== id),
    }))

  const inputCls =
    'h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 placeholder:text-slate-400'

  const sectionHeader = (label: string) => (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-1 h-5 rounded-full bg-[#ff9500]" />
      <h2 className="text-[#161A61] font-semibold text-[15px]">{label}</h2>
    </div>
  )

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Fixed header */}
      <div className="flex items-start gap-4 px-2 pb-4">
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
          <p className="mt-0.5 text-sm text-slate-500">
            Register Create New Engagement and track outcomes
          </p>
        </div>
      </div>

      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto">
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8 space-y-10">
            {/* ── Engagement Details ──────────────────────── */}
            <section>
              {sectionHeader('Engagement Details')}
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Engagement ID
                  </label>
                  <Input value={formState.id} readOnly className="bg-slate-50 text-slate-400" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Date</label>
                  <Input
                    type="date"
                    value={formState.date}
                    onChange={e => setFormState(s => ({ ...s, date: e.target.value }))}
                    placeholder="dd / mm / yyyy"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Organization Name <span className="text-[#ff9500]">*</span>
                  </label>
                  <Input
                    value={formState.organization ?? ''}
                    onChange={e => setFormState(s => ({ ...s, organization: e.target.value }))}
                    placeholder="Enter Organization Name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Engagement Type
                  </label>
                  <select
                    value={formState.type}
                    onChange={e => setFormState(s => ({ ...s, type: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">select Engagement Type</option>
                    {engagementTypes.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* ── Participants List ───────────────────────── */}
            <section>
              {sectionHeader('Participants List')}
              <div className="space-y-4">
                {formState.participants?.map((p, i) => (
                  <div key={p.id} className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      {i === 0 && (
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Organization Name <span className="text-[#ff9500]">*</span>
                        </label>
                      )}
                      <Input
                        value={p.organizationName}
                        onChange={e => updateParticipant(p.id, 'organizationName', e.target.value)}
                        placeholder="Enter Organization Name"
                      />
                    </div>
                    <div>
                      {i === 0 && (
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Full Name
                        </label>
                      )}
                      <Input
                        value={p.fullName}
                        onChange={e => updateParticipant(p.id, 'fullName', e.target.value)}
                        placeholder="Enter Full Name"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        {i === 0 && (
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Position
                          </label>
                        )}
                        <Input
                          value={p.position}
                          onChange={e => updateParticipant(p.id, 'position', e.target.value)}
                          placeholder="Enter Position"
                        />
                      </div>
                      {(formState.participants?.length ?? 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(p.id)}
                          className="mb-0.5 text-slate-400 hover:text-red-500 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={addParticipant}
                  className="flex items-center gap-2 text-[#161A61] text-sm font-semibold hover:opacity-80"
                >
                  <PlusCircle className="h-5 w-5 fill-[#161A61] text-white" />
                  Add Participant
                </button>
              </div>
            </section>

            {/* ── EAII Representatives ────────────────────── */}
            <section>
              {sectionHeader('EAII Representatives')}
              <div className="space-y-4">
                {formState.eaiiRepresentatives?.map((r, i) => (
                  <div key={r.id} className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      {i === 0 && (
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Department Name <span className="text-[#ff9500]">*</span>
                        </label>
                      )}
                      <Input
                        value={r.departmentName}
                        onChange={e => updateRepresentative(r.id, 'departmentName', e.target.value)}
                        placeholder="Enter Organization Name"
                      />
                    </div>
                    <div>
                      {i === 0 && (
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Full Name
                        </label>
                      )}
                      <Input
                        value={r.fullName}
                        onChange={e => updateRepresentative(r.id, 'fullName', e.target.value)}
                        placeholder="Enter Full Name"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        {i === 0 && (
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Position
                          </label>
                        )}
                        <Input
                          value={r.position}
                          onChange={e => updateRepresentative(r.id, 'position', e.target.value)}
                          placeholder="Enter Position"
                        />
                      </div>
                      {(formState.eaiiRepresentatives?.length ?? 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRepresentative(r.id)}
                          className="mb-0.5 text-slate-400 hover:text-red-500 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={addRepresentative}
                  className="flex items-center gap-2 text-[#161A61] text-sm font-semibold hover:opacity-80"
                >
                  <PlusCircle className="h-5 w-5 fill-[#161A61] text-white" />
                  Add Representatives
                </button>
              </div>
            </section>

            {/* ── Discussion Summary ──────────────────────── */}
            <section>
              {sectionHeader('Discussion Summary')}
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Key Points
                  </label>
                  <textarea
                    value={formState.keyPoints ?? ''}
                    onChange={e => setFormState(s => ({ ...s, keyPoints: e.target.value }))}
                    placeholder="summarize the key discussion points"
                    rows={5}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 placeholder:text-slate-400 resize-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Agreed Action
                  </label>
                  <textarea
                    value={formState.agreedAction ?? ''}
                    onChange={e => setFormState(s => ({ ...s, agreedAction: e.target.value }))}
                    placeholder="Opportunity Description"
                    rows={5}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 placeholder:text-slate-400 resize-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Next Steps
                  </label>
                  <textarea
                    value={formState.nextSteps ?? ''}
                    onChange={e => setFormState(s => ({ ...s, nextSteps: e.target.value }))}
                    placeholder="What are the next Step"
                    rows={5}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 placeholder:text-slate-400 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* ── Attachments ─────────────────────────────── */}
            <section>
              {sectionHeader('Attachments')}
              <div
                className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center cursor-pointer hover:border-[#161A61]/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-3" />
                <p className="text-sm font-semibold text-slate-700">Upload Files</p>
                <p className="mt-1 text-xs text-slate-400">select your file or drag and drop</p>
                <p className="text-xs text-slate-400">png, pdf, jpg, docx accepted</p>
                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-[#161A61] underline underline-offset-2"
                >
                  browse
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={e => {
                    if (e.target.files) setAttachedFiles(Array.from(e.target.files))
                  }}
                />
              </div>
              {attachedFiles.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-slate-600 list-disc pl-5">
                  {attachedFiles.map(f => (
                    <li key={f.name}>{f.name}</li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* ── Footer buttons ───────────────────────────── */}
          <div className="flex justify-end gap-3 border-t border-slate-100 px-8 py-5">
            <Button
              variant="outline"
              type="button"
              onClick={() => onSaveDraft?.({ ...formState, status: 'Assigned' })}
              className="px-6 rounded-lg"
            >
              Save Draft
            </Button>
            <button
              type="button"
              onClick={() => onSubmit?.({ ...formState, status: 'Pending Approval' })}
              className="flex items-center gap-1.5 rounded-lg bg-[#ff9500] px-6 py-2 text-sm font-semibold text-white hover:bg-[#e68a00] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
