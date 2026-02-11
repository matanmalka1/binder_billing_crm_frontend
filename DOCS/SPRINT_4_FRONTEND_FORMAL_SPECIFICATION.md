# Frontend Sprint 4 - Formal Specification

## 1. Status
**Status:** ACTIVE SPECIFICATION

This document defines the authoritative scope for Frontend Sprint 4.

Sprint 4 transforms the frontend from an action-capable UI (Sprint 3) into a true operational workspace aligned with Backend Sprint 6.

Any deviation requires explicit approval.

---

## 2. Purpose
Sprint 4 introduces Operational Flows + Work Queue UI.

### Goals
- Convert binder actions into structured operational flows
- Surface backend `work_state` + `signals` visually
- Introduce work-queue driven workflow
- Maintain strict separation: UI renders backend logic only

### Sprint 4 Does Not Introduce
- Client-side business logic
- Optimistic state mutations
- Heavy UX polish
- Complex state machines

---

## 3. Technology Stack (Frozen)
- React
- Vite
- TypeScript (strict)
- TailwindCSS (RTL enforced)
- Axios
- Zustand (auth + ui only)
- `react-router-dom`

### Explicitly Forbidden
- UI frameworks (MUI, Ant, Chakra, etc.)
- React Query / Redux / MobX
- Form libraries
- Chart libraries
- Animations / transitions
- Client-side SLA calculations
- Gemini / AI SDK integrations

---

## 4. Architectural Principles
Frontend remains: **DUMB RENDERER**

### Rules
- All business logic lives in backend
- Pages = orchestration only
- Features live under: `src/features/<domain>/`
- Primitives remain under: `src/components/ui/`
- API calls must go through: `src/api/client.ts`

---

## 5. Scope - In

### 5.1 Binder Operational Flows
Existing Sprint 3 actions evolve into structured flows.

**Affected screens**
- Binders page
- Dashboard quick actions

**Supported actions**
- Receive Binder
- Mark Ready For Pickup
- Return Binder

**UI requirements**
- Use `Modal` primitive
- Use `ConfirmDialog` for destructive actions
- No inline mutation buttons without confirmation

**Data source**
- Backend fields:
  - `available_actions`
  - `quick_actions`
  - `work_state`
  - `signals`
  - `sla_state`
- Frontend must not derive logic

### 5.2 Work Queue Screen (NEW)
**Route:** `/dashboard/work-queue`  
**Endpoint:** `GET /dashboard/work-queue`

**Purpose**
- Operational attention view showing:
  - Clients needing action
  - Overdue binders
  - SLA risks
  - Signals

**Rendering rules**
- Table/Card hybrid layout
- Color indicators allowed (no animations)
- Unknown enum -> render `—`

### 5.3 Signals Visualization
Signals already exist in backend.

**Frontend adds**
- Signal badges
- SLA visual indicators
- Work state label

**Supported visual elements**
- `Badge` (existing primitive)
- `StatusLabel` component (feature-level)

**Not allowed**
- Charts
- Graphs
- Client-side SLA computation

### 5.4 Client Timeline View (NEW)
**Route:** `/clients/:client_id/timeline`  
**Endpoint:** `GET /clients/{client_id}/timeline`

**Scope**
- Read-only event stream

**Rendering**
- Chronological list
- Event type label
- Timestamp
- Description

**Not allowed**
- Editing
- Collapsing animations
- Filtering

### 5.5 Feature Architecture Enforcement
New components must live under:
- `src/features/dashboard/`
- `src/features/binders/`
- `src/features/clients/`

Pages remain orchestration-only.

---

## 6. Scope - Out
Sprint 4 explicitly excludes:
- Bulk actions
- Editing forms
- Pagination logic
- Search filters
- Client-side workflows
- Role-based UI branching
- Notifications UI
- Analytics / Observability UI

---

## 7. UI & Language Rules
- Hebrew only
- RTL only
- No English fallback text
- Unknown enum values -> `—`
- No hover animations
- No transitions

---

## 8. File Discipline
Hard rules:
- `<=150` lines per file
- No circular imports
- No business logic inside pages
- No domain logic inside primitives

---

## 9. Deliverables
Sprint 4 is complete when:
- Binder flows use modal-based actions
- Work Queue screen renders backend data
- Timeline screen implemented
- Signals visually rendered
- Feature architecture preserved
- Sprint 1-3 functionality intact

---

## 10. Completion Criteria
Sprint 4 is DONE when:
- TypeScript strict passes
- Build passes
- Manual UI review passes
- No forbidden dependencies introduced
- API alignment verified

---

## 11. Non-Goals
Sprint 4 does not aim to:
- Introduce complex state management
- Add mobile responsiveness
- Redesign layout
- Implement performance optimizations

---

End of Document
