import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { userFormSchema, type UserFormValues } from '../utils/validation'
import type { UserRecord } from '../types'

const statusOptions = ['Active', 'Pending', 'Inactive'] as const

type UserFormProps = {
  user?: UserRecord | null
  onSubmit?: (user: UserFormValues) => void
  onCancel?: () => void
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      position: user?.position ?? '',
      status: (user?.status as any) ?? 'Active',
    },
  })

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">User Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(data => onSubmit?.(data))}>
          <div className="grid gap-4 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <Input
                {...register('name')}
                placeholder="Enter full name"
                className={errors.name ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                {...register('email')}
                placeholder="Enter email address"
                className={errors.email ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
              <Input
                {...register('phone')}
                placeholder="Enter phone number"
                className={errors.phone ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.phone && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Position</label>
              <Input
                {...register('position')}
                placeholder="Enter position"
                className={errors.position ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.position && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                {...register('status')}
                className={`h-12 w-full rounded-2xl border bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 ${errors.status ? 'border-red-500' : 'border-slate-300'}`}
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.status.message}</p>
              )}
            </div>
            <div className="flex items-end justify-end gap-3">
              <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button className="!bg-[#ff9500] !text-white" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Submit'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
