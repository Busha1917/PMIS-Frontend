import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import type { PartnerRecord } from '../types'
import { partnerFormSchema, type PartnerFormValues } from '../utils/validation'

type PartnerFormMode = 'create' | 'edit' | 'preview'

type PartnerFormProps = {
  partner?: PartnerRecord | null
  mode?: PartnerFormMode
  onSubmit?: (partner: PartnerRecord) => void
  onCancel?: () => void
  onEdit?: () => void
}

const statusOptions = ['Draft', 'Approved', 'Accepted', 'Rejected']

export function PartnerForm({
  partner,
  mode = 'create',
  onSubmit,
  onCancel,
  onEdit,
}: PartnerFormProps) {
  const isPreview = mode === 'preview'

  // Set up React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: partner?.name ?? '',
      type: partner?.type ?? '',
      country: partner?.country ?? '',
      organization: partner?.organization ?? '',
      contact: partner?.contact ?? '',
      status: (partner?.status as any) ?? 'Draft',
      notes: (partner as any)?.notes ?? '',
    },
  })

  // Keep form in sync when partner prop updates
  useEffect(() => {
    if (partner) {
      reset({
        name: partner.name,
        type: partner.type,
        country: partner.country,
        organization: partner.organization,
        contact: partner.contact,
        status: partner.status as any,
        notes: (partner as any).notes ?? '',
      })
    }
  }, [partner, reset])

  const onSubmitForm = (values: PartnerFormValues) => {
    if (onSubmit) {
      onSubmit({
        id: partner?.id ?? `prt-${Date.now()}`,
        no: partner?.no ?? 0,
        ...values,
      } as PartnerRecord)
    }
  }

  if (isPreview) {
    const previewData = (partner as PartnerRecord & { notes?: string }) ?? {
      id: '',
      no: 0,
      name: '',
      type: '',
      country: '',
      organization: '',
      contact: '',
      status: 'Draft',
      notes: '',
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
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Partner Details</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {previewData.name || 'Partner Preview'}
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
                  <dt className="text-slate-500">Partner Name</dt>
                  <dd className="font-semibold text-slate-950">{previewData.name || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-semibold text-slate-950">{previewData.type || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Country</dt>
                  <dd className="font-semibold text-slate-950">{previewData.country || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Organization</dt>
                  <dd className="font-semibold text-slate-950">
                    {previewData.organization || 'N/A'}
                  </dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-slate-500">Primary Contact</dt>
                  <dd className="font-semibold text-slate-950">{previewData.contact || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Notes & History
                </p>
                <span className="block h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
              <p className="text-sm leading-7 text-slate-700">
                {previewData.notes ||
                  'This record represents a registered partnership. All active collaborations, legal agreements, and historical visits are linked to this organization profile.'}
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
          {mode === 'edit' ? 'Edit Partner' : 'Partner Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmitForm)}>
          <div className="grid gap-4 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Partner Name</label>
              <Input
                {...register('name')}
                placeholder="Enter partner name"
                className={errors.name ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
              <Input
                {...register('type')}
                placeholder="Enter partner type"
                className={errors.type ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.type && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
              <Input
                {...register('country')}
                placeholder="Enter country"
                className={errors.country ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.country && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.country.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Organization</label>
              <Input
                {...register('organization')}
                placeholder="Enter organization"
                className={errors.organization ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.organization && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.organization.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Primary Contact
              </label>
              <Input
                {...register('contact')}
                placeholder="Enter contact name"
                className={errors.contact ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.contact && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.contact.message}</p>
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
            <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              {...register('notes')}
              className={`min-h-[120px] w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 ${
                errors.notes ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'
              }`}
              placeholder="Enter any partner notes"
            />
            {errors.notes && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.notes.message}</p>
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
