import type { LucideIcon } from 'lucide-react'

export type AdminPage =
  | 'dashboard'
  | 'events'
  | 'events-officer'
  | 'events-director-general'
  | 'events-assigned-person'
  | 'opportunities'
  | 'opportunities-officer'
  | 'opportunities-knowledge-director'
  | 'opportunities-division-director'
  | 'engagement'
  | 'engagement-ke-director'
  | 'engagement-officer'
  | 'engagement-division-director'
  | 'agreements'
  | 'agreements-officer'
  | 'agreements-legal'
  | 'agreements-ke-director'
  | 'partners'
  | 'partners-officer'
  | 'partners-ke-director'
  | 'partners-division-director'
  | 'collaboration-projects'
  | 'collaboration-projects-officer'
  | 'collaboration-projects-division-director'
  | 'collaboration-activities'
  | 'collaboration-activities-officer'
  | 'collaboration-activities-division-director'
  | 'collaboration-grants'
  | 'collaboration-grants-officer'
  | 'collaboration-grants-division-director'
  | 'collaboration-contributions'
  | 'collaboration-contributions-officer'
  | 'collaboration-contributions-division-director'
  | 'kpi-monitoring'
  | 'kpi-monitoring-officer'
  | 'kpi-monitoring-division-director'
  | 'baseData'
  | 'users'
  | 'roles'
  | 'permission-actions'
  | 'permission-resources'
  | 'profile'
  | 'audit-logs'
  | 'notifications'

export type NotificationRecord = {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  timestamp: string
  link?: string
}

export type AuditLogRecord = {
  id: string
  action: string
  module: string
  user: string
  timestamp: string
  details: string
}

export type NavigationItem = {
  label: string
  page: AdminPage
  icon: LucideIcon
  group: string
}

export type UserRole =
  | 'admin'
  | 'manager'
  | 'viewer'
  | 'Officer'
  | 'Director General'
  | 'Assigned Person'

export type UserStatus = 'Active' | 'Pending' | 'Inactive'

export type UserRecord = {
  id: string
  no: number
  name: string
  email: string
  phone: string
  position: string
  status: UserStatus
}

export type PermissionActionRecord = {
  id: number
  action: string
}

export type PermissionResourceRecord = {
  id: number
  name: string
}

export type RolePermissionResource = {
  permission_resource_id: number
  rolePermissionResourceActions: { permission_action_id: number }[]
}

export type RoleRecord = {
  id: string
  no: number
  name: string
  description: string
  rolePermissionResources: RolePermissionResource[]
}

export type PartnerParticipant = {
  id: string
  fullName: string
  organizationName: string
  position: string
  email: string
  phone: string
  type: 'Speaker' | 'Guest' | 'VIP Guest' | 'Partner Representative'
}

export type EaiiParticipant = {
  name: string
  division: string
  email: string
}

export type DelegationMember = {
  fullName: string
  position: string
  organizationName: string
  country: string
  email: string
  phone: string
  status: 'VIP' | 'Normal'
}

export type AttachmentValue = string | File | null | undefined

export type AuditTrailEntry = {
  actorName: string
  actorRole: string
  actionLabel:
    | 'Submitted'
    | 'Approved'
    | 'Rejected'
    | 'Assigned'
    | 'Outcome Submitted'
    | 'Completed'
    | 'Sent Back for Revision'
  previousStatus:
    | 'Draft'
    | 'Pending Review'
    | 'Approved'
    | 'Pending Final Review'
    | 'Rejected'
    | 'Completed'
  newStatus:
    | 'Draft'
    | 'Pending Review'
    | 'Approved'
    | 'Pending Final Review'
    | 'Rejected'
    | 'Completed'
  timestamp: string // ISO 8601
  comment?: string
}

export type FeedbackEntry = {
  type: 'Rejection' | 'Revision Request'
  authorName: string
  statusAtTime: string
  timestamp: string // ISO 8601
  comment: string
}

// ── Event Sub-types ────────────────────────────────────────────────────────
export type EventParticipant = {
  id?: number
  participantUid?: string
  fullName: string
  organizationName: string
  position?: string | null
  email?: string | null
  phoneNumber?: string | null
  participantType?: string
}

export type EventEaiiParticipant = {
  id?: number
  userId?: string | number
  user?: any
  name?: string
  email?: string
  division?: string
}

export type EventBudget = {
  id?: number
  budgetUid?: string
  estimatedBudget?: number
  actualBudget?: number
  fundingSource?: string
}

export type EventOutcome = {
  id?: number
  outcomeUid?: string
  keyDiscussions?: string
  agreementsReached?: string
  actionPoints?: string
  objectivesAchieved?: string
  recommendations?: string
}

export type EventTypeRef = { id: number | string; typeName: string; description?: string | null }
export type EventCategoryRef = {
  id: number | string
  categoryName: string
  description?: string | null
}
export type EventModeRef = { id: number | string; modeName: string; description?: string | null }

export type EventRecord = {
  id: string | number
  eventUid?: string
  recordId?: string
  title: string
  eventName?: string
  eventType?: EventTypeRef | string | any
  eventTypeId?: string
  eventCategory?: EventCategoryRef | string | any
  eventCategoryId?: string
  eventDate?: string
  startTime?: string | null
  endTime?: string | null
  venue: string
  organizer?: string | null
  coOrganizer?: string | null
  eventMode?: EventModeRef | string | any
  eventModeId?: string
  partnerId?: string | null
  status:
    | 'Planned'
    | 'Ongoing'
    | 'Completed'
    | 'Cancelled'
    | 'Follow-up Required'
    | 'Draft'
    | 'Pending Review'
    | 'Approved'
    | 'Pending Final Review'
    | 'Rejected'
  verifiedStatus?: string | null
  reviewNotes?: string | null
  verificationNotes?: string | null
  participants?: EventParticipant[]
  eaiiParticipants?: EventEaiiParticipant[]
  budget?: EventBudget | null
  outcomes?: EventOutcome[]
  createdAt?: string
  updatedAt?: string
  createdBy?: any

  // Legacy UI fields (kept for form compatibility)
  no?: number
  date?: string // alias for eventDate in old forms
  type?: string // alias for eventType.typeName in old forms
  category?: 'Event' | 'Visit'
  auditTrail?: AuditTrailEntry[]
  feedbackEntries?: FeedbackEntry[]
  assignedPerson?: string
  assignedPersonId?: string
  reviewComment?: string
  outcomeDueDate?: string
  hasOutcomeDraft?: boolean
  endDate?: string
  visitType?: string | any
  visitCategory?: string | any
  visitDate?: string
  visitEndDate?: string
  hostOrganization?: string
  visitingOrganization?: string
  visitLocations?: string
  purposeOfVisit?: string
  estimatedBudget?: number
  actualBudget?: number
  fundingScore?: number
  partnerParticipants?: any[]
  keyDiscussions?: string
  agreementsReached?: string
  actionPoints?: string
  objectivesAchieved?: string
  recommendations?: string
  keyTopicsDiscussed?: string
  opportunitiesIdentified?: string
  visitAgreementsReached?: string
  followUpActions?: string
  focalPersonName?: string
  focalPersonDivision?: string
  focalPersonEmail?: string
  rejectionReason?: string
  attachmentsAgenda?: any
  delegations?: any
}

// ── Visit Sub-types ────────────────────────────────────────────────────────
export type VisitDelegate = {
  id?: string
  delegateUid?: string
  fullName: string
  position?: string | null
  organizationName?: string | null
  country?: string | null
  email?: string | null
  phoneNumber?: string | null
  status?: string | null
}

export type VisitOutcome = {
  id?: string
  outcomeUid?: string
  keyTopicsDiscussed?: string
  opportunitiesIdentified?: string
  agreementsReached?: string
  followUpActions?: string
}

export type VisitTypeRef = { id: string; typeName: string; description?: string | null }
export type VisitCategoryRef = { id: string; categoryName: string; description?: string | null }

export type VisitRecord = {
  id: string
  visitUid?: string
  recordId?: string
  title: string
  visitType?: VisitTypeRef
  visitTypeId?: string
  visitCategory?: VisitCategoryRef
  visitCategoryId?: string
  visitDate: string
  hostOrganization?: string | null
  visitingOrganization?: string | null
  visitLocation?: string | null
  purpose?: string | null
  focalPerson?: any
  focalPersonId?: string | null
  partnerId?: string | null
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Follow-up Required'
  verifiedStatus?: string | null
  reviewNotes?: string | null
  verificationNotes?: string | null
  delegates?: VisitDelegate[]
  outcome?: VisitOutcome | null
  createdAt?: string
  updatedAt?: string
  createdBy?: any

  // Legacy UI fields
  no?: number
}

export type OpportunityStatus =
  | 'Draft'
  | 'Under Review'
  | 'Verified'
  | 'Reviewed'
  | 'Approved'
  | 'Rejected'
  | 'Converted'

export type OpportunityRole = 'officer' | 'knowledge-director' | 'division-director'

export type OpportunityRecord = {
  id: string
  no?: number
  opportunityUid?: string
  title: string
  dateIdentified?: string
  partnerName?: string
  partnerAcronym?: string
  organizationType?: string
  country?: string
  region?: string
  city?: string
  website?: string
  contactPersonName?: string
  contactPosition?: string
  contactEmail?: string
  contactPhone?: string
  existingRelationship?: string
  interestArea?: string
  strategicImportanceLevelId?: string
  strategicImportanceLevel?: {
    id: string
    levelName: string
    description?: string
  }
  opportunityCategoryId?: string
  opportunityCategory?: {
    id: string
    name: string
    description?: string
  }
  opportunitySourceId?: string
  opportunitySource?: {
    id: string
    sourceName: string
    description?: string
  }
  opportunityBackground?: string
  opportunityDescription?: string
  proposedCollaborationArea?: string
  expectedOutcome?: string
  strategicAlignment?: string
  expectedBenefits?: string
  partnerId?: string
  status: OpportunityStatus
  verificationNotes?: string
  reviewNotes?: string
  approvalNotes?: string
  screenedAt?: string
  verifiedAt?: string
  reviewedAt?: string
  approvedAt?: string
  convertedToEntityType?: string
  convertedToEntityId?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: Record<string, any>
  reviewedBy?: Record<string, any>
  verifiedBy?: Record<string, any>
  // UI-specific mapped fields that may not be in the direct backend schema initially
  division?: string
  source?: string
  date?: string
}

export type AgreementStatus =
  | 'Draft'
  | 'Pending Verification'
  | 'Verified'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'

export type AgreementEaiiDivision = {
  id: string
  division: string
  fullName: string
  position: string
}

// ── Amendment System ──────────────────────────────────────────────────────
export type AgreementAmendment = {
  versionId: string
  versionNumber: number // 1, 2, 3, etc.
  createdBy: 'Officer' | 'Legal Officer'
  createdAt: string
  comments: string // Legal officer's comments or Officer's response
  attachmentUrl?: string // File attachment reference
  status: 'Pending' | 'Responded' | 'Verified'
}

export type AgreementRecord = {
  id: string
  no: number
  title: string
  type: string
  date: string
  startDate: string
  endDate: string
  status: AgreementStatus | string

  // Linked engagement
  engagementId?: string
  engagementOrganization?: string
  engagementType?: string
  engagementDate?: string
  engagementApprovedAt?: string
  engagementApprovedBy?: string

  // Parties (from Officer form)
  partnerOrganization?: string
  contactPerson?: string
  contactPosition?: string

  // EAII Responsible divisions (multi-row)
  eaiiDivisions?: AgreementEaiiDivision[]

  // Discussion Summary
  description?: string

  // Attachment filenames (deprecated, use amendments instead)
  attachments?: string[]

  // Amendment/Version tracking system
  amendments?: AgreementAmendment[] // Track all amendments/versions
  currentVersion?: number // Current version being worked on

  // Officer workflow
  submittedBy?: string
  submittedAt?: string

  // Legal Officer workflow
  verifiedBy?: string
  verifiedAt?: string
  legalRejectedBy?: string
  legalRejectedAt?: string
  legalRejectionReason?: string

  // KE Director workflow
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
}

export type PartnerStatus =
  | 'Draft'
  | 'Pending Verification'
  | 'Verified'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'

export type PartnerContact = {
  id: string
  fullName: string
  position: string
  department: string
  email: string
  mobilePhone: string
  officePhone: string
}

export type PartnerAdditionalContact = {
  id: string
  fullName: string
  title: string
  email: string
  phone: string
  roleInPartnership: string
}

export interface SelectOption {
  label: string
  value: string
}

export type PartnerRecord = {
  id: string
  no: number
  name: string
  type: string
  country: string
  organization: string
  contact: string
  status: PartnerStatus | string

  // Step 1: Basic Information
  acronym?: string
  organizationType?: string
  region?: string
  website?: string
  yearEstablished?: string
  registrationLicenseNumber?: string
  taxNumber?: string
  partnershipClassification?: string

  // Step 2: Organizational Details
  partnerLogo?: string
  mission?: string
  vision?: string
  strategicFocusAreas?: string
  keyExpertiseAreas?: string
  aiRelatedFocusAreas?: string
  annualBudget?: string
  numberOfEmployees?: string
  geographicCoverage?: string

  // Step 4: Primary Contact
  primaryContact?: PartnerContact

  // Step 4: Additional Contact
  additionalContact?: PartnerAdditionalContact

  // Step 5: Internal EAII Focal Person (assigned by system)
  internalFocalPersonName?: string
  internalFocalPersonDivision?: string

  // Linked agreement
  agreementId?: string
  agreementTitle?: string
  agreementType?: string
  agreementApprovedAt?: string
  agreementApprovedBy?: string

  // Officer workflow
  submittedBy?: string
  submittedAt?: string
  currentStep?: number // for stepper tracking

  // KE Director workflow
  verifiedBy?: string
  verifiedAt?: string
  keRejectedBy?: string
  keRejectedAt?: string
  keRejectionReason?: string

  // Division Director workflow
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
}

export type BaseDataItem = {
  id: string
  title: string
  description: string
}

// ── Collaboration Module Types ──────────────────────────────────────────────

export type CollaborationStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected'

// Project Collaboration
export type ProjectMilestone = {
  id: string
  milestone: string
  plannedDate: string
  actualDate?: string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed'
}

export type ProjectDeliverable = {
  id: string
  deliverable: string
  dueDate: string
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue'
}

export type ProjectRisk = {
  id: string
  riskId: string
  impact: 'Low' | 'Medium' | 'High' | 'Critical'
  description: string
  mitigation: string
  status: 'Open' | 'Mitigating' | 'Resolved'
}

export type ProjectTeamMember = {
  id: string
  name: string
  role: string
  email: string
}

export type ProjectPartnerOrg = {
  id: string
  name: string
  lead: string
  country: string
}

export type ProjectRecord = {
  id: string
  no: number
  partnerId: string
  partnerName: string
  projectName: string
  description: string
  thematicArea: string
  budget: string
  fundingSource: string
  currency: string
  projectManager: string
  partnerLead: string
  partnerCountry?: string
  teamMembers: ProjectTeamMember[]
  partnerOrganizations?: ProjectPartnerOrg[]
  startDate: string
  endDate: string
  percentageCompletion: number
  milestones: ProjectMilestone[]
  deliverables: ProjectDeliverable[]
  risks: ProjectRisk[]
  status: CollaborationStatus
  // Cost sharing
  costSharing?: boolean
  orgContribution?: string
  partnerContribution?: string
  submittedBy?: string
  submittedAt?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  currentPhase?: string
}

// Joint Activity
export type ActivityOutput = {
  id: string
  output: string
  type: 'Planned' | 'Actual'
}

export type ActivityRecord = {
  id: string
  no: number
  partnerId: string
  partnerName: string
  activityName: string
  activityType: string
  description: string
  startDate: string
  endDate: string
  leadOrganization: string
  eaiiResponsibleUnit: string
  partnerResponsibleUnit: string
  plannedOutputs: string[]
  actualOutputs: string[]
  attachments?: string[]
  status: CollaborationStatus
  submittedBy?: string
  submittedAt?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
}

// ────────────────── KPI MONITORING ──────────────────
export type KPIStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Returned'

export type KPIRating = 'Poor' | 'Fair' | 'Good' | 'Excellent'

export type KPISupportingEvidence = {
  reportUrl?: string
  agreementUrl?: string
  photoUrl?: string
  publicationUrl?: string
  financialDocumentUrl?: string
}

export type KPIRecord = {
  id: string
  kpiId: string // e.g., KPI-2026-001
  kpiName: string
  reportingYear: string
  division: string
  focalPerson: string
  leadOrganization: string
  partnerOrganization: string
  eaiiResponsibleUnit: string
  startDate: string
  endDate: string
  period: string // e.g., "first quarter", "second quarter"
  status: KPIStatus
  ratingApproval?: KPIRating
  performanceScore: number // 0-100

  // Step 1: General Information
  generalInfo: {
    kpiName: string
    reportingYear: string
    division: string
    focalPerson: string
  }

  // Step 2: Partnership Indicators
  partnershipIndicators: {
    jointProjects: number
    fundingMobilized: number
    fundingMobilizedCurrency: string
    trainingsConduc: number
    researchOutputs: number
    aiSolutionsDeveloped: number
    startupsSupported: number
    expertsExchanged: number
    eventsConducted: number
  }

  // Step 3: KPI Scoring
  kpiScoring: {
    strategicValueScore: number
    strategicValueDetail: string
    technicalValueScore: number
    technicalValueDetail: string
    financialValueScore: number
    financialValueDetail: string
    sustainabilityScore: number
    sustainabilityDetail: string
  }

  // Step 4: Remarks & Evidence
  remarks: {
    majorAchievements: string
    challengesEncountered: string
    recommendations: string
    supportingComments: string
  }

  supportingEvidence: KPISupportingEvidence

  // Division Director Review
  directorReview?: {
    approvedBy?: string
    approvedAt?: string
    returnedBy?: string
    returnedAt?: string
    returnReason?: string
  }

  submittedAt?: string
  submittedBy?: string
  createdAt: string
  updatedAt: string
}
// Funding & Grant Tracking
export type GrantMilestone = {
  id: string
  milestone: string
  plannedDate: string
  actualDate: string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed'
}

export type GrantDeliverable = {
  id: string
  deliverable: string
  dueDate: string
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue'
}

export type GrantRisk = {
  id: string
  description: string
  mitigationPlan: string
}

export type GrantTeamMember = {
  id: string
  name: string
  role: string
  email: string
}

export type GrantRecord = {
  id: string
  no: number
  partnerId: string
  partnerName: string
  // Project Details
  projectName: string
  description: string
  thematicArea: string
  // Funding
  donorName: string
  amount: string
  fundingSource: string
  currency: string
  // Team
  projectManager: string
  partnerLead: string
  teamMembers: GrantTeamMember[]
  // Timeline
  startDate: string
  endDate: string
  submissionDate: string
  approvalDate?: string
  // Progress
  percentageCompletion: number
  milestones: GrantMilestone[]
  deliverables: GrantDeliverable[]
  // Risks
  risks: GrantRisk[]
  // Workflow
  status: CollaborationStatus | string
  submittedBy?: string
  submittedAt?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
}

// Resource Contribution
export type ContributionItem = {
  id: string
  category: string
  checked: boolean
  description?: string
}

export type ResourceContributionRecord = {
  id: string
  no: number
  partnerId: string
  partnerName: string
  projectName?: string
  eaiiContributions: {
    staff: boolean
    infrastructure: boolean
    funding: boolean
    equipment: boolean
    dataResources: boolean
    staffDetails?: string
    infrastructureDetails?: string
    fundingDetails?: string
    equipmentDetails?: string
    dataResourcesDetails?: string
  }
  partnerContributions: {
    staff: boolean
    funding: boolean
    technology: boolean
    equipment: boolean
    expertise: boolean
    staffDetails?: string
    fundingDetails?: string
    technologyDetails?: string
    equipmentDetails?: string
    expertiseDetails?: string
  }
  monetaryValue: string
  inKindValue: string
  totalValue: string
  currency: string
  status: CollaborationStatus
  submittedBy?: string
  submittedAt?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
}

// ----------------------------------------------------------------------------
// Engagement API Schemas
// ----------------------------------------------------------------------------

export type ExternalParticipant = {
  id?: string
  fullName: string
  organizationName: string
  position?: string | null
  email?: string | null
  phoneNumber?: string | null
}

export type EaiiRepresentative = {
  id?: string
  fullName: string
  userId?: string | null
  division: string
  email: string
  role?: string | null
}

export type EngagementType = {
  id: string
  typeName: string
  description?: string | null
}

export type EngagementRecord = {
  id: string
  engagementUid?: string
  recordId?: string
  opportunityId: string
  engagementType?: EngagementType
  engagementTypeId?: string // Used for creating/updating
  engagementDate: string
  title: string
  location?: string | null
  startTime?: string | null
  endTime?: string | null
  keyPoints: string
  agreedActions: string
  nextSteps: string
  followUpRequired: boolean
  followUpDate?: string | null
  followUpNotes?: string | null
  status: 'Draft' | 'In Progress' | 'Completed' | 'Cancelled'
  approvalNotes?: string | null
  approvalDate?: string | null
  createdAt?: string
  updatedAt?: string
  externalParticipants?: ExternalParticipant[]
  eaiiRepresentatives?: EaiiRepresentative[]
  createdBy?: any
  approvedBy?: any
  opportunity?: OpportunityRecord | null
}
