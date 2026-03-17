# Annual Income Tax Report Flow — Deep-Dive Map

> This document is a complete reference map of the Annual Report domain across backend and frontend.
> All paths are relative to `/Users/matanmalka/Desktop/`.

---

## 1. Data Model

### Tables & ORM Models

#### `annual_reports` — [backend/app/annual_reports/models/annual_report_model.py](backend/app/annual_reports/models/annual_report_model.py)

| Column                 | Type                      | Constraints         | Notes                        |
| ---------------------- | ------------------------- | ------------------- | ---------------------------- |
| `id`                   | Integer PK                | autoincrement       |                              |
| `client_id`            | FK → clients              | not null, indexed   |                              |
| `created_by`           | FK → users                | not null            |                              |
| `assigned_to`          | FK → users                | nullable, indexed   |                              |
| `tax_year`             | Integer                   | not null            |                              |
| `client_type`          | Enum(ClientTypeForReport) | not null            |                              |
| `form_type`            | Enum(AnnualReportForm)    | not null            | auto-set from client_type    |
| `status`               | Enum(AnnualReportStatus)  | default NOT_STARTED |                              |
| `deadline_type`        | Enum(DeadlineType)        |                     | STANDARD / EXTENDED / CUSTOM |
| `filing_deadline`      | DateTime                  | nullable            | computed on create           |
| `custom_deadline_note` | String                    | nullable            |                              |
| `submitted_at`         | DateTime                  | nullable            |                              |
| `ita_reference`        | String                    | nullable            | Tax Authority ref number     |
| `assessment_amount`    | Numeric(14,2)             | nullable            |                              |
| `refund_due`           | Numeric(14,2)             | nullable            |                              |
| `tax_due`              | Numeric(14,2)             | nullable            |                              |
| `has_rental_income`    | Boolean                   | default False       | triggers SCHEDULE_B          |
| `has_capital_gains`    | Boolean                   | default False       | triggers SCHEDULE_BET        |
| `has_foreign_income`   | Boolean                   | default False       | triggers SCHEDULE_GIMMEL     |
| `has_depreciation`     | Boolean                   | default False       | triggers SCHEDULE_DALET      |
| `has_exempt_rental`    | Boolean                   | default False       | triggers SCHEDULE_HEH        |
| `notes`                | Text                      | nullable            |                              |
| `created_at`           | DateTime                  | default utcnow      |                              |
| `updated_at`           | DateTime                  | nullable            |                              |
| `deleted_at`           | DateTime                  | nullable            | soft delete                  |
| `deleted_by`           | FK → users                | nullable            | soft delete actor            |

**Indexes:** `idx_annual_report_client_year` (unique on client_id+tax_year), `idx_annual_report_status`, `idx_annual_report_deadline`, `idx_annual_report_assigned`

---

#### `annual_report_status_history` — [backend/app/annual_reports/models/annual_report_status_history.py](backend/app/annual_reports/models/annual_report_status_history.py)

| Column             | Type                | Notes                  |
| ------------------ | ------------------- | ---------------------- |
| `id`               | PK                  |                        |
| `annual_report_id` | FK → annual_reports |                        |
| `from_status`      | Enum                | nullable (first entry) |
| `to_status`        | Enum                | not null               |
| `changed_by`       | FK → users          |                        |
| `changed_by_name`  | String              | denormalized           |
| `note`             | String              | nullable               |
| `occurred_at`      | DateTime            | default utcnow         |

---

#### `annual_report_details` — [backend/app/annual_reports/models/annual_report_detail.py](backend/app/annual_reports/models/annual_report_detail.py)

One-to-one with annual_reports. Contains financial outcomes and credit points.
| Column | Type | Notes |
|--------|------|-------|
| `report_id` | FK (unique) | 1:1 |
| `tax_refund_amount` | Numeric | nullable |
| `tax_due_amount` | Numeric | nullable |
| `client_approved_at` | DateTime | nullable |
| `credit_points` | Numeric(5,2) | default 2.25 |
| `pension_credit_points` | Numeric | nullable |
| `life_insurance_credit_points` | Numeric | nullable |
| `tuition_credit_points` | Numeric | nullable |
| `pension_contribution` | Numeric | nullable |
| `donation_amount` | Numeric | nullable |
| `other_credits` | Numeric | nullable |
| `internal_notes` | Text | nullable |
| `amendment_reason` | Text | nullable |

---

#### `annual_report_income_lines` — [backend/app/annual_reports/models/annual_report_income_line.py](backend/app/annual_reports/models/annual_report_income_line.py)

| Column             | Type                   |
| ------------------ | ---------------------- |
| `annual_report_id` | FK                     |
| `source_type`      | Enum(IncomeSourceType) |
| `amount`           | Numeric(14,2)          |
| `description`      | String                 |
| timestamps         |                        |

**IncomeSourceType:** `BUSINESS`, `SALARY`, `INTEREST`, `DIVIDENDS`, `CAPITAL_GAINS`, `RENTAL`, `FOREIGN`, `PENSION`, `OTHER`

---

#### `annual_report_expense_lines` — [backend/app/annual_reports/models/annual_report_expense_line.py](backend/app/annual_reports/models/annual_report_expense_line.py)

| Column                    | Type                     | Notes                                         |
| ------------------------- | ------------------------ | --------------------------------------------- |
| `annual_report_id`        | FK                       |                                               |
| `category`                | Enum(ExpenseCategory)    |                                               |
| `amount`                  | Numeric(14,2)            | gross                                         |
| `recognition_rate`        | Numeric(5,2)             | 0-1; default from STATUTORY_RECOGNITION_RATES |
| `supporting_document_ref` | String                   | nullable                                      |
| `supporting_document_id`  | FK → permanent_documents | nullable                                      |
| timestamps                |                          |

**STATUTORY_RECOGNITION_RATES:** Vehicle=0.75, Communication=0.80, all others=1.00
**ExpenseCategory:** `OFFICE_RENT`, `PROFESSIONAL_SERVICES`, `SALARIES`, `DEPRECIATION`, `VEHICLE`, `MARKETING`, `INSURANCE`, `COMMUNICATION`, `TRAVEL`, `TRAINING`, `BANK_FEES`, `OTHER`

---

#### `annual_report_schedules` — [backend/app/annual_reports/models/annual_report_schedule_entry.py](backend/app/annual_reports/models/annual_report_schedule_entry.py)

| Column             | Type                       |
| ------------------ | -------------------------- |
| `annual_report_id` | FK                         |
| `schedule`         | Enum(AnnualReportSchedule) |
| `is_required`      | Boolean                    |
| `is_complete`      | Boolean                    |
| `notes`            | String                     |
| `created_at`       | DateTime                   |
| `completed_at`     | DateTime                   |

**AnnualReportSchedule:** `SCHEDULE_B`, `SCHEDULE_BET`, `SCHEDULE_GIMMEL`, `SCHEDULE_DALET`, `SCHEDULE_HEH`
**Auto-generated on create** via `_generate_schedules()` using `SCHEDULE_FLAGS` map in [backend/app/annual_reports/services/constants.py:61](backend/app/annual_reports/services/constants.py#L61)

---

#### `annual_report_annex_data` — [backend/app/annual_reports/models/annual_report_annex_data.py](backend/app/annual_reports/models/annual_report_annex_data.py)

Flexible JSON store per schedule.
| Column | Type |
|--------|------|
| `annual_report_id` | FK |
| `schedule` | Enum |
| `line_number` | Integer |
| `data` | JSON |
| `notes` | String |
| timestamps | |

---

### Enums — [backend/app/annual_reports/models/annual_report_enums.py](backend/app/annual_reports/models/annual_report_enums.py)

| Enum                   | Values                                                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ClientTypeForReport`  | INDIVIDUAL, SELF_EMPLOYED, CORPORATION, PARTNERSHIP                                                                                                   |
| `AnnualReportForm`     | FORM_1301, FORM_1215, FORM_6111                                                                                                                       |
| `AnnualReportStatus`   | NOT_STARTED, COLLECTING_DOCS, DOCS_COMPLETE, IN_PREPARATION, PENDING_CLIENT, SUBMITTED, AMENDED, ACCEPTED, ASSESSMENT_ISSUED, OBJECTION_FILED, CLOSED |
| `AnnualReportSchedule` | SCHEDULE_B, SCHEDULE_BET, SCHEDULE_GIMMEL, SCHEDULE_DALET, SCHEDULE_HEH                                                                               |
| `DeadlineType`         | STANDARD, EXTENDED, CUSTOM                                                                                                                            |
| `ReportStage`          | MATERIAL_COLLECTION, IN_PROGRESS, FINAL_REVIEW, CLIENT_SIGNATURE, TRANSMITTED                                                                         |

---

### Cross-Domain FK Links

- `charges.annual_report_id` → annual_reports (migration 0006)
- `advance_payments.annual_report_id` → annual_reports (migration 0008)
- `annual_report_expense_lines.supporting_document_id` → permanent_documents

---

## 2. State Machine

### Status Flow — [backend/app/annual_reports/services/constants.py:17](backend/app/annual_reports/services/constants.py#L17)

```
NOT_STARTED → COLLECTING_DOCS
COLLECTING_DOCS → DOCS_COMPLETE | NOT_STARTED
DOCS_COMPLETE → IN_PREPARATION | COLLECTING_DOCS
IN_PREPARATION → PENDING_CLIENT | DOCS_COMPLETE
PENDING_CLIENT → IN_PREPARATION | SUBMITTED
SUBMITTED → ACCEPTED | ASSESSMENT_ISSUED
AMENDED → IN_PREPARATION | SUBMITTED
ACCEPTED → CLOSED
ASSESSMENT_ISSUED → OBJECTION_FILED | CLOSED | PENDING_CLIENT | IN_PREPARATION | DOCS_COMPLETE
OBJECTION_FILED → CLOSED | DOCS_COMPLETE
CLOSED → (terminal)
```

### Kanban Stage ↔ Status Mapping — [backend/app/annual_reports/services/kanban_service.py:6](backend/app/annual_reports/services/kanban_service.py#L6)

| Stage (UI)          | Status (backend) |
| ------------------- | ---------------- |
| material_collection | collecting_docs  |
| in_progress         | docs_complete    |
| final_review        | in_preparation   |
| client_signature    | pending_client   |
| transmitted         | submitted        |

### Transition Rules

- **Who can trigger:** any role (ADVISOR or SECRETARY) unless noted
- **ADVISOR-only:** DELETE, amend (`POST /{id}/amend`), delete income/expense lines
- **`PENDING_CLIENT` entry side effect:** auto-creates a SignatureRequest (cross-domain) — [backend/app/annual_reports/services/status_service.py:86](backend/app/annual_reports/services/status_service.py#L86)
- **`SUBMITTED` pre-condition:** `_assert_filing_readiness()` must pass:
  1. All required schedules complete
  2. `total_income > 0`
  3. Detail record has `tax_refund_amount` or `tax_due_amount` filled
  4. `client_approved_at` is set
- **Deadline computation** — [backend/app/annual_reports/services/deadlines.py](backend/app/annual_reports/services/deadlines.py):
  - STANDARD → April 30 of `tax_year + 1` at 23:59:59 UTC
  - EXTENDED → January 31 of `tax_year + 2` at 23:59:59 UTC
  - CUSTOM → manually set

---

## 3. API Surface

All routes require auth. Default = ADVISOR | SECRETARY. ADVISOR-only noted explicitly.

### Core CRUD

| Method | Path                                 | Auth    | Request                                  | Response                         |
| ------ | ------------------------------------ | ------- | ---------------------------------------- | -------------------------------- |
| POST   | `/api/v1/annual-reports`             | default | `AnnualReportCreateRequest`              | `AnnualReportDetailResponse` 201 |
| GET    | `/api/v1/annual-reports`             | default | `?tax_year&page&page_size&sort_by&order` | `AnnualReportListResponse`       |
| GET    | `/api/v1/annual-reports/kanban/view` | default | -                                        | `{stages:[...]}`                 |
| GET    | `/api/v1/annual-reports/overdue`     | default | `?tax_year`                              | `list[AnnualReportResponse]`     |
| GET    | `/api/v1/annual-reports/{id}`        | default | -                                        | `AnnualReportDetailResponse`     |
| DELETE | `/api/v1/annual-reports/{id}`        | ADVISOR | -                                        | 204                              |
| POST   | `/api/v1/annual-reports/{id}/amend`  | ADVISOR | `AmendRequest`                           | `AnnualReportDetailResponse`     |

### Status & Lifecycle

| Method | Path                                     | Auth    | Request                   | Response                      |
| ------ | ---------------------------------------- | ------- | ------------------------- | ----------------------------- |
| POST   | `/api/v1/annual-reports/{id}/status`     | default | `StatusTransitionRequest` | `AnnualReportResponse`        |
| POST   | `/api/v1/annual-reports/{id}/submit`     | default | `SubmitRequest`           | `AnnualReportDetailResponse`  |
| POST   | `/api/v1/annual-reports/{id}/transition` | default | `StageTransitionRequest`  | `AnnualReportDetailResponse`  |
| POST   | `/api/v1/annual-reports/{id}/deadline`   | default | `DeadlineUpdateRequest`   | `AnnualReportResponse`        |
| GET    | `/api/v1/annual-reports/{id}/history`    | default | -                         | `list[StatusHistoryResponse]` |

### Detail & Schedules

| Method | Path                                             | Request                           | Response                      |
| ------ | ------------------------------------------------ | --------------------------------- | ----------------------------- |
| GET    | `/api/v1/annual-reports/{id}/details`            | -                                 | `ReportDetailResponse`        |
| PATCH  | `/api/v1/annual-reports/{id}/details`            | `AnnualReportDetailUpdateRequest` | `ReportDetailResponse`        |
| GET    | `/api/v1/annual-reports/{id}/schedules`          | -                                 | `list[ScheduleEntryResponse]` |
| POST   | `/api/v1/annual-reports/{id}/schedules`          | `ScheduleAddRequest`              | `ScheduleEntryResponse` 201   |
| POST   | `/api/v1/annual-reports/{id}/schedules/complete` | `ScheduleCompleteRequest`         | `ScheduleEntryResponse`       |

### Financials

| Method | Path                                             | Auth    | Request                    | Response                   |
| ------ | ------------------------------------------------ | ------- | -------------------------- | -------------------------- |
| GET    | `/api/v1/annual-reports/{id}/financials`         | default | -                          | `FinancialSummaryResponse` |
| GET    | `/api/v1/annual-reports/{id}/tax-calculation`    | default | -                          | `TaxCalculationResponse`   |
| GET    | `/api/v1/annual-reports/{id}/advances-summary`   | default | -                          | `AdvancesSummary`          |
| GET    | `/api/v1/annual-reports/{id}/readiness`          | default | -                          | `ReadinessCheckResponse`   |
| POST   | `/api/v1/annual-reports/{id}/income`             | default | `IncomeLineCreateRequest`  | `IncomeLineResponse` 201   |
| PATCH  | `/api/v1/annual-reports/{id}/income/{line_id}`   | default | `IncomeLineUpdateRequest`  | `IncomeLineResponse`       |
| DELETE | `/api/v1/annual-reports/{id}/income/{line_id}`   | ADVISOR | -                          | 204                        |
| POST   | `/api/v1/annual-reports/{id}/expenses`           | default | `ExpenseLineCreateRequest` | `ExpenseLineResponse` 201  |
| PATCH  | `/api/v1/annual-reports/{id}/expenses/{line_id}` | default | `ExpenseLineUpdateRequest` | `ExpenseLineResponse`      |
| DELETE | `/api/v1/annual-reports/{id}/expenses/{line_id}` | ADVISOR | -                          | 204                        |

### Annex / Schedules Data

| Method | Path                                                     | Auth    |
| ------ | -------------------------------------------------------- | ------- |
| GET    | `/api/v1/annual-reports/{id}/annex/{schedule}`           | default |
| POST   | `/api/v1/annual-reports/{id}/annex/{schedule}`           | default |
| PATCH  | `/api/v1/annual-reports/{id}/annex/{schedule}/{line_id}` | default |
| DELETE | `/api/v1/annual-reports/{id}/annex/{schedule}/{line_id}` | ADVISOR |

### Season & Client

| Method | Path                                         |
| ------ | -------------------------------------------- |
| GET    | `/api/v1/tax-year/{year}/reports`            |
| GET    | `/api/v1/tax-year/{year}/summary`            |
| GET    | `/api/v1/clients/{client_id}/annual-reports` |
| GET    | `/api/v1/annual-reports/{id}/export/pdf`     |

---

## 4. Service Logic

### Service Facade — [backend/app/annual_reports/services/annual_report_service.py](backend/app/annual_reports/services/annual_report_service.py)

`AnnualReportService` inherits from 7 mixins:

- `AnnualReportCreateService` — create + schedule generation
- `AnnualReportStatusService` — state machine + deadline updates
- `AnnualReportKanbanService` — stage → status mapping
- `AnnualReportSeasonService` — season summary computation
- `AnnualReportScheduleService` — schedule management
- `AnnualReportQueryService` — reads, kanban view, amend
- `AnnualReportAnnexService` — annex CRUD

### Key Business Rules

**Creation** — [backend/app/annual_reports/services/create_service.py](backend/app/annual_reports/services/create_service.py):

1. Client must exist and not be CLOSED (`assert_client_allows_create`)
2. `client_type` must be valid enum
3. `assigned_to` user must exist
4. Unique constraint: one report per (client_id, tax_year)
5. `form_type` auto-derived from `client_type` via `FORM_MAP`
6. `filing_deadline` auto-computed from `deadline_type`
7. Schedules auto-generated based on boolean flags

**Tax Calculation** — [backend/app/annual_reports/services/financial_tax_service.py](backend/app/annual_reports/services/financial_tax_service.py):

1. Income total from income_lines
2. Recognized expenses = sum(amount × recognition_rate)
3. Net profit = total_income - recognized_expenses
4. Tax via `calculate_tax(net_profit, credit_points)` engine
5. NI via `calculate_national_insurance(net_profit)` engine
6. VAT pulled from `vat_reports.VatWorkItem` (cross-domain query)
7. Advance payments pulled from `advance_payments.AdvancePayment` (cross-domain query)
8. `total_liability = tax + ni + vat - advances`

**Readiness Check** — [backend/app/annual_reports/services/financial_tax_service.py:86](backend/app/annual_reports/services/financial_tax_service.py#L86):

- 4 checks → completion_pct = (passed / 4) × 100
- `is_ready` = all 4 pass

**`get_detail_report`** — [backend/app/annual_reports/services/query_service.py:46](backend/app/annual_reports/services/query_service.py#L46):

- Assembles full AnnualReportDetailResponse
- Calls `get_tax_calculation()` for net_profit
- Queries AdvancePayment for paid advances
- `final_balance = tax.tax_after_credits - advances_paid`

---

## 5. Cross-Domain Connections

| Source                  | Target              | How                                                                      | Where                                                                                                   | Notes                                                              |
| ----------------------- | ------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| annual_reports create   | clients             | `get_client_or_raise()`, `assert_client_allows_create()`                 | [create_service.py:36](backend/app/annual_reports/services/create_service.py#L36)                       | Blocks create if client CLOSED                                     |
| annual_reports create   | users               | `get_user_or_raise()` for assigned_to                                    | [create_service.py:56](backend/app/annual_reports/services/create_service.py#L56)                       | Validates user exists                                              |
| status → PENDING_CLIENT | signature_requests  | `SignatureRequestService.create()` with type=`ANNUAL_REPORT_APPROVAL`    | [status_service.py:86](backend/app/annual_reports/services/status_service.py#L86)                       | Sets `annual_report_id` on the request                             |
| tax_calculation         | vat_reports         | Direct ORM query on `VatWorkItem` table                                  | [financial_tax_service.py:34](backend/app/annual_reports/services/financial_tax_service.py#L34)         | Cross-layer violation (bypasses vat_reports repo)                  |
| tax_calculation         | advance_payments    | Direct ORM query on `AdvancePayment` table                               | [financial_tax_service.py:44](backend/app/annual_reports/services/financial_tax_service.py#L44)         | Cross-layer violation                                              |
| advances_summary        | advance_payments    | `AnnualReportAdvancesSummaryService.get_advances_summary()`              | [advances_summary_service.py:22](backend/app/annual_reports/services/advances_summary_service.py#L22)   | Sums paid advances for client/year                                 |
| clients status card     | annual_reports      | `AnnualReportRepository.get_by_client_year()`                            | [clients/services/status_card_service.py:72](backend/app/clients/services/status_card_service.py#L72)   | Cross-layer violation (client service imports annual_reports repo) |
| dashboard               | annual_reports      | `AnnualReportRepository` counts + `sum_financials_by_year()`             | [dashboard/services/dashboard_tax_service.py](backend/app/dashboard/services/dashboard_tax_service.py)  |                                                                    |
| timeline                | annual_reports      | Reads `AnnualReport` ORM; `annual_report_status_changed_event()` builder | [timeline/services/timeline_service.py](backend/app/timeline/services/timeline_service.py)              |                                                                    |
| charges                 | annual_reports      | FK `charges.annual_report_id` (nullable, indexed)                        | [charge/models/charge.py:40](backend/app/charge/models/charge.py#L40)                                   | **FK exists, never populated — dead column**                       |
| expense_lines           | permanent_documents | FK `supporting_document_id`                                              | [annual_report_expense_line.py:56](backend/app/annual_reports/models/annual_report_expense_line.py#L56) | Used to attach supporting documents                                |

### FK Relationships Added in Migration 0006 — [alembic/versions/0006_annual_report_income_expense_and_fks.py](backend/alembic/versions/0006_annual_report_income_expense_and_fks.py)

5 cross-domain FKs were added in one batch. No ON DELETE/UPDATE cascade rules on any of them.

| Table                | Column             | Populated in Code?                 | Used in Logic?                  | Status                |
| -------------------- | ------------------ | ---------------------------------- | ------------------------------- | --------------------- |
| `charges`            | `annual_report_id` | Never                              | Never                           | Dead column           |
| `binders`            | `annual_report_id` | Never                              | Never                           | Dead column           |
| `reminders`          | `annual_report_id` | Never                              | Never                           | Dead column           |
| `advance_payments`   | `annual_report_id` | Never                              | Never                           | Dead column           |
| `signature_requests` | `annual_report_id` | Yes — on PENDING_CLIENT transition | Yes — created by status_service | Active but no cleanup |

### reminders — [backend/app/reminders/](backend/app/reminders/)

The `annual_report_id` FK on reminders ([reminder.py:51](backend/app/reminders/models/reminder.py#L51)) was added in migration 0006 but is **completely unused**:

- `ReminderType` enum has no annual report type
- `factory.py` creates reminders only for: `TAX_DEADLINE_APPROACHING`, `BINDER_IDLE`, `UNPAID_CHARGE`, `CUSTOM`
- No service method, repository query, or API route references `annual_report_id`
- No annual report status transition triggers a reminder

### advance_payments — Reverse Direction — [backend/app/advance_payments/](backend/app/advance_payments/)

- `annual_report_id` exists on the model ([advance_payment.py](backend/app/advance_payments/models/advance_payment.py)) but is never populated
- `_ALLOWED_UPDATE_FIELDS` in the repository does **not include `annual_report_id`** — it cannot be set via normal update path
- When a report is soft-deleted: advance payments are **not touched** — the FK remains `NULL` (since it's never set)
- When a report is amended: no cascade logic exists

### signature_requests — Full Lifecycle — [backend/app/signature_requests/](backend/app/signature_requests/)

**Creation:** On every `PENDING_CLIENT` transition, `_trigger_signature_request()` creates a `SignatureRequest` with:

- `request_type = "ANNUAL_REPORT_APPROVAL"`
- `annual_report_id = report.id`
- Status: `PENDING_SIGNATURE`

**If report is deleted (soft-delete):**

- `delete_report()` in [annual_report_service.py:40](backend/app/annual_reports/services/annual_report_service.py#L40) calls `repo.soft_delete()` only
- **No signature request is canceled** — the request remains PENDING_SIGNATURE with a dangling reference

**If report transitions back from PENDING_CLIENT → IN_PREPARATION:**

- `transition_status()` validates the transition via `VALID_TRANSITIONS`
- `_trigger_signature_request()` is only called when `new_status == PENDING_CLIENT`
- **No cleanup of existing signature requests** when leaving PENDING_CLIENT
- The old signature request is never canceled, expired, or updated

**If report is amended (SUBMITTED → AMENDED):**

- `amend_report()` in [query_service.py:93](backend/app/annual_reports/services/query_service.py#L93) calls `transition_status()` + updates detail
- **No signature request handling** — any requests created before submission remain untouched

**If report transitions to PENDING_CLIENT multiple times:**

- A **new** signature request is created each time
- Old ones are never deactivated — multiple PENDING_SIGNATURE requests can exist for the same report

### binders — annual_report_id FK — [backend/app/binders/](backend/app/binders/)

- `Binder.annual_report_id` ([binder.py:39](backend/app/binders/models/binder.py#L39)) is nullable, indexed
- `binder_repository.create()` does not accept `annual_report_id` as a parameter
- No service method sets it
- No query filters by it
- **This is a planned but unimplemented link** — binders cannot currently be associated with annual reports programmatically

### Frontend: ClientAnnualReportsTab — [frontend/src/features/annualReports/components/shared/ClientAnnualReportsTab.tsx](frontend/src/features/annualReports/components/shared/ClientAnnualReportsTab.tsx)

**Component tree:**

```
ClientAnnualReportsTab
├── useClientAnnualReportsTab(clientId)
│   ├── useState(selectedYear)            # defaults to CURRENT_YEAR
│   ├── useQuery → annualReportsApi.listClientReports(clientId)
│   │   └── GET /api/v1/clients/{clientId}/annual-reports
│   ├── filteredReports = reports.filter(r.tax_year === selectedYear)
│   ├── yearHasReports(year) → boolean
│   └── openReport(id) → navigate('/tax/reports/{id}')
├── Year selector sidebar
│   └── Year buttons (descending) — green checkmark if yearHasReports(year)
└── SeasonReportsTable (read-only)
    ├── Columns: client_name, client_type+form_type, status badge, DeadlineCell, deadline_type, submitted_at
    └── onRowClick → navigate to /tax/reports/{id}
```

**Can a report be created from within the client page?** **No.** The tab is purely display + navigation. No create button, no modal, no action buttons per row. All mutations must happen via `/tax/reports`.

**Data shown per report (SeasonReportsTable columns):**

1. לקוח — `r.client_name`
2. סוג / טופס — `r.client_type` label + `r.form_type` badge
3. סטטוס — colored status badge
4. מועד הגשה — deadline date + days remaining (red if overdue)
5. סוג מועד — deadline_type label
6. הוגש — formatted `submitted_at`

---

## 6. Frontend Flow

### Routes — AppRoutes.tsx

| Path                       | Component                                          |
| -------------------------- | -------------------------------------------------- |
| `/tax/reports`             | `AnnualReportsKanban` page                         |
| `/tax/reports/:reportId`   | `AnnualReportDetail` page                          |
| `/clients/:clientId` (tab) | `ClientAnnualReportsTab` embedded in client detail |

### Page: AnnualReportsKanban — [frontend/src/pages/AnnualReportsKanban.tsx](frontend/src/pages/AnnualReportsKanban.tsx)

**Tabs:** Kanban | Season | Status

**Component Tree:**

```
AnnualReportsKanban
├── OverdueBanner                          # shows overdue count; links to kanban
├── Tab: "kanban"
│   ├── SeasonSummaryCards                # counts per stage
│   ├── AnnualReportsLegend              # color key
│   └── [5 × AnnualReportColumn]
│       └── [n × AnnualReportCard]       # paginated (6/page), forward/back arrows
├── Tab: "season"
│   ├── SeasonProgressBar
│   ├── SeasonSummaryCards
│   └── SeasonReportsTable
└── Tab: "status"
    └── AnnualReportStatusView
Modals:
├── CreateReportModal                     # opened by "דוח חדש" button
└── YearComparisonModal                   # opened by "השוואה" button
```

**Data Hooks:**

- `useAnnualReportsKanbanPage` (composite: kanban + season + overdue)
- `useSeasonDashboard(taxYear)` — `QK.tax.annualReports.seasonSummary`, `.seasonList`, `.overdue`
- `useCreateReport` — creates report, invalidates all
- `useYearComparison` — multi-year `useQueries`

**Kanban drag mechanics:**
No drag-and-drop library. Cards have ← → arrow buttons. Clicking fires `transitionStage(reportId, toStage)` → POST `/api/v1/annual-reports/{id}/transition`. On success: invalidates `QK.tax.annualReports.all` + `QK.timeline.clientRoot`.

### Page: AnnualReportDetail — [frontend/src/pages/AnnualReportDetail.tsx](frontend/src/pages/AnnualReportDetail.tsx)

**Component Tree:**

```
AnnualReportDetail
└── AnnualReportFullPanel (reportId from URL param)
    ├── PageHeader (client name, tax year, status badge)
    ├── Tab Navigation (7 sections)
    ├── AnnualReportSidebarStatus
    │   └── StatusTransitionPanel
    │       ├── TransitionTargetSelector   # valid next statuses
    │       ├── TransitionDetailsForm      # note, itaRef, amounts
    │       ├── ReadinessCheckPanel        # collapsible, auto-fetched
    │       ├── StatusHistoryTimeline
    │       │   └── [n × TimelineEvent]
    │       └── AmendReportModal           # ADVISOR only
    └── AnnualReportSectionContent (active section)
        ├── [overview] AnnualReportOverviewSection
        │   ├── ReportAlertBanners
        │   ├── ReportSummaryCards
        │   ├── ReportMetaGrid
        │   ├── AnnualReportDetailForm     # tax amounts, client_approved_at
        │   ├── ScheduleChecklist
        │   ├── AnnualPLSummary (collapsible)
        │   └── ReportHistoryTable
        ├── [financials] IncomeExpensePanel
        │   ├── FinancialSummaryCards
        │   ├── [income] FinancialLineRow × n
        │   │   └── EditIncomeLineForm (inline)
        │   ├── [expense] FinancialLineRow × n
        │   │   ├── EditExpenseLineForm (inline)
        │   │   └── AddExpenseLineForm
        │   └── IncomeExpensePanelParts
        ├── [tax] TaxCalculationPanel
        │   ├── TaxCalculatorInputs        # edit credit points
        │   ├── TaxBracketsTable
        │   ├── TaxCreditsPanel
        │   └── TaxSavingsOpportunities
        ├── [deductions] DeductionsTab
        │   └── AnnexDataPanel × schedule
        │       └── AnnexDataTable
        │           └── ScheduleAddForm / edit rows
        ├── [documents] DocumentsTab
        └── [timeline] FilingTimelineTab
Header Actions (ADVISOR only):
├── Export PDF button
└── Delete Report → DeleteReportConfirmDialog
```

**Data Hooks:**

- `useAnnualReportDetailPage(reportId)` — composite hook
- `useReportDetail(reportId)` — `QK.tax.annualReports.detail(reportId)`
- `useReportMutations(reportId, clientId)` — transition, updateDetail, deleteReport
- `useReportSchedules(reportId)` — completeSchedule, addSchedule
- `useIncomeExpenseMutations(reportId)` — income/expense CRUD

### Modals

| Modal                     | Trigger                 | Owner Component       |
| ------------------------- | ----------------------- | --------------------- |
| CreateReportModal         | "דוח חדש" button        | AnnualReportsKanban   |
| YearComparisonModal       | "השוואה" button         | AnnualReportsKanban   |
| AmendReportModal          | Amend action button     | StatusTransitionPanel |
| DeleteReportConfirmDialog | Delete button (ADVISOR) | AnnualReportFullPanel |

### Role-Based UI

| Feature                     | ADVISOR | SECRETARY |
| --------------------------- | ------- | --------- |
| Export PDF                  | ✓       | ✗         |
| Delete report               | ✓       | ✗         |
| Amend report                | ✓       | ✗         |
| Delete income/expense lines | ✓       | ✗         |
| Status transitions          | ✓       | ✓         |
| Edit detail form            | ✓       | ✓         |
| Kanban stage moves          | ✓       | ✓         |
| Create report               | ✓       | ✓         |

---

## 7. React Query Cache Keys

| Key                                        | Data               | Invalidated By              |
| ------------------------------------------ | ------------------ | --------------------------- |
| `QK.tax.annualReports.kanban`              | kanban stages      | transitionStage             |
| `QK.tax.annualReports.all`                 | all reports        | create, transition, delete  |
| `QK.tax.annualReports.detail(id)`          | full detail        | mutations, schedules        |
| `QK.tax.annualReports.seasonSummary(year)` | season stats       | (manual refetch)            |
| `QK.tax.annualReports.seasonList(year)`    | season report list | (manual refetch)            |
| `QK.tax.annualReports.overdue(year)`       | overdue list       | (manual refetch)            |
| `QK.tax.annualReportsForClient(clientId)`  | client's reports   | create                      |
| `QK.tax.annualReportFinancials(id)`        | financials summary | income/expense mutations    |
| `QK.tax.annualReportReadiness(id)`         | readiness check    | income/expense mutations    |
| `QK.timeline.clientRoot(clientId)`         | client timeline    | transitionStage, transition |
| `QK.reports.annualReportStatus(year)`      | status report      | (manual refetch)            |

---

## 8. Annex Schedule Fields — [frontend/src/features/annualReports/annex.constants.ts](frontend/src/features/annualReports/annex.constants.ts)

| Schedule        | Hebrew        | Fields                                                                                               |
| --------------- | ------------- | ---------------------------------------------------------------------------------------------------- |
| schedule_b      | שכירות        | property_address, gross_income, expenses, net_income                                                 |
| schedule_bet    | רווחי הון     | asset_description, purchase_date, sale_date, purchase_price, sale_price, exempt_amount, taxable_gain |
| schedule_gimmel | הכנסות מחו"ל  | country, income_type, gross_amount, foreign_tax_paid, credit_claimed                                 |
| schedule_dalet  | פחת           | asset_name, purchase_date, cost, depreciation_rate, annual_depreciation, accumulated                 |
| schedule_heh    | שכר דירה פטור | property_address, monthly_rent, annual_rent, exempt_ceiling, taxable_portion                         |

---

## 9. Alembic Migrations (annual_reports)

| File                                                | What it does                                                                                             |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `0006_annual_report_income_expense_and_fks.py`      | Creates income_lines, expense_lines tables; adds annual_report_id FK to charges, binders, reminders      |
| `0007_add_credit_points_to_annual_report_detail.py` | Adds `credit_points` column (default 2.25) to details                                                    |
| `0008_add_annual_report_id_to_advance_payments.py`  | Adds `annual_report_id` FK + index to advance_payments                                                   |
| `0009_add_annual_report_annex_data.py`              | Creates `annual_report_annex_data` table                                                                 |
| `0018_add_annual_report_schedules_table.py`         | Creates `annual_report_schedules` table                                                                  |
| `0010`, `0011`, `0014`, `0019`                      | Add pension_contribution, donation, other_credits, per-source credit_points, amendment_reason to details |

---

## 10. UX & Design

**Hebrew Labels (key):**

- לוח דוחות שנתיים — Annual Reports Board
- דוח חדש — New Report
- שנת מס — Tax Year
- סוג לקוח — Client Type
- מועד הגשה — Filing Deadline
- מסמכים התקבלו — Documents Received
- בהכנה — In Preparation
- ממתין לאישור לקוח — Pending Client Approval
- הוגש — Submitted
- שומה הוצאה — Assessment Issued
- סה"כ הכנסות — Total Income
- סה"כ הוצאות — Total Expenses
- הכנסה חייבת — Taxable Income
- מס לפני זיכויים — Tax Before Credits
- זיכויי מס — Tax Credits
- מס סופי לתשלום — Final Tax

**Status Badge Variants:**

- `neutral` → not_started, closed
- `info` → collecting_docs, docs_complete, in_preparation
- `warning` → pending_client, assessment_issued, amended
- `success` → submitted, accepted
- `error` → objection_filed

**Days-until-due pill colors (AnnualReportCard):**

- Red: overdue (< 0)
- Orange: ≤ 7 days
- Gray: > 7 days

---

## 11. Gaps & Inconsistencies

### Frontend–Backend Mismatches

1. **Status route naming mismatch:** The frontend `annualReport.status.api.ts` calls `POST /api/v1/annual-reports/{id}/transition-status` but the backend router defines `POST /{id}/status`. Likely a bug or stale frontend constant that would result in 404s.

2. **`AMENDED` not in kanban stage map:** If a report is `AMENDED`, it won't appear in any kanban column — `STAGE_TO_STATUS` in [kanban_service.py:6](backend/app/annual_reports/services/kanban_service.py#L6) has no `amended` entry. Frontend kanban silently drops amended reports.

3. **`ASSESSMENT_ISSUED` and `OBJECTION_FILED` not in kanban:** Both statuses have no column. Reports in these states vanish from the board. ASSESSMENT_ISSUED in particular has complex rollback transitions defined in `VALID_TRANSITIONS`.

4. **Frontend tax bracket duplication:** `useCreateReport.ts` (lines 14-36) hardcodes 2024 Israeli tax brackets for the preview calculation — duplicates `tax_engine` backend logic. Will drift.

### Architecture / Layering Violations

5. **Direct ORM cross-domain queries:** `financial_tax_service.py` queries `VatWorkItem` and `AdvancePayment` ORM models directly without going through their domain's repository — violates CLAUDE.md's "no cross-domain imports at Repository or Model level" rule.

6. **Client service imports annual_reports repo:** `clients/services/status_card_service.py` imports `AnnualReportRepository` directly — violates the same layering rule.

7. **`AnnexDataRepository` not wired in constructor:** Created on-demand via `_get_annex_repo()` in the service — inconsistent with all other repos wired in `AnnualReportService.__init__`.

### Orphaned FKs (migration 0006 dead columns)

8. **`charges.annual_report_id`** — never populated, never queried. Dead column.
9. **`binders.annual_report_id`** — never populated, never queried. Dead column. No code links a binder to a report.
10. **`reminders.annual_report_id`** — never populated. No `ReminderType` for annual reports. No factory function. Dead column.
11. **`advance_payments.annual_report_id`** — never populated. Advances are only linked to reports via `client_id + year` in queries, not via this FK.

### Lifecycle / Data Integrity

12. **Signature requests not cleaned up on report deletion:** `delete_report()` ([annual_report_service.py:40](backend/app/annual_reports/services/annual_report_service.py#L40)) soft-deletes the report but leaves associated signature requests in `PENDING_SIGNATURE` state with a dangling `annual_report_id`.

13. **Signature requests accumulate on re-entry to PENDING_CLIENT:** Each `PENDING_CLIENT` transition creates a new signature request. Prior requests are never canceled. Multiple `PENDING_SIGNATURE` requests can pile up for the same report.

14. **No signature request cleanup on amendment:** Transitioning from SUBMITTED → AMENDED ([query_service.py:93](backend/app/annual_reports/services/query_service.py#L93)) creates no new signature request and cancels no old ones.

15. **No signature request cleanup when leaving PENDING_CLIENT:** Transitioning back to IN_PREPARATION leaves the original signature request active.

### UI Limitations

16. **No optimistic updates:** All mutations wait for server response — no cache pre-updates observed.

17. **`ClientAnnualReportsTab` is read-only:** Cannot create, edit, or delete reports from within the client page. The create flow requires navigating to `/tax/reports`.

18. **`list_all_with_clients()` cross-domain repo import in service base:** `base.py` calls `client_repo.list_by_ids()` — service layer importing another domain's repo is a cross-layer concern.
