# Frontend ↔ Backend API Alignment Prompt
> Place this file at the **backend repo root** and reference it when working in the frontend project.

---

## Context

You are working on the **frontend** of a Hebrew-language CRM called **Binder & Billing CRM**.

- Frontend: `../frontend/` — React 19 + TypeScript + Vite + TailwindCSS v4
- Backend: FastAPI + SQLAlchemy, fully documented in `JSON_EXAMPLES.md` (this file's companion, at the backend root)
- All user-facing strings are in **Hebrew**
- Roles: `advisor` (full access), `secretary` (read-oriented)

---

## Your Task

Audit and align every API call in the frontend codebase to match the **exact** response shapes, field names, field types, and request bodies defined in `JSON_EXAMPLES.md`.

Work **domain by domain**, in this order:

1. Auth (`/api/v1/auth/*`)
2. Users & Audit Logs (`/api/v1/users/*`)
3. Clients (`/api/v1/clients/*`)
4. Businesses (`/api/v1/businesses/*`, `/api/v1/clients/{id}/businesses`)
5. Business Tax Profile (`/api/v1/businesses/{id}/tax-profile`)
6. Business Status Card (`/api/v1/businesses/{id}/status-card`)
7. Binders (`/api/v1/binders/*`)
8. Charges (`/api/v1/charges/*`)
9. Annual Reports (`/api/v1/annual-reports/*`, `/api/v1/tax-year/*`)
10. VAT Reports (`/api/v1/vat/*`)
11. Advance Payments (`/api/v1/advance-payments/*`, `/api/v1/businesses/{id}/advance-payments`)
12. Tax Deadlines (`/api/v1/tax-deadlines/*`)
13. Reminders (`/api/v1/reminders/*`)
14. Notifications (`/api/v1/notifications/*`)
15. Signature Requests (`/api/v1/signature-requests/*`, `/sign/*`)
16. Permanent Documents (`/api/v1/documents/*`)
17. Correspondence (`/api/v1/businesses/{id}/correspondence`)
18. Authority Contacts (`/api/v1/businesses/{id}/authority-contacts`)
19. Timeline (`/api/v1/businesses/{id}/timeline`)
20. Dashboard (`/api/v1/dashboard/*`)
21. Reports (`/api/v1/reports/*`)
22. Search (`/api/v1/search`)

---

## Rules — Follow These Exactly

### 1. Field names are snake_case — never camelCase
The backend returns and accepts `snake_case` everywhere.
- ✅ `full_name`, `business_id`, `tax_year`, `created_at`
- ❌ `fullName`, `businessId`, `taxYear`, `createdAt`

The **only exception** is the login request body which accepts `rememberMe` (alias defined in the backend schema).

### 2. Numeric fields arrive as strings (Decimal)
All monetary and rate fields serialised by Pydantic's `Decimal` type come over the wire as **quoted strings**, not numbers.

Fields affected include (but are not limited to):
- `amount`, `net_amount`, `vat_amount`, `paid_amount`, `expected_amount`
- `total_income`, `total_expenses`, `taxable_income`, `recognized_expenses`
- `recognition_rate`, `recognized_amount`, `deduction_rate`
- `tax_before_credits`, `tax_after_credits`, `credit_points_value`
- `total_output_vat`, `total_input_vat`, `net_vat`, `final_vat_amount`
- `pension_contribution`, `donation_amount`, `other_credits`
- `total_refund_due`, `total_tax_due`, `total_outstanding`
- `advance_rate`, `vat_exempt_ceiling`, `payment_amount`
- `total_advances_paid`, `final_balance`

In TypeScript, type these as `string` when received raw and convert with `parseFloat()` / `Number()` only at the point of display or arithmetic. Do **not** type them as `number`.

### 3. Date vs DateTime fields
- `DateTime` fields → ISO 8601 string with a `Z` suffix, e.g. `"2026-01-02T03:04:05Z"`. Type as `string` in TS.
- `Date`-only fields → `"YYYY-MM-DD"` string, e.g. `"2026-01-15"`. Type as `string` in TS.
- Check the `JSON_EXAMPLES.md` examples carefully — some fields on the same response mix both formats (`filed_at` is DateTime, `invoice_date` is Date-only, `submission_deadline` is Date-only).

### 4. Enum values are lowercase strings — never uppercase
All enums arrive as lowercase string literals matching the backend Python enum `.value`:
- `status`: `"active"`, `"frozen"`, `"closed"`, `"draft"`, `"issued"`, `"paid"`, `"canceled"`, `"pending"`, `"sent"`, `"filed"`, etc.
- `role`: `"advisor"` | `"secretary"`
- `period_type` (VAT): `"monthly"` | `"bimonthly"` | `"exempt"`
- `submission_method`: `"online"` | `"manual"` | `"representative"`
- `invoice_type`: `"income"` | `"expense"`
- `deadline_type`: `"vat"` | `"advance_payment"` | `"national_insurance"` | `"annual_report"` | `"other"`
- `balance_type`: `"due"` | `"refund"` | `"zero"`
- `client_type`: `"individual"` | `"self_employed"` | `"corporation"` | `"partnership"`
- `form_type`: `"1301"` | `"1215"` | `"6111"`

Never compare against `"ACTIVE"`, `"ADVISOR"`, etc.

### 5. Nullable fields use `null`, not `undefined`
Optional fields the backend omits or sets to `None` arrive as JSON `null`. Use `field ?? fallback` not `field || fallback` where `0` or `false` are valid values.

### 6. Pagination envelope shape
Every paginated list response has exactly these top-level keys:
```ts
{
  items: T[];
  page: number;
  page_size: number;
  total: number;
}
```
Some list responses add domain-specific top-level keys (e.g. `collection_rate`, `total_expected`, `total_paid` on advance payments overview). Check `JSON_EXAMPLES.md` per endpoint.

### 7. Action contracts
`available_actions` is an array of action objects attached to many entity responses (binders, businesses, charges, tax deadlines, annual reports). Shape:
```ts
interface Action {
  id: string;
  key: string;
  label: string;       // Hebrew string
  method: string;      // "get" | "post" | "patch" | "put" | "delete"
  endpoint: string;    // relative path, e.g. "/binders/5/ready"
  payload?: Record<string, unknown>;
  confirm?: {
    title: string;
    message: string;
    confirm_label: string;
    cancel_label: string;
    inputs?: Array<{ name: string; label: string; type: string; required: boolean }>;
  };
  // dashboard quick-action extras
  client_name?: string | null;
  binder_number?: string | null;
  category?: string | null;
  due_label?: string | null;
}
```

### 8. Error envelope
All error responses share this shape — handle it consistently:
```ts
interface ApiError {
  detail: string | unknown[];   // string for domain errors, array for validation errors
  error: string;                // stable error code, e.g. "CLIENT.NOT_FOUND"
  error_meta: {
    type: string;
    detail: string;
    status_code: number;
  };
}
```

### 9. VAT work-item numeric fields are strings
`total_output_vat`, `total_input_vat`, `net_vat`, `total_output_net`, `total_input_net`, `final_vat_amount` are all Decimal-serialised strings. The JSON examples show `"string"` as placeholder — treat as `string` type in TypeScript.

### 10. Business `client_name` field
Businesses returned from the **general list** (`GET /api/v1/businesses`) use `BusinessWithClientResponse` which adds:
- `client_full_name: string`
- `client_id_number: string`

Businesses returned from **client-scoped** (`GET /api/v1/clients/{id}/businesses`) use `BusinessResponse` which does **not** have those fields.

### 11. `VatWorkItemResponse` — fields to watch
- `period_type` is present (snapshot of VAT type at creation)
- `submission_method` replaces any legacy `filing_method` field
- `business_status` is the enum value of `BusinessStatus`, not a boolean
- `total_output_vat` / `total_input_vat` / `net_vat` / `total_output_net` / `total_input_net` are strings

### 12. Annual report `AnnualReportDetailResponse` extends `AnnualReportResponse`
The detail endpoint returns the full report plus:
```ts
schedules: ScheduleEntryResponse[];
status_history: StatusHistoryResponse[];
pension_contribution?: string | null;
donation_amount?: string | null;
other_credits?: string | null;
client_approved_at?: string | null;
internal_notes?: string | null;
amendment_reason?: string | null;
tax_refund_amount?: number | null;
tax_due_amount?: number | null;
total_income?: string | null;
total_expenses?: string | null;
taxable_income?: string | null;
profit?: string | null;
final_balance?: string | null;
```

### 13. Signature request — signer-facing vs advisor-facing schemas
- Advisor routes return `SignatureRequestResponse` (full fields including `signer_email`, `signed_at`, `canceled_by`, etc.)
- Public signer routes (`/sign/{token}`) return `SignerViewResponse` (minimal: `request_id`, `title`, `description`, `signer_name`, `status`, `content_hash`, `expires_at`)

### 14. Search results shape
```ts
interface SearchResponse {
  results: SearchResult[];
  documents: DocumentSearchResult[];
  page: number;
  page_size: number;
  total: number;
}
interface SearchResult {
  result_type: "client" | "binder";
  business_id: number;
  client_name: string;
  client_status?: string | null;
  binder_id?: number | null;
  binder_number?: string | null;
  work_state?: string | null;
  signals: string[];
}
```

### 15. Reminder `client_name` field
`ReminderResponse` has `client_name` but the backend calls it `business_name` internally — it will arrive on the response as `client_name` (the schema field name). Do not rename it.

### 16. Idempotency key header
The following endpoints require `X-Idempotency-Key: <uuid>` header:
- `POST /api/v1/charges/bulk-action`
- `POST /api/v1/businesses/bulk-action`

Always send this header for those calls.

### 17. File download endpoints
These return binary streams (`application/pdf` or `.xlsx`), not JSON. Use `blob` response type:
- `GET /api/v1/reports/aging/export`
- `GET /api/v1/annual-reports/{id}/export/pdf`
- `GET /api/v1/vat/businesses/{id}/export`
- `GET /api/v1/clients/export`
- `GET /api/v1/clients/template`

### 18. `business_id` vs `client_id`
The backend migrated from a flat `client` model to `client → businesses`. Key points:
- Binders are owned by `client_id` (not `business_id`)
- All operational domains (VAT, charges, advance payments, annual reports, timeline, etc.) are owned by `business_id`
- The `BusinessResponse` always includes both `id` (business) and `client_id`

---

## What to Check in Each File

For every service/hook/API client file in the frontend:

1. **Request body field names** — must match `JSON_EXAMPLES.md` request bodies exactly
2. **Response destructuring** — field names used in components must match the response schema
3. **TypeScript interfaces/types** — must reflect the exact shape from `JSON_EXAMPLES.md`
4. **Enum string comparisons** — must use lowercase values
5. **Decimal/string handling** — monetary fields must not be assumed to be `number`
6. **Nullable handling** — use `?? null` patterns, not truthy checks where `0`/`false` are valid
7. **Pagination destructuring** — always `{ items, page, page_size, total }`
8. **Error handling** — catch and read `error` (the stable code) and `detail` (the message)

---

## Output Format

For each domain you audit, report:

```
## [Domain Name]

### ✅ Aligned
- List of files/components that are already correct

### ❌ Issues Found
- `src/path/to/file.ts` line N: [description of mismatch]
  - Expected: [what JSON_EXAMPLES.md says]
  - Found: [what the frontend has]

### 🔧 Changes Made
- [List of changes applied]
```

Do not rewrite working code. Fix only actual mismatches.

---

## Reference

The canonical source of truth for every request/response shape is **`JSON_EXAMPLES.md`** at the backend root. When in doubt, that file wins over any comment, component prop, or existing TypeScript type in the frontend.
