Binder & Billing CRM — Frontend Roadmap
# 📘 Frontend Master Specification
## Binder & Billing CRM

---

## 1. Purpose

This document defines the **full frontend roadmap** across all planned sprints.

It serves as a high-level planning artifact describing:

- Which screens exist in each sprint
- What capability level the frontend reaches
- How responsibility evolves from read-only UI to operational workspace

This document does NOT replace sprint-level formal specifications.

Each sprint must have its own frozen specification before execution.

---

## 2. Core Principles (Frozen)

The frontend is a **backend-driven operational interface**.

Rules:

- Frontend is a dumb renderer
- No business logic in UI
- Backend owns workflows and decisions
- Hebrew only
- RTL only
- No animations
- No client-side SLA calculations

---

## 3. Technology Stack (Frozen)

- React
- Vite
- TypeScript (strict)
- TailwindCSS (RTL enforced)
- Axios
- Zustand (minimal state)
- react-router-dom

Forbidden:

- UI frameworks
- Gemini / AI SDKs
- Redux / MobX / React Query
- Form libraries (until defined in sprint)
- Chart libraries (until explicitly allowed)

---

## 4. Frontend Evolution Model

The frontend progresses through capability stages:

1. Read-only visibility
2. Operational monitoring
3. Guided interaction
4. Work execution surface
5. Operational tooling

---

## 5. Sprint Overview

---

### 🟩 Sprint 1 — Foundation & Read-Only Visibility

**Goal:** Connect frontend to backend and display core data.

Screens:

- Login
- Dashboard (summary)
- Binders list (read-only)
- Clients list (read-only)

Capabilities:

- Authentication
- Protected routes
- RTL Hebrew layout
- Primitive components

Level:

👉 Pure renderer

---

### 🟩 Sprint 2 — Operational Monitoring Layer

**Goal:** Improve navigation and visibility.

Enhancements:

- Dashboard operational counters
- Collapsible sidebar
- Tooltip navigation
- Extended table columns

Screens:

- Same Sprint 1 screens (enhanced)

Level:

👉 Monitoring UI

No editing.

---

### 🟨 Sprint 3 — Guided Interaction Surface (Planned)

Goal:

Introduce controlled operational actions without complex workflows.

Expected Screens:

- Binder Details page
- Client Details page

Capabilities:

- Action buttons (backend-driven)
- Status visualization
- Timeline preview (read-only)

Level:

👉 Assisted workflow UI

---

### 🟨 Sprint 4 — Operational Signals & Attention Layer

Goal:

Expose backend signals clearly to operators.

New Screens:

- Attention Dashboard
- Alerts View

Capabilities:

- Work State indicators
- SLA-based visual markers
- Notification visibility

Level:

👉 Operational assistant interface

---

### 🟧 Sprint 5 — Work Queue & Search Experience

Goal:

Enable faster operational navigation.

Screens:

- Work Queue
- Global Search

Capabilities:

- SLA filters
- Signal filters
- Work-state grouping

Level:

👉 Daily operational workspace

---

### 🟧 Sprint 6 — Timeline & Context Expansion

Goal:

Provide full operational context.

Screens:

- Client Timeline
- Binder Activity View

Capabilities:

- Cross-entity history
- Event aggregation
- Notification context display

Level:

👉 Deep operational context UI

---

### 🟥 Sprint 7 — Execution Surface (Light Actions)

Goal:

Introduce safe operational actions.

Screens:

- Binder Action Panel
- Charge visibility inside UI

Capabilities:

- Controlled backend-triggered actions
- Role-based button visibility
- Confirmation dialogs (simple)

Level:

👉 Operational control panel

---

## 6. What Frontend Will NEVER Do

- Compute SLA
- Run workflows
- Trigger background jobs
- Perform billing calculations
- Store domain state locally

---

## 7. Sprint Specification Rule

Before any sprint execution:

A dedicated document must exist:
SPRINT_X_FRONTEND_FORMAL_SPECIFICATION.md
This master document only describes direction.

---

## 8. Completion Definition

Frontend roadmap is considered complete when:

- All sprint screens exist
- Backend contract fully represented
- UI remains backend-driven
- No business logic leaks into UI

---

END OF DOCUMENT