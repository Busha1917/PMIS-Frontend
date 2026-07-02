/**
 * Shared in-memory partner store.
 * Partners are seeded when a KE Director approves an agreement.
 * All three actor pages (Officer, KE Director, Division Director) read from
 * and write to the same array so state is consistent across navigations.
 */
import type { AgreementRecord, PartnerRecord, PartnerStatus } from '../../types'

// Module-level singleton
let _partners: PartnerRecord[] = []
const _listeners: Array<(list: PartnerRecord[]) => void> = []

function notify() {
  _listeners.forEach(fn => fn([..._partners]))
}

export const partnerStore = {
  getAll(): PartnerRecord[] {
    return [..._partners]
  },

  subscribe(fn: (list: PartnerRecord[]) => void): () => void {
    _listeners.push(fn)
    fn([..._partners])
    return () => {
      const idx = _listeners.indexOf(fn)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  },

  update(updated: PartnerRecord) {
    _partners = _partners.map(p => (p.id === updated.id ? updated : p))
    notify()
  },

  add(record: PartnerRecord) {
    _partners = [..._partners, record]
    notify()
  },

  /** Called by KEDirectorAgreementPage when an agreement is approved */
  addFromAgreement(agr: AgreementRecord) {
    const alreadyExists = _partners.some(p => p.agreementId === agr.id)
    if (alreadyExists) return

    const next: PartnerRecord = {
      id: `PAR-2026-${String(_partners.length + 1).padStart(3, '0')}`,
      no: _partners.length + 1,
      name: agr.partnerOrganization || 'Untitled Partner',
      type: 'International Organization',
      country: '',
      organization: agr.partnerOrganization || '',
      contact: agr.contactPerson || '',
      status: 'Draft' as PartnerStatus,
      currentStep: 1,

      // Linked agreement context
      agreementId: agr.id,
      agreementTitle: agr.title,
      agreementType: agr.type,
      agreementApprovedAt: agr.approvedAt,
      agreementApprovedBy: agr.approvedBy,

      // Pre-fill from agreement
      partnershipClassification: 'Strategic Partner',
    }

    _partners = [..._partners, next]
    notify()
  },
}
