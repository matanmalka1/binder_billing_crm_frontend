# CLAUDE.md — Binder & Billing CRM (Frontend)

> This file is the single source of truth for assistant behavior and project rules.
> It supersedes all other documentation. Do not look for `FRONTEND_PROJECT_RULES.md` — its contents are fully merged here.

---

## Assistant Behavior

- No greetings, affirmations, or filler ("Sure!", "Great question", "I hope this helps")
- Never repeat the user's prompt back to them
- Skip explanations unless explicitly requested
- Think step-by-step internally; output final result only unless reasoning is requested
- Prefer code and bullet points over prose
- Get it right the first time — verify against existing patterns before generating
- **Do not read files not explicitly mentioned in the task — ask if uncertain**

---

## Project Overview

Internal staff CRM: clients, binders, billing, tax, annual reports, VAT, notifications.
UI: Hebrew-only. Roles: `ADVISOR` (full access), `SECRETARY` (operational, read-oriented).

Backend repo: `../backend/` — FastAPI + SQLAlchemy (Python). API base: `http://localhost:8000`.
Schema migrations: Alembic (`../backend/alembic/`). After any model change, generate + run a migration before testing.

---

## Run

```bash
npm run dev
npm run typecheck   # must pass — strict mode, zero errors
npm run lint        # zero warnings
```

---

## Stack

- React 19, TypeScript 5 (strict), Vite 7, TailwindCSS v4
- React Query v5 (server state), Zustand v5 (auth only)
- react-hook-form + Zod, Axios, react-router-dom v7
- sonner via `src/utils/toast.ts` wrapper only

---

## Architecture — Layer Structure

```
Pages   → layout + composition only; no useQuery/useMutation/business logic
Hooks   → all state, filtering, mutations, data fetching
API     → typed functions calling Axios client
ENDPOINTS → single source of truth for all backend paths
```

- **Pages** (`src/pages/`) — composition only; no `useQuery`, no `useMutation`, no business decisions
- **Feature hooks** (`src/features/*/hooks/`) — own all data-fetching and state; return clean view-model objects to pages
- **API files** (`src/api/*.api.ts`) — call the backend; own request/response TypeScript types
- **`endpoints.ts`** — all backend paths; static paths as strings, dynamic paths as `(id) => string` functions

---

## Directory Structure

```
src/
├── api/
│   ├── client.ts        # Axios instance — 401 handled globally here
│   ├── endpoints.ts     # ALL backend paths — never hardcode URLs elsewhere
│   ├── queryParams.ts   # toQueryParams() — use for all query params
│   └── *.api.ts         # One file per domain
├── features/<name>/
│   ├── components/      # Feature-specific UI
│   ├── hooks/           # use<Name>Page.ts
│   ├── schemas.ts       # Zod schemas
│   └── types.ts         # Feature-local types
├── pages/               # Composition only
├── components/ui/       # Shared reusable UI
├── hooks/               # Shared hooks
├── store/               # Zustand (only place for localStorage)
├── types/               # Global: common.ts, store.ts, filters.ts
├── lib/queryKeys.ts     # QK constant — all React Query keys
└── utils/
    ├── utils.ts         # cn(), getErrorMessage(), formatDateTime()
    └── toast.ts         # toast.* wrapper
```

---

## Non-Negotiable Rules

### Code Structure
- Max **150 lines** per `.ts` or `.tsx` file — split if exceeded
- Arrow functions only — no `function` declarations
- No cross-feature component imports — shared UI goes in `src/components/ui/`
- All components are functional — no class components (except `AppErrorBoundary`)
- Props interface defined in same file as component, named `<ComponentName>Props`
- No inline arrow functions with business logic in JSX — extract to named handlers
- No ternary chains longer than two levels — extract to variables or early returns
- `displayName` set on all components

### API & Data
- All API paths in `src/api/endpoints.ts` — no hardcoded URLs anywhere else
- All HTTP via `src/api/client.ts` — no raw `fetch()`
- Query params via `toQueryParams()` — never construct `URLSearchParams` manually
- All React Query keys in `src/lib/queryKeys.ts` as `QK`

### State
- Pages render; hooks decide — no business logic in pages
- No `localStorage` / `sessionStorage` outside `src/store/`
- No server data duplicated in Zustand

### Authorization
- No auth logic outside `useRole()`
- Role checks in feature hooks only — never in pages or API files
- Missing-permission UI: `<AccessBanner>` — not silent hiding
- Backend enforces authorization; frontend enforces UX only
- Available permissions: `can.createClients`, `can.viewChargeAmounts`, `can.editClients`, `can.performBinderActions`

### Language & Text
- **All user-facing text in Hebrew** — labels, toasts, errors, placeholders, no exceptions

### TypeScript
- `strict: true` — no `any`, use `unknown` and narrow explicitly
- `import type` required for type-only imports
- `noUnusedLocals: true`, `noUnusedParameters: true` — no dead code
- Global shared types in `src/types/`; API types in `*.api.ts`; feature types in `features/<name>/types.ts`

---

## State Management

| State | Tool |
|---|---|
| Server (clients, binders, etc.) | React Query |
| Auth (user, role) | Zustand `auth.store.ts` |
| UI (modals, filters, pagination) | `useState` or URL params |

---

## React Query

- All keys in `src/lib/queryKeys.ts` as `QK`
- Key shape: `["domain", "sub", params]` — always include params in list query keys
- Global: `staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false`
- Mutations invalidate by broad prefix — e.g. `["clients", "list"]`, not full key

---

## API Files

- One file per domain: `clients.api.ts`, `binders.api.ts`
- Exports: typed interfaces + named `const` object (e.g. `clientsApi`)
- Types: `*Payload`/`*Request` (requests), `*Response` (responses), `List*Params` (list params)

---

## Endpoints

Every backend path declared in `src/api/endpoints.ts` before use:

```typescript
clientsImport: "/clients/import",
clientById: (id: number | string) => `/clients/${id}`,
```

No other file may construct a path string.

---

## Error Handling

- `toast.error(getErrorMessage(error, fallback))` for all API errors
- `getErrorMessage()` from `src/utils/utils.ts` only
- `toast.*` from `src/utils/toast.ts` only — no direct `sonner` calls
- 401 handled globally in `client.ts` — do not handle in feature code
- `AppErrorBoundary` wraps the entire app for render errors

---

## Styling

- Tailwind only — no `style={{}}`, no external CSS for components
- RTL default: `pr-*` not `pl-*`, `text-right` for alignment
- Conditional classes via `cn()` only
- Variant maps as `const` objects, not ternary chains:
  ```typescript
  const variants = { primary: "bg-blue-600 text-white", outline: "border border-gray-300" };
  className={variants[variant]}
  ```
- Custom tokens in `tailwind.config` — no arbitrary values for design system properties

---

## Forms

- react-hook-form + Zod resolver always — no uncontrolled forms, no manual validation
- Schemas in `schemas.ts`; types via `z.infer<typeof schema>` — no manual duplication
- Error messages in Hebrew
- Always provide default values to `useForm`

---

## Naming

| What | Convention | Example |
|---|---|---|
| Components | PascalCase | `ClientsTableCard.tsx` |
| Hooks | `use` prefix, camelCase | `useClientsPage.ts` |
| API files | `<name>.api.ts` | `clients.api.ts` |
| Types/utils | `<name>.<kind>.ts` | `binders.types.ts` |
| Constants | SCREAMING_SNAKE_CASE | `AUTH_STORAGE_NAME` |
| Request types | `*Payload` / `*Request` | `CreateClientPayload` |
| Response types | `*Response` | `ClientResponse` |
| Form types | `*FormValues` | `CreateClientFormValues` |
| Query keys | `QK.*` nested object | `QK.clients.list(params)` |

---

## Filter Options

Defined in `src/constants/filterOptions.constants.ts`.
Changes require updating both `src/utils/enums.ts` AND the constants file. Never hardcode in components.

---

## Role-Based Types

When backend returns different shapes per role, define both variants and a union:

```typescript
type ChargeResponse = ChargeAdvisorResponse | ChargeSecretaryResponse;
```

---

## What This Project Is NOT

- A general-purpose component library
- An analytics dashboard
- A client-facing portal (internal staff tool only)
- Responsible for enforcing business authorization (backend owns that)
- A multi-language application (Hebrew only)