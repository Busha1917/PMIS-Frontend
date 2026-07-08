/**
 * Shared in-memory agreement store.
 * Agreements are seeded when a Division Director approves an engagement.
 * All three actor pages (Officer, Legal Officer, KE Director) read from
 * and write to the same array so state is consistent across navigations.
 */
import type { AgreementRecord, AgreementStatus, EngagementRecord } from '../../types'

// Module-level singleton
let _agreements: AgreementRecord[] = []
const _listeners: Array<(list: AgreementRecord[]) => void> = []

function notify() {
  _listeners.forEach(fn => fn([..._agreements]))
}

export const agreementStore = {
  getAll(): AgreementRecord[] {
    return [..._agreements]
  },

  subscribe(fn: (list: AgreementRecord[]) => void): () => void {
    _listeners.push(fn)
    fn([..._agreements])
    return () => {
      const idx = _listeners.indexOf(fn)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  },

  create(): AgreementRecord {
    const newId = `AGR-2026-${String(_agreements.length + 1).padStart(3, '0')}`
    const newAgreement: AgreementRecord = {
      id: newId,
      no: _agreements.length + 1,
      title: '',
      type: 'MoU',
      date: '',
      startDate: '',
      endDate: '',
      status: 'Draft' as AgreementStatus,
      partnerOrganization: '',
      contactPerson: '',
      contactPosition: '',
      eaiiDivisions: [],
      description: '',
      attachments: [],
    }
    _agreements = [..._agreements, newAgreement]
    notify()
    return newAgreement
  },

  update(updated: AgreementRecord) {
    _agreements = _agreements.map(a => (a.id === updated.id ? updated : a))
    notify()
  },

  add(record: AgreementRecord) {
    _agreements = [..._agreements, record]
    notify()
  },

  /** Called by DivisionDirectorEngagementPage when an engagement is approved */
  addFromEngagement(eng: EngagementRecord) {
    const alreadyExists = _agreements.some(a => a.engagementId === eng.id)
    if (alreadyExists) return

    const next: AgreementRecord = {
      id: `AGR-2026-${String(_agreements.length + 1).padStart(3, '0')}`,
      no: _agreements.length + 1,
      title: eng.title || 'Untitled Agreement',
      type: 'MoU',
      date: '',
      startDate: '',
      endDate: '',
      status: 'Draft' as AgreementStatus,

      // Linked engagement context
      engagementId: eng.id,
      engagementOrganization: eng.externalParticipants?.[0]?.organizationName || '',
      engagementType: eng.engagementType?.typeName || '',
      engagementDate: eng.engagementDate,
      engagementApprovedAt: eng.approvalDate || undefined,
      engagementApprovedBy: undefined, // Needs proper User object mapping

      // Pre-fill partner from engagement
      partnerOrganization: eng.externalParticipants?.[0]?.organizationName || '',
      contactPerson: eng.externalParticipants?.[0]?.fullName || '',
      contactPosition: eng.externalParticipants?.[0]?.position || '',
      eaiiDivisions: [],
      description: '',
      attachments: [],
    }

    _agreements = [..._agreements, next]
    notify()
  },
}
