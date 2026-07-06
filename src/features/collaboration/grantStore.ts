/**
 * Funding & Grant Tracking Store
 * Manages grant records for approved partners
 */
import type { GrantRecord, CollaborationStatus } from '../../types'

let _grants: GrantRecord[] = []
const _listeners: Array<(list: GrantRecord[]) => void> = []

function notify() {
  _listeners.forEach(fn => fn([..._grants]))
}

export const grantStore = {
  getAll(): GrantRecord[] {
    return [..._grants]
  },

  subscribe(fn: (list: GrantRecord[]) => void): () => void {
    _listeners.push(fn)
    fn([..._grants])
    return () => {
      const idx = _listeners.indexOf(fn)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  },

  create(partnerId: string, partnerName: string): GrantRecord {
    const newId = `GNT-2026-${String(_grants.length + 1).padStart(3, '0')}`
    const newGrant: GrantRecord = {
      id: newId,
      no: _grants.length + 1,
      partnerId,
      partnerName,
      donorName: '',
      amount: '',
      currency: 'USD',
      submissionDate: '',
      endDate: '',
      status: 'Draft' as CollaborationStatus,
    }
    _grants = [..._grants, newGrant]
    notify()
    return newGrant
  },

  update(updated: GrantRecord) {
    _grants = _grants.map(g => (g.id === updated.id ? updated : g))
    notify()
  },

  delete(id: string) {
    _grants = _grants.filter(g => g.id !== id)
    notify()
  },
}
