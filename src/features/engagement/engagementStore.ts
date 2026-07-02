/**
 * Shared in-memory engagement store.
 * All three actor pages (KE Director, Officer, Division Director) read from
 * and write to the same array so state is consistent across navigations.
 *
 * In a real app this would be Redux / RTK Query / server state.
 */
import { opportunities } from '../../data'
import type { EngagementRecord, EngagementStatus, OpportunityRecord } from '../../types'

// Seed from approved opportunities
function buildInitialEngagements(): EngagementRecord[] {
  return opportunities
    .filter(opp => opp.status === 'Approved')
    .map((opp, index) => ({
      id: `ENG-2026-${String(index + 1).padStart(3, '0')}`,
      no: index + 1,
      type: opp.opportunityCategory || 'Partnership',
      date: opp.date,
      status: 'Draft' as EngagementStatus,
      organization: opp.partnerName || 'Unknown Organization',
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      opportunitySource: opp.source,
      opportunityCategory: opp.opportunityCategory,
      opportunityCountry: opp.country,
      opportunityStrategicImportance: opp.strategicImportance,
      opportunityApprovedAt: opp.approvedAt,
      opportunityApprovedBy: opp.approvedBy,
      participants: [],
      eaiiRepresentatives: [],
      keyPoints: '',
      agreedAction: '',
      nextSteps: '',
    }))
}

// Module-level singleton
let _engagements: EngagementRecord[] = buildInitialEngagements()
const _listeners: Array<(list: EngagementRecord[]) => void> = []

function notify() {
  _listeners.forEach(fn => fn([..._engagements]))
}

export const engagementStore = {
  getAll(): EngagementRecord[] {
    return [..._engagements]
  },

  subscribe(fn: (list: EngagementRecord[]) => void): () => void {
    _listeners.push(fn)
    fn([..._engagements])
    return () => {
      const idx = _listeners.indexOf(fn)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  },

  update(updated: EngagementRecord) {
    _engagements = _engagements.map(e => (e.id === updated.id ? updated : e))
    notify()
  },

  add(record: EngagementRecord) {
    _engagements = [..._engagements, record]
    notify()
  },

  /** Called by Division Director Opportunities page when an opportunity is approved */
  addFromOpportunity(opp: OpportunityRecord) {
    const alreadyExists = _engagements.some(e => e.opportunityId === opp.id)
    if (alreadyExists) return
    const next: EngagementRecord = {
      id: `ENG-2026-${String(_engagements.length + 1).padStart(3, '0')}`,
      no: _engagements.length + 1,
      type: opp.opportunityCategory || 'Partnership',
      date: opp.date,
      status: 'Draft',
      organization: opp.partnerName || 'Unknown Organization',
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      opportunitySource: opp.source,
      opportunityCategory: opp.opportunityCategory,
      opportunityCountry: opp.country,
      opportunityStrategicImportance: opp.strategicImportance,
      opportunityApprovedAt: opp.approvedAt,
      opportunityApprovedBy: opp.approvedBy,
      participants: [],
      eaiiRepresentatives: [],
      keyPoints: '',
      agreedAction: '',
      nextSteps: '',
    }
    _engagements = [..._engagements, next]
    notify()
  },
}
