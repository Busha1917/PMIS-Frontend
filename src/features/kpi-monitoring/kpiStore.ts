/**
 * KPI Monitoring Store
 * Manages KPI records for performance tracking
 */
import type { KPIRecord } from '@/types'

const _kpis: KPIRecord[] = []
const _listeners: Array<(list: KPIRecord[]) => void> = []

function notify() {
  _listeners.forEach(fn => fn([..._kpis]))
}

// Generate KPI ID
function generateKPIId(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `KPI-${year}-${randomNum}`
}

export const kpiStore = {
  getAll(): KPIRecord[] {
    return [..._kpis]
  },

  getById(id: string): KPIRecord | undefined {
    return _kpis.find(k => k.id === id)
  },

  subscribe(fn: (list: KPIRecord[]) => void): () => void {
    _listeners.push(fn)
    fn([..._kpis])
    return () => {
      const idx = _listeners.indexOf(fn)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  },

  create(): KPIRecord {
    const id = `kpi-${Date.now()}`
    const kpiId = generateKPIId()
    const now = new Date().toISOString()

    const newKPI: KPIRecord = {
      id,
      kpiId,
      kpiName: '',
      reportingYear: new Date().getFullYear().toString(),
      division: '',
      focalPerson: '',
      leadOrganization: '',
      partnerOrganization: '',
      eaiiResponsibleUnit: '',
      startDate: '',
      endDate: '',
      period: '',
      status: 'Draft',
      performanceScore: 0,

      generalInfo: {
        kpiName: '',
        reportingYear: new Date().getFullYear().toString(),
        division: '',
        focalPerson: '',
      },

      partnershipIndicators: {
        jointProjects: 0,
        fundingMobilized: 0,
        fundingMobilizedCurrency: 'USD',
        trainingsConduc: 0,
        researchOutputs: 0,
        aiSolutionsDeveloped: 0,
        startupsSupported: 0,
        expertsExchanged: 0,
        eventsConducted: 0,
      },

      kpiScoring: {
        strategicValueScore: 0,
        strategicValueDetail: '',
        technicalValueScore: 0,
        technicalValueDetail: '',
        financialValueScore: 0,
        financialValueDetail: '',
        sustainabilityScore: 0,
        sustainabilityDetail: '',
      },

      remarks: {
        majorAchievements: '',
        challengesEncountered: '',
        recommendations: '',
        supportingComments: '',
      },

      supportingEvidence: {
        reportUrl: undefined,
        agreementUrl: undefined,
        photoUrl: undefined,
        publicationUrl: undefined,
        financialDocumentUrl: undefined,
      },

      createdAt: now,
      updatedAt: now,
    }

    _kpis.push(newKPI)
    notify()
    return newKPI
  },

  update(kpi: KPIRecord): void {
    const idx = _kpis.findIndex(k => k.id === kpi.id)
    if (idx !== -1) {
      _kpis[idx] = { ...kpi, updatedAt: new Date().toISOString() }
      notify()
    }
  },

  delete(id: string): void {
    const idx = _kpis.findIndex(k => k.id === id)
    if (idx !== -1) {
      _kpis.splice(idx, 1)
      notify()
    }
  },
}
