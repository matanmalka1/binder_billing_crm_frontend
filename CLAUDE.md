# CLAUDE.md — Binder & Billing CRM (Frontend)

> Single source of truth for assistant behavior and project rules.

---

## Assistant Behavior

- No greetings, affirmations, or filler
- No prompt repetition
- No unsolicited explanations
- Output final result only; reason internally
- When uncertain about scope — ask before reading files

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
```

---

## Stack

- React 19, TypeScript 5 (strict), Vite 7, TailwindCSS v4
- React Query v5 · Zustand v5 (auth only)
- react-hook-form + Zod · Axios · react-router-dom v7
- Toasts: `src/utils/toast.ts` wrapper only — no direct `sonner` imports

---

## Architecture
```
Pages   → layout + composition only
Hooks   → all state, filtering, mutations, data fetching
API     → typed functions via Axios client
ENDPOINTS → single source of truth for all backend paths
```

| Layer | Location | Responsibility |
|---|---|---|
| Pages | `src/pages/` | Composition only. No `useQuery`, no `useMutation`, no business logic. |
| Feature hooks | `src/features/*/hooks/` | All data-fetching and state. Return clean view-model objects. |
| API files | `src/api/*.api.ts` | Backend calls + request/response TypeScript types. |
| API utils | `src/api/*.utils.ts` | Backend enum mapping, response normalization only. No UI logic. |
| Endpoints | `src/api/endpoints.ts` | All backend paths. No URL construction anywhere else. |

---

## Directory Structure
```
src/
├── api/
│   ├── client.ts          # Axios instance — 401 handled here globally
│   ├── endpoints.ts       # ALL backend paths
│   ├── queryParams.ts     # toQueryParams() — use for all query params
│   ├── *.api.ts           # One file per domain
│   └── *.utils.ts         # API-layer transforms only
├── features/<name>/
│   ├── components/        # Feature UI (sub-folders for large features)
│   ├── hooks/             # use<Name>Page.ts
│   ├── schemas.ts         # Zod schemas
│   └── types.ts           # Feature-local types
├── pages/                 # Composition only
├── components/ui/         # Shared reusable UI
├── hooks/                 # Shared hooks
├── store/                 # Zustand — only place for localStorage
├── types/                 # Global: common.ts, store.ts, filters.ts
├── constants/
│   └── filterOptions.constants.ts
├── lib/queryKeys.ts       # QK — all React Query keys
└── utils/
    ├── utils.ts           # cn(), getErrorMessage(), formatDateTime()
    └── toast.ts           # toast.* wrapper
```

Large features: use domain sub-folders (`kanban/`, `panel/`) and scoped constants (`annex.constants.ts`).

---

## Rules

### Files & Structure
- Max **150 lines** per `.ts` / `.tsx` — split proactively, not retroactively
- Arrow functions only — no `function` declarations
- All components are functional; `displayName` set on every component
- Props interface in same file as component, named `<ComponentName>Props`
- No class components (exception: `AppErrorBoundary`)
- No cross-feature component imports — shared UI goes in `src/components/ui/`

### JSX
- No inline arrow functions with side effects or data transforms in JSX — extract to named handlers
- No ternary chains longer than two levels — use early returns or named variables
- Variant maps as `const` objects, not inline ternaries:
```typescript
  const statusVariants = { active: "text-green-600", inactive: "text-gray-400" };
  className={statusVariants[status]}
```
- Loading and error states must be handled explicitly in every component that fetches data

### API & Data
- All paths in `endpoints.ts` — static: string, dynamic: `(id: number | string) => string`
- All HTTP via `src/api/client.ts` — no raw `fetch()`
- All query params via `toQueryParams()` — no manual `URLSearchParams`
- All React Query keys via `QK` from `src/lib/queryKeys.ts`
- Key shape: `["domain", "sub", params]` — always include params in list keys
- Mutations invalidate by broad prefix — e.g. `["clients", "list"]`
- `staleTime: 30_000` · `retry: 1` · `refetchOnWindowFocus: false`

### State
- No business logic in pages
- No `localStorage` / `sessionStorage` outside `src/store/`
- No server data duplicated in Zustand

### Authorization
- Role logic only in `useRole()` and feature hooks — never in pages or API files
- Missing-permission UI: `<AccessBanner>` — not silent hiding
- Frontend enforces UX; backend enforces authorization
- Permissions: `can.createClients` · `can.viewChargeAmounts` · `can.editClients` · `can.performBinderActions`

### TypeScript
- `strict: true` — no `any`; use `unknown` and narrow explicitly
- `import type` for type-only imports
- `noUnusedLocals` + `noUnusedParameters` — no dead code
- Global types → `src/types/`; API types → `*.api.ts`; feature types → `features/<name>/types.ts`
- Role-variant responses: define both shapes and a union
```typescript
  type ChargeResponse = ChargeAdvisorResponse | ChargeSecretaryResponse;
```

### Forms
- react-hook-form + Zod resolver — no uncontrolled forms, no manual validation
- Schemas in `schemas.ts`; types via `z.infer<typeof schema>`
- Default values always provided to `useForm`
- Error messages in Hebrew

### Styling
- Tailwind only — no `style={{}}`, no external CSS for components
- RTL: `pr-*` not `pl-*`, `text-right` for alignment
- Conditional classes via `cn()` only
- Arbitrary values only for one-off cases not in the design system; use config tokens otherwise

### Language
- All user-facing text in Hebrew — labels, toasts, errors, placeholders, no exceptions

### Error Handling
- `toast.error(getErrorMessage(error, fallback))` for all API errors
- 401 handled globally in `client.ts` — do not handle in feature code

---

## Naming

| What | Convention | Example |
|---|---|---|
| Components | PascalCase | `ClientsTableCard.tsx` |
| Hooks | `use` + camelCase | `useClientsPage.ts` |
| API files | `<name>.api.ts` | `clients.api.ts` |
| Utils/types | `<name>.<kind>.ts` | `binders.types.ts` |
| Constants (scoped) | `<scope>.constants.ts` | `report.constants.ts` |
| Constants (values) | SCREAMING_SNAKE_CASE | `AUTH_STORAGE_NAME` |
| Request types | `*Payload` / `*Request` | `CreateClientPayload` |
| Response types | `*Response` | `ClientResponse` |
| Form types | `*FormValues` | `CreateClientFormValues` |
| Query keys | `QK.*` | `QK.clients.list(params)` |

---

## Filter Options

Defined in `src/constants/filterOptions.constants.ts`.
Any change requires updating both `src/utils/enums.ts` and the constants file.
Never hardcode filter values in components.