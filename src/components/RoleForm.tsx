import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { useLayout } from '../contexts/LayoutContext'
import { roleFormSchema, type RoleFormValues } from '../utils/validation'
import type { RoleRecord } from '../types'
import { permissionActions, permissionResources } from '../data'

type RoleFormProps = {
  role?: RoleRecord | null
  onSubmit?: (role: RoleFormValues) => void
  onCancel?: () => void
}

type SelectedPermission = {
  action_id: number
  resource_id: number
}

export function RoleForm({ role, onSubmit, onCancel }: RoleFormProps) {
  const [selectedPermission, setSelectedPermission] = useState<SelectedPermission[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name ?? '',
      description: role?.description ?? '',
      rolePermissionResources: role?.rolePermissionResources ?? [],
    },
  })

  const { setBreadcrumbSuffix } = useLayout()

  useEffect(() => {
    if (role?.id) {
      setBreadcrumbSuffix(role.id)

      const initialSelected: SelectedPermission[] = []
      role.rolePermissionResources.forEach(res => {
        res.rolePermissionResourceActions.forEach(act => {
          initialSelected.push({
            action_id: act.permission_action_id,
            resource_id: res.permission_resource_id,
          })
        })
      })
      setSelectedPermission(initialSelected)
    } else {
      setSelectedPermission([])
    }
    return () => setBreadcrumbSuffix(null)
  }, [role, setBreadcrumbSuffix])

  const handleCheckAction = (action_id: number, resource_id: number, checked: boolean) => {
    if (checked) {
      setSelectedPermission(prev => [...prev, { action_id, resource_id }])
    } else {
      setSelectedPermission(prev =>
        prev.filter(item => !(item.action_id === action_id && item.resource_id === resource_id))
      )
    }
  }

  const handleCheckResource = (resource_id: number, checked: boolean) => {
    if (checked) {
      const newSelections: SelectedPermission[] = []
      permissionActions.forEach(action => {
        // Only add if not already selected
        if (
          !selectedPermission.some(p => p.action_id === action.id && p.resource_id === resource_id)
        ) {
          newSelections.push({ action_id: action.id, resource_id })
        }
      })
      setSelectedPermission(prev => [...prev, ...newSelections])
    } else {
      setSelectedPermission(prev => prev.filter(item => item.resource_id !== resource_id))
    }
  }

  const handleFormSubmit = (data: Omit<RoleFormValues, 'rolePermissionResources'>) => {
    // Group selected permissions into the nested array structure required by the schema
    const rolePermissions: RoleFormValues['rolePermissionResources'] = []

    selectedPermission.forEach(selected => {
      let existingResource = rolePermissions.find(
        p => p.permission_resource_id === selected.resource_id
      )
      if (!existingResource) {
        existingResource = {
          permission_resource_id: selected.resource_id,
          rolePermissionResourceActions: [],
        }
        rolePermissions.push(existingResource)
      }
      existingResource.rolePermissionResourceActions.push({
        permission_action_id: selected.action_id,
      })
    })

    onSubmit?.({
      ...data,
      rolePermissionResources: rolePermissions,
    })
  }

  return (
    <Card className="rounded-[2rem] border border-[#cbd5e1] bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-950">Role Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
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

          <div className="mt-6 border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-[#0b265a] text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Resource</th>
                  {permissionActions.map(action => (
                    <th key={action.id} className="px-4 py-3 font-semibold text-center">
                      {action.action}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {permissionResources.map(resource => {
                  const allSelected = permissionActions.every(action =>
                    selectedPermission.some(
                      p => p.action_id === action.id && p.resource_id === resource.id
                    )
                  )

                  return (
                    <tr key={resource.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 bg-slate-100/50 font-medium text-slate-900 border-r border-slate-200 w-48">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={e => handleCheckResource(resource.id, e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-[#ff9500] focus:ring-[#ff9500]"
                          />
                          {resource.name}
                        </label>
                      </td>
                      {permissionActions.map(action => {
                        const isSelected = selectedPermission.some(
                          p => p.action_id === action.id && p.resource_id === resource.id
                        )
                        return (
                          <td key={action.id} className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={e =>
                                handleCheckAction(action.id, resource.id, e.target.checked)
                              }
                              className="h-4 w-4 rounded border-slate-300 text-[#ff9500] focus:ring-[#ff9500] cursor-pointer hover:scale-110 transition-transform"
                            />
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-end justify-end gap-3 pt-4">
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
