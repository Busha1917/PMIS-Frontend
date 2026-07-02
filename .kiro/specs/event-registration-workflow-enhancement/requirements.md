# Requirements Document

## Introduction

The Event Registration Workflow Enhancement improves the existing Events & Visits lifecycle management in the PMIS (Partnership Management Information System) frontend. The system currently supports a four-stage workflow — Draft → Pending Review → Approved → Pending Final Review → Completed — across three roles: Officer, Director General (DG), and Assigned Person.

Ten identified gaps reduce the workflow's reliability and usability: assigned persons are never notified, the DG's assignment field is a free-text input with no user validation, there is no rejection path from final review, Officers lose visibility after submission, attachments are unenforced at status transitions, the Assigned Person has no draft-save for outcomes, assignments carry no due date, the Feedback tab in the timeline panel is empty, switching Event↔Visit mid-form silently discards entered data, and no per-record audit trail is shown inside the form view.

This document defines the requirements that close all ten gaps.

---

## Glossary

- **System**: The PMIS frontend React application managing Events & Visits.
- **Officer**: A system user who creates, edits, and submits Event/Visit registration records.
- **Director_General (DG)**: A system user who reviews submissions, assigns an Assigned Person, approves or rejects records, and performs the final review of outcomes.
- **Assigned_Person**: A system user who has been assigned to an approved registration and is responsible for filling in outcome details.
- **EventRecord**: The data model representing a single Event or Visit registration (`EventRecord` in `src/types.ts`).
- **User_Lookup**: A searchable, validated dropdown that resolves system users from the `UserRecord` list.
- **Notification**: An in-app notification entry written to the `NotificationRecord` store.
- **Assignment_Due_Date**: The deadline by which the Assigned_Person must submit outcomes for an approved record; stored as `outcomeDueDate` on EventRecord.
- **Outcome_Draft**: A locally persisted, intermediate save of outcome fields that does not advance the record's status.
- **Audit_Trail**: An ordered list of status-change events for a single EventRecord, each recording the acting user, acting user role, action label, previous status, new status, timestamp (ISO 8601), and optional comment.
- **Feedback_Tab**: The "Feedback" tab inside the timeline panel of the form view that displays reviewer comments and rejection reasons.
- **History_Tab**: A third tab inside the timeline panel that displays the full Audit_Trail for a record.
- **Category_Switch_Warning**: A confirmation modal shown when the user attempts to change the `category` field (Event ↔ Visit) after form data has been entered.
- **Final_Rejection**: A new status transition triggered by the DG's "Send Back for Revision" action, moving a record from "Pending Final Review" back to "Approved".
- **Attachment_Gate**: A hard validation check that blocks a status transition unless required attachments are present for the relevant category.
- **Event-specific fields**: `title`, `type`, `eventCategory`, `startTime`, `endTime`, `organizer`, `coOrganizer`, `eventMode`, `partnerParticipants`, `eaiiParticipants`, `attachmentsAgenda`, `attachmentsAttendanceSheet`, `attachmentsPresentations`, `attachmentsPhotos`, `attachmentsVideos`, `attachmentsEventReport`, `keyDiscussions`, `agreementsReached`, `actionPoints`, `objectivesAchieved`, `recommendations`.
- **Visit-specific fields**: `visitType`, `visitCategory`, `visitDate`, `hostOrganization`, `visitingOrganization`, `visitLocations`, `purposeOfVisit`, `focalPersonName`, `focalPersonDivision`, `focalPersonEmail`, `delegations`, `visitAttachmentsSchedule`, `visitAttachmentsAttendanceList`, `visitAttachmentsMinutes`, `visitAttachmentsPhotos`, `visitAttachmentsVideos`, `visitAttachmentsPresentations`, `visitAttachmentsReport`, `keyTopicsDiscussed`, `opportunitiesIdentified`, `visitAgreementsReached`, `followUpActions`.
- **Shared fields**: `id`, `no`, `date`, `venue`, `status`, `estimatedBudget`, `actualBudget`, `fundingScore`.

---

## Requirements

### Requirement 1: Assigned Person Notification and Filtered Worklist

**User Story:** As an Assigned Person, I want to receive an in-app notification when I am assigned to an Event/Visit record and see a filtered list of my assignments, so that I can act promptly without manually searching the full list.

#### Acceptance Criteria

1. WHEN the Director_General confirms an assignment action that sets `assignedPersonId` on a record, THE System SHALL create a Notification entry whose `link` field deep-links to that record, addressed to the user whose `id` matches `assignedPersonId`, containing the record `title` and record `id`.
2. WHEN the Assigned_Person views the Events & Visits page, THE System SHALL display a "My Assignments" toggle that, when active, shows only EventRecords where `assignedPersonId` matches the current user's `id` and `status` is `"Approved"`.
3. WHILE the "My Assignments" filter is active, THE System SHALL sort the filtered list by `outcomeDueDate` ascending; records with a null `outcomeDueDate` SHALL appear after all records with a defined due date.
4. WHEN the System creates a new Notification addressed to the Assigned_Person, THE System SHALL increment the notification badge count displayed in the application header by 1.
5. IF an EventRecord's `assignedPersonId` matches the current user's `id` and the record's `status` is `"Pending Final Review"` or `"Completed"`, THEN THE System SHALL exclude that record from the "My Assignments" filtered view.

---

### Requirement 2: User Lookup for Assignment Field

**User Story:** As a Director General, I want to select an Assigned Person from a validated list of system users rather than typing a free-text name, so that assignments always reference real, active accounts.

#### Acceptance Criteria

1. WHEN the Director_General opens the assignment panel for a "Pending Review" record, THE System SHALL render a User_Lookup input that queries the `UserRecord` list filtered to users with `status` equal to `"Active"`.
2. WHEN the Director_General types at least 2 characters in the User_Lookup input, THE System SHALL display a dropdown of matching `UserRecord` entries — performing a case-insensitive substring match against each user's `name` field — showing each user's `name` and `position`, within 300ms of the last keystroke; IF the query matches no active users, THE System SHALL display "No matching users found" inside the dropdown.
3. WHEN the Director_General selects a user from the User_Lookup dropdown, THE System SHALL populate the visible input text with the selected user's `name`, set `assignedPerson` to that `name`, and set `assignedPersonId` to that user's `id`; IF the Director_General subsequently modifies the input text without re-selecting from the dropdown, THE System SHALL clear `assignedPersonId`.
4. IF the Director_General attempts to confirm the assignment with non-empty input text in the User_Lookup field and `assignedPersonId` is unset, THEN THE System SHALL display an inline validation error "Selected person does not match a system user" and SHALL prevent the approval action.
5. WHEN the User_Lookup dropdown is open, THE System SHALL allow keyboard navigation: Arrow keys move the highlighted option, Enter selects the highlighted option and closes the dropdown, Escape closes the dropdown without selecting.
6. WHEN the Director_General opens the assignment panel for a record that already has `assignedPersonId` set, THE System SHALL pre-populate the User_Lookup input with the previously assigned user's `name`.

---

### Requirement 3: Final Review Rejection Path

**User Story:** As a Director General, I want to send outcomes back to the Assigned Person for revision when they are inadequate, so that completed records accurately reflect what occurred.

#### Acceptance Criteria

1. WHEN the Director_General views a record with status `"Pending Final Review"`, THE System SHALL display both a "Complete Registration" action and a "Send Back for Revision" action.
2. WHEN the Director_General activates the "Send Back for Revision" action, THE System SHALL display a modal containing a text area for a revision comment; the text area SHALL accept between 1 and 500 characters; the confirm button SHALL remain disabled while the text area is empty.
3. WHEN the Director_General confirms the revision request with a non-empty comment, THE System SHALL transition the record's status from `"Pending Final Review"` to `"Approved"` and store the revision comment in the `reviewComment` field.
4. WHEN the revision is confirmed and the record transitions to `"Approved"` via the Send-Back path, THE System SHALL create a Notification addressed to the user whose `id` matches `assignedPersonId`, containing the revision comment text, the record `title`, the record `id`, and a deep-link to the record.
5. WHEN the Assigned_Person opens the outcome editing panel for a record whose most recent `reviewComment` was set via the Send-Back path, THE System SHALL display the revision comment in a labelled banner ("Revision Required: [comment]") that is visible at the top of the outcome editing panel without requiring scrolling.
6. IF the Director_General attempts to confirm a revision request with an empty text area, THEN THE System SHALL display an inline validation error "Revision reason is required" and SHALL keep the modal open.

---

### Requirement 4: Officer Pipeline Visibility

**User Story:** As an Officer, I want to see the current status and reviewer feedback on records I have submitted, so that I can track progress and understand any rejection reasons without contacting the DG separately.

#### Acceptance Criteria

1. WHEN an Officer opens a record in any status, THE System SHALL display the status timeline panel showing each of the four workflow stages with its current state: one of Completed, Pending, Rejected, or Draft.
2. IF a record's `status` is `"Rejected"` and `reviewComment` is non-empty, THEN THE System SHALL display `reviewComment` as an entry in the Feedback_Tab, labelled with the Director_General's name and the timestamp of the rejection action.
3. WHEN the DG approves a record, IF `reviewComment` is non-empty at the time of approval, THEN THE System SHALL store the comment and display it in the Feedback_Tab; IF `reviewComment` is empty, THEN THE System SHALL NOT display a feedback entry for that approval action.
4. WHEN an Officer opens the Events & Visits list, THE System SHALL display a status badge in each record row that reflects the current `status` value, using the color scheme defined in `statusConfig`.
5. WHILE a record has `status` equal to `"Rejected"`, THE System SHALL display `reviewComment` in a banner at the top of the registration form section; IF `reviewComment` is empty on a Rejected record, THE System SHALL display "No rejection reason provided" in the banner.

---

### Requirement 5: Attachment Enforcement at Status Transitions

**User Story:** As a system administrator, I want the system to enforce that required attachments are present before certain status transitions occur, so that records are not advanced without supporting documentation.

#### Acceptance Criteria

1. WHEN an Officer attempts to submit a record (transition to `"Pending Review"`) and none of the record's attachment fields contain a value, THE System SHALL display a warning dialog listing all attachment fields for the record's current category as recommended items.
2. WHEN the warning dialog is shown, THE System SHALL offer the Officer a "Proceed Anyway" action and a "Cancel" action; selecting "Proceed Anyway" SHALL allow the status transition; selecting "Cancel" SHALL dismiss the dialog without changing the record's status.
3. WHEN the Assigned_Person attempts to submit outcomes (transition to `"Pending Final Review"`) for an Event record and `attachmentsEventReport` is empty, THE System SHALL display an inline validation message "Event Report attachment is required before submission" adjacent to the `attachmentsEventReport` field.
4. WHEN the Assigned_Person attempts to submit outcomes for a Visit record and `visitAttachmentsReport` is empty, THE System SHALL display an inline validation message "Visit Report attachment is required before submission" adjacent to the `visitAttachmentsReport` field.
5. IF the Attachment_Gate validation fails for the Assigned_Person's outcome submission, THEN THE System SHALL prevent the status transition, keep the form open, scroll the mandatory attachment field into view, and apply focus to it.

---

### Requirement 6: Outcome Draft Save

**User Story:** As an Assigned Person, I want to save my outcome entries as a draft without submitting them for final review, so that I can resume filling in details across multiple sessions.

#### Acceptance Criteria

1. WHEN the Assigned_Person is editing the outcome panel for an `"Approved"` record, THE System SHALL display a "Save Draft" button alongside the "Submit for Final Review" button.
2. WHEN the Assigned_Person activates "Save Draft", THE System SHALL persist all current outcome field values to the EventRecord in the application state without changing the record's `status`.
3. WHEN the Assigned_Person reopens an `"Approved"` record that has previously saved outcome field values, THE System SHALL pre-populate all outcome fields with those saved values and display a "Draft in progress" indicator label above the outcome form.
4. WHEN a draft save completes successfully, THE System SHALL display a "Draft saved" toast notification within 1 second; the toast SHALL remain visible for 3 seconds.
5. IF the Assigned_Person attempts to navigate away from the outcome editing panel (by clicking the back button, switching records, or closing the form) and at least one outcome field or attachment field contains a value that differs from the last saved draft state, THEN THE System SHALL display a modal confirmation with the message "You have unsaved changes. Discard them?" with a "Discard" action and a "Stay" action.
6. IF the draft save operation fails, THEN THE System SHALL display an error toast "Draft could not be saved. Please try again." and SHALL NOT clear or modify any currently entered outcome field values.

---

### Requirement 7: Assignment Due Date

**User Story:** As a Director General, I want to set a due date when assigning a person to a record, so that outcome submissions have a clear deadline and overdue items can be identified.

#### Acceptance Criteria

1. WHEN the Director_General opens the assignment panel for a "Pending Review" record, THE System SHALL display a date input labeled "Outcome Due Date" alongside the User_Lookup field.
2. IF the Director_General attempts to confirm an assignment with an "Outcome Due Date" that falls before the user's local calendar date at the time of submission, THEN THE System SHALL display an inline validation error "Due date must be today or in the future" and SHALL prevent the assignment.
3. WHEN an assignment is confirmed with a valid due date, THE System SHALL store the due date as an ISO 8601 date-only string (YYYY-MM-DD) in the `outcomeDueDate` field on the EventRecord.
4. WHILE a record's `status` is `"Approved"` and the user's local calendar date is strictly after `outcomeDueDate`, THE System SHALL render an "Overdue" badge alongside the record's status badge in the Events & Visits list row.
5. WHEN the Assigned_Person views a record whose `status` is `"Approved"` and `outcomeDueDate` is set, THE System SHALL display the due date in the record header as "Outcome due by: DD/MM/YYYY".
6. IF the Outcome Due Date field is left empty when the Director_General confirms the assignment, THEN THE System SHALL display an inline validation error "Outcome due date is required" and SHALL prevent the approval action.

---

### Requirement 8: Feedback Tab Content

**User Story:** As any user, I want the Feedback tab in the timeline panel to display all reviewer comments and rejection reasons chronologically, so that the full review history is accessible from a single view.

#### Acceptance Criteria

1. WHEN a user opens the Feedback_Tab for a record that has at least one entry in a `feedbackEntries` array on the EventRecord, THE System SHALL display each entry as a separate card showing: the entry type label ("Rejection" or "Revision Request"), the author's name, the status value at the time the comment was recorded, and the timestamp formatted as DD/MM/YYYY HH:MM.
2. WHEN a record's `feedbackEntries` array is empty or absent, THE System SHALL display an empty-state message "No feedback yet" inside the Feedback_Tab.
3. WHEN the Director_General confirms a rejection action, THE System SHALL append a new entry to `feedbackEntries` within 500ms of the confirmation, with type "Rejection", before the updated record state is rendered.
4. WHEN the Director_General confirms a Send Back for Revision action, THE System SHALL append a new entry to `feedbackEntries` with type "Revision Request" before the updated record state is rendered.
5. THE Feedback_Tab SHALL display `feedbackEntries` in reverse-chronological order (most recent first); entries with identical timestamps SHALL be ordered by their insertion index, with the higher index appearing first.

---

### Requirement 9: Category Switch Data Loss Prevention

**User Story:** As an Officer, I want to be warned before switching a registration between Event and Visit categories when I have already entered form data, so that I do not accidentally lose my work.

#### Acceptance Criteria

1. WHEN an Officer changes the `category` selector and at least one field from the current category's field set (Event-specific fields or Visit-specific fields as defined in the Glossary) contains a non-empty value — where non-empty means a string with at least one character, a number, or an array with at least one element — THE System SHALL display the Category_Switch_Warning modal.
2. THE Category_Switch_Warning modal SHALL display the message "Switching from [current category] will clear all [current category] fields. Do you want to continue?" with a "Switch & Clear" primary action and a "Cancel" secondary action, where [current category] is replaced by the value before the change ("Event" or "Visit").
3. WHEN the Officer confirms the switch via the "Switch & Clear" action, THE System SHALL set all fields from the previous category's field set to their empty defaults (empty string, undefined, or empty array as appropriate per field type) and retain all Shared fields unchanged.
4. WHEN the Officer selects "Cancel" in the Category_Switch_Warning modal, THE System SHALL revert the `category` selector to its value before the change attempt and leave all entered data unchanged.
5. IF all fields in the current category's field set are at their empty defaults at the time the Officer changes the `category` selector, THEN THE System SHALL switch the category immediately without displaying the Category_Switch_Warning modal.

---

### Requirement 10: Per-Record Audit Trail in Form View

**User Story:** As any user, I want to see a chronological history of all status changes for a record inside the form view, so that I have a transparent account of who acted on it and when.

#### Acceptance Criteria

1. WHEN a record's status changes due to any user action — submit (Officer), approve (DG), reject (DG), assign (DG), outcome submit (Assigned_Person), final complete (DG), or send back for revision (DG) — THE System SHALL append an Audit_Trail entry to an `auditTrail` array on the EventRecord containing: `actorName` (string), `actorRole` (string), `actionLabel` (one of: "Submitted", "Approved", "Rejected", "Assigned", "Outcome Submitted", "Completed", "Sent Back for Revision"), `previousStatus`, `newStatus`, `timestamp` (ISO 8601), and `comment` (optional string, max 500 characters).
2. WHEN a user opens the form view for a record, THE System SHALL display a History_Tab as the third tab in the timeline panel (after "Status" and "Feedback"); all Audit_Trail entries from `auditTrail` SHALL be displayed within this tab; creating a Draft record for the first time SHALL NOT generate an Audit_Trail entry.
3. THE History_Tab SHALL display `auditTrail` entries in reverse-chronological order (most recent first).
4. WHEN an Audit_Trail entry's `comment` field is non-empty, THE System SHALL display the comment text in a visually distinct block beneath the status-change description line for that entry.
5. IF a record's `auditTrail` array is empty or absent, THEN THE System SHALL display the message "No history yet" in the History_Tab.
6. THE System SHALL display each Audit_Trail entry with a status badge for `newStatus` using the color scheme defined in `statusConfig` in `EventForm.tsx`.
7. WHEN an Audit_Trail entry has `actionLabel` equal to "Sent Back for Revision", THE System SHALL display the entry's `newStatus` badge as "Approved" with the `statusConfig` color for "Approved" and prefix the action description with the label "Revision Requested →" to distinguish it from a standard approval entry.
