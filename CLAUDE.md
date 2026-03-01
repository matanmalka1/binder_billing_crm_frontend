# CLAUDE.md — Binder & Billing CRM (Frontend)

## Assistant Behavior

- No greetings, affirmations, or filler ("Sure!", "Great question", "I hope this helps")
- Never repeat the user's prompt back to them
- Skip explanations unless explicitly requested
- Think step-by-step internally, but only output the final result unless reasoning is requested
- Prefer code and bullet points over prose
- Get it right the first time — verify against existing patterns before generating

---

## Project Overview

Internal staff CRM: clients, binders, billing, tax, annual reports, VAT, notifications.
UI: Hebrew-only. Roles: `ADVISOR` (full access), `SECRETARY` (operational, read-oriented).
Status: Production-ready through Sprint 9. Sprints 1–9 are **frozen**.

Backend repo: `../backend/` — FastAPI + SQLAlchemy (Python). API base: `http://localhost:8000`.

Full engineering rules: `FRONTEND_PROJECT_RULES.md` (this file is the assistant-facing summary).

---

## Run

```bash
npm run dev
npm run typecheck   # must pass — strict mode
npm run lint        # zero warnings
```

---

## Stack

- React 19, TypeScript 5 (strict), Vite 7, TailwindCSS v4
- React Query v5 (server state), Zustand v5 (auth only)
- react-hook-form + Zod, Axios, react-router-dom v7
- sonner via `src/utils/toast.ts` wrapper only

---

## Architecture

```
Pages   → layout + composition only; read from page hooks
Hooks   → all state, filtering, mutations, data fetching
API     → typed functions calling Axios client
ENDPOINTS → single source of truth for all backend paths
```

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
├── pages/               # Composition only — no useQuery/useMutation
├── components/ui/       # Shared reusable UI
├── hooks/               # Shared hooks
├── store/               # Zustand (only place for localStorage)
├── types/               # Global: common.ts, store.ts, filters.ts
├── lib/queryKeys.ts     # QK constant — all React Query keys
└── utils/
    ├── utils.ts          # cn(), getErrorMessage(), formatDateTime()
    └── toast.ts          # toast.* wrapper
```

---

## Non-Negotiable Rules

- All API paths in `src/api/endpoints.ts` — no hardcoded URLs elsewhere
- Pages render; hooks decide — no business logic in pages
- No cross-feature component imports
- Arrow functions only — no `function` declarations
- No `localStorage`/`sessionStorage` outside `src/store/`
- No auth logic outside `useRole()`
- **All user-facing text in Hebrew**
- All HTTP via `src/api/client.ts` — no raw `fetch()`
- TypeScript strict — no `any`, use `unknown`

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
- Global: `staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false`
- Mutations invalidate by broad prefix: `["clients", "list"]`

---

## API Files

- One file per domain: `clients.api.ts`, `binders.api.ts`
- Types: `*Payload`/`*Request` (requests), `*Response` (responses), `List*Params` (list params)
- Query params via `toQueryParams()` — never construct `URLSearchParams` manually

---

## Authorization (UI)

- Role checks in feature hooks via `useRole()` — never in pages or API files
- Missing-permission UI: `<AccessBanner>` — not silent hiding
- Backend owns real authorization; frontend is UX enforcement only

---

## Error Handling

- `toast.error(getErrorMessage(error, fallback))` for all API errors
- 401 handled globally in `client.ts` — do not handle in feature code

---

## Styling

- Tailwind only — no `style={{}}`, no external CSS for components
- RTL default: `pr-*` not `pl-*`, `text-right` for alignment
- Conditional classes via `cn()` only
- Variant maps as `const` objects, not ternary chains

---

## Forms

- react-hook-form + Zod resolver always
- Schemas in `schemas.ts`; types via `z.infer<typeof schema>`
- Error messages in Hebrew
- Always provide default values to `useForm`

---

## Naming

| What | Convention | Example |
|---|---|---|
| Components | PascalCase | `ClientsTableCard.tsx` |
| Hooks | `use` prefix, camelCase | `useClientsPage.ts` |
| API files | `<name>.api.ts` | `clients.api.ts` |
| Constants | SCREAMING_SNAKE_CASE | `AUTH_STORAGE_NAME` |
| Request types | `*Payload` / `*Request` | `CreateClientPayload` |
| Response types | `*Response` | `ClientResponse` |
| Form types | `*FormValues` | `CreateClientFormValues` |

---

## Filter Options

Defined in `src/constants/filterOptions.constants.ts`.
Changes require updating both `src/utils/enums.ts` AND the constants file. Never hardcode in components.

---

## Known Issues

No current known issues. All previously tracked issues have been resolved:
- Signature audit trail (`audit_trail` / `occurred_at`) — fixed
- VAT monetary fields (`number` in both layers) — fixed
- `useImportExport.ts` URL hardcoding — fixed, uses `ENDPOINTS.*`
- `correspondence.api.ts` path hardcoding — fixed, uses `ENDPOINTS.*`
- `userAuditLogs` missing from `endpoints.ts` — added
- `AnnualReportResponse.client_name` — present in both backend schema and frontend
- `/settings/users` user management page — implemented (`Users.tsx`, full CRUD)
- `/reports/signature-requests` page — implemented (`SignatureRequests.tsx`)
