# Implementation Plan: Event Registration Workflow Enhancement

## Overview

This plan breaks the ten workflow enhancements into discrete, incremental coding tasks that build on each other — starting with foundational type and state changes, then new components, then integrating everything into the existing pages and forms. Each task references the specific requirements it satisfies and the correctness properties it validates.

The implementation language is **TypeScript** (React + Vite + Redux Toolkit + Tailwind CSS), consistent with the existing project stack. Property-based tests use **fast-check** (already available); unit/integration tests use **Vitest + React Testing Library**.

---

## Tasks

- [x] 1. Extend types and data model in `src/types.ts`
  - Add `AuditTrailEntry` type with fields: `actorName`, `actorRole`, `actionLabel` (union), `previousStatus`, `newStatus`, `timestamp`, `comment?`
  - Add `FeedbackEntry` type with fields: `type` (`'Rejection' | 'Revision Request'`), `authorName`, `statusAtTime`, `timestamp`, `comment`
  - Extend `EventRecord` with: `assignedPersonId?`, `outcomeDueDate?`, `hasOutcomeDraft?`, `auditTrail?`, `feedbackEntries?`
  - _Requirements: 1.1, 2.3, 3.3, 6.2, 7.3, 8.1, 10.1_

- [x] 2. Create `notificationsSlice.ts` and wire it into the Redux store
  - [x] 2.1 Create `src/store/slices/notificationsSlice.ts`
    - Define `NotificationsState` with `items: NotificationRecord[]`
    - Implement actions: `addNotification`, `markRead`, `markAllRead`, `deleteNotification`
    - Export selector `selectUnreadCount` and `selectNotifications`
    - Seed initial state from `notifications` array in `src/data.ts`
    - _Requirements: 1.1, 1.4_

  - [ ]\* 2.2 Write unit tests for `notificationsSlice`
    - Test `addNotification` increments unread count by 1
    - Test `markAllRead` sets all `isRead: true`
    - Test `selectUnreadCount` returns 0 when no unread items exist
    - _Requirements: 1.4_

  - [x] 2.3 Register `notificationsSlice` reducer in `src/store/index.ts`
    - Add `notifications: notificationsReducer` to the `configureStore` reducer map
    - Export updated `RootState` type reflecting the new slice
    - _Requirements: 1.4_

- [x] 3. Update `Header.tsx` to consume the notifications Redux slice
  - Replace the hardcoded `MOCK_NOTIFICATIONS` array with `useSelector(selectNotifications)`
  - Replace the static dot badge with a dynamic count driven by `useSelector(selectUnreadCount)`; hide the dot when count is 0
  - Render the drawer notification list from the Redux store items
  - Wire the "Mark all as read" button to dispatch `markAllRead()`
  - _Requirements: 1.4_

- [ ] 4. Create `src/components/UserLookup.tsx`
  - [x] 4.1 Implement the `UserLookup` component with props: `users`, `value`, `selectedId`, `onChange`, `onSelect`, `error?`, `autoFocus?`
    - Internal state: `query`, `open`, `highlightedIndex`
    - Filter active users with case-insensitive substring match on `name`; only open dropdown when ≥2 characters typed
    - Display each match's `name` and `position`; show "No matching users found" when empty
    - On selection: populate input with user's `name`, call `onSelect(user)`; on free-text edit after selection: call `onChange(text)` to signal `assignedPersonId` cleared
    - Pre-populate when `selectedId` is provided on mount
    - _Requirements: 2.1, 2.2, 2.3, 2.6_

  - [-] 4.2 Add keyboard navigation to `UserLookup`
    - ArrowDown / ArrowUp move `highlightedIndex`; Enter selects highlighted option and closes dropdown; Escape closes without selecting
    - _Requirements: 2.5_

  - [ ]\* 4.3 Write unit tests for `UserLookup`
    - Test: renders "No matching users found" when no active user matches
    - Test: pre-populates input when `selectedId` is provided
    - Test: keyboard navigation — ArrowDown, ArrowUp, Enter, Escape
    - Test: clears `assignedPersonId` when user modifies text after selection
    - _Requirements: 2.2, 2.3, 2.5, 2.6_

  - [ ]\* 4.4 Write property test for user lookup filter correctness (Property 4)
    - **Property 4: User lookup filter correctness**
    - For any query ≥2 chars and any list of active UserRecords, filtered results contain exactly users whose `name` includes the query as a case-insensitive substring
    - **Validates: Requirements 2.2**

- [ ] 5. Create `src/components/TimelinePanel.tsx`
  - [x] 5.1 Extract and refactor the timeline from `EventForm.tsx` into a standalone `TimelinePanel` component
    - Props: `record: EventRecord`, `activeTab: 'Status' | 'Feedback' | 'History'`, `onTabChange`
    - Status tab: render the existing four-node pipeline (unchanged logic, moved from `renderTimeline()`)
    - _Requirements: 4.1_

  - [-] 5.2 Implement Feedback tab in `TimelinePanel`
    - Iterate `record.feedbackEntries` in reverse-chronological order (sort by `timestamp` descending; same-timestamp ties broken by insertion index descending)
    - Render each entry as a card: type label (red for "Rejection", amber for "Revision Request"), author name, status-at-time badge, timestamp formatted `DD/MM/YYYY HH:MM`
    - Show "No feedback yet" empty state when `feedbackEntries` is empty or absent
    - _Requirements: 8.1, 8.2, 8.5_

  - [-] 5.3 Implement History tab in `TimelinePanel`
    - Iterate `record.auditTrail` in reverse-chronological order
    - Render each entry: `newStatus` badge using `statusConfig` colors, actor name + role, action label
    - For `actionLabel === 'Sent Back for Revision'`: prefix with "Revision Requested →" and apply the "Approved" badge color
    - Show comment in a visually distinct block (`bg-slate-50 rounded p-2`) when `comment` is non-empty
    - Show "No history yet" empty state when `auditTrail` is empty or absent
    - _Requirements: 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [ ]\* 5.4 Write unit tests for `TimelinePanel`
    - Test: "No feedback yet" shown when `feedbackEntries` is empty
    - Test: "No history yet" shown when `auditTrail` is empty
    - Test: "Sent Back for Revision" entry renders "Revision Requested →" prefix and "Approved" badge style
    - Test: status tab renders all four pipeline nodes
    - _Requirements: 8.2, 10.5, 10.6, 10.7_

  - [ ]\* 5.5 Write property test for Feedback tab rendering (Property 13)
    - **Property 13: Feedback tab renders all entries**
    - For any array of `FeedbackEntry` objects, the Feedback tab renders exactly that many cards, each containing type label, author name, status-at-time, and `DD/MM/YYYY HH:MM` timestamp
    - **Validates: Requirements 8.1**

  - [ ]\* 5.6 Write property test for Feedback reverse-chronological order (Property 14)
    - **Property 14: Feedback reverse-chronological order**
    - For any array of `FeedbackEntry` objects with varying timestamps, the tab renders them most-recent-first; ties broken by higher insertion index first
    - **Validates: Requirements 8.5**

  - [ ]\* 5.7 Write property test for Audit trail reverse-chronological order (Property 19)
    - **Property 19: Audit trail reverse-chronological order**
    - For any array of `AuditTrailEntry` objects with varying timestamps, the History tab renders them most-recent-first
    - **Validates: Requirements 10.3**

  - [ ]\* 5.8 Write property test for Audit trail status badge colors (Property 20)
    - **Property 20: Audit trail status badge colors**
    - For any `AuditTrailEntry` whose `newStatus` is defined in `statusConfig`, the badge rendered uses the CSS classes from `statusConfig`
    - **Validates: Requirements 10.6**

- [ ] 6. Create `src/components/OutcomeDraftPanel.tsx`
  - [ ] 6.1 Extract outcome editing UI from `EventForm.tsx`'s `renderOutcomeEditPanel()` into a standalone `OutcomeDraftPanel` component
    - Props: `category`, `values`, `onChange`, `onSaveDraft`, `onSubmit`, `onCancel`, `hasDraft`, `revisionComment?`, `attachmentGateError?`
    - Render "Draft in progress" banner above the form when `hasDraft` is true
    - Render "Revision Required: [comment]" banner at the top (above all fields) when `revisionComment` is non-empty
    - Render inline validation error adjacent to the report attachment field when `attachmentGateError` is set; add a ref to that field for programmatic scroll+focus
    - _Requirements: 3.5, 5.5, 6.3_

  - [~] 6.2 Add "Save Draft" button to `OutcomeDraftPanel`
    - Render "Save Draft" button alongside the existing "Submit for Final Review" button
    - Clicking "Save Draft" calls `onSaveDraft()`
    - _Requirements: 6.1_

- [~] 7. Checkpoint — Ensure all component stubs build without TypeScript errors
  - Verify `UserLookup`, `TimelinePanel`, and `OutcomeDraftPanel` compile cleanly
  - Ensure all new types in `src/types.ts` are exported and consumed correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Refactor `EventForm.tsx` — internal state extensions and helper functions
  - [~] 8.1 Add new internal state fields to `EventForm`
    - `categoryBeforeSwitch`, `showCategorySwitchModal`, `pendingCategorySwitch`
    - `showAttachmentWarning`, `attachmentGateError`
    - `lastSavedOutcome`, `showUnsavedChangesModal`, `pendingNavAction`
    - `activeTimelineTab: 'Status' | 'Feedback' | 'History'`
    - _Requirements: 5.1, 6.5, 9.1_

  - [~] 8.2 Add `currentUser` and `onNotify` props to `EventForm`
    - Extend `EventFormProps` with `currentUser?: { id: string; name: string; role: string }` and `onNotify?: (n: Omit<NotificationRecord, 'id'>) => void`
    - _Requirements: 1.1, 3.4_

  - [~] 8.3 Implement helper functions in `EventForm`
    - `buildAuditEntry(actionLabel, previousStatus, newStatus, comment?)` — constructs and appends `AuditTrailEntry` using `currentUser`; does NOT fire for Draft saves
    - `buildFeedbackEntry(type, comment)` — constructs and appends `FeedbackEntry` using `currentUser`
    - `hasUnsavedOutcomeChanges()` — compares current `outcomeForm` against `lastSavedOutcome`; returns boolean
    - `hasCategorySpecificData(record)` — checks all Event-specific or Visit-specific fields for non-empty values (string ≥1 char, number, or array ≥1 element)
    - `formatDateDMY(isoDate)` — converts `YYYY-MM-DD` to `DD/MM/YYYY`
    - `isOverdue(event)` — returns `status === 'Approved' && !!outcomeDueDate && outcomeDueDate < todayString`
    - _Requirements: 3.3, 6.5, 9.1, 10.1_

  - [ ]\* 8.4 Write property test for draft save preserves status (Property 10)
    - **Property 10: Draft save preserves status**
    - For any set of outcome field values, activating "Save Draft" persists all field values to EventRecord state without changing `status` (remains `'Approved'`)
    - **Validates: Requirements 6.2**

  - [ ]\* 8.5 Write property test for outcome draft round-trip (Property 11)
    - **Property 11: Outcome draft round-trip**
    - For any set of outcome field values saved as a draft, reopening the same EventRecord pre-populates all outcome fields with those exact saved values
    - **Validates: Requirements 6.3**

  - [ ]\* 8.6 Write property test for unsaved changes detection (Property 12)
    - **Property 12: Unsaved changes detection**
    - For any pair of (currentOutcomeState, lastSavedOutcomeState) where at least one field differs, the guard activates; when states are identical, the guard does not activate
    - **Validates: Requirements 6.5**

  - [ ]\* 8.7 Write property test for audit trail entry structure (Property 18)
    - **Property 18: Audit trail entry structure**
    - For any valid status-change action with any actor name/role, previous/new status, the appended `AuditTrailEntry` has non-empty `actorName`, `actorRole`, valid `actionLabel`, correct `previousStatus`, correct `newStatus`, and valid ISO 8601 `timestamp`
    - **Validates: Requirements 10.1**

- [ ] 9. Integrate `UserLookup` and due-date field into `EventForm`'s DG assignment panel
  - [~] 9.1 Replace the free-text assignment input with the `UserLookup` component
    - Pass `users` filtered to `status === 'Active'` from `src/data.ts`
    - Wire `onSelect` to set `assignedPerson = user.name` and `assignedPersonId = user.id`
    - Wire `onChange` to clear `assignedPersonId` on free-text modification
    - Pre-populate when `event.assignedPersonId` is already set on the record
    - _Requirements: 2.1, 2.3, 2.6_

  - [~] 9.2 Add "Outcome Due Date" date input to the assignment panel
    - Label: "Outcome Due Date"; input `type="date"`
    - Store selected value in local state `outcomeDueDate`
    - _Requirements: 7.1_

  - [~] 9.3 Add validation on "Verify & Assign" click
    - If `assignedPersonId` is unset while `value` is non-empty: show inline error "Selected person does not match a system user"
    - If `outcomeDueDate` is empty: show inline error "Outcome due date is required"
    - If `outcomeDueDate` is before today: show inline error "Due date must be today or in the future"
    - Both must pass before calling `handleDgApprove`
    - _Requirements: 2.4, 7.2, 7.6_

  - [~] 9.4 Update `handleDgApprove` to store `assignedPersonId` and `outcomeDueDate` on the record
    - Store `outcomeDueDate` as the ISO 8601 date string (YYYY-MM-DD) returned by the date input
    - Call `buildAuditEntry('Assigned', ...)` before calling `onSubmit`
    - Call `onNotify(...)` with the assigned user's `id` as addressee, deep-link, and record title
    - _Requirements: 1.1, 2.3, 7.3, 10.1_

  - [ ]\* 9.5 Write unit tests for assignment validation
    - Test: missing `assignedPersonId` with non-empty text shows inline error
    - Test: empty due date shows "Outcome due date is required"
    - Test: past due date shows "Due date must be today or in the future"
    - Test: valid selection with future due date calls `handleDgApprove`
    - _Requirements: 2.4, 7.2, 7.6_

  - [ ]\* 9.6 Write property test for user lookup validation (Property 5)
    - **Property 5: User lookup validation**
    - For any non-empty input text where `assignedPersonId` is undefined, validation returns an error and prevents the approval action
    - **Validates: Requirements 2.4**

  - [ ]\* 9.7 Write property test for due date validation (Property 7)
    - **Property 7: Due date validation**
    - For any date string strictly before today, validation fails with an error; for today or any future date, validation passes
    - **Validates: Requirements 7.2, 7.6**

  - [ ]\* 9.8 Write property test for due date storage format (Property 8)
    - **Property 8: Due date storage format**
    - For any valid confirmed due date, `outcomeDueDate` on EventRecord matches `^\d{4}-\d{2}-\d{2}$`
    - **Validates: Requirements 7.3**

  - [ ]\* 9.9 Write property test for due date display format (Property 9)
    - **Property 9: Due date display format**
    - For any valid ISO 8601 date-only string in `outcomeDueDate`, the formatted header value matches `DD/MM/YYYY`
    - **Validates: Requirements 7.5**

- [ ] 10. Add "Send Back for Revision" path in `EventForm` (Final Review)
  - [~] 10.1 Add "Send Back for Revision" button alongside "Complete Registration" when `canFinalReview` is true
    - Render both buttons in `renderHeader`
    - _Requirements: 3.1_

  - [~] 10.2 Implement `SendBackModal` inside `EventForm`
    - Reuse the existing `Modal` from `src/ui/Modal`; textarea for revision comment (1–500 characters)
    - Keep the confirm button disabled while textarea is empty; show inline error "Revision reason is required" on empty confirm attempt
    - _Requirements: 3.2, 3.6_

  - [~] 10.3 Wire "Send Back for Revision" confirmation
    - On confirm: call `buildFeedbackEntry('Revision Request', comment)`, call `buildAuditEntry('Sent Back for Revision', 'Pending Final Review', 'Approved', comment)`, then call `onSubmit({ ...formState, status: 'Approved', reviewComment: comment })`
    - Call `onNotify(...)` addressed to `assignedPersonId` with revision comment, record title, and deep-link
    - _Requirements: 3.3, 3.4, 8.4, 10.1_

  - [ ]\* 10.4 Write unit tests for Send Back for Revision
    - Test: status transitions to `'Approved'`; `reviewComment` is set
    - Test: `feedbackEntries` gains a new "Revision Request" entry
    - Test: `auditTrail` gains an entry with `actionLabel === 'Sent Back for Revision'`
    - _Requirements: 3.3, 8.4, 10.1_

  - [ ]\* 10.5 Write property test for revision modal confirm-button state (Property 6)
    - **Property 6: Revision modal confirm-button state**
    - For any string of length 0, the confirm button is disabled; for any string of length 1–500, the confirm button is enabled
    - **Validates: Requirements 3.2, 3.6**

- [ ] 11. Add rejection banner, audit trail entries, and feedback entries for Officer visibility in `EventForm`
  - [~] 11.1 Add rejection banner in `renderDetailView`
    - When `formState.status === 'Rejected'`: render a red alert banner above event details showing `reviewComment || 'No rejection reason provided'`
    - _Requirements: 4.5_

  - [~] 11.2 Ensure `handleDgReject` builds audit and feedback entries
    - Call `buildFeedbackEntry('Rejection', rejectReason)` before `onSubmit`
    - Call `buildAuditEntry('Rejected', 'Pending Review', 'Rejected', rejectReason)` before `onSubmit`
    - _Requirements: 4.2, 8.3, 10.1_

  - [~] 11.3 Ensure `submitWithStatus('Pending Review')` builds an audit entry
    - Call `buildAuditEntry('Submitted', 'Draft'|'Rejected', 'Pending Review')` before `onSubmit`
    - Do NOT call `buildAuditEntry` for `submitWithStatus('Draft')`
    - _Requirements: 10.1_

  - [~] 11.4 Ensure `handleFinalReviewComplete` builds an audit entry
    - Call `buildAuditEntry('Completed', 'Pending Final Review', 'Completed')` before `onSubmit`
    - _Requirements: 10.1_

  - [~] 11.5 Ensure `handleSubmitOutcome` builds an audit entry
    - Call `buildAuditEntry('Outcome Submitted', 'Approved', 'Pending Final Review')` before `onSubmit`
    - _Requirements: 10.1_

  - [ ]\* 11.6 Write unit tests for audit trail action labels
    - Test: Draft save → no `auditTrail` entry appended
    - Test: Submit → entry with `actionLabel: 'Submitted'`
    - Test: DG Approve → entry with `actionLabel: 'Approved'`
    - Test: DG Reject → entry with `actionLabel: 'Rejected'` and feedback entry of type "Rejection"
    - Test: Assign → entry with `actionLabel: 'Assigned'`
    - Test: Outcome submit → entry with `actionLabel: 'Outcome Submitted'`
    - Test: Final complete → entry with `actionLabel: 'Completed'`
    - Test: Send Back → entry with `actionLabel: 'Sent Back for Revision'`
    - _Requirements: 10.1_

- [ ] 12. Implement outcome draft save logic in `EventForm` / `OutcomeDraftPanel`
  - [~] 12.1 Wire `onSaveDraft` callback in `EventForm`
    - On "Save Draft": call `onSubmit({ ...formState, ...outcomeForm, hasOutcomeDraft: true })` without changing `status`
    - After submit: call `setLastSavedOutcome(snapshot)` and `toast.success('Draft saved', { duration: 3000 })`
    - On error path (if applicable): display `toast.error('Draft could not be saved. Please try again.')`
    - _Requirements: 6.2, 6.4, 6.6_

  - [~] 12.2 Pre-populate outcome fields from saved draft when reopening an Approved record
    - Initialize `outcomeForm` from `event` fields when `event.hasOutcomeDraft === true`
    - Pass `hasDraft={!!event.hasOutcomeDraft}` to `OutcomeDraftPanel`
    - _Requirements: 6.3_

  - [~] 12.3 Add navigation-away guard for unsaved outcome changes
    - Wrap the back button's `onCancel` action: if `hasUnsavedOutcomeChanges()` is true, show the unsaved changes modal instead of navigating
    - Modal message: "You have unsaved changes. Discard them?" with "Discard" (proceeds) and "Stay" (dismisses) actions
    - _Requirements: 6.5_

- [ ] 13. Implement attachment enforcement gates in `EventForm`
  - [~] 13.1 Add submit attachment warning for Officers
    - In `submitWithStatus('Pending Review')`: check if all attachment fields for the current category are empty; if so, set `showAttachmentWarning(true)` instead of calling `onSubmit`
    - Implement `AttachmentWarningModal` (using `Modal` from `src/ui/`): list all attachment field names; offer "Proceed Anyway" (calls `onSubmit`) and "Cancel" (dismisses)
    - _Requirements: 5.1, 5.2_

  - [~] 13.2 Add outcome submission report attachment gate
    - In `handleSubmitOutcome`: check `attachmentsEventReport` (Event) or `visitAttachmentsReport` (Visit); if empty, set `attachmentGateError(message)` and prevent `onSubmit`
    - Pass `attachmentGateError` to `OutcomeDraftPanel`; the panel scrolls the field into view and applies focus
    - _Requirements: 5.3, 5.4, 5.5_

  - [ ]\* 13.3 Write unit tests for attachment gates
    - Test: submit blocked when required report attachment missing; `attachmentGateError` shown
    - Test: warning dialog offered when all attachments empty; "Proceed Anyway" allows transition; "Cancel" prevents it
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 14. Implement category switch data-loss prevention in `EventForm`
  - [~] 14.1 Replace the `category` `<select>` `onChange` handler with `handleCategoryChange`
    - If `hasCategorySpecificData(formState)` is true when `category` changes: store `pendingCategorySwitch`, set `categoryBeforeSwitch`, and show the `CategorySwitchModal`
    - If all category-specific fields are empty defaults: switch immediately without modal
    - _Requirements: 9.1, 9.5_

  - [~] 14.2 Implement `CategorySwitchModal`
    - Message: "Switching from [current category] will clear all [current category] fields. Do you want to continue?"
    - "Switch & Clear" primary action: clear all old-category-specific fields to empty defaults (empty string / undefined / `[]`); leave shared fields untouched; apply `pendingCategorySwitch`
    - "Cancel" secondary action: revert `category` selector to value before change; leave all data unchanged
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ]\* 14.3 Write unit tests for category switch
    - Test: modal shown when at least one Event-specific field is non-empty
    - Test: modal skipped when all Event-specific fields are empty defaults
    - Test: "Switch & Clear" clears old category fields and retains shared fields
    - Test: "Cancel" is a complete no-op — `formState` identical to pre-change state
    - _Requirements: 9.1, 9.3, 9.4, 9.5_

  - [ ]\* 14.4 Write property test for category switch modal trigger (Property 15)
    - **Property 15: Category switch modal trigger**
    - For any form state with ≥1 non-empty field in the current category's specific field set, changing `category` shows the modal. For any state where all category-specific fields are empty defaults, it switches immediately.
    - **Validates: Requirements 9.1, 9.5**

  - [ ]\* 14.5 Write property test for category switch clears only old-category fields (Property 16)
    - **Property 16: Category switch clears only old-category fields**
    - For any form state with populated fields in both old and new category sets and populated shared fields, confirming "Switch & Clear" sets old-category fields to empty defaults and leaves shared fields unchanged
    - **Validates: Requirements 9.3**

  - [ ]\* 14.6 Write property test for category switch cancel is a no-op (Property 17)
    - **Property 17: Category switch cancel is a no-op**
    - For any form state, clicking "Cancel" in the modal leaves the entire `formState` object identical to its state before the category change was attempted
    - **Validates: Requirements 9.4**

- [ ] 15. Wire `TimelinePanel` and `OutcomeDraftPanel` into `EventForm`
  - [~] 15.1 Replace inline `renderTimeline()` call with `<TimelinePanel>` component
    - Pass `record={formState}`, `activeTab={activeTimelineTab}`, `onTabChange={setActiveTimelineTab}`
    - Ensure `TimelinePanel` is rendered in both preview and edit modes for all roles (Officers included)
    - _Requirements: 4.1, 8.1, 8.5, 10.2, 10.3_

  - [~] 15.2 Replace `renderOutcomeEditPanel()` with `<OutcomeDraftPanel>` component
    - Pass all required props: `category`, `values={outcomeForm}`, `onChange`, `onSaveDraft`, `onSubmit={handleSubmitOutcome}`, `onCancel`, `hasDraft`, `revisionComment`, `attachmentGateError`
    - Derive `revisionComment` from the most recent `feedbackEntries` entry of type `'Revision Request'`
    - _Requirements: 3.5, 6.1, 6.3_

  - [~] 15.3 Update `renderHeader` to show due date for Assigned Person
    - When `isAssignedPerson && formState.outcomeDueDate` is set, append "Outcome due by: DD/MM/YYYY" to the header subtitle using `formatDateDMY`
    - _Requirements: 7.5_

- [~] 16. Checkpoint — Full `EventForm` integration check
  - Verify all role-based conditions render correctly: Officer, DG, Assigned Person
  - Ensure all new modals (CategorySwitch, AttachmentWarning, SendBack, UnsavedChanges) open and close correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Update `EventsVisitsPage.tsx` — My Assignments filter, Overdue badge, and notification dispatch
  - [~] 17.1 Add "My Assignments" toggle and filtered/sorted list logic
    - Add `myAssignmentsOnly` state (default `false`) and derive `currentUser` from `useSelector(selectCurrentUser)`
    - Apply filter: `assignedPersonId === currentUser?.id && status === 'Approved'` when toggle is active
    - Sort filtered list by `outcomeDueDate` ascending; null/undefined `outcomeDueDate` values appear last
    - Show "My Assignments" toggle button in the toolbar only when `role === 'Assigned Person'`
    - Exclude records with `status === 'Pending Final Review'` or `'Completed'` from this filtered view
    - _Requirements: 1.2, 1.3, 1.5_

  - [~] 17.2 Add "Overdue" badge to the Status column in `DataTable`
    - Compute `isOverdue(event)` → `event.status === 'Approved' && !!event.outcomeDueDate && event.outcomeDueDate < todayString`
    - Render a red badge (`bg-red-100 text-red-700`) alongside the status badge in the Status cell when true
    - _Requirements: 7.4_

  - [~] 17.3 Wire `onNotify` callback from `EventsVisitsPage` to `EventForm`
    - Pass `currentUser` and `onNotify` props to `<EventForm>`
    - `onNotify` dispatches `addNotification` to the Redux store with the full `NotificationRecord` payload (excluding `id` — slice generates it)
    - _Requirements: 1.1, 1.4, 3.4_

  - [ ]\* 17.4 Write unit tests for `EventsVisitsPage` list behavior
    - Test: Overdue badge renders when `outcomeDueDate` is in the past and `status === 'Approved'`
    - Test: Overdue badge not rendered when due date is in the future
    - Test: "My Assignments" toggle only visible to `Assigned Person` role
    - Test: `Pending Final Review` and `Completed` records excluded from My Assignments filter
    - _Requirements: 1.2, 1.5, 7.4_

  - [ ]\* 17.5 Write property test for My Assignments filter correctness (Property 1)
    - **Property 1: My Assignments filter correctness**
    - For any array of EventRecords and any current user id, when the filter is applied every result has `assignedPersonId === currentUserId AND status === 'Approved'`; no qualifying record is absent
    - **Validates: Requirements 1.2, 1.5**

  - [ ]\* 17.6 Write property test for My Assignments sort order (Property 2)
    - **Property 2: My Assignments sort order**
    - For any list returned by the My Assignments filter, it is sorted by `outcomeDueDate` ascending; null/undefined values appear after all defined due dates
    - **Validates: Requirements 1.3**

  - [ ]\* 17.7 Write property test for notification badge increment (Property 3)
    - **Property 3: Notification badge increment**
    - For any initial notification array of length N addressed to a given user, after adding one new unread notification the computed unread count equals N + 1
    - **Validates: Requirements 1.4**

- [ ] 18. Integration wiring — end-to-end flows
  - [~] 18.1 Write integration test: Header badge updates when assignment notification dispatched
    - Render `Header` connected to the Redux store; dispatch `addNotification` via the events assignment flow; assert badge count increments
    - _Requirements: 1.4_

  - [~] 18.2 Write integration test: full DG approval path with My Assignments update
    - Render `EventsVisitsPage` with a seeded "Pending Review" record and a logged-in Assigned Person user
    - Simulate DG approval + assignment; assert notification is dispatched and My Assignments list updates to show the record
    - _Requirements: 1.1, 1.2, 2.3_

- [~] 19. Final checkpoint — Full regression and property test run
  - Run all unit, property-based, and integration tests with `npx vitest --run`
  - Ensure TypeScript compiles cleanly (`npx tsc --noEmit`)
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP delivery
- Each task references specific requirements for full traceability back to the spec
- Property tests use the `fast-check` library; tag each test file with the comment `// Feature: event-registration-workflow-enhancement, Property N: <text>`
- Checkpoints at tasks 7, 16, and 19 validate incremental correctness before proceeding to the next phase
- The design uses TypeScript exclusively — all new files must be `.ts` or `.tsx`
- No new UI libraries are introduced; use existing `src/ui/` primitives and `sonner` for toasts
- `src/data.ts` serves as the user lookup source; no API call is required

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.3"] },
    { "id": 2, "tasks": ["2.2", "3", "4.1", "5.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "4.4", "5.2", "5.3", "6.1"] },
    { "id": 4, "tasks": ["5.4", "5.5", "5.6", "5.7", "5.8", "6.2", "8.1", "8.2"] },
    { "id": 5, "tasks": ["8.3", "8.4", "8.5", "8.6", "8.7"] },
    {
      "id": 6,
      "tasks": [
        "9.1",
        "9.2",
        "10.1",
        "11.1",
        "11.2",
        "11.3",
        "11.4",
        "11.5",
        "12.1",
        "12.2",
        "13.1",
        "14.1"
      ]
    },
    {
      "id": 7,
      "tasks": [
        "9.3",
        "9.4",
        "9.5",
        "9.6",
        "9.7",
        "9.8",
        "9.9",
        "10.2",
        "10.3",
        "10.4",
        "10.5",
        "11.6",
        "12.3",
        "13.2",
        "14.2"
      ]
    },
    { "id": 8, "tasks": ["13.3", "14.3", "14.4", "14.5", "14.6", "15.1", "15.2", "15.3"] },
    { "id": 9, "tasks": ["17.1", "17.2", "17.3"] },
    { "id": 10, "tasks": ["17.4", "17.5", "17.6", "17.7", "18.1", "18.2"] }
  ]
}
```
