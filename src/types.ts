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
  | 'collaboration-activities'
  | 'collaboration-grants'
  | 'collaboration-contributions'
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

export type EventRecord = {
  id: string
  no: number
  title: string // Maps to Event Name
  type: string // Maps to Event Type / Visit Type
  date: string // Maps to Event Start Date & Time / Visit Start Date & Time
  endDate?: string // Maps to Event End Date & Time
  visitEndDate?: string // Maps to Visit End Date & Time
  venue: string // Maps to Venue / Host Org / Location
  status:
    | 'Draft'
    | 'Pending Review'
    | 'Approved'
    | 'Pending Final Review'
    | 'Rejected'
    | 'Completed'

  // DG Review Fields
  assignedPerson?: string
  assignedPersonId?: string
  reviewComment?: string
  outcomeDueDate?: string // ISO 8601 date-only YYYY-MM-DD
  hasOutcomeDraft?: boolean
  auditTrail?: AuditTrailEntry[]
  feedbackEntries?: FeedbackEntry[]

  // New Fields
  category?: 'Event' | 'Visit'

  // If Event details
  eventCategory?: 'Internal' | 'Joint'
  organizer?: string
  coOrganizer?: string
  eventMode?: 'Physically' | 'Virtual' | 'Hybrid'
  partnerParticipants?: PartnerParticipant[]
  eaiiParticipants?: EaiiParticipant[]
  estimatedBudget?: number
  actualBudget?: number
  fundingScore?: number
  keyDiscussions?: string
  agreementsReached?: string
  actionPoints?: string
  objectivesAchieved?: string
  recommendations?: string
  // Event Attachments (filenames, references, or uploaded files)
  attachmentsAgenda?: AttachmentValue
  attachmentsAttendanceSheet?: AttachmentValue
  attachmentsPresentations?: AttachmentValue
  attachmentsPhotos?: AttachmentValue
  attachmentsVideos?: AttachmentValue
  attachmentsEventReport?: AttachmentValue

  // If Visit details
  visitType?:
    | 'Incoming visit'
    | 'outgoing visit'
    | 'technical visit'
    | 'courtesy visit'
    | 'site visit'
    | 'delegation visit'
    | 'benchmarking visit'
    | 'international visit'
  visitCategory?: 'Internal' | 'external' | 'international'
  visitDate?: string
  hostOrganization?: string
  visitingOrganization?: string
  visitLocations?: string
  purposeOfVisit?: string

  // Focal Person
  focalPersonName?: string
  focalPersonDivision?: string
  focalPersonEmail?: string

  // Delegation
  delegations?: DelegationMember[]

  // Discussion Summary (Visit)
  keyTopicsDiscussed?: string
  opportunitiesIdentified?: string
  visitAgreementsReached?: string
  followUpActions?: string

  // Visit Attachments
  visitAttachmentsSchedule?: AttachmentValue
  visitAttachmentsAttendanceList?: AttachmentValue
  visitAttachmentsMinutes?: AttachmentValue
  visitAttachmentsPhotos?: AttachmentValue
  visitAttachmentsVideos?: AttachmentValue
  visitAttachmentsPresentations?: AttachmentValue
  visitAttachmentsReport?: AttachmentValue
  rejectionReason?: string
}

export type OpportunityStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected'

export type OpportunityRole = 'officer' | 'knowledge-director' | 'division-director'

export type OpportunityRecord = {
  id: string
  no: number
  title: string
  source: string
  date: string
  division: string
  status: OpportunityStatus

  // Partner Info
  partnerName?: string
  acronym?: string
  organizationType?: string
  organizationTypeSpecify?: string
  country?: string
  regionState?: string
  city?: string
  website?: string
  contactPersonName?: string
  positionTitle?: string
  email?: string
  existingRelationship?: 'New Partner' | 'Exist Partner' | 'Former'
  partnerInterestArea?: string
  strategicImportance?: 'High' | 'Medium' | 'Low'
  opportunityCategory?: string
  opportunityCategorySpecify?: string
  sourceSpecify?: string

  // Description Fields
  opportunityBackground?: string
  opportunityDescription?: string
  proposedCollaborationArea?: string
  strategicAlignment?: string
  expectedBenefits?: string
  expectedOutcome?: string

  // Workflow tracking
  registeredBy?: string
  registeredAt?: string
  reviewedBy?: string // Knowledge & Ecosystem Director
  reviewComment?: string // Director's note when sending for approval
  sentForApprovalAt?: string
  approvedBy?: string // Division Director
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
}

export type ParticipantRecord = {
  id: string
  organizationName: string
  fullName: string
  position: string
}

export type EaiiRepresentativeRecord = {
  id: string
  departmentName: string
  fullName: string
  position: string
}

export type EngagementStatus = 'Draft' | 'Assigned' | 'Pending Approval' | 'Approved' | 'Rejected'

export type EngagementRecord = {
  id: string
  no: number
  type: string
  date: string
  status: EngagementStatus
  organization?: string
  attachments?: string | File | null

  // Linked opportunity
  opportunityId?: string
  opportunityTitle?: string
  opportunitySource?: string
  opportunityCategory?: string
  opportunityCountry?: string
  opportunityStrategicImportance?: string
  opportunityApprovedAt?: string
  opportunityApprovedBy?: string

  // Participants
  participants?: ParticipantRecord[]
  eaiiRepresentatives?: EaiiRepresentativeRecord[]

  // Discussion Summary fields (from design)
  keyPoints?: string
  agreedAction?: string
  nextSteps?: string

  // Legacy field kept for backward compat
  discussionSummary?: string

  // Assignment (KE Director assigns officer)
  assignedOfficer?: string
  assignedDepartment?: string
  assignmentNotes?: string
  assignedAt?: string
  assignedBy?: string

  // Officer submission
  submittedAt?: string
  submittedBy?: string

  // Division Director decision
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
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

  // Attachment filenames
  attachments?: string[]

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

export type PermissionRecord = {
  id: string
  key: string
  description: string
  group: string
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
  teamMembers: string[]
  startDate: string
  endDate: string
  percentageCompletion: number
  milestones: ProjectMilestone[]
  deliverables: ProjectDeliverable[]
  risks: ProjectRisk[]
  status: CollaborationStatus
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

// Funding & Grant Tracking
export type GrantRecord = {
  id: string
  no: number
  partnerId: string
  partnerName: string
  donorName: string
  amount: string
  currency: string
  submissionDate: string
  approvalDate?: string
  endDate: string
  description?: string
  status: CollaborationStatus
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
