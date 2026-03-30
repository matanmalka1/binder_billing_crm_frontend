# TODO.md — Comprehensive Code Review Fixes

> Full-stack code review of the Israeli Tax Consultant CRM.
> **35 issues found** across frontend and backend. Organized by priority.

---
### TODO 29: B10 — VatInvoice created_at uses Date instead of DateTime
- **File:** `backend/app/vat_reports/models/vat_invoice.py:71`
- **Bug:** `created_at = Column(Date)` — cannot track creation time, only date. Invoices created on the same day have undefined order.
- **Fix:** Change to `Column(DateTime, nullable=False, default=utcnow)`. Requires Alembic migration.
- **Migration:** `alembic revision --autogenerate -m "vat_invoice_created_at_to_datetime"`

---

## 🔵 P3 — LOW (Nice to Have)

### TODO 34: F23 — Charge amount as string
- **File:** `frontend/src/features/charges/schemas.ts:22-28`
- **Fix:** Consider `z.coerce.number()` for cleaner validation. Low priority.

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
