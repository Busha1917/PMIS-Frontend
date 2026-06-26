import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { baseDataFormSchema, type BaseDataFormValues } from '../utils/validation'

type BaseDataFormProps = {
  item?: any | null
  onSubmit?: (data: BaseDataFormValues) => void
  onCancel?: () => void
  title?: string
}

export function BaseDataForm({
  item,
  onSubmit,
  onCancel,
  title = 'Base Data Details',
}: BaseDataFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BaseDataFormValues>({
    resolver: zodResolver(baseDataFormSchema),
    defaultValues: {
      title: item?.title || item?.name || item?.action || '',
      description: item?.description || '',
    },
  })

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(data => onSubmit?.(data))}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Name / Title</label>
              <Input
                {...register('title')}
                placeholder="Enter name or title"
                className={errors.title ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.title && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <Input
                {...register('description')}
                placeholder="Enter description"
                className={errors.description ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.description && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-end justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="!bg-[#ff9500] !text-white hover:!bg-[#e68a00]"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
