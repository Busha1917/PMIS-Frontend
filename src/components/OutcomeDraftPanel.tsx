import { forwardRef, useImperativeHandle, useRef } from 'react'
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { Button } from '../ui'

// Feature: event-registration-workflow-enhancement
// Requirements: 3.5, 5.5, 6.3

export type OutcomeValues = {
  keyDiscussions: string
  agreementsReached: string
  actionPoints: string
  objectivesAchieved: string
  recommendations: string
  keyTopicsDiscussed: string
  visitAgreementsReached: string
  followUpActions: string
  opportunitiesIdentified: string
}

export type OutcomeDraftPanelProps = {
  category: 'Event' | 'Visit'
  values: OutcomeValues
  onChange: (values: OutcomeValues) => void
  onSaveDraft: () => void
  onSubmit: () => void
  onCancel: () => void
  hasDraft?: boolean
  revisionComment?: string
  attachmentGateError?: string
}

/**
 * Expose attachment field refs for programmatic scroll+focus from the parent.
 * Usage: attach this ref to OutcomeDraftPanel and call
 *   ref.current?.focusEventReport() or ref.current?.focusVisitReport()
 * This satisfies Req 5.5 (scroll + focus on attachment gate error).
 */
export type OutcomeDraftPanelHandle = {
  focusEventReport: () => void
  focusVisitReport: () => void
}

const textareaCls =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#161A61] focus:bg-white focus:ring-2 focus:ring-[#161A61]/10 resize-none'

const inputCls =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-all focus:border-[#161A61] focus:bg-white focus:ring-2 focus:ring-[#161A61]/10'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">{title}</p>
        <span className="block h-1.5 w-12 rounded-full bg-[#ff9500]" />
      </div>
      {children}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
    </div>
  )
}

export const OutcomeDraftPanel = forwardRef<OutcomeDraftPanelHandle, OutcomeDraftPanelProps>(
  function OutcomeDraftPanel(
    {
      category,
      values,
      onChange,
      onSaveDraft,
      onSubmit,
      onCancel,
      hasDraft,
      revisionComment,
      attachmentGateError,
    },
    ref
  ) {
    // Refs for report attachment fields — used for programmatic scroll+focus (Req 5.5)
    const eventReportRef = useRef<HTMLInputElement>(null)
    const visitReportRef = useRef<HTMLInputElement>(null)

    // Expose focus helpers to parent via imperative handle (Req 5.5)
    useImperativeHandle(ref, () => ({
      focusEventReport() {
        eventReportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        eventReportRef.current?.focus()
      },
      focusVisitReport() {
        visitReportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        visitReportRef.current?.focus()
      },
    }))

    const set = (field: keyof OutcomeValues) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      onChange({ ...values, [field]: e.target.value })

    const title = category === 'Event' ? 'Event Outcomes' : 'Visit Discussion & Outcomes'

    return (
      <SectionCard title={title}>
        {/* Revision Required banner — Req 3.5: shown above all fields when revisionComment is non-empty */}
        {revisionComment && revisionComment.trim().length > 0 && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Revision Required: {revisionComment}
              </p>
            </div>
          </div>
        )}

        {/* Draft in progress banner — Req 6.3: shown above the form when hasDraft is true */}
        {hasDraft && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
            <FileText className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm font-semibold text-amber-700">Draft in progress</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {category === 'Event' ? (
            <>
              <FormField label="Key Discussions">
                <textarea
                  value={values.keyDiscussions}
                  onChange={set('keyDiscussions')}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Key topics discussed..."
                />
              </FormField>
              <FormField label="Agreements Reached">
                <textarea
                  value={values.agreementsReached}
                  onChange={set('agreementsReached')}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Agreements reached..."
                />
              </FormField>
              <FormField label="Action Points">
                <textarea
                  value={values.actionPoints}
                  onChange={set('actionPoints')}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Next action items..."
                />
              </FormField>
              <FormField label="Objectives Achieved">
                <textarea
                  value={values.objectivesAchieved}
                  onChange={set('objectivesAchieved')}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="What objectives were met..."
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Recommendations">
                  <textarea
                    value={values.recommendations}
                    onChange={set('recommendations')}
                    className={`${textareaCls} min-h-[80px]`}
                    placeholder="Recommendations..."
                  />
                </FormField>
              </div>
              {/* Event Report attachment field — Req 5.3, 5.5 */}
              <div className="md:col-span-2">
                <FormField label="Event Report Attachment">
                  <input
                    ref={eventReportRef}
                    type="file"
                    className={`${inputCls} cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-slate-200 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-300`}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                  />
                  {attachmentGateError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {attachmentGateError}
                    </p>
                  )}
                </FormField>
              </div>
            </>
          ) : (
            <>
              <FormField label="Key Topics Discussed">
                <textarea
                  value={values.keyTopicsDiscussed}
                  onChange={set('keyTopicsDiscussed')}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Topics discussed..."
                />
              </FormField>
              <FormField label="Opportunities Identified">
                <textarea
                  value={values.opportunitiesIdentified}
                  onChange={set('opportunitiesIdentified')}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Opportunities identified..."
                />
              </FormField>
              <FormField label="Agreements Reached">
                <textarea
                  value={values.visitAgreementsReached}
                  onChange={set('visitAgreementsReached')}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Agreements reached..."
                />
              </FormField>
              <FormField label="Follow-up Actions">
                <textarea
                  value={values.followUpActions}
                  onChange={set('followUpActions')}
                  className={`${textareaCls} min-h-[100px]`}
                  placeholder="Follow-up actions..."
                />
              </FormField>
              {/* Visit Report attachment field — Req 5.4, 5.5 */}
              <div className="md:col-span-2">
                <FormField label="Visit Report Attachment">
                  <input
                    ref={visitReportRef}
                    type="file"
                    className={`${inputCls} cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-slate-200 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-300`}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                  />
                  {attachmentGateError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {attachmentGateError}
                    </p>
                  )}
                </FormField>
              </div>
            </>
          )}
        </div>

        {/* Action buttons — Req 6.1: Save Draft alongside Submit for Final Review */}
        <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline" type="button" onClick={onSaveDraft}>
            Save Draft
          </Button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Submit for Final Review
          </button>
        </div>
      </SectionCard>
    )
  }
)
