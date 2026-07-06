/**
 * Shared in-memory opportunity store.
 * All opportunity pages read from and write to the same array so state is consistent.
 */
import { opportunities as initialData } from '../../data'
import type { OpportunityRecord, OpportunityStatus } from '../../types'

// Module-level singleton
let _opportunities: OpportunityRecord[] = [...initialData]
const _listeners: Array<(list: OpportunityRecord[]) => void> = []

function notify() {
  _listeners.forEach(fn => fn([..._opportunities]))
}

export const opportunityStore = {
  getAll(): OpportunityRecord[] {
    return [..._opportunities]
  },

  subscribe(fn: (list: OpportunityRecord[]) => void): () => void {
    _listeners.push(fn)
    fn([..._opportunities])
    return () => {
      const idx = _listeners.indexOf(fn)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  },

  create(): OpportunityRecord {
    const newId = `OPP-2026-${String(_opportunities.length + 1).padStart(3, '0')}`
    const newOpp: OpportunityRecord = {
      id: newId,
      no: _opportunities.length + 1,
      title: '',
      source: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft' as OpportunityStatus,
      division: '',
      opportunityCategory: '',
      country: '',
      partnerName: '',
      strategicImportance: undefined,
    }
    _opportunities = [..._opportunities, newOpp]
    notify()
    return newOpp
  },

  update(updated: OpportunityRecord) {
    _opportunities = _opportunities.map(o => (o.id === updated.id ? updated : o))
    notify()
  },

  delete(id: string) {
    _opportunities = _opportunities.filter(o => o.id !== id)
    notify()
  },
}
