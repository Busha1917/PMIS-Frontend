import { useState } from 'react'
import { Button, Input, Label, Modal } from '../ui'

type SelectField = {
  key: string
  label: string
  type: 'select'
  options: { label: string; value: string }[]
}

type TextField = {
  key: string
  label: string
  type: 'text'
  placeholder?: string
}

type DateField = {
  key: string
  label: string
  type: 'date'
}

type DateRangeField = {
  key: string
  label: string
  type: 'daterange'
}

export type FilterField = SelectField | TextField | DateField | DateRangeField
export type FilterValues = Record<string, string>

type FilterDrawerProps = {
  open: boolean
  onClose: () => void
  onApply: (filters: FilterValues) => void
  fields: FilterField[]
  title?: string
}

export function FilterDrawer({
  open,
  onClose,
  onApply,
  fields,
  title = 'Filter',
}: FilterDrawerProps) {
  const [values, setValues] = useState<FilterValues>({})

  const setValue = (key: string, value: string) => setValues(prev => ({ ...prev, [key]: value }))

  const handleApply = () => {
    const activeFilters = Object.fromEntries(Object.entries(values).filter(([, v]) => v !== ''))
    onApply(activeFilters)
    onClose()
  }

  const handleReset = () => {
    setValues({})
    onApply({})
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      {/* Filter Fields */}
      <div className="flex flex-col gap-5 px-6 py-6">
        {fields.map(field => {
          if (field.type === 'select') {
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <Label htmlFor={field.key}>{field.label}</Label>
                <select
                  id={field.key}
                  value={values[field.key] ?? ''}
                  onChange={e => setValue(field.key, e.target.value)}
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#161A61] focus:outline-none focus:ring-2 focus:ring-[#161A61]/10"
                >
                  <option value="">All</option>
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          }

          if (field.type === 'daterange') {
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <Label>{field.label}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={values[`${field.key}_from`] ?? ''}
                    onChange={e => setValue(`${field.key}_from`, e.target.value)}
                    className="flex-1"
                  />
                  <span className="shrink-0 text-xs text-slate-500">to</span>
                  <Input
                    type="date"
                    value={values[`${field.key}_to`] ?? ''}
                    onChange={e => setValue(`${field.key}_to`, e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            )
          }

          if (field.type === 'date') {
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  type="date"
                  value={values[field.key] ?? ''}
                  onChange={e => setValue(field.key, e.target.value)}
                />
              </div>
            )
          }

          // type === 'text'
          return (
            <div key={field.key} className="flex flex-col gap-1.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type="text"
                placeholder={field.placeholder ?? `Search ${field.label}...`}
                value={values[field.key] ?? ''}
                onChange={e => setValue(field.key, e.target.value)}
              />
            </div>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleApply}>Apply Filters</Button>
      </div>
    </Modal>
  )
}
