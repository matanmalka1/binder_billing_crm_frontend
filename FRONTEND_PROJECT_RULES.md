**Status:** ACTIVE
**Applies To:** Entire Frontend Codebase

### 1. Purpose

This document defines the non-negotiable engineering, architectural, and operational rules of the Binder & Billing CRM frontend.

Its purpose is to:

- Preserve long-term architectural integrity
- Prevent scope creep and hidden regressions
- Serve as the highest-level frontend engineering contract

If a conflict arises between this document and other documentation, **this document prevails** unless explicitly amended.

---

### 2. Non-Negotiable Engineering Rules

The following rules must not be violated without explicit approval:

- **All API paths must be declared in `src/api/endpoints.ts`** — no hardcoded URL strings anywhere else in the codebase
- **No business logic in page components** — pages render; hooks decide
- **No cross-feature imports at the component level** — features are self-contained; shared code belongs in `src/components/`, `src/hooks/`, or `src/utils/`
- **All functions use arrow syntax** — no `function` declarations; components, helpers, and callbacks are `const foo = () => {}`
- **No direct `localStorage` / `sessionStorage` access** outside `src/store/`
- **No authorization logic outside `useRole()`** — role checks belong in hooks, never in API files or utility functions
- **All user-facing text is in Hebrew** — no English strings in UI output (labels, toasts, error messages, placeholders)
- **All API calls go through the Axios instance in `src/api/client.ts`** — no raw `fetch()` calls
- **TypeScript strict mode must pass cleanly** — `noUnusedLocals`, `noUnusedParameters`, and `strict` are enabled and must not be suppressed

---

### 3. Architecture Rules

#### 3.1 Layer Structure

The application is organized into four layers. Each layer has a single responsibility:

```
Pages       →  render layout, compose feature components, read from page hooks
Hooks       →  own all page state, filtering, mutations, and data fetching
API files   →  declare request/response types, call the Axios client
ENDPOINTS   →  single source of truth for all backend paths
```

- **Pages** (`src/pages/`) — composition only; no `useQuery`, no `useMutation`, no business decisions
- **Feature hooks** (`src/features/*/hooks/`) — own all data-fetching and state for a feature; return clean view-model objects to pages
- **API files** (`src/api/*.api.ts`) — functions that call the backend; own request/response TypeScript types
- **`endpoints.ts`** — all backend paths; static paths as strings, dynamic paths as `(id) => string` functions

#### 3.2 Feature Module Structure

Each feature under `src/features/<name>/` must follow this layout:

```
features/<name>/
├── components/     # Feature-specific UI components
├── hooks/          # Feature-specific hooks (use<Name>Page.ts, etc.)
├── schemas.ts      # Zod validation schemas for forms
└── types.ts        # Feature-specific TypeScript types
```

Features must not reach into other features. Shared UI goes in `src/components/ui/`. Shared logic goes in `src/hooks/` or `src/utils/`.

#### 3.3 State Ownership

- **Server state** (clients, binders, charges, reports, etc.) → React Query only
- **Auth state** (user identity, role) → Zustand (`auth.store.ts`) only
- **UI state** (modals, filters, pagination) → component-local `useState` or URL params via `useSearchParams`
- No server data is duplicated in Zustand

---

### 4. API & Endpoint Rules

#### 4.1 Endpoint Registration

Every backend path must be declared in `src/api/endpoints.ts` before use:

```typescript
// Static path
clientsImport: "/clients/import",

// Dynamic path
clientById: (id: number | string) => `/clients/${id}`,
```

No other file may construct a path string — always reference `ENDPOINTS.*`.

#### 4.2 API File Conventions

- One file per backend domain: `clients.api.ts`, `binders.api.ts`, etc.
- File exports: typed request/response interfaces + a named `const` object (e.g., `clientsApi`)
- Request types use suffix `*Payload` or `*Request`; response types use `*Response`
- List param types use prefix `List*Params`

#### 4.3 Query Parameters

- All query params passed through `toQueryParams()` from `src/api/queryParams.ts`
- `toQueryParams` strips `null`, `undefined`, and empty strings automatically
- Never manually construct `URLSearchParams`

#### 4.4 React Query Conventions

- All query keys defined in `src/lib/queryKeys.ts` as the `QK` constant
- `staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false` (set globally in `queryClient.ts`)
- Query key shape: `["domain", "sub", params]` — always include params in list query keys
- Mutations invalidate by broad key prefix (`["clients", "list"]`), not by full key

---

### 5. Component Rules

#### 5.1 Component Style

- All components are **functional** — no class components (except `AppErrorBoundary`)
- Props interface defined in the same file as the component, named `<ComponentName>Props`
- Components that forward refs use `React.forwardRef`
- `displayName` set on all components

#### 5.2 UI Components

- All shared, reusable UI lives in `src/components/ui/`
- UI components accept `variant` and `size` props for styling variants
- Conditional classNames use the `cn()` utility — no string concatenation
- Loading and disabled states must be handled by every interactive component

#### 5.3 No Logic in JSX

- No inline arrow functions with business logic in JSX event handlers — extract to named handlers
- No ternary chains longer than two levels — extract to variables or early returns

---

### 6. Styling Rules

- **Tailwind CSS only** — no inline `style={{}}` props, no external CSS files for component styling
- RTL layout is default: use `pr-*` not `pl-*` for indentation, `text-right` for alignment
- Variant maps are `const` objects, not ternary chains:
  ```typescript
  const variants = { primary: "bg-blue-600 text-white", outline: "border border-gray-300" };
  className={variants[variant]}
  ```
- Custom design tokens (colors, shadows, animations) are defined in `tailwind.config` — no arbitrary values for design system properties

---

### 7. Form Rules

- All forms use **react-hook-form** with **Zod** resolver — no uncontrolled forms, no manual validation
- Schemas defined in the feature's `schemas.ts` file
- Form value types derived from schema via `z.infer<typeof schema>` — no manual duplication
- All error messages written in Hebrew
- Default values always provided to `useForm`

---

### 8. Authorization Rules

#### 8.1 Role Enforcement

- Role checks happen in **feature hooks**, via `useRole()` — never in page components or API files
- `useRole()` is the single source of truth for permission checks
- Available permissions: `can.createClients`, `can.viewChargeAmounts`, `can.editClients`, `can.performBinderActions`

#### 8.2 UI Behavior

- Advisors: full create/edit/view access
- Secretaries: read-only access to most features; charge amounts hidden
- Missing-permission UI uses `<AccessBanner>` component — not silent hiding
- Backend enforces authorization; frontend enforces UX only

#### 8.3 Role-Based Types

- When backend returns different shapes per role (e.g., charges), define both variants and a union type:
  ```typescript
  type ChargeResponse = ChargeAdvisorResponse | ChargeSecretaryResponse;
  ```

---

### 9. Error Handling Rules

- All API errors shown via `toast.error(getErrorMessage(error, fallback))`
- `getErrorMessage()` from `src/utils/utils.ts` is the only error-extraction function
- `toast.*` from `src/utils/toast.ts` is the only toast interface — no direct `sonner` calls
- 401 responses are handled globally by the Axios interceptor in `client.ts` — feature code must not handle 401 manually
- `AppErrorBoundary` wraps the entire app for render errors

---

### 10. TypeScript Rules

- `strict: true` — all strict checks enforced
- `noUnusedLocals: true`, `noUnusedParameters: true` — no dead code
- `import type` required for type-only imports
- No `any` — use `unknown` and narrow explicitly
- Global shared types live in `src/types/` (`common.ts`, `store.ts`, `filters.ts`)
- API response types live in the corresponding `*.api.ts` file
- Feature-local types live in `features/<name>/types.ts`

---

### 11. Naming Conventions

| What | Convention | Example |
|---|---|---|
| Components | PascalCase | `ClientsTableCard.tsx` |
| Hooks | camelCase, `use` prefix | `useClientsPage.ts` |
| API files | `<name>.api.ts` | `clients.api.ts` |
| Types/utils | `<name>.<kind>.ts` | `binders.types.ts` |
| Schemas | `schemas.ts` per feature | `features/clients/schemas.ts` |
| Constants | SCREAMING_SNAKE_CASE | `AUTH_STORAGE_NAME` |
| Request types | `*Payload` or `*Request` | `CreateClientPayload` |
| Response types | `*Response` | `ClientResponse` |
| Form value types | `*FormValues` | `CreateClientFormValues` |
| Query key file | `QK.*` nested object | `QK.clients.list(params)` |

---

### 12. What This Project Is NOT

This frontend is explicitly **not**:

- A general-purpose component library
- An analytics dashboard
- A client-facing portal (internal staff tool only)
- Responsible for enforcing business authorization (backend owns that)
- A multi-language application (Hebrew only)

---

### 13. Amendment Policy

This document may only be amended by:

- Explicit decision
- Documented change
- Versioned update

**End of Rules**
