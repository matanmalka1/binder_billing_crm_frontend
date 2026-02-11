# 📘 Frontend Sprint 3 - Formal Specification

---

## 1. Status
**Status:** FINAL / FROZEN

This document defines the official scope for Frontend Sprint 3.  
Any feature not explicitly written here is out of scope.

---

## 2. Purpose
Sprint 3 transitions the frontend from a read-only monitoring UI into a controlled operational interface.

The goal is:
- Enable operational actions from UI
- Preserve backend as single source of truth
- Maintain zero business logic in frontend

Frontend acts only as:
`Event Trigger Layer + Data Renderer`

---

## 3. Technology Stack (Frozen)
- React
- Vite
- TypeScript (strict mode)
- TailwindCSS (RTL enforced)
- Axios
- Zustand (minimal usage)
- react-router-dom

### Explicitly Forbidden
- UI Frameworks (MUI / Ant / Chakra / Mantine)
- Redux / MobX / React Query
- Form libraries
- Charts / analytics libs
- Client-side SLA logic
- Animations / transitions
- AI SDKs (Gemini / OpenAI / Copilot runtime)

---

## 4. Scope - In

### 4.1 Binder Operational Actions
Screen: Binders Page

New capabilities:
- Receive Binder
- Mark Ready for Pickup
- Return Binder

Endpoints (example structure):
- POST /binders/{id}/receive
- POST /binders/{id}/ready
- POST /binders/{id}/return

Rules:
- No status logic in UI
- Button visibility is backend-driven
- UI only renders available actions

### 4.2 Client Operational Actions
Screen: Clients Page

Allowed actions:
- Freeze Client
- Activate Client

Rules:
- UI sends intent only
- No state derivation locally
- Status labels remain mapped via enum translators

### 4.3 Dashboard Action Surface
Dashboard remains mostly read-only but may include:
- Quick action buttons (operational triggers)
- Attention indicators (render only)

No calculations allowed.

### 4.4 Work State Rendering
Frontend receives derived fields such as:
- work_state
- signals
- sla_state

Frontend responsibilities:
- Render badges
- Apply Hebrew labels
- Show fallback "—" for unknown values

### 4.5 UI Primitives Extension
New primitives allowed:
- Modal
- ConfirmDialog
- ActionButton

Rules:
- Stateless
- No domain knowledge
- Pure UI components

---

## 5. Scope - Out
Sprint 3 explicitly excludes:
- Bulk actions
- Notifications triggering
- Billing mutations
- Upload flows
- Search filters (advanced)
- Pagination logic
- Charts
- Workflow engines
- Role-based UI branching

---

## 6. Architectural Principles
Frontend must maintain:

### 6.1 Dumb UI Policy
- No SLA logic
- No workflow logic
- No derived business decisions

### 6.2 Layer Separation
UI Component  
-> Page Handler  
-> API Client  
-> Backend

### 6.3 Mutation Rules
Frontend may:
- Trigger events

Frontend may NOT:
- Decide domain transitions

---

## 7. State Management Rules
Zustand usage allowed only for:
- Auth state
- UI layout state
- Loading state

Forbidden:
- Entity caching
- Derived domain state

---

## 8. Language & Layout
- Hebrew only UI
- RTL only
- No English fallback text
- Unknown enum values render: "—"

---

## 9. File Structure Expectations
```text
src/
  components/
    primitives/
      Button
      Modal
      Badge
  features/
    binders/
    clients/
    dashboard/
  api/
  stores/
```

No business logic allowed in primitives.

---

## 10. Deliverables
Sprint 3 is complete when:
- Binder actions trigger backend correctly
- Client actions work via API
- No UI logic added
- All mutations handled via axios client
- Hebrew + RTL preserved

---

## 11. Non-Goals
Sprint 3 does NOT aim to:
- Improve UX polish
- Add animations
- Optimize performance
- Add mobile support
- Implement search or filters

---

## 12. Completion Criteria
Sprint 3 is DONE when:
- Manual review passes
- No forbidden libraries exist
- No client-side business logic detected
- Build passes
- TypeScript strict passes

---

## 13. Sprint Transition
After Sprint 3 completion, frontend becomes:  
`Operational UI Layer`

Ready for:
- Sprint 4 - Signals & Attention UX
- Sprint 5 - Production Hardening (Frontend)

---

End of Document
