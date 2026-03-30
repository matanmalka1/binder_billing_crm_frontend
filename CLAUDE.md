# CLAUDE.md — Binder & Billing CRM (Frontend)

> Single source of truth for assistant behavior and project rules.

---

## Assistant Behavior

- No greetings, affirmations, or filler
- No prompt repetition
- No unsolicited explanations
- Output final result only; reason internally
- Verify against existing code patterns before changing structure
- Prefer the current repo shape over historical assumptions

---

## Project Overview

Internal staff CRM: clients,binders, billing, tax businesses, charges, VAT, annual reports, reminders, notifications, signing, correspondence, and tax workflows.
UI is Hebrew-first with RTL defaults.
Roles are lowercase string values: `advisor`, `secretary`.

Backend: `../backend/` — FastAPI + SQLAlchemy.
Frontend API base defaults to `http://localhost:8000/api/v1` unless `VITE_API_BASE_URL` overrides it.

---

## Commands

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run arch:check
npm run arch:check:strict
npm run test
```

---

## Stack

- React 19, TypeScript 5, Vite 7, TailwindCSS v4
- React Query v5 for server state
- Zustand v5 for auth/session state only
- react-hook-form + Zod for forms
- Axios for HTTP
- react-router-dom v7
- sonner for toasts

---

## Architecture

```
main.tsx      -> app bootstrap, QueryClientProvider, BrowserRouter, AppErrorBoundary, Toaster
router/       -> route wiring, auth-expiry redirect handling, authenticated layout
features/*    -> primary domain modules with local api/hooks/components/pages
components/*  -> shared UI, layout, and cross-feature widgets
api/          -> thin shared transport/auth layer, auth API, query param helpers
store/        -> persisted auth/session state only
lib/actions/  -> action runtime and shared action helpers
```

### Core Shape

| Layer | Location | Responsibility |
|---|---|---|
| App bootstrap | `src/main.tsx` | Root render, providers, suspense, global toaster |
| Router | `src/router/AppRoutes.tsx` | Route tree, guarded layout, auth expiry navigation |
| Shared API core | `src/api/` | Axios client, auth API, shared contracts, query param helpers, core endpoints |
| Feature modules | `src/features/<name>/` | Domain-specific UI, hooks, endpoints, contracts, query keys |
| Shared UI | `src/components/ui/` | Reusable presentational primitives and generic interaction components |
| Shared layout | `src/components/layout/` | Navbar, sidebar, page shell, page headers |
| Shared domain widgets | `src/components/shared/` | Cross-feature widgets reused in multiple domains |
| Shared hooks | `src/hooks/` | Generic hooks such as filters, debounce, role helpers |
| Store | `src/store/` | Auth/session persistence and selectors |

### Important Architectural Reality

- `src/api/` is a thin shared layer, not a centralized domain API registry
- Backend endpoint constants are usually feature-local under `src/features/<feature>/api/endpoints.ts`
- Query keys are feature-local under `src/features/<feature>/api/queryKeys.ts`
- There is no global `src/lib/queryKeys.ts`
- The `businesses` feature acts as an integration shell that composes tabs from multiple other features

---

## Directory Structure

```
src/
├── api/
│   ├── auth.api.ts
│   ├── client.ts
│   ├── contracts.ts
│   ├── core-endpoints.ts
│   └── queryParams.ts
├── components/
│   ├── errors/
│   ├── layout/
│   ├── shared/
│   └── ui/
├── constants/
├── features/<name>/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── constants.ts or *.constants.ts
│   ├── schemas.ts
│   ├── types.ts
│   └── index.ts
├── hooks/
├── lib/
│   ├── actions/
│   └── queryClient.ts
├── router/
├── store/
├── types/
└── utils/
```

Large features may have nested component folders such as `kanban/`, `panel/`, `financials/`, `statusTransition/`, or `shared/`.

---

## Current Feature Surface

Active top-level feature folders currently include:

- `actions`
- `advancedPayments`
- `annualReports`
- `auth`
- `authorityContacts`
- `binders`
- `businesses`
- `charges`
- `clients`
- `correspondence`
- `dashboard`
- `documents`
- `importExport`
- `notifications`
- `reminders`
- `reports`
- `search`
- `signatureRequests`
- `signing`
- `taxDashboard`
- `taxDeadlines`
- `taxProfile`
- `timeline`
- `users`
- `vatReports`

---

## Rules

### Files & Structure

- Prefer small files, but do not assume a hard 150-line limit; follow existing local patterns when splitting
- Arrow functions only — no `function` declarations
- Components are functional; `AppErrorBoundary` is the class-component exception
- Feature-internal API, contracts, and query keys stay co-located under that feature
- External imports into a feature should prefer that feature's `index.ts` barrel

### Routing & Pages

- Route components live in `src/features/<feature>/pages/` when the feature exposes a route
- Pages should stay composition-focused and delegate fetching/mutations/state to hooks where practical
- `src/router/AppRoutes.tsx` should import feature entrypoints rather than deep feature internals
- Route-level layout and auth guards stay in the router layer

### API & Data

- All HTTP goes through the shared Axios client in `src/api/client.ts`
- Prefer feature-local endpoint maps under `src/features/<feature>/api/endpoints.ts`
- Use `toQueryParams()` for query-string construction
- Keep query key factories in feature-local `api/queryKeys.ts`
- Query keys should stay serializable and stable
- Avoid raw `fetch()` unless there is a strong reason and an established pattern

### Shared UI Boundaries

- `src/components/ui/` must stay free of feature-specific business logic
- `src/components/ui/` must not import from feature API modules or React Query
- Shared layout belongs in `src/components/layout/`
- Shared cross-feature widgets belong in `src/components/shared/`

### State

- Zustand is for auth/session state, not server entity caches
- Server data belongs in React Query
- `localStorage` and `sessionStorage` access is primarily concentrated in `src/store/` and auth expiry cleanup in `src/api/client.ts`

### Authorization

- Role helpers live in hooks and auth-related modules
- Frontend authorization is a UX layer; backend remains the source of truth
- Use explicit permission-aware UI where denial needs explanation

### TypeScript

- Keep strict typing; avoid `any`
- Use `import type` for type-only imports
- Shared transport/infrastructure types belong in `src/api/` or `src/types/`
- Feature-specific request/response contracts belong in `src/features/<feature>/api/contracts.ts`
- Feature-local UI/view types belong in `src/features/<feature>/types.ts`

### Forms

- Prefer react-hook-form + Zod
- Keep schemas close to the owning feature
- Provide explicit default values to `useForm`
- Validation and error text should be Hebrew-facing

### Styling

- Tailwind is the default styling system
- Inline `style={{}}` is allowed for dynamic layout values, animation delays, sizing, z-index, or third-party integration when class names are insufficient
- Preserve RTL-aware spacing, alignment, and interaction patterns
- Reuse shared primitives before creating one-off wrappers

### Language

- User-facing copy should be Hebrew by default

### Toasts & Errors

- Prefer the `src/utils/toast.ts` wrapper for feature code
- `src/main.tsx` mounts `Toaster` directly from `sonner`
- Existing direct `sonner` imports should be treated as debt unless there is a clear reason
- 401 handling stays centralized in `src/api/client.ts`

---

## Naming

| What | Convention | Example |
|---|---|---|
| Feature folders | camelCase | `annualReports` |
| Components | PascalCase | `TaxDeadlineDrawer.tsx` |
| Hooks | `use` + camelCase | `useTaxProfile.ts` |
| Pages | `*Page.tsx` | `DashboardPage.tsx` |
| Feature API files | `<feature>.api.ts` or scoped API files | `taxDeadlines.api.ts` |
| Feature contracts | `contracts.ts` | `api/contracts.ts` |
| Feature query keys | `queryKeys.ts` | `api/queryKeys.ts` |
| Feature barrel | `index.ts` | `features/taxProfile/index.ts` |
| Constants | `constants.ts` or scoped `*.constants.ts` | `history.constants.ts` |
| Request types | `*Payload` / `*Params` | `CreateCorrespondencePayload` |
| Response types | `*Response` | `TaxDeadlineResponse` |

---

## Guardrails

- Run `npm run arch:check` after structural changes
- Run `npm run arch:check:strict` when touching cross-feature imports or barrels
- `arch-check` is the enforceable source of truth for architectural boundaries
- Do not bypass a feature barrel for cross-feature hooks, API modules, contracts, or query keys
- Cross-feature component imports are allowed for composition patterns
- Preserve alias usage such as `@/api/client` and `@/features/<feature>`
