import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '../components/DataTable'
import { PartnerForm } from '../components/PartnerForm'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/StatusBadge'
import { TableActionButtons } from '../components/TableActionButtons'
import { TablePagination } from '../components/TablePagination'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { FilterDrawer } from '../components/FilterDrawer'
import type { FilterValues } from '../components/FilterDrawer'
import type { PartnerRecord } from '../types'
import { partners as initialPartners } from '../data'

const FILTER_FIELDS = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Accepted', value: 'Accepted' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
  {
    key: 'type',
    label: 'Partner Type',
    type: 'select' as const,
    options: [
      { label: 'International Organization', value: 'International Organization' },
      { label: 'Private Sector', value: 'Private Sector' },
      { label: 'Academic', value: 'Academic' },
    ],
  },
  { key: 'country', label: 'Country', type: 'text' as const, placeholder: 'e.g. USA, UK...' },
]

export function PartnersPage() {
  const [partners, setPartners] = useState<PartnerRecord[]>(initialPartners)
  const [showForm, setShowForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<PartnerRecord | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'preview'>('create')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  const filteredPartners = useMemo(() => {
    return partners.filter(item => {
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters.status && item.status !== activeFilters.status) return false
      if (activeFilters.type && item.type !== activeFilters.type) return false
      if (
        activeFilters.country &&
        !item.country.toLowerCase().includes(activeFilters.country.toLowerCase())
      )
        return false
      return true
    })
  }, [partners, searchQuery, activeFilters])

  const isFiltering = searchQuery !== '' || Object.keys(activeFilters).length > 0

  const handleAddNew = () => {
    setSelectedPartner(null)
    setFormMode('create')
    setShowForm(true)
  }

  const handleView = (item: PartnerRecord) => {
    setSelectedPartner(item)
    setFormMode('preview')
    setShowForm(true)
  }

  const handleEdit = (item: PartnerRecord) => {
    setSelectedPartner(item)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = (item: PartnerRecord) => {
    setSelectedPartner(item)
    setShowDeleteModal(true)
  }

  const handleSubmit = (formData: PartnerRecord) => {
    if (formMode === 'edit' && selectedPartner) {
      setPartners(current =>
        current.map(item => (item.id === selectedPartner.id ? formData : item))
      )
      toast.success('Partner updated successfully')
    } else {
      setPartners(current => [
        ...current,
        { ...formData, id: `prt-${Date.now()}`, no: current.length + 1 },
      ])
      toast.success('Partner created successfully')
    }
    setShowForm(false)
    setSelectedPartner(null)
    setFormMode('create')
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedPartner(null)
    setFormMode('create')
  }

  const confirmDelete = () => {
    if (!selectedPartner) return
    setPartners(current => current.filter(item => item.id !== selectedPartner.id))
    setShowDeleteModal(false)
    setSelectedPartner(null)
    setFormMode('create')
    toast.success('Partner deleted')
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard title="Partner Registration" subtitle="Manage partnership organizations" />
      <PageToolbar
        searchPlaceholder="Search partners..."
        addLabel="Add Partners"
        onSearch={setSearchQuery}
        onFilter={() => setShowFilter(true)}
        activeFilterCount={Object.keys(activeFilters).length}
        onAdd={showForm ? undefined : handleAddNew}
      />

      {showForm ? (
        <PartnerForm
          partner={selectedPartner}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <DataTable
            items={filteredPartners}
            rowKey={item => item.id}
            emptyVariant={isFiltering ? 'search' : 'empty'}
            columns={[
              {
                label: 'No.',
                render: item => <span className="font-semibold text-slate-900">{item.no}</span>,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Partner Name',
                render: item => item.name,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Type',
                render: item => item.type,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Country',
                render: item => item.country,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Organization',
                render: item => item.organization,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Primary Contact',
                render: item => item.contact,
                headClassName: 'bg-[#0b265a] text-white',
              },
              {
                label: 'Status',
                render: item => <StatusBadge status={item.status} />,
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
              {
                label: 'Action',
                render: item => (
                  <TableActionButtons
                    onView={() => handleView(item)}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                ),
                headClassName: 'bg-[#0b265a] text-white text-center',
                cellClassName: 'text-center',
              },
            ]}
          />
          <TablePagination totalEntries={filteredPartners.length} />
        </>
      )}

      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setActiveFilters}
        fields={FILTER_FIELDS}
        title="Filter Partners"
      />

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Partner"
        message="Are you sure you want to delete this partner? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
