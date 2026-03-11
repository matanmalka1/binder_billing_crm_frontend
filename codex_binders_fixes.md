# Codex Task: Fix `binders` Domain — 6 Architecture & Correctness Violations

## Project Context

FastAPI + React 19 + TypeScript CRM. Hebrew-only UI.
- Backend rules: strict `API → Service → Repository → ORM` layering; no business logic in
  routers; no cross-domain imports at Repository/Model level; max 150 lines per Python file;
  UI must never implement business authorization logic.
- Frontend rules: feature-boundary isolation; all HTTP calls through typed `src/api/*.api.ts`
  clients and `src/api/endpoints.ts` constants; hooks in `src/features/<domain>/hooks/`.

---

## Fix 1 — Architecture Breach (High): `ClientRepository` used directly in `list_binders` router

### Files
- `app/binders/api/binders_list_get.py`
- `app/binders/services/binder_service.py`
- `app/binders/api/binders_common.py`

### Problem

`list_binders` in the router instantiates `ClientRepository` directly and performs client-name
enrichment logic inline. `binders_common.py:fetch_client_and_build_response` does the same for
single-binder responses. Both violate `API → Service → Repository → ORM`.

### Required changes

**1a. Add `list_binders_enriched` to `BinderService`**

In `app/binders/services/binder_service.py`, add a new method that owns the full enrichment
pipeline (client name lookup + work_state derivation + signals + filtering + sorting):

```python
def list_binders_enriched(
    self,
    *,
    client_id: Optional[int] = None,
    status: Optional[str] = None,
    work_state: Optional[str] = None,
    query: Optional[str] = None,
    client_name_filter: Optional[str] = None,
    binder_number: Optional[str] = None,
    year: Optional[int] = None,
    sort_by: str = "received_at",
    sort_dir: str = "desc",
    page: int = 1,
    page_size: int = 20,
    reference_date: Optional[date] = None,
) -> tuple[list[dict], int]:
    """
    List binders with full enrichment: client names, work_state, signals.
    All filtering and sorting runs here — the router receives a plain tuple.
    """
```

Move the `ClientRepository` instantiation, `client_name_map` build, work_state/signal
derivation, and all filter/sort/pagination logic from `list_binders` into this method.
The method returns `(enriched_items_as_dicts_or_BinderResponse_list, total)`.

If adding this method would push `binder_service.py` past 150 lines, extract it into a new
file `app/binders/services/binder_list_service.py` following the same mixin/facade pattern
used by `AnnualReportService`.

**1b. Simplify the router**

`list_binders` in `binders_list_get.py` should become:
```python
service = BinderService(db)
items, total = service.list_binders_enriched(
    client_id=client_id,
    status=status_filter,
    work_state=work_state,
    query=query,
    client_name_filter=client_name,
    binder_number=binder_number,
    year=year,
    sort_by=sort_by or "received_at",
    sort_dir=sort_dir,
    page=page,
    page_size=page_size,
)
return BinderListResponse(items=items, page=page, page_size=page_size, total=total)
```

Remove `from app.clients.repositories.client_repository import ClientRepository`,
`from app.binders.services.work_state_service import WorkStateService`, and
`from app.binders.services.signals_service import SignalsService` from `binders_list_get.py`
imports — the router should only import `BinderService`.

**1c. Fix `binders_common.py`**

`fetch_client_and_build_response` also instantiates `ClientRepository` directly. Move the
client lookup into `BinderService.get_binder_with_client_name(binder_id) -> BinderResponse`
and update `binders_common.py` to call that service method, or pass `client_name` through
from the service layer so the helper never touches a repository.

### Acceptance
- `binders_list_get.py` has zero imports from `app.clients.repositories.*`.
- `binders_common.py` has zero direct `ClientRepository(db)` calls.
- `pytest -q` passes.

---


## Fix 2 — Transition Block (High): Remove `work_state` gate on "Ready" action in frontend

### Files
- `src/features/binders/components/BindersColumns.tsx`
- Any other component/hook that conditionally hides or disables an action with `key === "ready"`
  based on `work_state === "waiting_for_work"` or `work_state !== "in_progress"`.

### Problem

The backend `action_contracts.py` governs which actions are available — it grants `"ready"` to
all `in_office` binders regardless of `work_state`. `work_state` is a UX-only derived signal;
it must never gate executable actions. Any frontend conditional that suppresses the `"ready"`
button based on `work_state` is implementing business authorization in the UI, which is
explicitly prohibited by `BACKEND_PROJECT_RULES.md §6`.

### Required changes

1. Search `BindersColumns.tsx` (and any related action-rendering utility) for any conditional
   of the form:
   ```ts
   work_state === 'in_progress' && action.key === 'ready'
   // or
   binder.work_state !== 'waiting_for_work'
   // or any filter/guard on available_actions that checks work_state
   ```
2. Remove that conditional entirely. The action button must render if and only if
   `binder.available_actions.some(a => a.key === 'ready')` — i.e., trust the backend contract.
3. Do not add any client-side work_state checks on other action keys (`"return"`, etc.) either.

### Acceptance
- Action rendering in binders table/drawer is driven exclusively by the `available_actions`
  array returned by the backend. No `work_state` check appears adjacent to action rendering.
- `tsc --noEmit` passes.

---

## Fix 3 — Dead Endpoint (High): Wire `GET /binders/open` to the frontend

### Files
- `src/api/binders.api.ts`
- `src/api/endpoints.ts`
- `src/features/binders/hooks/useOpenBinders.ts` (create new)

### Problem

`GET /api/v1/binders/open` exists on the backend but is never called from the frontend.
The endpoint returns `BinderListResponseExtended` (with `work_state` + `signals`) and is
the correct data source for a "work queue" or "open items" view.

### Required changes

**3a. `src/api/endpoints.ts`** — add:
```ts
BINDERS_OPEN: '/binders/open',
```

**3b. `src/api/binders.api.ts`** — add:
```ts
export interface BinderDetailResponse {
  id: number;
  client_id: number;
  binder_number: string;
  status: string;
  received_at: string;
  returned_at: string | null;
  pickup_person_name: string | null;
  work_state: string | null;
  signals: string[];
}

export interface BinderListResponseExtended {
  items: BinderDetailResponse[];
  page: number;
  page_size: number;
  total: number;
}

// inside bindersApi object:
getOpenBinders: (params?: { page?: number; page_size?: number }): Promise<BinderListResponseExtended> =>
  apiClient.get(ENDPOINTS.BINDERS_OPEN, { params }).then(r => r.data),
```

**3c. Create `src/features/binders/hooks/useOpenBinders.ts`**:
```ts
import { useQuery } from '@tanstack/react-query';
import { bindersApi } from '../../../api/binders.api';
import { QK } from '../../../lib/queryKeys';

export const useOpenBinders = (page = 1, pageSize = 20) =>
  useQuery({
    queryKey: [QK.binders, 'open', page, pageSize],
    queryFn: () => bindersApi.getOpenBinders({ page, page_size: pageSize }),
  });
```

**3d.** Export `useOpenBinders` from the binders feature barrel (`src/features/binders/index.ts`
if it exists, or document that it is ready for use).

### Acceptance
- `bindersApi.getOpenBinders()` is callable and typed.
- `useOpenBinders()` hook exists and is exported.
- `tsc --noEmit` passes.

---
doneeeeeeeeeeeeeeeeeeeeeeeeeeee
doneeeeeeeeeeeeeeeeeeeeeeeeeeee
doneeeeeeeeeeeeeeeeeeeeeeeeeeee
## Fix 4 — Policy Violation (High): `executeAction` must validate endpoint against a whitelist

### Files
- `src/lib/actions/runtime.ts`
- `src/api/endpoints.ts`

### Problem

`executeAction` dispatches HTTP calls using the raw `command.endpoint` string provided by the
server. This is the intentional design of the `actions/` contract system, but it means the
frontend is making API calls to arbitrary server-supplied paths with no client-side guard.
The policy fix is to validate that every `command.endpoint` matches a known pattern before
dispatching — not to replace it with a static constant (the endpoint is always dynamic, e.g.
`/binders/42/ready`), but to assert it matches a declared pattern.

### Required changes

**4a. Add an action endpoint whitelist to `src/api/endpoints.ts`**:
```ts
export const ACTION_ENDPOINT_PATTERNS: RegExp[] = [
  /^\/binders\/\d+\/ready$/,
  /^\/binders\/\d+\/return$/,
  /^\/charges\/\d+\/issue$/,
  /^\/charges\/\d+\/mark-paid$/,
  /^\/charges\/\d+\/cancel$/,
  /^\/clients\/\d+$/,   // for freeze/activate PATCH actions
];
```

**4b. In `src/lib/actions/runtime.ts`**, add a guard at the top of `executeAction`:
```ts
import { ACTION_ENDPOINT_PATTERNS } from '../../api/endpoints';

const isAllowedActionEndpoint = (endpoint: string): boolean =>
  ACTION_ENDPOINT_PATTERNS.some(p => p.test(endpoint));

export const executeAction = async (command: ActionCommand): Promise<void> => {
  if (!isAllowedActionEndpoint(command.endpoint)) {
    console.error(`Blocked action with unrecognised endpoint: ${command.endpoint}`);
    throw new Error(`פעולה לא מורשית: ${command.endpoint}`);
  }
  // ... existing dispatch logic unchanged
};
```

### Acceptance
- `executeAction` throws for any endpoint not matching `ACTION_ENDPOINT_PATTERNS`.
- All existing binder/charge/client actions pass the whitelist without change.
- `tsc --noEmit` passes.

---

## Fix 5 — Language Policy (Medium): Translate English history note in `return_binder`

### Files
- `app/binders/services/binder_service.py`

### Problem

```python
# Current (English — violates Hebrew-only policy):
notes=f"Picked up by {pickup_person_name}",
```

### Required change

Replace with Hebrew:
```python
notes=f"נאסף על ידי {pickup_person_name}",
```

Also add a note to `mark_ready_for_pickup` (currently no note is written at all):
```python
self.status_log_repo.append(
    binder_id=binder_id,
    old_status=old_status,
    new_status=BinderStatus.READY_FOR_PICKUP.value,
    changed_by=user_id,
    notes="סומן כמוכן לאיסוף",   # ← add this
)
```

### Acceptance
- `return_binder` status log note is `f"נאסף על ידי {pickup_person_name}"`.
- `mark_ready_for_pickup` status log note is `"סומן כמוכן לאיסוף"`.
- `pytest -q` passes.

---

## Fix 6 — Data Selection Risk (High): Deep-link `binder_id` must fall back to `GET /binders/{id}`

### Files
- `src/api/binders.api.ts`
- `src/api/endpoints.ts`
- `src/features/binders/hooks/useBinderDetail.ts` (create new)
- `src/features/binders/hooks/useBindersPage.ts`

### Problem

When a URL param like `?binder_id=123` is present on the binders page, the frontend attempts
to find the binder in the current page's list. If it is on a different page, filtered out, or
the list hasn't loaded yet, the drawer opens empty. The backend exposes `GET /binders/{id}`
for exactly this use-case, but no frontend hook or API function calls it.

### Required changes

**6a. `src/api/endpoints.ts`** — add:
```ts
BINDER_DETAIL: (id: number) => `/binders/${id}`,
```

**6b. `src/api/binders.api.ts`** — add:
```ts
getBinder: (binderId: number): Promise<BinderResponse> =>
  apiClient.get(ENDPOINTS.BINDER_DETAIL(binderId)).then(r => r.data),
```

(`BinderResponse` should already be typed in this file; add if missing — it matches the
backend `BinderResponse` schema: `id`, `client_id`, `client_name`, `binder_number`,
`binder_type`, `status`, `received_at`, `returned_at`, `pickup_person_name`, `days_in_office`,
`work_state`, `signals`, `available_actions`.)

**6c. Create `src/features/binders/hooks/useBinderDetail.ts`**:
```ts
import { useQuery } from '@tanstack/react-query';
import { bindersApi } from '../../../api/binders.api';
import { QK } from '../../../lib/queryKeys';

export const useBinderDetail = (binderId: number | null) =>
  useQuery({
    queryKey: [QK.binders, 'detail', binderId],
    queryFn: () => bindersApi.getBinder(binderId!),
    enabled: binderId !== null,
  });
```

**6d. Update `src/features/binders/hooks/useBindersPage.ts`**

When a `binder_id` URL param is detected:
1. Try to find the binder in `data.items` (current page).
2. If not found **and** the list query has finished loading, call `useBinderDetail(binderId)`
   to fetch it individually, then use that result to populate the drawer.

The hook should expose a `selectedBinder` value that is either the page-list match or the
individually-fetched result, never `undefined` while its query is still loading.

Minimal pattern:
```ts
const urlBinderId = /* read from searchParams */;
const pageMatch = data?.items.find(b => b.id === urlBinderId) ?? null;
const needsFallback = urlBinderId !== null && !isLoading && pageMatch === null;
const { data: detailBinder } = useBinderDetail(needsFallback ? urlBinderId : null);
const selectedBinder = pageMatch ?? detailBinder ?? null;
```

### Acceptance
- Navigating to `/binders?binder_id=123` when binder 123 is not on page 1 triggers
  `GET /api/v1/binders/123` and populates the drawer correctly.
- `bindersApi.getBinder(id)` is callable and typed.
- `useBinderDetail(id)` hook is exported from the binders feature.
- `tsc --noEmit` passes.

---

## Execution Order

Apply fixes in this order to avoid cascading errors:

1. **Fix 5** — pure string change in one method, zero risk
2. **Fix 1** — backend service extraction; keep router signatures identical so no frontend changes needed
3. **Fix 6a + 6b** — add `BINDER_DETAIL` endpoint + `getBinder` API function
4. **Fix 6c + 6d** — `useBinderDetail` hook + `useBindersPage` fallback
5. **Fix 3** — add `BINDERS_OPEN`, `getOpenBinders`, `useOpenBinders`
6. **Fix 2** — remove `work_state` gate in `BindersColumns.tsx`
7. **Fix 4** — add `ACTION_ENDPOINT_PATTERNS` whitelist + guard in `executeAction`

---

## Final Verification Checklist

### Backend
- [ ] `binders_list_get.py` — zero imports from `app.clients.repositories.*`
- [ ] `binders_common.py` — zero direct `ClientRepository(db)` calls
- [ ] `binder_service.py` (or `binder_list_service.py`) — `list_binders_enriched` method owns all enrichment
- [ ] `binder_service.py:return_binder` — note is `f"נאסף על ידי {pickup_person_name}"`
- [ ] `binder_service.py:mark_ready_for_pickup` — note is `"סומן כמוכן לאיסוף"`
- [ ] No Python file in `app/binders/` exceeds 150 lines
- [ ] `pytest -q` passes

### Frontend
- [ ] `src/api/endpoints.ts` — `BINDER_DETAIL`, `BINDERS_OPEN` entries present
- [ ] `src/api/binders.api.ts` — `getBinder(id)` and `getOpenBinders()` functions present and typed
- [ ] `src/features/binders/hooks/useBinderDetail.ts` — hook created and exported
- [ ] `src/features/binders/hooks/useOpenBinders.ts` — hook created and exported
- [ ] `src/features/binders/hooks/useBindersPage.ts` — `selectedBinder` falls back to `useBinderDetail` when binder not in page list
- [ ] `src/features/binders/components/BindersColumns.tsx` — no `work_state` check adjacent to action rendering
- [ ] `src/lib/actions/runtime.ts` — `executeAction` validates `command.endpoint` against `ACTION_ENDPOINT_PATTERNS`
- [ ] `src/api/endpoints.ts` — `ACTION_ENDPOINT_PATTERNS` array declared
- [ ] `tsc --noEmit` passes