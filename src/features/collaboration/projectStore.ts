/**
 * Project Collaboration Store
 * Manages project records for approved partners
 */
import type { ProjectRecord, CollaborationStatus } from '../../types'

let _projects: ProjectRecord[] = []
const _listeners: Array<(list: ProjectRecord[]) => void> = []

function notify() {
  _listeners.forEach(fn => fn([..._projects]))
}

export const projectStore = {
  getAll(): ProjectRecord[] {
    return [..._projects]
  },

  subscribe(fn: (list: ProjectRecord[]) => void): () => void {
    _listeners.push(fn)
    fn([..._projects])
    return () => {
      const idx = _listeners.indexOf(fn)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  },

  create(): ProjectRecord {
    const newId = `PROJ-2026-${String(_projects.length + 1).padStart(3, '0')}`
    const newProject: ProjectRecord = {
      id: newId,
      no: _projects.length + 1,
      partnerId: '',
      partnerName: '',
      projectName: '',
      description: '',
      thematicArea: '',
      budget: '',
      fundingSource: '',
      currency: 'ETB',
      projectManager: '',
      partnerLead: '',
      partnerCountry: '',
      teamMembers: [],
      partnerOrganizations: [],
      startDate: '',
      endDate: '',
      percentageCompletion: 0,
      milestones: [],
      deliverables: [],
      risks: [],
      status: 'Draft' as CollaborationStatus,
      currentPhase: 'Planning',
      costSharing: false,
      orgContribution: '',
      partnerContribution: '',
    }
    _projects = [..._projects, newProject]
    notify()
    return newProject
  },

  update(updated: ProjectRecord) {
    _projects = _projects.map(p => (p.id === updated.id ? updated : p))
    notify()
  },

  delete(id: string) {
    _projects = _projects.filter(p => p.id !== id)
    notify()
  },
}
