/**
 * Resource Contribution Store
 * Manages resource contribution records for approved partners
 */
import type { ResourceContributionRecord, CollaborationStatus } from '../../types'

let _contributions: ResourceContributionRecord[] = []
const _listeners: Array<(list: ResourceContributionRecord[]) => void> = []

function notify() {
  _listeners.forEach(fn => fn([..._contributions]))
}

export const contributionStore = {
  getAll(): ResourceContributionRecord[] {
    return [..._contributions]
  },

  subscribe(fn: (list: ResourceContributionRecord[]) => void): () => void {
    _listeners.push(fn)
    fn([..._contributions])
    return () => {
      const idx = _listeners.indexOf(fn)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  },

  create(partnerId: string, partnerName: string): ResourceContributionRecord {
    const newId = `RC-2026-${String(_contributions.length + 1).padStart(3, '0')}`
    const newContribution: ResourceContributionRecord = {
      id: newId,
      no: _contributions.length + 1,
      partnerId,
      partnerName,
      eaiiContributions: {
        staff: false,
        infrastructure: false,
        funding: false,
        equipment: false,
        dataResources: false,
      },
      partnerContributions: {
        staff: false,
        funding: false,
        technology: false,
        equipment: false,
        expertise: false,
      },
      monetaryValue: '0',
      inKindValue: '0',
      totalValue: '0',
      currency: 'ETB',
      status: 'Draft' as CollaborationStatus,
    }
    _contributions = [..._contributions, newContribution]
    notify()
    return newContribution
  },

  update(updated: ResourceContributionRecord) {
    _contributions = _contributions.map(c => (c.id === updated.id ? updated : c))
    notify()
  },

  delete(id: string) {
    _contributions = _contributions.filter(c => c.id !== id)
    notify()
  },
}
