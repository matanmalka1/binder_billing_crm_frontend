📘 Frontend Sprint 1 – Formal Specification

1. Status

Status: FROZEN
This document is the authoritative source of truth for Frontend Sprint 1.
Any deviation requires explicit approval.

⸻

2. Purpose

Sprint 1 establishes the frontend foundation for the Binder & Billing CRM.

The goal is to deliver:
	•	A working UI shell
	•	Authentication bootstrap
	•	Read-only visibility into core backend data
	•	A clean, extensible architecture for future sprints

Sprint 1 is not intended to deliver full UX, workflows, or interactivity.

⸻

3. Technology Stack (Frozen)

The following stack is mandatory and frozen:
	•	React
	•	Vite
	•	TypeScript (strict mode)
	•	TailwindCSS
	•	RTL enforced
	•	Hebrew language only
	•	Axios (HTTP client)
	•	Zustand (minimal global state)
	•	react-router-dom

Explicitly Forbidden
	•	❌ Gemini / any AI SDK
	•	❌ UI frameworks (MUI, Ant Design, Chakra, Mantine, etc.)
	•	❌ Redux / MobX / React Query
	•	❌ Form libraries (Formik, React Hook Form)
	•	❌ Chart libraries
	•	❌ Auth SDKs (Clerk, Firebase, Supabase)
	•	❌ Client-side business logic
	•	❌ Animations or advanced visual effects

⸻

4. Scope – In

4.1 Authentication (Bootstrap Only)

Allowed mutation:
POST /auth/login

Purpose:
	•	Obtain authentication token
	•	Bootstrap user session

Rules:
	•	This is the only allowed POST in Sprint 1
	•	No other domain mutations are permitted
	•	Logout may be client-side only (token discard)

⸻

4.2 Screens (Read-only)

Sprint 1 includes the following screens:

4.2.1 Login
	•	Email
	•	Password
	•	Login action via /auth/login
	•	Minimal validation (required fields only)

4.2.2 Dashboard (Read-only)
	•	Data source:
  GET /dashboard/overview

  	•	Displays summary counts only
	•	No charts
	•	No actions

4.2.3 Binders List (Read-only)
	•	Data source:
  GET /binders

  	•	Displays:
	•	Binder number
	•	Status
	•	days_in_office
	•	No filters
	•	No pagination

4.2.4 Clients List (Read-only)
	•	Data source:
  GET /clients
## 4. Folder Structure (Initial)

	•	Displays:
	•	Client name
	•	Client status
	•	Client type
	•	Pagination metadata may exist but is ignored in Sprint 1

⸻

5. Read-only Definition (Clarified)

Sprint 1 is read-only with one exception:
	•	Authentication (POST /auth/login) is allowed
	•	All domain data (clients, binders, dashboard, billing) is strictly read-only
	•	No POST / PATCH / DELETE beyond login

⸻

6. Architectural Principles

6.1 Responsibility Boundaries
	•	UI renders backend state only
	•	No business logic in components
	•	Pages may:
	•	Fetch their own data
	•	Handle loading and error states
	•	Dedicated data hooks/services are explicitly deferred to later sprints

6.2 State Management

Zustand may be used only for:
	•	Authentication state
	•	Global UI state (layout, loading)

No caching, persistence, or derived state is allowed.

⸻

7. Enums, Statuses & Localization

7.1 Backend Enums

Backend enum values:
	•	May be English
	•	May evolve over time

Rules in Sprint 1:
	•	Frontend must not assume full enum coverage
	•	Safe fallback rendering is required
	•	Raw enum leakage into UI labels should be avoided when possible

Examples:
	•	Known value → Hebrew label
	•	Unknown value → neutral placeholder (e.g. “—”)

Full enum mapping is deferred to later sprints.

⸻

8. Language & Layout
	•	Language: Hebrew only
	•	Layout: RTL only
	•	No English UI strings
	•	No LTR assumptions in spacing, alignment, or tooltips

⸻

9. Navigation & Auth Handling

Authentication failures may be handled via:
	•	Axios interceptors (hard redirect), or
	•	Router guards

Sprint 1 allows a mixed approach.
Navigation unification is deferred to a later sprint.

⸻

10. Folder Structure

The following structure is expected:

src/
├─ api/
├─ components/
│  ├─ ui/
│  └─ layout/
├─ pages/
├─ router/
├─ store/
├─ services/        (may be empty in Sprint 1)
├─ types/
├─ utils/
└─ main.tsx

Empty or placeholder folders are allowed and not considered dead architecture.

⸻

11. Out of Scope

Sprint 1 explicitly excludes:
	•	Editing or CRUD
	•	Search or filters
	•	Pagination logic
	•	Notifications UI
	•	Billing UI
	•	Role-based UI branching
	•	Advanced error handling
	•	UX polish
	•	Performance optimization

⸻

12. Known Technical Debt (Accepted)

The following are known and accepted in Sprint 1:
	•	Pages performing their own data fetching
	•	Permissive typing for backend enums
	•	Mixed navigation control (Axios + Router)
	•	Minor UI primitive inconsistencies

These items are not considered bugs.

⸻

13. Completion Criteria

Sprint 1 is considered DONE when:
	•	All listed screens render correctly
	•	Authentication bootstrap works
	•	No forbidden libraries are used
	•	No domain mutations exist
	•	Codebase is clean and extensible
	•	This specification is fully respected

⸻

End of Document