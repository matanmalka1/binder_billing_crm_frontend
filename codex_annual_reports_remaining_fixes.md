# Codex Fix Prompt — `annual_reports` Remaining 8 Issues

## Context

Binder & Billing CRM — production Israeli accounting firm CRM.

**Backend rules (non-negotiable):**
- FastAPI + SQLAlchemy ORM + Pydantic v2
- Strict layering: `API → Service → Repository → ORM`
- No cross-domain imports at Repository or Model level
- No business logic in API routers — routers handle request/response only
- Service layer is the only permitted entry point for cross-domain calls
- Max 150 lines per Python file; split if exceeded
- All errors via `app.core.exceptions` (`AppError`, `NotFoundError`, `ConflictError`)

**Frontend rules (non-negotiable):**
- React 19 + TypeScript + Vite + TailwindCSS v4
- Feature-based structure: `src/features/<domain>/`
- All React Query keys via `QK.*` from `src/lib/queryKeys.ts` — no inline string arrays
- All UI text must be Hebrew only
- No cross-feature component imports — shared UI belongs in `src/components/`

Fix each issue independently. Do not change anything outside the listed files for each fix.

---

## Fix A — Frontend: Expose income/expense line edit (PATCH) in the UI

**Problem:** `PATCH /api/v1/annual-reports/{id}/income/{line_id}` and `PATCH /api/v1/annual-reports/{id}/expenses/{line_id}` exist in both the backend and `annualReportFinancials.api.ts` (`updateIncomeLine`, `updateExpenseLine`) but are never called from any UI component. Users must delete and re-add lines to correct mistakes.

**Files to touch:** `src/features/annualReports/components/AnnualReportFullPanel.tsx` (or the financial sub-panel component that renders income/expense lines — locate it).

**Fix:** In the income lines list and the expense lines list, add an edit (pencil) icon button next to each line. On click, render the existing add-form inline (or a small modal) pre-populated with the line's current values. On save, call `annualReportFinancialsApi.updateIncomeLine(reportId, line.id, payload)` or `updateExpenseLine`. On success, invalidate `QK.tax.annualReportFinancials(reportId)`.

Requirements:
- Use the existing `annualReportFinancialsApi.updateIncomeLine` and `updateExpenseLine` functions — do not create new API client functions.
- Invalidate the correct query key after mutation.
- Edit icon button label must be Hebrew (`aria-label="עריכת שורה"`).
- If the income/expense panel is its own component file, make the change there; do not restructure the component hierarchy.

---

## Fix B — Frontend: Expose annex line edit (PATCH) in the UI

**Problem:** `PATCH /api/v1/annual-reports/{id}/annex/{schedule}/{line_id}` exists in the backend and in `annualReportsApi.updateAnnexLine` but is never called from the UI.

**Files to touch:** The annex data panel component (likely inside `AnnualReportFullPanel.tsx` or a sibling `AnnexPanel` component).

**Fix:** Same pattern as Fix A — add an inline edit flow for each annex line using `annualReportsApi.updateAnnexLine(reportId, schedule, line.id, payload)`. On success, invalidate the annex query key for this report and schedule.

Requirements:
- Do not create new API client functions.
- Hebrew aria-label on edit button.
- Invalidate the correct existing `QK.*` key.

---

## Fix C — Frontend: Expose manual schedule add in the UI

**Problem:** `POST /api/v1/annual-reports/{id}/schedules` exists in both the backend and `annualReportsApi.addSchedule` but is never surfaced in the UI. Users cannot manually add a schedule that wasn't auto-generated from income flags.

**Files to touch:** The schedules/checklist section of `AnnualReportFullPanel.tsx` (or the dedicated schedule component).

**Fix:** Add an "הוסף נספח" (Add Schedule) button below the schedule checklist. On click, show a small inline form or dropdown with the available `AnnualReportScheduleKey` values not already present on the report. On submit, call `annualReportsApi.addSchedule(reportId, { schedule, notes })`. On success, invalidate `QK.tax.annualReports.detail(reportId)` (or the appropriate key that refreshes the schedules list).

Requirements:
- Only show schedule keys not already present on the report to avoid duplicates.
- Do not create new API client functions — `annualReportsApi.addSchedule` already exists.
- Hebrew labels only.

---

## Fix D — Frontend: Fix post-delete navigation route in `useReportDetail.ts`

**Problem:** After deleting a report, the hook navigates to `/annual-reports` but the actual route registered in `AppRoutes.tsx` is `/tax/reports`. This causes a broken redirect to a non-existent route.

**File:** `src/features/annualReports/hooks/useReportDetail.ts`

**Fix:** Find the `navigate` call after a successful delete mutation. Change the path from `"/annual-reports"` to `"/tax/reports"`:

```typescript
// Before
navigate("/annual-reports");

// After
navigate("/tax/reports");
```

Do not change any other navigation in the file.

---

## Fix E — Frontend: Replace inline React Query key with `QK.*` in `useReportDetail.ts`

**Problem:** `useReportDetail.ts` uses an inline hardcoded query key array `["annual-reports", "detail", null]` (or similar) instead of the centralized `QK.tax.annualReports.detail(id)` factory. This violates the QK policy and risks cache fragmentation.

**File:** `src/features/annualReports/hooks/useReportDetail.ts`

**Fix:** Find the `useQuery` call with the inline key. Replace it with the appropriate `QK` accessor. For example:

```typescript
// Before
queryKey: ["annual-reports", "detail", reportId]

// After
queryKey: QK.tax.annualReports.detail(reportId)
```

Verify `QK.tax.annualReports.detail` exists in `src/lib/queryKeys.ts`. If it does not exist yet, add it following the existing `QK.tax.annualReports.*` pattern. The key factory should accept a `reportId: number` and return a stable array.

---

## Fix F — Backend: Move business logic out of `annual_report_kanban.py` router

**Problem:** `app/annual_reports/api/annual_report_kanban.py` contains a `STAGE_TO_STATUS` mapping dict and uses it to resolve the target status before calling the service. This is business logic inside a router — a rule violation.

**Fix:**

**Step 1 — Move the mapping to the service layer.**

In `app/annual_reports/services/` (either in `status_service.py` or a new `kanban_service.py` if that keeps files under 150 lines), add:

```python
STAGE_TO_STATUS: dict[str, str] = {
    "material_collection": "collecting_docs",
    "in_progress": "docs_complete",
    "final_review": "in_preparation",
    "client_signature": "pending_client",
    "transmitted": "submitted",
}

def transition_stage(self, report_id: int, to_stage: str, changed_by: int, changed_by_name: str) -> AnnualReportResponse:
    target_status = STAGE_TO_STATUS.get(to_stage)
    if not target_status:
        raise AppError(f"שלב לא חוקי: {to_stage}", "ANNUAL_REPORT.INVALID_STAGE")
    return self.transition_status(
        report_id=report_id,
        new_status=target_status,
        changed_by=changed_by,
        changed_by_name=changed_by_name,
    )
```

Add `transition_stage` to `AnnualReportService` (via the appropriate mixin or directly on the facade).

**Step 2 — Simplify the router to be pass-through only.**

`app/annual_reports/api/annual_report_kanban.py` becomes:

```python
@router.post("/{report_id}/transition", response_model=AnnualReportDetailResponse)
def transition_stage(report_id: int, body: StageTransitionRequest, db: DBSession, user: CurrentUser):
    service = AnnualReportService(db)
    return service.transition_stage(
        report_id=report_id,
        to_stage=body.to_stage,
        changed_by=user.id,
        changed_by_name=user.full_name,
    )
```

No `STAGE_TO_STATUS`, no `if not target_status`, no `HTTPException` for business validation — all of that lives in the service.

---

## Fix G — Backend: Move completion math out of `annual_report_season.py` router

**Problem:** `app/annual_reports/api/annual_report_season.py`'s `get_season_summary` endpoint computes `done`, `rate`, and `overdue` count inline — this is business logic in a router.

**Fix:**

**Step 1 — Add `get_season_summary_response` to the service layer.**

In `app/annual_reports/services/query_service.py`, add a method that returns a fully-populated `SeasonSummaryResponse`:

```python
from app.annual_reports.schemas.annual_report import SeasonSummaryResponse

def get_season_summary_response(self, tax_year: int) -> SeasonSummaryResponse:
    summary = self.repo.get_season_summary(tax_year)
    overdue_count = len(self.repo.list_overdue(tax_year=tax_year))
    total = summary.get("total", 0)
    done = (
        summary.get("submitted", 0)
        + summary.get("accepted", 0)
        + summary.get("closed", 0)
    )
    completion_rate = round(done / total * 100, 1) if total > 0 else 0.0
    return SeasonSummaryResponse(
        tax_year=tax_year,
        total=total,
        not_started=summary.get("not_started", 0),
        collecting_docs=summary.get("collecting_docs", 0),
        docs_complete=summary.get("docs_complete", 0),
        in_preparation=summary.get("in_preparation", 0),
        pending_client=summary.get("pending_client", 0),
        submitted=summary.get("submitted", 0),
        accepted=summary.get("accepted", 0),
        assessment_issued=summary.get("assessment_issued", 0),
        objection_filed=summary.get("objection_filed", 0),
        closed=summary.get("closed", 0),
        completion_rate=completion_rate,
        overdue_count=overdue_count,
    )
```

Expose this via `AnnualReportService`.

**Step 2 — Simplify the router.**

`get_season_summary` in `annual_report_season.py` becomes a one-liner:

```python
@season_router.get("/{tax_year}/summary", response_model=SeasonSummaryResponse)
def get_season_summary(tax_year: int, db: DBSession, user: CurrentUser):
    return AnnualReportService(db).get_season_summary_response(tax_year)
```

No arithmetic in the router. Check file line counts after the change; split if needed.

---

## Fix H — Backend: Remove cross-domain imports from `create_service.py` and `annual_report_service.py`

**Problem:** Both files import directly from `app.clients` and `app.users` domains at the service level in a way that violates the intent of domain isolation. Specifically:

- `create_service.py` imports `ClientRepository`, `get_client_or_raise`, and `UserRepository`
- `annual_report_service.py` imports `ClientRepository`

The rule is: **no cross-domain imports at Repository or Model level.** Service-to-service cross-domain calls are permitted but should go through the other domain's service, not its repository directly. Importing `ClientRepository` directly into another domain's service bypasses that contract.

**Fix:**

**`app/annual_reports/services/create_service.py`:**

Replace the direct `ClientRepository` + `get_client_or_raise` usage with a call to `ClientService` (or the appropriate thin lookup from `app.clients.services`). The pattern used elsewhere in the codebase (e.g. `VatReportService`, `BillingService`) is to accept a `client_repo` injected from the facade, and call `get_client_or_raise(self.client_repo, client_id)`. Since the facade already owns `client_repo`, this is not a new dependency — it just needs to stop instantiating `ClientRepository` inside a mixin.

For the `UserRepository` usage in `create_service.py` (validating `assigned_to`):
- Replace with a call to `app.users.services.user_lookup.get_user_or_raise` (or equivalent) if one exists.
- If no such lookup helper exists in the `users` domain, create `app/users/services/user_lookup.py` mirroring the `app/clients/services/client_lookup.py` pattern:

```python
# app/users/services/user_lookup.py
from app.core.exceptions import NotFoundError
from app.users.repositories.user_repository import UserRepository

def get_user_or_raise(repo: UserRepository, user_id: int):
    user = repo.get_by_id(user_id)
    if not user:
        raise NotFoundError(f"משתמש {user_id} לא נמצא", "USER.NOT_FOUND")
    return user
```

Then in `create_service.py`, import and call `get_user_or_raise(self.user_repo, assigned_to)` where `self.user_repo` is injected by the facade.

**`app/annual_reports/services/annual_report_service.py`:**

The facade already assigns `self.client_repo = ClientRepository(db)`. This import is at the **service layer** (facade level), which is the permitted cross-domain entry point. However, to keep the boundary clear, change the import to go through `app.clients.services` rather than `app.clients.repositories` directly — or accept this as an approved service-layer boundary (document the decision with a comment). The strict violation is the repository-level import in `create_service.py`; the facade-level import is borderline acceptable per the existing codebase pattern (see `VatReportService`, `SignatureRequestService`, `BillingService` which all do the same). Leave the facade import in place with a comment, and focus the actual code change on `create_service.py`.

**`app/annual_reports/services/annual_report_service.py`** — add a comment:
```python
# Cross-domain: ClientRepository injected here at facade level only (service boundary).
# Lower layers (create_service, query_service) must not import client/user repos directly.
self.client_repo = ClientRepository(db)
```

Also add `user_repo` to the facade so mixins don't need to instantiate it themselves:
```python
from app.users.repositories.user_repository import UserRepository
self.user_repo = UserRepository(db)
```

And add `user_repo: Any` to `AnnualReportBaseService` alongside `client_repo: Any`.

Check line counts on all modified files. Split any file exceeding 150 lines.

---

## Fix I — Backend: Split oversized files to comply with 150-line rule

**Problem:** Several backend files exceed the 150-line hard limit. The known offenders are:

- `app/annual_reports/services/financial_service.py` (well over 150 lines)
- `app/annual_reports/services/tax_engine.py`
- Schema files in `app/annual_reports/schemas/`

**Fix — `financial_service.py`:**

Split into two files:
1. `app/annual_reports/services/financial_crud_service.py` — contains `add_income`, `update_income`, `delete_income`, `add_expense`, `update_expense`, `delete_expense`, `get_financial_summary`
2. `app/annual_reports/services/financial_tax_service.py` — contains `get_tax_calculation`, `get_readiness_check`

Keep `AnnualReportFinancialService` as the public name by importing and re-exporting from a thin `financial_service.py` facade, or rename the class in each file and expose both from `__init__.py`. Do not break any existing callers — `AnnualReportFinancialService` must remain importable from `app.annual_reports.services.financial_service`.

**Fix — `tax_engine.py`:**

If over 150 lines, extract the national insurance calculation logic into `app/annual_reports/services/ni_engine.py`. Keep `calculate_tax` and `TaxCalculationResult` in `tax_engine.py`.

**Fix — oversized schema files:**

If `app/annual_reports/schemas/annual_report.py` or `annual_report_financials.py` exceed 150 lines, split by logical group (request schemas vs response schemas, or financial vs status schemas). Update all imports in routers and services accordingly.

After splitting, run `pytest -q` to verify nothing is broken.

---

## Fix J — Frontend: Fix cross-feature import in `ClientDetailsTabContent.tsx`

**Problem:** `src/features/clients/components/ClientDetailsTabContent.tsx` imports a component directly from `src/features/annualReports/`. This violates the feature boundary rule — features must not import from other features; shared UI belongs in `src/components/`.

**Fix:**

**Step 1 — Identify the imported component.** Find the import in `ClientDetailsTabContent.tsx` that references `../annualReports/` or `../../annualReports/` (e.g. a `ClientAnnualReportsList` or similar component).

**Step 2 — Move it to shared.** Move the component to `src/components/annualReports/` (create the directory if needed). Update the component's own imports to use the correct relative paths from its new location.

**Step 3 — Update both import sites:**
- `ClientDetailsTabContent.tsx` → import from `src/components/annualReports/ComponentName`
- Any existing imports inside `src/features/annualReports/` that also use this component → update to the new path

Do not change the component's logic or props — only its location and import paths.

---


## Constraints (apply to all fixes)

- Do not modify any files in Sprints 1–9 frozen domains outside `annual_reports` and `clients` (for Fix J only).
- Do not add new API endpoints. All fixes use existing contracts.
- Do not rename exported symbols consumed by other files without updating all import sites.
- Backend: run `pytest -q` with `JWT_SECRET=test-secret` after all changes. All tests must pass.
- Frontend: no English visible in the UI. All new UI strings must be Hebrew.
- Frontend: all React Query mutations must invalidate the correct `QK.*` key.
- Apply each fix independently — they are self-contained.
