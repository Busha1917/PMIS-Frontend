import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { useLayout } from '../contexts/LayoutContext'
import { roleFormSchema, type RoleFormValues } from '../utils/validation'
import type { RoleRecord } from '../types'

type RoleFormProps = {
  role?: RoleRecord | null
  onSubmit?: (role: RoleFormValues) => void
  onCancel?: () => void
}

export function RoleForm({ role, onSubmit, onCancel }: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name ?? '',
      description: role?.description ?? '',
      permissions: role?.permissions ?? 0,
    },
  })

  const { setBreadcrumbSuffix } = useLayout()

  useEffect(() => {
    if (role?.id) {
      setBreadcrumbSuffix(role.id)
    }
    return () => setBreadcrumbSuffix(null)
  }, [role?.id, setBreadcrumbSuffix])

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">Role Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(data => onSubmit?.(data))}>
          <div className="grid gap-4 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Role Name</label>
              <Input
                {...register('name')}
                placeholder="Enter role name"
                className={errors.name ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="xl:col-span-3">
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <Input
                {...register('description')}
                placeholder="Enter role description"
                className={errors.description ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.description && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Permissions</label>
              <Input
                type="number"
                min={0}
                {...register('permissions', { valueAsNumber: true })}
                placeholder="Enter permission count"
                className={errors.permissions ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.permissions && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.permissions.message}
                </p>
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
