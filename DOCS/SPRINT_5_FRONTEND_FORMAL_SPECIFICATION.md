# Frontend Sprint 5 - Formal Specification

## 1. Status
**Status:** DRAFT - REQUIRES EXPLICIT APPROVAL

This document defines the official scope for Frontend Sprint 5.
Sprint 5 builds on Sprints 1-4 and introduces controlled operational actions while preserving architecture rules.

---

## 2. Purpose
Sprint 5 transitions the UI from monitoring interface to operational interface.

The frontend now allows:
- Triggering backend workflows through approved endpoints
- Executing backend-allowed actions
- Managing binder lifecycle actions from UI

Without introducing client-side domain logic.

---

## 3. Technology Stack (Frozen)
- React
- Vite
- TypeScript (strict)
- TailwindCSS (RTL only)
- Axios
- Zustand
- react-router-dom

### Forbidden (Still)
- Redux / React Query
- UI frameworks
- Form libraries
- Animations
- Business logic in frontend

---

## 4. Architectural Principles (Non-Negotiable)
Frontend remains: **Renderer + Action Trigger Only**

Backend decides:
- `available_actions`
- `quick_actions`
- `permissions`
- SLA logic
- Workflow state

Frontend must:
- Render only backend-provided actions
- Never infer workflow transitions

---

## 5. Scope - In

### 5.1 Operational Action System (New Core)
New concept: **Action Layer**

Create feature domain: `src/features/actions/`

Purpose:
- Centralize execution of binder actions
- Centralize execution of dashboard quick actions
- Centralize execution of timeline operations

UI requirements:
- Create reusable primitives:
  - `ActionButton.tsx`
  - `ConfirmDialog.tsx`
  - `ActionModal.tsx`
- Button label comes from backend
- Action visibility comes from backend
- No hardcoded roles in UI

Endpoint usage examples:
```text
POST /binders/{id}/receive
POST /binders/{id}/ready
POST /binders/{id}/return
POST /charges/{id}/pay
```

Frontend responsibilities:
- Send request
- Show loading state
- Refresh data

Frontend must not:
- Validate workflow rules

### 5.2 Dashboard Quick Actions (Expansion)
Extend existing Dashboard with a new section: **Operational Panel**

Shows:
- `quick_actions[]`
- Attention actions

Example backend response:
```json
{
  "quick_actions": [
    { "type": "receive_binder", "binder_id": 10 }
  ]
}
```

Frontend:
- Map actions to `ActionButton`
- Execute actions via action layer

### 5.3 Timeline Interaction Layer
Extend Timeline Viewer with:
- Action buttons inside timeline events
- Status indicators

Rules:
- Timeline order stays backend-driven
- No sorting in UI

### 5.4 Binder Row Actions (Upgrade)
Binders table supports:
- Contextual action menu
- Inline action buttons

Based only on `available_actions[]`.

Example:
```json
{ "available_actions": ["receive", "return"] }
```

### 5.5 Global Action Feedback
Introduce: `GlobalToast.tsx`

Used for:
- Success confirmation
- Backend error display

Rules:
- No animation classes
- No transitions

---

## 6. Scope - Out
Sprint 5 explicitly excludes:
- Form editing
- Bulk actions
- Client-side validation rules
- Offline state management
- Role-based routing logic
- Custom workflow engines

---

## 7. File Structure (Expected After Sprint 5)
```text
src/
  features/
    dashboard/
    binders/
    clients/
    search/
    timeline/
    actions/      # NEW

  components/
    ui/

  stores/
  services/
```

---

## 8. Backend Alignment Requirements
Frontend must expect:
- `available_actions[]`
- `quick_actions[]`
- `work_state`
- `sla_state`
- `signals`

Fallback rules:
- Unknown enum -> `—`
- Missing action -> render nothing

---

## 9. Language and Layout
Mandatory:
- Hebrew UI only
- RTL layout
- No English fallback text
- No LTR positioning assumptions

---

## 10. Deliverables
Sprint 5 is done when:
- Dashboard supports quick actions
- Binder rows execute backend actions
- Timeline supports operational actions
- Action layer exists under `src/features/actions`
- No business logic added to UI

---

## 11. Non-Goals
Sprint 5 does not:
- Optimize performance
- Introduce charts
- Support mobile layouts
- Redesign UI

---

## 12. Completion Criteria
Sprint 5 is complete when:
- All actions are triggered via backend only
- Architecture remains thin pages + feature components
- File length <=150 lines is preserved for implementation files
- Manual architecture review passes

---

End of Document
