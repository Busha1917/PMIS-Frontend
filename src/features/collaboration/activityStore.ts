/**
 * Joint Activity Store
 * Manages joint activity records for approved partners
 */
import type { ActivityRecord, CollaborationStatus } from '../../types'

let _activities: ActivityRecord[] = []
const _listeners: Array<(list: ActivityRecord[]) => void> = []

function notify() {
  _listeners.forEach(fn => fn([..._activities]))
}

export const activityStore = {
  getAll(): ActivityRecord[] {
    return [..._activities]
  },

  subscribe(fn: (list: ActivityRecord[]) => void): () => void {
    _listeners.push(fn)
    fn([..._activities])
    return () => {
      const idx = _listeners.indexOf(fn)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  },

  create(partnerId: string, partnerName: string): ActivityRecord {
    const newId = `JA-2026-${String(_activities.length + 1).padStart(3, '0')}`
    const newActivity: ActivityRecord = {
      id: newId,
      no: _activities.length + 1,
      partnerId,
      partnerName,
      activityName: '',
      activityType: '',
      description: '',
      startDate: '',
      endDate: '',
      leadOrganization: '',
      eaiiResponsibleUnit: '',
      partnerResponsibleUnit: '',
      plannedOutputs: [],
      actualOutputs: [],
      attachments: [],
      status: 'Draft' as CollaborationStatus,
    }
    _activities = [..._activities, newActivity]
    notify()
    return newActivity
  },

  update(updated: ActivityRecord) {
    _activities = _activities.map(a => (a.id === updated.id ? updated : a))
    notify()
  },

  delete(id: string) {
    _activities = _activities.filter(a => a.id !== id)
    notify()
  },
}
