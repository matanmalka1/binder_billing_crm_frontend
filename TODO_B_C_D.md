# TODO — Sections B, C, D

> One task per conversation. Read `CLAUDE.md` first. Do not read files not listed in the task.

---

## Status

- [ ] B1 — Rename 9 component files to PascalCase
- [ ] B2 — Rename `reminder.types.ts` → `types.ts`
- [ ] C1a — Create missing files in `actions/` + `correspondence/`
- [ ] C1b — Create missing files in `dashboard/` + `importExport/`
- [ ] C1c — Create missing files in `reports/` + `taxDashboard/` + `taxProfile/`
- [ ] D1 — Merge duplicate client search components
- [ ] D2 — Merge duplicate confirm dialogs
- [ ] D3 — Evaluate `SignatureStatusBadge` vs `StatusBadge`

---

## B1 — Rename 9 component files to PascalCase

**Do:** Rename files only — do not modify file contents.
Then update every import across the codebase that references the old name.

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

**After:** Run `npm run typecheck` — must pass with zero errors.

---

## B2 — Rename `reminder.types.ts` → `types.ts`

**Read:** `src/features/reminders/reminder.types.ts`

**Do:**
- Rename to `src/features/reminders/types.ts`
- Update all imports referencing the old name

**After:** Run `npm run typecheck` — must pass with zero errors.

---

## C1a — Create missing files: `actions/` + `correspondence/`

**Read:**
- All files inside `src/features/actions/`
- All files inside `src/features/correspondence/`

**Do:**
- `src/features/actions/schemas.ts` — extract any inline Zod schemas found; otherwise stub with `// TODO: add schemas as feature grows`
- `src/features/actions/types.ts` — extract any inline types found; otherwise stub
- `src/features/correspondence/types.ts` — extract any inline types found; otherwise stub

**Do not touch any other feature folder.**

---

## C1b — Create missing files: `dashboard/` + `importExport/`

**Read:**
- All files inside `src/features/dashboard/`
- All files inside `src/features/importExport/`

**Do:**
- `src/features/dashboard/schemas.ts` — extract or stub
- `src/features/dashboard/types.ts` — extract or stub
- `src/features/importExport/schemas.ts` — extract or stub
- `src/features/importExport/types.ts` — extract or stub

**Do not touch any other feature folder.**

---

## C1c — Create missing files: `reports/` + `taxDashboard/` + `taxProfile/`

**Read:**
- All files inside `src/features/reports/`
- All files inside `src/features/taxDashboard/`
- All files inside `src/features/taxProfile/`

**Do:**
- `src/features/reports/schemas.ts` — extract or stub
- `src/features/reports/types.ts` — extract or stub
- `src/features/taxDashboard/schemas.ts` — extract or stub
- `src/features/taxDashboard/types.ts` — extract or stub
- `src/features/taxProfile/types.ts` — extract or stub

**Do not touch any other feature folder.**

---

## D1 — Merge duplicate client search components

**Read:**
- `src/features/advancedPayments/components/ClientSearchField.tsx`
- `src/features/binders/components/ClientSearchInput.tsx`

**Do:**
- Create `src/components/ui/ClientSearchInput.tsx` with a unified API covering both use cases
- Update both feature files to import from the shared component
- Delete the two originals

**After:** Run `npm run typecheck` — must pass with zero errors.

---

## D2 — Merge duplicate confirm dialogs

**Read:**
- `src/features/documents/components/ConfirmDeleteDialog.tsx`
- `src/features/actions/components/ConfirmDialog.tsx`

**Do:**
- Keep the more complete version, move/rename to `src/components/ui/ConfirmDialog.tsx`
- Update all imports across the codebase
- Delete the duplicate

**After:** Run `npm run typecheck` — must pass with zero errors.

---

## D3 — Evaluate `SignatureStatusBadge` vs `StatusBadge`

**Read:**
- `src/features/signatureRequests/components/SignatureStatusBadge.tsx`
- `src/components/ui/StatusBadge.tsx`

**Do — pick one:**
- If `SignatureStatusBadge` is just `StatusBadge` with extra variants → merge variants into `StatusBadge`, delete `SignatureStatusBadge`, update imports
- If it has genuinely different logic → add a comment at the top of the file explaining why it's separate: `// Kept separate from StatusBadge because: <reason>`
