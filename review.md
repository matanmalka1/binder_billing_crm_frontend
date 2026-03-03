# Frontend Dead Code & Redundancy Audit
**Project:** Binder & Billing CRM  
**Stack:** React 19 · TypeScript 5 (strict) · Vite 7 · TailwindCSS v4  
**Scope:** Frontend only (`src/`)  
**Date:** 2026-06-03  

---

## 1. Executive Summary

The project is well-structured and follows its own architecture contract consistently. TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) eliminates most classic dead code at compile time.

Findings are concentrated in three areas:
- **Exported symbols with no consumers** — TypeScript does not enforce usage across module boundaries for exported identifiers
- **Duplicate query-key entries** in `queryKeys.ts` pointing to the same backend endpoint
- **Two parallel label-getter patterns** coexisting in `enums.ts` vs `*.utils.ts`

No architectural changes are required. Cleanup is surgical and low-risk.

---

## 2. Safe Delete List

| # | File | Symbol | Why Unused | Safe to Delete | Confidence |
|---|---|---|---|---|---|
| 1 | `src/api/taxDeadlines.utils.ts` | `getUrgencyLabel` | Exported but no import found in any component or hook. `getUrgencyColor` is consumed; `getUrgencyLabel` is not. | Yes | 85% |
| 2 | `src/api/taxDeadlines.utils.ts` | `getDeadlineIcon` | Exported but no consumer in the frontend codebase. May be pre-written for Sprint 10 VAT panel — verify before deleting. | Needs review | 80% |
| 3 | `src/api/taxDeadlines.utils.ts` | `DeadlineTypeKey` | Exported type, only used internally within the same file as a cast target. No external import found. | Yes | 80% |
| 4 | `src/lib/queryKeys.ts` | `QK.advisorToday.all` | `useAdvisorToday` calls `.deadlines`, `.reports`, `.reminders` individually. `.all` is never referenced in invalidation or queries. | Yes | 90% |
| 5 | `src/lib/queryKeys.ts` | `QK.documents.clients` | Bare array `["documents", "clients"]` with no observed consumer. `clientList` and `clientSignals` are actively used. | Yes | 75% |
| 6 | `src/lib/queryKeys.ts` | `QK.tax.deadlines.urgent` | Resolves to `["tax", "deadlines", "urgent"]` — identical to `QK.taxDashboard.urgentDeadlines`. `useTaxDashboard` uses the latter. The former has no consumer. | Yes (after verifying no mutation invalidates it) | 80% |

---

## 3. Needs Review List

| # | File | Symbol / Pattern | Issue | Action |
|---|---|---|---|---|
| 1 | `src/utils/enums.ts` | All label functions | Uses inline `Record<string, string>` per function. `src/api/*.utils.ts` files use `makeLabelGetter()` from `src/utils/labels.ts`. Two patterns coexist with no declared preference. | Do not change now (Sprint 9 frozen). Add guidance to `CLAUDE.md` for Sprint 10+. |
| 2 | `src/lib/queryKeys.ts` | `QK.taxDashboard.urgentDeadlines` vs `QK.tax.deadlines.urgent` | Both resolve to `["tax", "deadlines", "urgent"]`. If a mutation invalidates one but not the other, cache will drift silently. | Audit all `invalidateQueries` calls. Remove `QK.tax.deadlines.urgent`; standardize on `QK.taxDashboard.urgentDeadlines`. |
| 3 | `src/features/dashboard/hooks/useAdvisorToday.ts` | `chargesQuery` key | Uses `QK.charges.list({ status: "issued", issued_before: sixtyDaysAgo, ... })` where `sixtyDaysAgo` is computed in `useMemo` with `[]` deps. Stable within a session, but if the component remounts on a new day the key changes, creating a stale cache entry instead of reusing it. | Low priority. Consider computing `sixtyDaysAgo` as a date-only string (`yyyy-MM-dd`) to make the key fully stable per calendar day. |
| 4 | `src/features/clients/types.ts` | `ClientBinderSummary`, `ClientChargeSummary` | Defined and exported but no visible import outside the file. TypeScript strict will surface this only if they are `import`-ed somewhere and then removed. | Grep for usages; delete if none found. |
| 5 | `src/pages/TaxDeadlines.tsx` | Double query concern | Imports both `useTaxDeadlines` (fetches deadline list) and `useTaxDashboard` (fetches urgent deadlines + tax submissions). Verify the two hooks do not issue overlapping requests to the same endpoint on page load. | Check network tab; consider whether `useTaxDashboard` data could be derived from the list query instead of a separate call. |

---

## 4. Duplication Report

### 4.1 Two Parallel Label-Getter Systems

**Where:**
- `src/utils/enums.ts` — each function contains its own `Record<string, string>` and returns `labels[key] || "—"`
- `src/api/*.utils.ts` files — use `makeLabelGetter(map, fallback)` and `makeClassGetter(map)` from `src/utils/labels.ts`

**Example of the split:**

```typescript
// enums.ts — inline pattern
export const getWorkStateLabel = (workState: string): string => {
  const labels: Record<string, string> = { waiting_for_work: "ממתין לטיפול", ... };
  return labels[workState] || "—";
};

// annualReports.utils.ts — factory pattern
export const getReportStageLabel = makeLabelGetter(stageLabels);
```

Both work correctly. The risk is that `enums.ts` will keep growing with the inline pattern while new domain utils adopt `makeLabelGetter`, making the codebase harder to navigate.

**Suggested fix (Sprint 10+, non-breaking):** New label functions added to `enums.ts` should use `makeLabelGetter`. Existing functions are frozen. Document this in `CLAUDE.md`.

---

### 4.2 Duplicate Query Key for Urgent Deadlines

**Where:** `src/lib/queryKeys.ts`

```typescript
// Two separate entries, identical resolved value:
QK.tax.deadlines.urgent          // → ["tax", "deadlines", "urgent"]
QK.taxDashboard.urgentDeadlines  // → ["tax", "deadlines", "urgent"]
```

`useTaxDashboard` uses `QK.taxDashboard.urgentDeadlines`. No file uses `QK.tax.deadlines.urgent`. If a future mutation invalidates one but not the other, React Query will serve stale data from the twin key.

**Fix:** Delete `QK.tax.deadlines.urgent`. Use `QK.taxDashboard.urgentDeadlines` exclusively.

---

### 4.3 Repeated JSX Branch in AdvisorTodaySection

**Where:** `src/features/dashboard/components/AdvisorTodaySection.tsx`

```tsx
// content is built identically for both branches
if (item.href) {
  return <Link ...>{content}</Link>;
}
return <div ...>{content}</div>;
```

`content` is a JSX variable defined once, which is correct. However the wrapper selection (Link vs div) is a repeated pattern that could be extracted into a small `ItemWrapper` component if the component grows.

**Current status:** Acceptable as-is. Extract only if this component gains more conditional wrapper types.

---

## 5. Refactor Opportunities

### 5.1 Consolidate Duplicate QK Urgent-Deadlines Key
**Risk:** Low  
**Effort:** 15 minutes  

```typescript
// queryKeys.ts — remove:
// urgent: ["tax", "deadlines", "urgent"] as const,   ← delete this line

// Standardize all callsites to:
QK.taxDashboard.urgentDeadlines
```

Verify no `invalidateQueries` call references the removed key before deleting.

---

### 5.2 Remove staggerDelay Import from PageHeader
**Risk:** None  
**Effort:** 5 minutes  

```tsx
// src/components/layout/PageHeader.tsx
// Before:
import { staggerDelay } from "../../utils/animation";
style={{ animationDelay: staggerDelay(1, 100) }}

// After (remove import, inline the literal):
style={{ animationDelay: "100ms" }}
```

The function is used only once in this file with static arguments. The import can be removed entirely if no other usage exists in the file.

---

### 5.3 Document Label-Getter Convention in CLAUDE.md
**Risk:** None  
**Effort:** 5 minutes  

Add to the `## Non-Negotiable Rules` section in `CLAUDE.md`:

```markdown
- New label/class getter functions use `makeLabelGetter` / `makeClassGetter` from `src/utils/labels.ts` — not inline `Record<string, string>`
```

---

## 6. Risk Assessment

| Item | Risk | Severity |
|---|---|---|
| `QK.tax.deadlines.urgent` / `QK.taxDashboard.urgentDeadlines` key duplication | Silent cache drift if mutations invalidate inconsistently | 🟡 Medium |
| `getDeadlineIcon` deletion | May be intentional pre-write for Sprint 10 VAT panel | 🟡 Medium — verify TODO.md |
| `getUrgencyLabel` deletion | No consumer found; safe | 🟢 Low |
| `QK.advisorToday.all` deletion | Never used; safe | 🟢 Low |
| `ClientBinderSummary` / `ClientChargeSummary` deletion | TypeScript strict will validate; grep first | 🟢 Low |
| enums.ts / labels.ts pattern split | Accumulating tech debt, not a runtime risk | 🟢 Low |

---

## 7. Estimated Cleanup Effort

| Task | Effort |
|---|---|
| Delete `QK.advisorToday.all`, `QK.documents.clients` | **Low** — 2 lines |
| Consolidate `QK.tax.deadlines.urgent` → verify + delete | **Low** — 30 min including grep |
| Delete `getUrgencyLabel`, `DeadlineTypeKey` | **Low** — 2 lines + confirm Sprint 10 scope |
| Remove `staggerDelay` import from `PageHeader` | **Low** — 5 min |
| Document label convention in `CLAUDE.md` | **Low** — 1 sentence |
| Verify `ClientBinderSummary` / `ClientChargeSummary` usage | **Low** — grep only |
| Investigate double-query in `TaxDeadlines.tsx` | **Medium** — requires network profiling |

**Total estimated effort: 1–3 hours.** No architectural changes required. No component rewrites. All changes are additive-safe or pure deletions.

---

## Appendix: Project Structure Map

```
src/
├── api/
│   ├── client.ts                   # Axios instance, global 401 handler
│   ├── endpoints.ts                # Single source of truth for all backend paths
│   ├── queryParams.ts              # toQueryParams() utility
│   ├── *.api.ts                    # One file per domain (clients, binders, charges, …)
│   └── *.utils.ts                  # Domain label/class getters (uses makeLabelGetter)
├── features/
│   ├── annualReports/
│   ├── binders/
│   ├── charges/
│   ├── clients/
│   ├── dashboard/
│   ├── documents/
│   ├── reminders/
│   ├── reports/
│   ├── signatureRequests/
│   ├── taxDashboard/
│   ├── taxDeadlines/
│   ├── taxProfile/
│   ├── timeline/
│   ├── users/
│   └── vatReports/
├── pages/                          # Composition only — no useQuery/useMutation
│   ├── Dashboard.tsx
│   ├── Binders.tsx
│   ├── Clients.tsx
│   ├── ClientDetails.tsx
│   ├── Charges.tsx
│   ├── Search.tsx
│   ├── TaxDeadlines.tsx
│   ├── AnnualReportsKanban.tsx
│   ├── Users.tsx
│   ├── SigningPage.tsx
│   ├── Login.tsx
│   ├── reports/                    # AgingReport, Reminders, SignatureRequests
│   └── tax/                        # AdvancePayments, VatWorkItems
├── components/
│   ├── layout/                     # Navbar, Sidebar, PageLayout, PageHeader
│   └── ui/                         # Shared reusable UI (Button, Card, Badge, Modal, …)
├── hooks/                          # Shared hooks (useRole, useSearchParamFilters, …)
├── store/                          # Zustand — auth only
├── lib/
│   └── queryKeys.ts                # QK constant — all React Query keys
├── types/                          # Global types: common.ts, store.ts, filters.ts
├── constants/
│   └── filterOptions.constants.ts
├── utils/
│   ├── utils.ts                    # cn(), getErrorMessage(), formatDate(), showErrorToast()
│   ├── toast.ts                    # Sonner wrapper
│   ├── animation.ts                # staggerDelay()
│   ├── labels.ts                   # makeLabelGetter(), makeClassGetter()
│   └── enums.ts                    # Domain label functions (inline pattern — legacy)
└── router/
    └── AppRoutes.tsx               # Route tree + ProtectedRoute + AuthenticatedLayout
```

**Entry point:** `src/main.tsx` → `<App />` → `<AppRoutes />`  
**Global providers:** React Query client, Zustand auth store, `AppErrorBoundary`, Sonner `<Toaster />`  
**Auth flow:** Zustand `auth.store.ts` → `selectIsAuthenticated` → `ProtectedRoute`  
**401 handling:** Axios interceptor in `client.ts` dispatches `AUTH_EXPIRED_EVENT` → `AuthExpiredNavigationHandler`
