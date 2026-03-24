# CLAUDE.md — Binder & Billing CRM (Frontend)

> Single source of truth for assistant behavior and project rules.

---

## Assistant Behavior

- No greetings, affirmations, or filler
- No prompt repetition
- No unsolicited explanations
- Output final result only; reason internally
- Verify against existing patterns before changing structure

---

## Project Overview

Internal staff CRM: clients, binders, billing, tax, annual reports, VAT, notifications.
UI: Hebrew only. RTL default.
Roles: `ADVISOR` (full access), `SECRETARY` (operational, read-oriented).

Backend: `../backend/` — FastAPI + SQLAlchemy. API base: `http://localhost:8000`.
Migrations: Alembic (`../backend/alembic/`). Run migration after every model change.

---

## Commands

```bash
npm run dev
npm run typecheck   # strict, zero errors required
npm run lint        # zero warnings required
npm run arch:check
npm run arch:check:strict
npm run test
```

---

## Stack

- React 19, TypeScript 5 (strict), Vite 7, TailwindCSS v4
- React Query v5 · Zustand v5 (auth/session only)
- react-hook-form + Zod · Axios · react-router-dom v7
- Toasts: `src/utils/toast.ts` wrapper only — no direct `sonner` imports

---

## Architecture

```
Routes    → feature entrypoints from `src/features/*`
Pages     → composition shells inside each feature
Hooks     → state, filtering, mutations, data fetching
API       → feature-local typed API modules using shared Axios client
Components→ feature UI or shared UI/layout primitives
```

| Layer | Location | Responsibility |
|---|---|---|
| Router | `src/router/AppRoutes.tsx` | Route wiring and app shell composition |
| Feature entrypoints | `src/features/<name>/index.ts` | Public surface for cross-feature imports |
| Pages | `src/features/<name>/pages/` | Route-level composition only |
| Feature hooks | `src/features/<name>/hooks/` | Data-fetching, mutations, filters, page state |
| Feature API | `src/features/<name>/api/` | Typed backend calls, contracts, local query keys |
| Shared API | `src/api/` | Axios client, endpoints, query param helpers |
| Shared UI | `src/components/ui/` | Pure reusable UI only |
| Shared layout | `src/components/layout/` | Navbar, sidebar, page shell |
| Shared cross-feature UI | `src/components/shared/` | Shared domain widgets used across features |
| Global query keys | `src/lib/queryKeys.ts` | Cross-domain invalidation source of truth |

---

## Directory Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance — auth expiry handled here
│   ├── endpoints.ts       # ALL backend paths
│   └── queryParams.ts     # toQueryParams() — use for all query params
├── components/
│   ├── errors/
│   ├── layout/
│   ├── shared/
│   └── ui/
├── features/<name>/
│   ├── api/               # <feature>.api.ts, contracts.ts, queryKeys.ts, index.ts
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── constants.ts       # optional
│   ├── schemas.ts         # optional
│   ├── types.ts           # optional
│   └── index.ts           # public feature barrel
├── hooks/                 # shared hooks
├── lib/
│   ├── actions/
│   ├── queryClient.ts
│   └── queryKeys.ts
├── router/
├── store/                 # Zustand auth/session only
├── types/
├── utils/
└── constants/
```

Large features may use scoped subfolders inside `components/` such as `kanban/`, `panel/`, `financials/`, `shared/`.

---

## Rules

### Files & Structure

- Max **150 lines** per `.ts` / `.tsx` — split proactively when practical
- Arrow functions only — no `function` declarations
- All components are functional; `displayName` set when helpful for wrapped/forwarded components
- Props interface in same file as component, named `<ComponentName>Props`
- No class components except `AppErrorBoundary`
- Cross-feature imports must go through `src/features/<feature>/index.ts`
- Exception: cross-feature component imports are allowed for composition, but prefer the feature barrel when possible
- Feature-internal API, hooks, contracts, and query keys stay co-located under that feature

### Routing & Pages

- Route components live in `src/features/<feature>/pages/`
- Pages are composition shells only: assemble hooks and components, do not hide business logic in JSX
- `src/router/AppRoutes.tsx` imports feature entrypoints, not feature internals

### API & Data

- All HTTP goes through `src/api/client.ts` — no raw `fetch()`
- All backend paths belong in `src/api/endpoints.ts`
- All query params go through `toQueryParams()`
- Each feature owns its local `api/queryKeys.ts`
- `src/lib/queryKeys.ts` is the global registry for cross-domain invalidation
- When adding a new query key, update both the feature-local `queryKeys.ts` and `src/lib/queryKeys.ts`
- Query key shape stays stable and serializable: arrays only, include params objects for list keys

### Shared UI Boundaries

- `src/components/ui/` must stay pure
- Files in `src/components/ui/` must not import from `api/`, `@/api/`, or `@tanstack/react-query`
- Shared layout belongs in `src/components/layout/`
- Shared domain widgets used across features belong in `src/components/shared/`

### State

- No business logic in router or page shells
- No `localStorage` / `sessionStorage` outside `src/store/`
- No server data duplicated in Zustand
- Zustand is for auth/session state, not remote entity caches

### Authorization

- Role logic lives in hooks and dedicated auth helpers, not in API modules
- Frontend enforces UX; backend enforces authorization
- Missing-permission UI should be explicit, not silently hidden when a state needs explanation

### TypeScript

- `strict: true` — no `any`; use `unknown` and narrow explicitly
- `import type` for type-only imports
- Global/shared API infrastructure types belong in `src/types/` or `src/api/`
- Feature-specific contracts belong in `src/features/<feature>/api/contracts.ts`
- Feature-local view types belong in `src/features/<feature>/types.ts`

### Forms

- react-hook-form + Zod resolver — no manual validation flows
- Schemas stay next to the feature in `schemas.ts` unless they are API contracts
- Default values always provided to `useForm`
- Error messages in Hebrew

### Styling

- Tailwind only — no inline `style={{}}` unless unavoidable for third-party integration
- RTL defaults matter: prefer logical/right-aligned spacing and text alignment
- Conditional classes via `cn()` only
- Reuse shared UI primitives before creating one-off wrappers

### Language

- All user-facing text in Hebrew — labels, toasts, placeholders, validation, empty states

### Error Handling

- `toast.error(getErrorMessage(error, fallback))` for API failures
- 401 handling stays centralized in `src/api/client.ts`
- Do not duplicate auth-expiry handling in feature code

---

## Naming

| What | Convention | Example |
|---|---|---|
| Feature folders | camelCase | `annualReports` |
| Components | PascalCase | `ClientsFiltersBar.tsx` |
| Hooks | `use` + camelCase | `useClientsPage.ts` |
| Pages | `*Page.tsx` | `ClientsPage.tsx` |
| Feature API files | `<feature>.api.ts` | `clients.api.ts` |
| Feature contracts | `contracts.ts` | `api/contracts.ts` |
| Feature query keys | `queryKeys.ts` | `api/queryKeys.ts` |
| Feature barrel | `index.ts` | `features/clients/index.ts` |
| Constants | `constants.ts` or scoped `*.constants.ts` | `history.constants.ts` |
| Request types | `*Payload` / `*Params` | `CreateClientPayload` |
| Response types | `*Response` | `ClientListResponse` |
| Form types | `*FormValues` | `CreateClientFormValues` |

---

## Guardrails

- Run `npm run arch:check` after structural changes
- Run `npm run arch:check:strict` when touching cross-feature imports or barrels
- Do not bypass a feature barrel for hooks, API modules, contracts, or query keys
- Do not introduce a new top-level `src/pages/` or centralized domain API layer under `src/api/`
- Preserve existing alias usage such as `@/api/client`
