# TODO.md — Comprehensive Code Review Fixes

> Full-stack code review of the Israeli Tax Consultant CRM.
> **35 issues found** across frontend and backend. Organized by priority.

---

## 🔴 P0 — CRITICAL (Fix Immediately)

---

### TODO 7: F5 — TaxDeadlineDrawer passes wrong ID (BROKEN NAV)
- **File:** `frontend/src/features/taxDeadlines/components/TaxDeadlineDrawer.tsx:43`
- **Bug:** `navigate(\`/tax/advance-payments?client_id=${deadline.business_id}\`)` — query param `client_id` receives a `business_id` value.
- **Fix:** Backend returns `client_id` in tax deadline response, or frontend resolves via business lookup.
  ```diff
  - navigate(`/tax/advance-payments?client_id=${deadline.business_id}&year=${year}`)
  + navigate(`/tax/advance-payments?client_id=${deadline.client_id}&year=${year}`)
  ```
- **Test:** Click "view advance payments" from tax deadline → verify correct data loads.

---

### TODO 8: F6 — Charges form uses wrong field name (SEMANTIC MISMATCH)
- **File:** `frontend/src/features/charges/schemas.ts:15,51`
- **Bug:** Schema defines `client_id` (line 15) but maps to `business_id: Number(values.client_id)` (line 51). The form label says "לקוח" (client) but it actually selects a business. For clients with multiple businesses, wrong entity gets charged.
- **Fix:**
  1. Rename schema field: `client_id` → `business_id`
  2. Update form UI label to "עסק" (business) or show business name with client context
  3. Remove the mapping in `toCreateChargePayload`: `business_id: Number(values.business_id)` (direct, no rename needed)
- **Related cleanup:** Also fix F9 (charges.api.ts workaround), F11 (workItem.schema.ts), F12 (useCreateReport.ts), F13 (useTaxDeadlines.ts) — all have the same `client_id → business_id` mapping pattern.
- **Test:** Create charge for a client with 2+ businesses → verify correct business is charged.

---

### TODO 9: B3 — N+1 query in VAT report enrichment (PERFORMANCE)
- **File:** `backend/app/vat_reports/services/vat_report_enrichment.py:29,48,92`
- **Bug:** After `business_repo.list_by_ids(business_ids)`, code accesses `business.client.full_name` in dict comprehensions. `Business.client` is `lazy="select"` so each access fires a separate SQL query. 100 businesses = 100 extra queries.
- **Fix:** In the repository method that fetches businesses by IDs, add eager loading:
  ```python
  from sqlalchemy.orm import joinedload

  def list_by_ids(self, ids: list[int]) -> list[Business]:
      return self.db.query(Business).options(
          joinedload(Business.client)
      ).filter(Business.id.in_(ids)).all()
  ```
- **Test:** Enable SQL logging → fetch VAT list with 20 businesses → verify only 2 queries (businesses + clients via JOIN), not 22.

---

## 🟠 P1 — HIGH (Fix Soon)

### TODO 10: F7 — SignatureRequestsPage fallback navigation (BROKEN NAV)
- **File:** `frontend/src/features/signatureRequests/pages/SignatureRequestsPage.tsx:56`
- **Bug:** `businessLookup[req.business_id]?.clientId ?? req.business_id` — fallback uses `business_id` as `client_id`.
- **Fix:** Remove the fallback entirely. If lookup fails, disable the link or show business name only:
  ```typescript
  const clientId = businessLookup[req.business_id]?.clientId;
  // Only render Link if clientId is resolved
  ```
- **Test:** Create signature request for business not in lookup → verify link is disabled/absent.

---

### TODO 11: F8 — Date format inconsistency (UX)
- **File:** `frontend/src/utils/utils.ts:30,40`
- **Bug:** `formatDate()` uses `"d.M.yyyy"` (e.g., "3.1.2026") while DatePicker uses `"dd/MM/yyyy"` (e.g., "03/01/2026"). Inconsistent display across app.
- **Fix:**
  ```diff
  - return format(parseISO(value), "d.M.yyyy", { locale: he });
  + return format(parseISO(value), "dd/MM/yyyy", { locale: he });

  - return format(parseISO(value), "d.M.yyyy HH:mm", { locale: he });
  + return format(parseISO(value), "dd/MM/yyyy HH:mm", { locale: he });
  ```
- **Also check:** AgingReportTable, ScheduleChecklist for inline date formats (TODO 22).
- **Test:** View any date in a table → verify format is `dd/MM/yyyy`.

---

### TODO 12: F9 — Remove charges.api.ts workaround (CLEANUP after TODO 8)
- **File:** `frontend/src/features/charges/api/charges.api.ts:17-20`
- **Bug:** Runtime normalization: `if params.business_id == null && params.client_id != null → copy client_id to business_id`. This masks the root cause (TODO 8).
- **Fix:** After TODO 8 is implemented, remove this normalization block entirely.
- **Depends on:** TODO 8

---

### TODO 13: F10 — notifications.api.ts entity confusion (CLEANUP)
- **File:** `frontend/src/features/notifications/api/notifications.api.ts:55-67`
- **Bug:** `business_id ?? payload.client_id` fallback.
- **Fix:** Standardize to `business_id` only after systemic fix.
- **Depends on:** TODO 8

---

### TODO 15: F12 — useCreateReport.ts client_id→business_id (CLEANUP)
- **File:** `frontend/src/features/annualReports/hooks/useCreateReport.ts:69`
- **Bug:** `business_id: Number(values.client_id)` mapping.
- **Fix:** Rename schema field to `business_id`.
- **Depends on:** TODO 8

---

### TODO 16: F13 — useTaxDeadlines.ts client_id→business_id (CLEANUP)
- **File:** `frontend/src/features/taxDeadlines/hooks/useTaxDeadlines.ts:129`
- **Bug:** `business_id: Number(values.client_id)` mapping.
- **Fix:** Rename schema field to `business_id`.
- **Depends on:** TODO 8

---

### TODO 17: B4 — Reminders endpoint missing permission check (SECURITY)
- **File:** `backend/app/reminders/api/routes_list.py:14-21`
- **Bug:** `list_reminders` has no `require_role()` dependency. Any authenticated user (even without proper role) can list all reminders.
- **Fix:**
  ```python
  @list_router.get(
      "/",
      response_model=ReminderListResponse,
      dependencies=[Depends(require_role(UserRole.ADVISOR, UserRole.SECRETARY))],
  )
  ```
- **Test:** Call `GET /api/v1/reminders` with invalid role → verify 403.

---

### TODO 18: B5 — Override amount not validated (INVALID VAT FILING)
- **File:** `backend/app/vat_reports/services/filing.py:35-38`
- **Bug:** `override_amount` is checked for presence of `override_justification` but not for positive/non-zero value. User could file VAT with negative override.
- **Fix:**
  ```python
  if override_amount is not None and override_amount <= 0:
      raise AppError("סכום דריסה חייב להיות חיובי", code="INVALID_OVERRIDE_AMOUNT", status_code=400)
  ```
- **Test:** File VAT with override_amount=-100 → 400. File with override_amount=0 → 400.

---

### TODO 19: B6 — Unbounded VAT list query (PERFORMANCE)
- **File:** `backend/app/vat_reports/repositories/vat_work_item_repository.py:65-74`
- **Bug:** `list_by_business()` calls `.all()` with no LIMIT. Monthly filings × 10 years = 120+ records fetched.
- **Fix:** Add a reasonable limit (or pagination):
  ```python
  def list_by_business(self, business_id: int, limit: int = 200) -> list[VatWorkItem]:
      return (
          self.db.query(VatWorkItem)
          .filter(...)
          .order_by(VatWorkItem.period.desc())
          .limit(limit)
          .all()
      )
  ```
- **Test:** Create business with 300 VAT items → verify only 200 returned, newest first.

---

### TODO 20: B7 — Business name search with page_size=10000 (PERFORMANCE)
- **File:** `backend/app/vat_reports/services/vat_report_queries.py:42`
- **Bug:** `_resolve_business_ids()` fetches up to 10,000 businesses matching a name search. Broad terms (e.g., single Hebrew letter) could be expensive.
- **Fix:** Lower to a reasonable limit (e.g., 500) and log a warning if result is truncated:
  ```python
  businesses = business_repo.list(search=business_name, page=1, page_size=500)
  if len(businesses) >= 500:
      logger.warning("Business name search '%s' returned max results, may be truncated", business_name)
  ```
- **Test:** Search with very broad term → verify warning logged and response capped.

---

### TODO 21: B8 — Silent exception in compute_deadline_fields (DEBUGGABILITY)
- **File:** `backend/app/vat_reports/services/vat_report_queries.py:13-22`
- **Bug:** Bare `except Exception` returns all `None` fields without logging. Invalid period formats are invisible.
- **Fix:**
  ```diff
  - except Exception:
  + except (ValueError, TypeError) as exc:
  +     logger.warning("Failed to compute deadline for period '%s': %s", period, exc)
      return {"submission_deadline": None, "days_until_deadline": None, "is_overdue": None}
  ```
- **Test:** Pass invalid period format → verify warning logged (not silently swallowed).

---

### TODO 22: F14 — Missing TypeScript types for taxProfile and correspondence
- **File:** `frontend/src/features/taxProfile/types.ts:1`, `frontend/src/features/correspondence/types.ts:1`
- **Bug:** Both files contain only `// TODO: add types as feature grows`. No TypeScript interfaces for filter params, response types, or component props.
- **Fix:** Define interfaces matching backend schemas for both features.
- **Test:** TypeScript compilation passes with no `any` types in these features.

---

### TODO 23: F15 — useVatWorkItemDetail returns boolean error (POOR UX)
- **File:** `frontend/src/features/vatReports/hooks/useVatWorkItemDetail.ts:66`
- **Bug:** Returns `error: invoicesQuery.isError` (boolean). Calling components can't display a meaningful error message.
- **Fix:**
  ```diff
  - error: invoicesQuery.isError,
  + error: invoicesQuery.isError ? (invoicesQuery.error?.message ?? "שגיאה בטעינת חשבוניות") : null,
  ```
- **Test:** Simulate API error → verify error message displayed to user (not just boolean).

---

## 🟡 P2 — MEDIUM (Fix When Convenient)

### TODO 24: F16 — Document upload race condition
- **File:** `frontend/src/features/documents/hooks/useDocumentUpload.ts:31-38`
- **Bug:** `setUploadError(null)` at start, but if component re-renders mid-upload, error state and mutation state can desync.
- **Fix:** Reset `uploadError` in mutation's `onSuccess` callback instead of at the start.

---

### TODO 25: F17 — Bulk charge action stale data
- **File:** `frontend/src/features/charges/hooks/useChargesPage.ts:113-138`
- **Bug:** Invalidates all charges after bulk action, but partial failures leave some items in wrong UI state until refetch completes.
- **Fix:** Use selective invalidation based on `result.succeeded` IDs.

---

### TODO 26: F18 — Inline date formatting in components
- **Files:** AgingReportTable, ScheduleChecklist
- **Bug:** Use inline date formatting instead of central `formatDate()` utility.
- **Fix:** Refactor to import and use `formatDate()` from `utils/utils.ts`.

---

### TODO 27: F19 — Magic number `days_before: 7`
- **File:** `frontend/src/features/reminders/schemas.ts:62`
- **Bug:** Hardcoded default `days_before: 7` with no named constant.
- **Fix:** Extract to `const DEFAULT_REMINDER_DAYS_BEFORE = 7`.

---

### TODO 28: F20 — Reminder form missing conditional validation
- **File:** `frontend/src/features/reminders/api/contracts.ts:31-67`
- **Bug:** `annual_report_id` and `advance_payment_id` are optional but backend may require them for specific reminder types (e.g., ANNUAL_REPORT_DEADLINE).
- **Fix:** Add Zod refinement that validates these fields are present when reminder type requires them.

---

### TODO 29: B10 — VatInvoice created_at uses Date instead of DateTime
- **File:** `backend/app/vat_reports/models/vat_invoice.py:71`
- **Bug:** `created_at = Column(Date)` — cannot track creation time, only date. Invoices created on the same day have undefined order.
- **Fix:** Change to `Column(DateTime, nullable=False, default=utcnow)`. Requires Alembic migration.
- **Migration:** `alembic revision --autogenerate -m "vat_invoice_created_at_to_datetime"`

---

### TODO 30: B11 — final_vat_amount nullable for FILED items
- **File:** `backend/app/vat_reports/models/vat_work_item.py:58`
- **Bug:** `final_vat_amount` is `nullable=True`. No constraint ensures filed items have an amount.
- **Fix:** Add service-level assertion in `file_vat_return()`:
  ```python
  if final_vat_amount is None and override_amount is None:
      raise AppError("סכום מע״מ סופי חייב להיות מוגדר", code="MISSING_FINAL_AMOUNT", status_code=400)
  ```

---

### TODO 31: B12 — External invoice provider integration
- **File:** `backend/app/invoice/services/invoice_service.py:21`
- **Bug:** TODO comment: external invoice provider pending. `attach_invoice_to_charge()` exists but no auto-generation.
- **Fix:** Implement when external provider is selected. Not a code bug — documented feature gap.

---

## 🔵 P3 — LOW (Nice to Have)

### TODO 32: F21 — Phone placeholder mismatch
- **File:** `frontend/src/features/clients/components/ClientEditForm.tsx:84`
- **Fix:** Change `"05X-XXXXXXX"` to `"050-1234567"` to match schema regex.

---

### TODO 33: F22 — console.error in ErrorBoundary
- **File:** `frontend/src/components/errors/AppErrorBoundary.tsx:29`
- **Fix:** Replace with structured logging when a logging service is available.

---

### TODO 34: F23 — Charge amount as string
- **File:** `frontend/src/features/charges/schemas.ts:22-28`
- **Fix:** Consider `z.coerce.number()` for cleaner validation. Low priority.

---

### TODO 35: B13 — Index on vat_work_items for status + business_ids
- **File:** `backend/app/vat_reports/repositories/vat_work_item_repository.py:76-93`
- **Fix:** Monitor query performance. Add composite index `(status, business_id)` if slow.

---

### TODO 36: B9 — Start test suite
- **Location:** Backend (all domains)
- **Priority tests to write:**
  1. VAT rate calculations (deduction rates per category)
  2. Israeli ID checksum validation (valid/invalid IDs)
  3. Status transition validation (all domains)
  4. Permission checks (ADVISOR vs SECRETARY)
  5. OSEK PATUR ceiling enforcement
  6. Amendment chain validation (after TODO 3)
- **Framework:** `pytest` with `JWT_SECRET=test-secret`

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| 🔴 P0 Critical | 9 | Data loss, wrong calculations, broken navigation |
| 🟠 P1 High | 13 | Security, performance, UX bugs, workaround cleanup |
| 🟡 P2 Medium | 8 | Race conditions, stale data, tech debt |
| 🔵 P3 Low | 5 | Cosmetic, code quality, monitoring |
| **Total** | **35** | |

**Estimated completeness: ~82%**

### Dependency Graph
```
TODO 8 (F6 form rename) ──┬──→ TODO 12 (F9 charges.api cleanup)
                          ├──→ TODO 13 (F10 notifications cleanup)
                          ├──→ TODO 15 (F12 annual reports cleanup)
                          └──→ TODO 16 (F13 tax deadlines cleanup)

TODO 5-7 (backend client_id in response) ──→ TODOs 5,6,7 frontend nav fixes
```
