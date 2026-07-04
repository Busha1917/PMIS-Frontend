# Collaboration Module - Complete Implementation Guide

## ✅ COMPLETED

### 1. Type Definitions

- ✅ Added all collaboration types to `src/types.ts`:
  - `CollaborationStatus`
  - `ProjectRecord` with milestones, deliverables, and risks
  - `ActivityRecord` with planned/actual outputs
  - `GrantRecord` for funding tracking
  - `ResourceContributionRecord` for dual-column contributions

### 2. State Management Stores

- ✅ Created `src/features/collaboration/projectStore.ts`
- ✅ Created `src/features/collaboration/activityStore.ts`
- ✅ Created `src/features/collaboration/grantStore.ts`
- ✅ Created `src/features/collaboration/contributionStore.ts`

### 3. Navigation

- ✅ Added collaboration pages to `AdminPage` type
- ✅ Updated Sidebar with Collaboration section and 4 sub-items

---

## 🔨 REMAINING TASKS

### Step 3: Create Shared Components

Create `src/features/collaboration/CollaborationTimeline.tsx`:

```typescript
// Vertical timeline showing Draft -> Pending Approval -> Approved/Rejected
// Similar to EngagementTimeline but for collaboration workflow
```

Create `src/features/collaboration/PartnerSelector.tsx`:

```typescript
// Dropdown to select from approved partners only
// Filters partnerStore for status === 'Approved'
```

### Step 4: Projects Module

Create `src/features/collaboration/ProjectsPage.tsx`:

- List all projects in DataTable
- Filter by status, partner
- "Add Project" button opens form
- View/Edit/Delete actions

Create `src/features/collaboration/ProjectForm.tsx`:

- Multi-step form (6 steps based on design):
  1. Partners & Team
  2. Project Details (name, description, thematic area)
  3. Budget & Funding
  4. Timeline (start/end dates)
  5. Milestones & Deliverables (dynamic arrays)
  6. Risks (ID, impact, description, mitigation)
- Progress bar showing `percentageCompletion`
- Save Draft / Submit for Approval buttons
- Status sidebar with timeline

### Step 5: Joint Activity Module

Create `src/features/collaboration/ActivitiesPage.tsx`:

- List all activities in DataTable
- "Add Activity" button

Create `src/features/collaboration/ActivityForm.tsx`:

- 3-step form:
  1. Activity Information (name, type, description, timeline)
  2. Responsibility Matrix (lead org, EAII unit, partner unit)
  3. Planned Outputs (checkboxes) + Actual Outputs + Attachments
- Detail view shows outputs as checked items
- Status sidebar

### Step 6: Funding & Grants Module

Create `src/features/collaboration/GrantsPage.tsx`:

- Financial ledger view
- DataTable with amount, currency, dates

Create `src/features/collaboration/GrantForm.tsx`:

- Simple single-page form:
  - Grant ID (auto)
  - Donor Name
  - Amount + Currency
  - Submission/Approval/End Dates
  - Description
- Status sidebar

### Step 7: Resource Contribution Module

Create `src/features/collaboration/ContributionsPage.tsx`:

- List showing both EAII and Partner contributions
- Summary total card

Create `src/features/collaboration/ContributionForm.tsx`:

- Dual-column layout:
  - Left: EAII Contributions (checkboxes + text fields for details)
    - Staff, Infrastructure, Funding, Equipment, Data Resources
  - Right: Partner Contributions
    - Staff, Funding, Technology, Equipment, Expertise
- Estimated Value section:
  - Monetary Value input
  - In-kind Value input
  - Auto-calculated Total Value
- Status sidebar

### Step 8: Director Approval Pages

Create `src/features/collaboration/DirectorProjectApprovalPage.tsx`:

- Shows projects with status 'Pending Approval'
- View project details
- Approve / Reject with reason buttons

Apply same pattern for:

- `DirectorActivityApprovalPage.tsx`
- `DirectorGrantApprovalPage.tsx`
- `DirectorContributionApprovalPage.tsx`

### Step 9: Update App.tsx Routing

Add lazy imports:

```typescript
const ProjectsPage = lazy(() => import('@/features/collaboration/ProjectsPage'))
const ActivitiesPage = lazy(() => import('@/features/collaboration/ActivitiesPage'))
const GrantsPage = lazy(() => import('@/features/collaboration/GrantsPage'))
const ContributionsPage = lazy(() => import('@/features/collaboration/ContributionsPage'))
```

Add route cases:

```typescript
case 'collaboration-projects':
  return <ProjectsPage />
case 'collaboration-activities':
  return <ActivitiesPage />
case 'collaboration-grants':
  return <GrantsPage />
case 'collaboration-contributions':
  return <ContributionsPage />
```

Add to `pageRoutes` object:

```typescript
'collaboration-projects': {
  path: '/collaboration/projects',
  title: 'Project Collaborations',
  description: 'Track programmatic tech project execution with partners',
},
// ... etc for other 3 pages
```

---

## 🎨 DESIGN SYSTEM REFERENCE

### Colors

- **Primary Navy**: `#161A61` (headers, primary buttons)
- **Secondary Navy**: `#2e3875` (form section headers)
- **Orange**: `#ff9500` (action buttons, timeline badges, left indicators)
- **Background**: `bg-slate-50` (canvas), `bg-white` (cards)

### Card Styling

```typescript
className = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
```

### Section Headers (Orange indicator)

```typescript
<div className="flex items-center gap-2 mb-5">
  <span className="w-1 h-5 rounded-full bg-[#ff9500] inline-block" />
  <h2 className="text-sm font-semibold text-[#2e3875]">{text}</h2>
</div>
```

### Input Fields

```typescript
className =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#161A61] focus:ring-2 focus:ring-[#161A61]/10 disabled:bg-slate-100'
```

### Button Styles

```typescript
// Primary (Orange)
className =
  'rounded-lg bg-[#ff9500] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e68a00]'

// Secondary (Navy)
className =
  'rounded-lg bg-[#161A61] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0f1347]'

// Outline
className =
  'rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
```

### Status Badges

Use existing `<StatusBadge status={record.status} />` component

### Timeline Component Structure

```typescript
<div className="flex items-start gap-3 border-l-2 border-slate-200 pl-4 pb-6">
  <div className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-white bg-[#ff9500]" />
  <div>
    <p className="text-xs font-semibold">Add Collaboration</p>
    <p className="text-[10px] text-slate-500">Focal Person</p>
    <div className="mt-2 rounded px-2 py-0.5 text-[10px] font-semibold bg-[#2e3875] text-white">
      Pending
    </div>
    <p className="mt-1 text-[10px] text-slate-400">Date: --/--/----</p>
  </div>
</div>
```

---

## 📋 VALIDATION RULES

### All Forms Must Validate:

- Partner selection (required)
- Name/Title fields (required, min 3 chars)
- Dates: start date < end date
- Budget/Amount: numeric, > 0
- Before Submit: show error toast if validation fails

### Status Flow:

1. **Draft** → Focal Person can edit
2. **Pending Approval** → Read-only, awaiting Director
3. **Approved** → Read-only, marked as approved
4. **Rejected** → Reverts to Draft, shows rejection reason

---

## 🔗 PARTNER LINKING

### Partner Selector Component:

```typescript
import { partnerStore } from '../partners/partnerStore'

const approvedPartners = partnerStore.getAll().filter(p => p.status === 'Approved')

<select value={partnerId} onChange={e => setPartnerId(e.target.value)}>
  <option value="">Select Partner</option>
  {approvedPartners.map(p => (
    <option key={p.id} value={p.id}>{p.name}</option>
  ))}
</select>
```

---

## 🧪 TESTING WORKFLOW

1. Approve a partner in Partners module
2. Navigate to Collaboration > Projects
3. Click "Add Project"
4. Select approved partner from dropdown
5. Fill multi-step form
6. Submit for approval
7. Navigate to Director approval page
8. Approve project
9. Verify status updated to "Approved"

---

## 📦 COMPONENT STRUCTURE

```
src/features/collaboration/
├── projectStore.ts ✅
├── activityStore.ts ✅
├── grantStore.ts ✅
├── contributionStore.ts ✅
├── CollaborationTimeline.tsx ⏳
├── PartnerSelector.tsx ⏳
├── ProjectsPage.tsx ⏳
├── ProjectForm.tsx ⏳
├── ActivitiesPage.tsx ⏳
├── ActivityForm.tsx ⏳
├── GrantsPage.tsx ⏳
├── GrantForm.tsx ⏳
├── ContributionsPage.tsx ⏳
├── ContributionForm.tsx ⏳
├── DirectorProjectApprovalPage.tsx ⏳
├── DirectorActivityApprovalPage.tsx ⏳
├── DirectorGrantApprovalPage.tsx ⏳
└── DirectorContributionApprovalPage.tsx ⏳
```

---

## 💡 IMPLEMENTATION NOTES

- Reuse existing components: `DataTable`, `PageToolbar`, `PageHeaderCard`, `StatusBadge`, `Modal`, `Button`
- Follow patterns from Engagement/Agreement modules for form structure
- Use `toast` from 'sonner' for success/error messages
- Subscribe to stores in `useEffect` for real-time updates
- Keep forms responsive: grid layouts that collapse on mobile

---

This guide provides the complete blueprint for implementing the Collaboration Module following the EAII PMIS design system.
