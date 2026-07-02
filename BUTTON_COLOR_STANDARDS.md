# Button Color Standards

This document defines the consistent color scheme used across all pages in the application.

## Color Standards

### Primary Actions (Submit, Next, Continue)

- **Color**: Orange `bg-[#ff9500]` with hover `hover:bg-[#e68a00]`
- **Usage**: Submit forms, Next step, Continue workflow
- **Examples**:
  - Officer pages: "Submit" button
  - Stepper forms: "Next" button
  - Modal confirmations for submissions

### Approve/Verify Actions

- **Color**: Green `bg-green-600` with hover `hover:bg-green-700`
- **Usage**: Approve, Verify, Confirm positive actions
- **Examples**:
  - KE Director: "Verify" button
  - Division Director: "Approve" button
  - Confirm modals for approvals

### Reject/Delete Actions

- **Color**: Red `bg-red-500` with hover `hover:bg-red-600`
- **Usage**: Reject, Delete, Deny actions
- **Examples**:
  - All director pages: "Reject" button
  - Delete confirmations
  - Negative decision actions

### View/Review/Navigate Actions

- **Color**: Navy `bg-[#161A61]` with hover `hover:bg-[#0f1347]`
- **Usage**: View details, Review items, Navigate to detail pages
- **Examples**:
  - Table action buttons: "View", "Review"
  - Navigation to detail views
  - Viewing submitted records

### Secondary Actions (Cancel, Back)

- **Color**: Gray outline `border-slate-300 bg-white text-slate-700`
- **Usage**: Cancel, Go back, Secondary navigation
- **Examples**:
  - Modal "Cancel" buttons
  - Form "Cancel" buttons
  - Back navigation

### Save Draft Actions

- **Color**: Navy outline `border-[#161A61] text-[#161A61]`
- **Usage**: Save draft without submitting
- **Examples**:
  - "Save Draft" in forms
  - Temporary save actions

## Status Badge Colors

- **Draft**: Orange `bg-orange-100 text-orange-800`
- **Pending**: Blue `bg-blue-100 text-blue-700`
- **Approved**: Green `bg-green-100 text-green-700`
- **Rejected**: Red `bg-red-100 text-red-700`
- **Verified**: Emerald `bg-emerald-100 text-emerald-700`
- **Completed**: Green `bg-green-100 text-green-700`

## Implementation Status

✅ All buttons are already consistently colored across:

- Agreement workflow pages (Officer, Legal Officer, KE Director)
- Partner workflow pages (Officer, KE Director, Division Director)
- Engagement workflow pages
- Opportunity workflow pages
- Event workflow pages

## Quick Reference

```tsx
// Primary/Submit - Orange
className = 'rounded-lg bg-[#ff9500] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e68a00]'

// Approve/Verify - Green
className = 'rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700'

// Reject/Delete - Red
className = 'rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600'

// View/Review - Navy
className =
  'rounded-lg bg-[#161A61] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0f1347]'

// Cancel/Secondary - Gray Outline
className =
  'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50'

// Save Draft - Navy Outline
className =
  'rounded-lg border border-[#161A61] px-5 py-2 text-sm font-semibold text-[#161A61] hover:bg-slate-50'
```
