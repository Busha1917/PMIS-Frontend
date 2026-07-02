import type { LucideIcon } from 'lucide-react'

export type AdminPage =
  | 'dashboard'
  | 'events'
  | 'opportunities'
  | 'opportunities-officer'
  | 'opportunities-knowledge-director'
  | 'opportunities-division-director'
  | 'engagement'
  | 'engagement-ke-director'
  | 'engagement-officer'
  | 'engagement-division-director'
  | 'agreements'
  | 'partners'
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
  date: string // Maps to Event Date / Visit Date
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
  startTime?: string
  endTime?: string
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

export type AgreementRecord = {
  id: string
  no: number
  title: string
  type: string
  date: string
  startDate: string
  endDate: string
  status: string
}

export type PartnerRecord = {
  id: string
  no: number
  name: string
  type: string
  country: string
  organization: string
  contact: string
  status: string
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
