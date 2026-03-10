# Refactor Tasks — Audit Findings

> **Rules before starting any task:**
> Read `CLAUDE.md` first.
> Do not read files not listed in the task.
> Do not implement other tasks.
> One task per conversation.

## Status

### Section A — Wrong Locations
- [x] A1 — Move `binders.types.ts` out of `src/api/`
- [x] A2 — Move `advancePayments` components out of `src/components/`
- [x] A3 — Move `NotificationsTab` out of `src/components/clientDetails/`
- [x] A4 — Move `FilingTimeline` out of `src/components/taxDeadlines/`
- [x] A5 — Move `NotificationDrawer` + `SeverityBadge` to `src/features/notifications/`
- [x] A6 — Move `UserFormFields.tsx` from `hooks/` to `components/`
- [x] A7 — Move `financialLabels.ts` out of `components/`
- [x] A8 — Resolve `advancedPayments/api/` conflict (duplicate api + types)

### Section B — Naming Violations
- [x] B1 — Rename all non-PascalCase component files
- [x] B2 — Rename `reminder.types.ts` → `types.ts`

### Section C — Missing Feature Files
- [x] C1 — Create missing `schemas.ts` / `types.ts` in feature folders

### Section D — Duplicate Shared Components
- [x] D1 — Consolidate `ClientSearchField` + `ClientSearchInput` into `src/components/ui/`
- [x] D2 — Consolidate `ConfirmDeleteDialog` + `ConfirmDialog`
- [x] D3 — Evaluate `SignatureStatusBadge` vs `StatusBadge`

### Section E — Files Exceeding 150 Lines
- [x] E1 — Split `src/api/annualReports.api.ts` (547 lines)
- [x] E2 — Split `src/features/binders/components/BinderDrawer.tsx` (322 lines)
- [x] E3 — Split `src/pages/SigningPage.tsx` (299 lines)
- [x] E4 — Split `src/features/timeline/components/TimelineEventMeta.tsx` (296 lines)
- [ ] E5 — Split `src/pages/ClientDetails.tsx` (263 lines)
- [ ] E6 — Split `src/features/binders/components/bindersColumns.tsx` (256 lines)
- [ ] E7 — Split `src/pages/Login.tsx` (254 lines)
- [ ] E8 — Split `src/api/vatReports.api.ts` (249 lines)
- [ ] E9 — Split `src/features/annualReports/components/StatusTransitionPanel.tsx` (245 lines)
- [ ] E10 — Split `src/features/annualReports/components/ReportDetailTabs.tsx` (240 lines)
- [ ] E11 — Split `src/features/advancedPayments/components/ClientAdvancePaymentsTab.tsx` (240 lines)
- [ ] E12 — Split `src/pages/reports/SignatureRequests.tsx` (227 lines)
- [ ] E13 — Split `src/pages/AnnualReportsKanban.tsx` (219 lines)
- [ ] E14 — Split `src/features/vatReports/components/VatClientSummaryPanel.tsx` (219 lines)
- [ ] E15 — Split `src/features/clients/components/ClientEditForm.tsx` (219 lines)
- [ ] E16 — Split `src/features/annualReports/components/TaxCalculationPanel.tsx` (217 lines)
- [ ] E17 — Split `src/features/annualReports/components/FilingTimelineTab.tsx` (208 lines)
- [ ] E18 — Split `src/components/layout/Sidebar.tsx` (208 lines)
- [ ] E19 — Split `src/api/signatureRequests.api.ts` (203 lines)
- [ ] E20 — Split `src/features/dashboard/hooks/useDashboardPage.ts` (201 lines)
- [ ] E21 — Split `src/features/taxDeadlines/hooks/useTaxDeadlines.ts` (198 lines)
- [ ] E22 — Split `src/features/vatReports/components/CategoryDataEntryForm.tsx` (188 lines)
- [ ] E23 — Split `src/pages/tax/AdvancePayments.tsx` (187 lines)
- [ ] E24 — Split `src/features/annualReports/components/AnnualPLSummary.tsx` (187 lines)
- [ ] E25 — Split `src/features/annualReports/components/DocumentsTab.tsx` (186 lines)
- [ ] E26 — Split `src/features/vatReports/components/VatWorkItemDrawer.tsx` (185 lines)
- [ ] E27 — Split `src/api/advancePayments.api.ts` (181 lines)
- [ ] E28 — Split `src/features/annualReports/components/ReportSummaryCards.tsx` (180 lines)
- [ ] E29 — Split `src/features/vatReports/components/vatWorkItemColumns.tsx` (179 lines)
- [ ] E30 — Split `src/features/taxDeadlines/components/TaxDeadlinesTable.tsx` (178 lines)
- [ ] E31 — Split `src/pages/Binders.tsx` (176 lines)
- [ ] E32 — Split `src/features/clients/components/ClientRelatedData.tsx` (174 lines)
- [ ] E33 — Split `src/features/timeline/components/TimelineCommandBar.tsx` (173 lines)
- [ ] E34 — Split `src/features/advancedPayments/components/CreateAdvancePaymentModal.tsx` (172 lines)
- [ ] E35 — Split `src/features/annualReports/components/AnnexDataPanel.tsx` (171 lines)
- [ ] E36 — Split `src/store/auth.store.ts` (162 lines)
- [ ] E37 — Split `src/features/annualReports/components/CreateReportModal.tsx` (161 lines)
- [ ] E38 — Split `src/features/timeline/hooks/useClientTimelinePage.ts` (157 lines)
- [ ] E39 — Split `src/components/ui/StatsCard.tsx` (157 lines)
- [ ] E40 — Split `src/features/search/components/SearchFiltersBar.tsx` (154 lines)
- [ ] E41 — Split `src/pages/Users.tsx` (153 lines)
- [ ] E42 — Split `src/components/errors/AppErrorBoundary.tsx` (153 lines)
- [ ] E43 — Split `src/api/clients.api.ts` (153 lines)
- [ ] E44 — Split `src/features/dashboard/components/DashboardStatsGrid.tsx` (152 lines)
- [ ] E45 — Split `src/features/timeline/components/TimelineEventItem.tsx` (151 lines)
- [ ] E46 — Split `src/components/ui/DetailDrawer.tsx` (151 lines)

---

## Task Details

---

### A1 — Move `binders.types.ts` out of `src/api/`

**Read:** `src/api/binders.types.ts`

**Do:**
- Move to `src/features/binders/types.ts`
- Update all imports across the codebase

---

### A2 — Move advancePayments components out of `src/components/`

**Read:**
- `src/components/advancePayments/AdvancePaymentsChart.tsx`
- `src/components/advancePayments/AdvancePaymentsKPICards.tsx`

**Do:**
- Move both to `src/features/advancedPayments/components/`
- Update all imports

---

### A3 — Move `NotificationsTab` out of `src/components/clientDetails/`

**Read:** `src/components/clientDetails/NotificationsTab.tsx`

**Do:**
- Determine correct feature (likely `src/features/notifications/components/`)
- Move file and update imports

---

### A4 — Move `FilingTimeline` out of `src/components/taxDeadlines/`

**Read:** `src/components/taxDeadlines/FilingTimeline.tsx`

**Do:**
- Move to `src/features/taxDeadlines/components/FilingTimeline.tsx`
- Update all imports

---

### A5 — Move `NotificationDrawer` + `SeverityBadge` to features

**Read:**
- `src/components/notifications/NotificationDrawer.tsx`
- `src/components/notifications/SeverityBadge.tsx`

**Do:**
- Move to `src/features/notifications/components/`
- Update all imports

---

### A6 — Move `UserFormFields.tsx` from `hooks/` to `components/`

**Read:** `src/features/users/hooks/UserFormFields.tsx`

**Do:**
- Move to `src/features/users/components/UserFormFields.tsx`
- Update all imports

---

### A7 — Move `financialLabels.ts` out of `components/`

**Read:** `src/features/annualReports/components/financialLabels.ts`

**Do:**
- Move to `src/features/annualReports/financialLabels.ts` (feature root)
- Update all imports

---

### A8 — Resolve `advancedPayments/api/` conflict

**Read:**
- `src/features/advancedPayments/api/advancePayments.api.ts`
- `src/api/advancePayments.api.ts`
- `src/features/advancedPayments/api/advancePayments.types.ts`

**Do:**
- Merge any unique content from the feature-level api file into `src/api/advancePayments.api.ts`
- Move types to `src/features/advancedPayments/types.ts`
- Delete `src/features/advancedPayments/api/` folder
- Update all imports

---

### B1 — Rename all non-PascalCase component files

**Files to rename (no content changes — rename only):**

| From | To |
|---|---|
| `src/features/reports/components/Agingreporttable.tsx` | `AgingReportTable.tsx` |
| `src/features/binders/components/bindersColumns.tsx` | `BindersColumns.tsx` |
| `src/features/charges/components/chargeColumns.tsx` | `ChargeColumns.tsx` |
| `src/features/clients/components/clientColumns.tsx` | `ClientColumns.tsx` |
| `src/features/search/components/searchColumns.tsx` | `SearchColumns.tsx` |
| `src/features/search/components/searchResultMeta.tsx` | `SearchResultMeta.tsx` |
| `src/features/timeline/components/timelineEventMeta.tsx` | `TimelineEventMeta.tsx` |
| `src/features/users/components/usersColumns.tsx` | `UsersColumns.tsx` |
| `src/features/vatReports/components/vatWorkItemColumns.tsx` | `VatWorkItemColumns.tsx` |

**Do:** Rename files + update all imports referencing old names.

---

### B2 — Rename `reminder.types.ts`

**Read:** `src/features/reminders/reminder.types.ts`

**Do:**
- Rename to `src/features/reminders/types.ts`
- Update all imports

---

### C1 — Create missing `schemas.ts` / `types.ts` in feature folders

**Features and what's missing:**

| Feature | Missing |
|---|---|
| `src/features/actions/` | `schemas.ts`, `types.ts` |
| `src/features/correspondence/` | `types.ts` |
| `src/features/dashboard/` | `schemas.ts`, `types.ts` |
| `src/features/importExport/` | `schemas.ts`, `types.ts` |
| `src/features/reports/` | `schemas.ts`, `types.ts` |
| `src/features/taxDashboard/` | `schemas.ts`, `types.ts` |
| `src/features/taxProfile/` | `types.ts` |

**Do:**
- Read each feature folder's existing files to understand what types/schemas already exist inline
- Extract and consolidate into the missing files
- Stub empty files where no content exists yet (with a comment: `// TODO: add types as feature grows`)

---

### D1 — Consolidate duplicate client search components

**Read:**
- `src/features/advancedPayments/components/ClientSearchField.tsx`
- `src/features/binders/components/ClientSearchInput.tsx`

**Do:**
- Create `src/components/ui/ClientSearchInput.tsx` with a unified API
- Update both feature components to use the shared one
- Delete the duplicates

---

### D2 — Consolidate duplicate confirm dialogs

**Read:**
- `src/features/documents/components/ConfirmDeleteDialog.tsx`
- `src/features/actions/components/ConfirmDialog.tsx`

**Do:**
- Keep the more complete version in `src/components/ui/ConfirmDialog.tsx`
- Update all imports
- Delete the duplicate

---

### D3 — Evaluate `SignatureStatusBadge` vs `StatusBadge`

**Read:**
- `src/features/signatureRequests/components/SignatureStatusBadge.tsx`
- `src/components/ui/StatusBadge.tsx`

**Do:**
- If `SignatureStatusBadge` is just a wrapper with signature-specific variants, merge variants into `StatusBadge`
- Otherwise keep as-is and document why it's separate

---

### E1 — Split `src/api/annualReports.api.ts` (547 lines) ⚠️ CRITICAL

**Read:** `src/api/annualReports.api.ts`

**Split into:**
- `src/api/annualReports.api.ts` — core CRUD (createReport, getReport, listReports, deleteReport, patchReportDetails)
- `src/api/annualReportFinancials.api.ts` — getFinancials, addIncomeLine, updateIncomeLine, deleteIncomeLine, addExpenseLine, updateExpenseLine, deleteExpenseLine
- `src/api/annualReportTax.api.ts` — getTaxCalculation, getAdvancesSummary, getReadiness
- `src/api/annualReportSeason.api.ts` — getSeasonSummary, listSeasonReports, getKanbanView, getOverdue
- `src/api/annualReportStatus.api.ts` — transitionStatus, submitReport, transitionStage, updateDeadline

Update all imports after splitting.

---

### E2 — Split `BinderDrawer.tsx` (322 lines)

**Read:** `src/features/binders/components/BinderDrawer.tsx`

**Split into:**
- `BinderDrawer.tsx` — shell + tab layout only
- `BinderDetailsPanel.tsx` — detail fields
- `BinderActionsPanel.tsx` — action buttons + transitions

---

### E3 — Split `SigningPage.tsx` (299 lines)

**Read:** `src/pages/SigningPage.tsx`

**Split into:**
- `SigningPage.tsx` — layout + composition only
- `src/features/signing/components/SigningForm.tsx`
- `src/features/signing/components/SigningStatus.tsx`

---

### E4 — Split `timelineEventMeta.tsx` (296 lines) + rename

**Read:** `src/features/timeline/components/timelineEventMeta.tsx`

**Do:**
- Rename to `TimelineEventMeta.tsx` (PascalCase)
- If >150 lines after rename, split out event-type-specific renderers into separate files

---

### E5 — Split `ClientDetails.tsx` (263 lines)

**Read:** `src/pages/ClientDetails.tsx`

**Split into:**
- `ClientDetails.tsx` — layout + tab routing only (target: <80 lines)
- Extract each tab's content into `src/features/clients/components/` if not already there

---

### E6–E46 — Remaining oversized files

For each file: read it, identify the natural split boundary (sections, sub-components, or logical groups), and split into ≤150-line files. Update all imports.

Prioritize in this order:
1. E8 — `vatReports.api.ts` (249) — split types from functions
2. E9 — `StatusTransitionPanel.tsx` (245)
3. E11 — `ClientAdvancePaymentsTab.tsx` (240)
4. E12 — `SignatureRequests.tsx` (227)
5. E14 — `VatClientSummaryPanel.tsx` (219)
6. E15 — `ClientEditForm.tsx` (219)
7. Remaining in descending order of line count
