import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import type { AgreementRecord } from '../types'
import { agreementFormSchema, type AgreementFormValues } from '../utils/validation'

type AgreementFormMode = 'create' | 'edit' | 'preview'

type AgreementFormProps = {
  agreement?: AgreementRecord | null
  mode?: AgreementFormMode
  onSubmit?: (agreement: AgreementRecord) => void
  onCancel?: () => void
  onEdit?: () => void
}

const agreementTypes = ['MoU', 'Contract', 'Service Level']
const statusOptions = ['Draft', 'Approved', 'Accepted', 'Rejected']

export function AgreementForm({
  agreement,
  mode = 'create',
  onSubmit,
  onCancel,
  onEdit,
}: AgreementFormProps) {
  const isPreview = mode === 'preview'

  // Set up React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementFormSchema),
    defaultValues: {
      title: agreement?.title ?? '',
      type: (agreement?.type as any) ?? 'MoU',
      startDate: agreement?.startDate ?? '',
      endDate: agreement?.endDate ?? '',
      date: agreement?.date ?? '',
      status: (agreement?.status as any) ?? 'Draft',
      summary: (agreement as any)?.summary ?? '',
    },
  })

  // Synchronize when the agreement prop changes
  useEffect(() => {
    if (agreement) {
      reset({
        title: agreement.title,
        type: agreement.type as any,
        startDate: agreement.startDate,
        endDate: agreement.endDate,
        date: agreement.date,
        status: agreement.status as any,
        summary: (agreement as any).summary ?? '',
      })
    }
  }, [agreement, reset])

  const onSubmitForm = (values: AgreementFormValues) => {
    if (onSubmit) {
      onSubmit({
        id: agreement?.id ?? `agr-${Date.now()}`,
        no: agreement?.no ?? 0,
        ...values,
      } as AgreementRecord)
    }
  }

  if (isPreview) {
    const previewData = (agreement as AgreementRecord & { summary?: string }) ?? {
      id: '',
      no: 0,
      title: '',
      type: 'MoU',
      date: '',
      startDate: '',
      endDate: '',
      status: 'Draft',
      summary: '',
    }

    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-0 bg-transparent p-0 text-slate-700 shadow-none hover:bg-transparent hover:text-slate-950"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Agreement Details
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {previewData.title || 'Agreement Preview'}
              </h1>
              <p className="mt-2 text-sm text-slate-500">ID: {previewData.id}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-800 shadow-sm shadow-orange-100/80">
                {previewData.status}
              </span>
              {previewData.status?.toLowerCase() === 'draft' && (
                <Button
                  variant="outline"
                  onClick={onEdit ?? onCancel}
                  className="rounded-full border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Key Information
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <dl className="divide-y divide-slate-200 text-sm text-slate-700">
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Agreement Title</dt>
                  <dd className="font-semibold text-slate-950">{previewData.title || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-semibold text-slate-950">{previewData.type || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Effective Date</dt>
                  <dd className="font-semibold text-slate-950">{previewData.date || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Start Date</dt>
                  <dd className="font-semibold text-slate-950">{previewData.startDate || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">End Date</dt>
                  <dd className="font-semibold text-slate-950">{previewData.endDate || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Summary & Scope
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <p className="text-sm leading-7 text-slate-700">
                {previewData.summary ||
                  'This agreement outlines terms of mutual collaboration. Under these provisions, both organizations commit to resource exchanges and joint operational review schedules.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">
          {mode === 'edit' ? 'Edit Agreement' : 'Agreement Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmitForm)}>
          <div className="grid gap-4 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Agreement Title
              </label>
              <Input
                {...register('title')}
                placeholder="Enter agreement title"
                className={errors.title ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.title && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
              <select
                {...register('type')}
                className={`h-12 w-full rounded-2xl border bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 ${
                  errors.type ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'
                }`}
              >
                {agreementTypes.map(typeOption => (
                  <option key={typeOption} value={typeOption}>
                    {typeOption}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
              <Input
                type="datetime-local"
                {...register('startDate')}
                className={`h-12 rounded-2xl border bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100 ${
                  errors.startDate ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">End Date</label>
              <Input
                type="datetime-local"
                {...register('endDate')}
                className={`h-12 rounded-2xl border bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100 ${
                  errors.endDate ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Effective Date
              </label>
              <Input
                type="datetime-local"
                {...register('date')}
                className={`h-12 rounded-2xl border bg-white px-3 text-sm text-slate-900 focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100 ${
                  errors.date ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.date.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                {...register('status')}
                className={`h-12 w-full rounded-2xl border bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 ${
                  errors.status ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'
                }`}
              >
                {statusOptions.map(statusOption => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Agreement Summary
            </label>
            <textarea
              {...register('summary')}
              className={`min-h-[120px] w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 ${
                errors.summary ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'
              }`}
              placeholder="Enter agreement summary"
            />
            {errors.summary && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.summary.message}</p>
            )}
          </div>

          <div className="flex items-end justify-end gap-3">
            <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="!bg-[#ff9500] !text-white !hover:bg-[#e68a00]"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
