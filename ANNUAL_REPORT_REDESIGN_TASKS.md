# Annual Report UI Redesign — Task List

> **Rules before starting any task:**
> Read `CLAUDE.md` first.
> Do not read files not listed in the task.
> Do not implement other tasks.
> One task per conversation.

## Status

- [x] F1 — Create `AnnualReportPanelLayout.tsx`
- [x] F2 — Create `AnnualReportSidebarNav.tsx`
- [x] F3 — Create `AnnualReportSidebarStatus.tsx`
- [x] F4 — Create `AnnualReportSidebar.tsx`
- [x] F5 — Create `ReportMetaGrid.tsx`
- [x] F6 — Create `AnnualReportOverviewSection.tsx`
- [x] F7 — Create `AnnualReportFullPanel.tsx`
- [x] F8 — Update `ClientAnnualReportsTab.tsx`
- [x] F9 — Update kanban caller
- [x] F10 — Delete `AnnualReportDetailDrawer.tsx` + `ReportDetailTabs.tsx`
- [x] F11 — Verify: typecheck + lint + manual QA

---

## Task Details

---

### F1 — Create `AnnualReportPanelLayout.tsx`

**File to create:** `src/features/annualReports/components/AnnualReportPanelLayout.tsx`

**Read first:**
- `src/components/ui/DetailDrawer.tsx` (Escape key + isDirty guard pattern)

**Do:**
- Full-screen overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/50`
- Inner panel: `w-[95vw] h-[95vh] max-w-7xl bg-white rounded-xl flex flex-col overflow-hidden`
- Header bar: title (right-aligned) + subtitle + `[מחק דוח]` + `[שמור]` + `[×]` close
- Body: `flex flex-1 overflow-hidden` — renders `children` as-is
- Escape key closes; if `isDirty` show confirm before closing (same pattern as `DetailDrawer`)
- Arrow function, `displayName` set, ≤150 lines, layout-only

**Props:**
```ts
interface AnnualReportPanelLayoutProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  onDelete: () => void
  onSave: () => void
  isDirty: boolean
  isSaving: boolean
  children: React.ReactNode
}
```

---

### F2 — Create `AnnualReportSidebarNav.tsx`

**File to create:** `src/features/annualReports/components/AnnualReportSidebarNav.tsx`

**Read first:**
- `src/features/annualReports/types.ts`

**Do:**
- Render 6 nav items: `📋 סקירה`, `💰 הכנסות והוצאות`, `⚖️ חישוב מס`, `✂️ ניכויים`, `📄 מסמכים`, `📅 ציר זמן`
- Active item highlighted — use a `const navItemVariants` map + `cn()`, no ternary chain
- Extract `handleNavClick` as a named handler — no inline arrow functions with logic in JSX
- RTL: `pr-3` not `pl-3`
- Nav labels: `hidden lg:inline`; icon always visible
- Arrow function, `displayName` set, ≤150 lines

**Props:**
```ts
interface AnnualReportSidebarNavProps {
  activeSection: SectionKey
  onSectionChange: (section: SectionKey) => void
}
```

---

### F3 — Create `AnnualReportSidebarStatus.tsx`

**File to create:** `src/features/annualReports/components/AnnualReportSidebarStatus.tsx`

**Read first:**
- `src/features/annualReports/components/StatusTransitionPanel.tsx`
- `src/features/annualReports/components/ReadinessCheckPanel.tsx`
- `src/features/annualReports/types.ts`

**Do:**
- Render: status badge + `<StatusTransitionPanel>` + `<ReadinessCheckPanel>` wrapped in collapsible toggle (`useState`)
- Reuse both child components as-is — no changes to them
- Arrow function, `displayName` set, ≤150 lines

**Props:**
```ts
interface AnnualReportSidebarStatusProps {
  report: AnnualReportFull
  detail: ReportDetailResponse | null
  availableActions: string[]
  onTransition: (action: string, note?: string) => void
}
```

---

### F4 — Create `AnnualReportSidebar.tsx`

**File to create:** `src/features/annualReports/components/AnnualReportSidebar.tsx`

**Read first:**
- `src/features/annualReports/components/AnnualReportSidebarNav.tsx` (F2)
- `src/features/annualReports/components/AnnualReportSidebarStatus.tsx` (F3)

**Do:**
- Compose `<AnnualReportSidebarNav>` (top) + `<AnnualReportSidebarStatus>` (pinned bottom)
- Wrapper: `flex flex-col justify-between lg:w-[220px] md:w-[48px] border-l h-full overflow-y-auto`
- Arrow function, `displayName` set, ≤150 lines

**Props:** union of F2 + F3 props

---

### F5 — Create `ReportMetaGrid.tsx`

**File to create:** `src/features/annualReports/components/ReportMetaGrid.tsx`

**Read first:**
- `src/features/annualReports/types.ts`
- `src/components/ui/DetailDrawer.tsx` (for `DrawerField` pattern)

**Do:**
- Two-column read-only grid showing: tax_year, client_type, form_type, ita_reference, submitted_at, filing_deadline
- Use `DrawerField` (or equivalent row pattern from `DetailDrawer`) for each field
- All labels in Hebrew
- Arrow function, `displayName` set, ≤150 lines

**Props:**
```ts
interface ReportMetaGridProps {
  report: AnnualReportFull
}
```

---

### F6 — Create `AnnualReportOverviewSection.tsx`

**File to create:** `src/features/annualReports/components/AnnualReportOverviewSection.tsx`

**Read first:**
- `src/features/annualReports/components/ReportAlertBanners.tsx`
- `src/features/annualReports/components/ReportSummaryCards.tsx`
- `src/features/annualReports/components/ReportMetaGrid.tsx` (F5)
- `src/features/annualReports/components/AnnualReportDetailForm.tsx`
- `src/features/annualReports/components/ScheduleChecklist.tsx`
- `src/features/annualReports/components/AnnualPLSummary.tsx`
- `src/features/annualReports/components/ReportHistoryTable.tsx`

**Do:**
- Render in order:
  1. `<ReportAlertBanners>`
  2. `<ReportSummaryCards>`
  3. `grid grid-cols-2 gap-6`: left = `<ReportMetaGrid>`, right = `<AnnualReportDetailForm>`
  4. `<ScheduleChecklist>`
  5. `<AnnualPLSummary>` in collapsible (`useState`)
  6. `<ReportHistoryTable>`
- All child components reused as-is
- Arrow function, `displayName` set, ≤150 lines

---

### F7 — Create `AnnualReportFullPanel.tsx`

**File to create:** `src/features/annualReports/components/AnnualReportFullPanel.tsx`

**Read first:**
- `src/features/annualReports/hooks/useReportDetail.ts`
- `src/features/annualReports/components/AnnualReportPanelLayout.tsx` (F1)
- `src/features/annualReports/components/AnnualReportSidebar.tsx` (F4)
- `src/features/annualReports/components/AnnualReportOverviewSection.tsx` (F6)
- `src/features/annualReports/types.ts`

**Do:**
- Own `activeSection` state (`useState<SectionKey>("overview")`)
- Use existing `useReportDetail` hook — no `useQuery`/`useMutation` directly in component
- Section map (right content area):
  ```
  "overview"   → <AnnualReportOverviewSection>
  "financials" → <IncomeExpensePanel>
  "tax"        → <TaxCalculationPanel>
  "deductions" → <DeductionsTab>
  "documents"  → <DocumentsTab>
  "timeline"   → <FilingTimelineTab>
  ```
- Mobile fallback: sidebar `hidden md:flex`; horizontal tab strip `<div className="flex md:hidden">` above content (icon + label per item)
- If logic grows past ~80 lines, extract to `useAnnualReportPanel.ts` hook
- Arrow function, `displayName` set, ≤150 lines

**Props:**
```ts
interface AnnualReportFullPanelProps {
  reportId: number
  onClose: () => void
}
```

---

### F8 — Update `ClientAnnualReportsTab.tsx`

**Read first:**
- `src/features/annualReports/components/ClientAnnualReportsTab.tsx`

**Do:**
- Remove `import AnnualReportDetailDrawer`
- Add `import { AnnualReportFullPanel } from "./AnnualReportFullPanel"`
- Replace `<AnnualReportDetailDrawer reportId={...} onClose={...} />` with `<AnnualReportFullPanel reportId={...} onClose={...} />`
- No other changes

---

### F9 — Update kanban caller

**Read first:**
- `src/pages/AnnualReportsKanban.tsx` (grep for `AnnualReportDetailDrawer` if path differs)

**Do:**
- Same import swap as F8
- No other changes

---

### F10 — Delete replaced files

**Read first:**
- Grep for `AnnualReportDetailDrawer` across `src/` to confirm zero remaining imports
- Grep for `ReportDetailTabs` across `src/` to confirm zero remaining imports

**Do:**
- Delete `src/features/annualReports/components/AnnualReportDetailDrawer.tsx`
- Delete `src/features/annualReports/components/ReportDetailTabs.tsx`
- Run `npm run typecheck` — must pass before closing task

---

### F11 — Verify

- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] Open `/clients/:clientId` → annual-reports tab → click a report → full panel opens (95vw × 95vh)
- [ ] All 6 sidebar sections render correct content
- [ ] Status transitions visible in sidebar without scrolling
- [ ] Edit a field → `[שמור]` activates
- [ ] `[מחק דוח]` → confirm dialog → panel closes, list refreshes
- [ ] Escape closes panel; dirty guard blocks if unsaved
- [ ] Open from kanban card → same panel
- [ ] 768–1279px: sidebar shows icons only
- [ ] <768px: horizontal tab strip shown, sidebar hidden
