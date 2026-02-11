# 📘 Frontend Sprint 2 – Formal Specification

---

## 1. Status
**Status:** FINAL / FROZEN  
This document is the authoritative source of truth for Frontend Sprint 2.  
Any change requires explicit approval.

---

## 2. Purpose
Sprint 2 extends the frontend from basic read-only visibility into an **operational monitoring interface**.

Primary goals:

- Improve navigation efficiency
- Surface operational visibility from backend data
- Enhance clarity without introducing interaction logic

Sprint 2 remains **strictly read-only**.

No editing, workflows, or client-side decisions are introduced.

---

## 3. Technology Stack (Frozen)

- React
- Vite
- TypeScript (strict mode)
- TailwindCSS  
  - RTL enforced  
  - Hebrew language only
- Axios (HTTP client)
- Zustand (minimal global state)
- react-router-dom

### Explicitly Forbidden

- ❌ UI frameworks (MUI, Ant Design, Chakra, Mantine, etc.)
- ❌ Redux / MobX / React Query
- ❌ Form libraries
- ❌ Chart libraries
- ❌ Client-side business logic
- ❌ Animations or advanced UI effects

---

## 4. Scope – In

### 4.1 Dashboard Enhancements (Read-only)

**Endpoint:**  
GET /dashboard/overview

Enhancements:

- Preserve Sprint 1 counters
- Display operational counters provided by backend:
  - `overdue_binders`
  - `binders_due_today`
  - `binders_due_this_week`

Rules:

- No charts
- No derived logic in frontend
- UI renders backend response only

---

### 4.2 Navigation Improvements

Scope:

- Collapsible sidebar (expanded / collapsed)
- Hover tooltip labels when sidebar is collapsed
- Existing routes remain unchanged

Rules:

- No new screens
- No additional API calls
- No role-based navigation branching

---

### 4.3 Table Enhancements (Read-only)

Scope:

Extend existing tables with already implemented fields:

Binders table:
- `received_at`
- `expected_return_at`

Clients table:
- `id_number`
- `phone`
- `opened_at`

Rules:

- No editing
- No filters
- No pagination logic
- No client-side transformations

---

## 5. Scope – Out

Sprint 2 explicitly excludes:

- POST / PATCH / DELETE (except authentication)
- Forms or editing workflows
- Bulk actions
- Notification triggering
- SLA calculations in UI
- Role-based UI branching
- Animations or visual polish beyond functional layout

---

## 6. Architectural Principles

- Frontend is a **dumb renderer**
- Backend owns all domain logic
- Pages remain thin
- Components are reusable primitives
- Zustand allowed only for:
  - Authentication state
  - Global UI layout state

---

## 7. Language & Layout

- Language: **Hebrew only**
- Layout: **RTL only**
- No English UI text
- No LTR positioning assumptions

---

## 8. Deliverables

Sprint 2 is complete when:

- Dashboard renders enhanced operational counters
- Sidebar collapsible behavior works
- Tables display extended fields
- No forbidden libraries exist
- No frontend business logic is introduced
- Sprint 1 functionality remains intact

---

## 9. Non-Goals

Sprint 2 does not attempt to:

- Optimize performance
- Support mobile layouts
- Introduce advanced UX
- Handle complex edge cases beyond backend response

---

## 10. Completion Criteria

Sprint 2 is considered DONE when:

- Code matches this specification
- Scope remains contained
- Manual review passes
- Project is ready for Sprint 3 (interactive actions phase)

---

**End of Document**