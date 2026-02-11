📘 Frontend Sprint 5 — Formal Specification

⸻

1. Status

Status: Draft — Requires Explicit Approval
This document defines the official scope of Frontend Sprint 5.

Sprint 5 builds on Sprints 1–4 and introduces controlled operational actions while preserving the architecture rules.

⸻

2. Purpose

Sprint 5 transitions the UI from:
Monitoring Interface  →  Operational Interface
The frontend will now allow:
	•	Triggering backend workflows
	•	Executing allowed actions
	•	Managing binder lifecycle from UI

WITHOUT introducing client-side domain logic.

⸻

3. Technology Stack (Frozen)
	•	React
	•	Vite
	•	TypeScript (strict)
	•	TailwindCSS (RTL only)
	•	Axios
	•	Zustand
	•	react-router-dom

Forbidden (Still)

❌ Redux / React Query
❌ UI frameworks
❌ Form libraries
❌ Animations
❌ Business logic in frontend

⸻

4. Architectural Principles (Non-Negotiable)

Frontend remains:
Renderer + Action Trigger ONLY

Backend decides:
	•	available_actions
	•	quick_actions
	•	permissions
	•	SLA logic
	•	workflow state

Frontend MUST:
	•	render only backend-provided actions
	•	never infer workflow transitions

⸻

5. Scope – In

⸻

5.1 Operational Action System (NEW CORE)

New Concept: Action Layer

Create feature domain:
src/features/actions/
Purpose

Centralize execution of:
	•	binder actions
	•	dashboard quick actions
	•	timeline operations

⸻

UI Requirements

Create reusable primitives:
ActionButton.tsx
ConfirmDialog.tsx
ActionModal.tsx

Rules:
	•	Button label comes from backend
	•	Action visibility comes from backend
	•	No hardcoded roles in UI

⸻

Endpoint Usage

Examples:
POST /binders/{id}/receive
POST /binders/{id}/ready
POST /binders/{id}/return
POST /charges/{id}/pay

Frontend responsibilities:
	•	send request
	•	show loading state
	•	refresh data

NOT:
	•	validate workflow rules

⸻

5.2 Dashboard Quick Actions (Expansion)

Extend existing Dashboard:

New Section:
Operational Panel

Shows:
	•	quick_actions[]
	•	attention actions

Example backend response:

{
  quick_actions: [
    { type: "receive_binder", binder_id: 10 }
  ]
}

Frontend:
	•	map actions → ActionButton
	•	execute via action layer

⸻

5.3 Timeline Interaction Layer

Extend Timeline Viewer:

Add support for:
	•	action buttons inside timeline events
	•	status indicators

Rules:
	•	timeline order stays backend-driven
	•	no sorting in UI

⸻

5.4 Binder Row Actions (Upgrade)

Binders table now supports:
	•	contextual action menu
	•	inline action buttons

Based ONLY on:
available_actions[]
Example:
available_actions: ["receive", "return"]

5.5 Global Action Feedback

Introduce:
GlobalToast.tsx

Used for:
	•	success confirmation
	•	backend error display

Rules:
	•	no animation classes
	•	no transitions

⸻

6. Scope – Out

Sprint 5 explicitly excludes:

❌ Form editing
❌ Bulk actions
❌ Client-side validation rules
❌ Offline state management
❌ Role-based routing logic
❌ Custom workflow engines

⸻

7. File Structure (Expected After Sprint 5)
src/
 ├─ features/
 │   ├─ dashboard/
 │   ├─ binders/
 │   ├─ clients/
 │   ├─ search/
 │   ├─ timeline/
 │   └─ actions/   ⭐ NEW
 │
 ├─ components/
 │   └─ ui/
 │
 ├─ stores/
 └─ services/

 8. Backend Alignment Requirements

Frontend MUST expect:
available_actions[]
quick_actions[]
work_state
sla_state
signals

Fallback rules:
	•	unknown enum → “—”
	•	missing action → render nothing

⸻

9. Language & Layout

Mandatory:
	•	Hebrew UI only
	•	RTL layout
	•	No English fallback text
	•	No LTR positioning assumptions

⸻

10. Deliverables

Sprint 5 is DONE when:

✅ Dashboard supports quick actions
✅ Binders rows execute backend actions
✅ Timeline supports operational actions
✅ Action layer exists under features/actions
✅ No business logic added to UI

⸻

11. Non-Goals

Sprint 5 does NOT:
	•	optimize performance
	•	introduce charts
	•	support mobile layouts
	•	redesign UI

⸻

12. Completion Criteria

Sprint 5 is complete when:
	•	All actions triggered via backend only
	•	Architecture remains thin pages + feature components
	•	File length ≤150 lines preserved
	•	Manual architecture review passes

⸻

✅ End of Document