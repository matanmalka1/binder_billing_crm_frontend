# Plan: Standardize Search & Filter Across All List Pages

## Context
9 filter bar components exist across the frontend. They have inconsistent layouts (flex vs grid), inconsistent wrappers (some use ToolbarContainer, most don't), varying reset patterns, varying placeholder/label text, and a silent bug: `ActiveFilterBadges` accepts `onReset` prop but never renders it — 6 bars pass it thinking it works. Goal: one visual style, one reset pattern, same Hebrew text conventions.

Users page also has zero search — adding it requires a backend change too.

---

## Critical Bug to Fix First

**`ActiveFilterBadges`** — `onReset` prop is declared but silently dropped (component only destructures `{ badges }`). Fix this first; it unblocks all other bars.

File: `src/components/ui/table/ActiveFilterBadges.tsx`

---

## Standardized Conventions (apply everywhere)

| Convention | Standard |
|---|---|
| Wrapper | `ToolbarContainer` (always) |
| Input grid | `grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3` (adjust cols for # of inputs) |
| Text search label | "חיפוש לקוח" (client) / "חיפוש עסק" (business) / "חיפוש משתמש" (user) |
| Text search placeholder | "שם, ת.ז. / ח.פ..." (client context) / entity-appropriate |
| ClientSearchInput placeholder | "שם, ת.ז. / ח.פ..." |
| Reset | `ActiveFilterBadges` with `onReset` → renders "נקה הכל" button inline |
| Active filter highlight | `className={cn(value && "border-primary-400 ring-1 ring-primary-200")}` on Select |

---

## Implementation Steps (in order)

### Step 1 — Fix `ActiveFilterBadges`
**File:** `src/components/ui/table/ActiveFilterBadges.tsx`

Add `onReset` to destructured props and render "נקה הכל" button after badges:

```tsx
export const ActiveFilterBadges: React.FC<Props> = ({ badges, onReset }) => {
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      {badges.map((b) => (
        <Badge key={b.key} removable onRemove={b.onRemove}>
          {b.label}
        </Badge>
      ))}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
        >
          נקה הכל
        </button>
      )}
    </div>
  );
};
```

---

### Step 2 — `ClientsFiltersBar`
**File:** `src/features/clients/components/ClientsFiltersBar.tsx`

- Add `ToolbarContainer` import + wrap outer `<div className="space-y-3">` in it
- No other changes (labels/placeholders are already canonical)

---

### Step 3 — `RemindersFiltersBar`
**File:** `src/features/reminders/components/RemindersFiltersBar.tsx`

- Add `ToolbarContainer` + `ActiveFilterBadges` imports
- Change layout from `flex flex-wrap items-end gap-3` → `grid grid-cols-1 gap-3 sm:grid-cols-2`
- Remove fixed-width wrappers (`flex-1 min-w-48`, `w-52`)
- Remove standalone "נקה סינון" button
- Change placeholder: "חיפוש לפי שם לקוח..." → "שם, ת.ז. / ח.פ..."
- Add `ActiveFilterBadges` below the grid with badges for `search` and `typeFilter`, `onReset={handleClear}`
- Keep prop interface unchanged (`hasFilters`/`onClear` stay — `RemindersPage` uses `hasFilters` for empty state)

---

### Step 4 — `ChargesFiltersCard`
**File:** `src/features/charges/components/ChargesFiltersCard.tsx`

- Add `ToolbarContainer` import + wrap outer `<div className="space-y-3">` in it
- Change `ClientSearchInput` placeholder: `"חפש לקוח..."` → `"שם, ת.ז. / ח.פ..."`
- `onReset` already passed → now works after Step 1

---

### Step 5 — `BindersFiltersBar`
**File:** `src/features/binders/components/BindersFiltersBar.tsx`

- Add `ToolbarContainer` import
- Keep StatsCards pills grid OUTSIDE ToolbarContainer (they are KPI widgets, not filter inputs)
- Wrap only the inputs grid + badges row in ToolbarContainer
- Change label: `"חיפוש"` → `"חיפוש לקוח"` (placeholder is already good: "שם לקוח או מספר קלסר...")
- `onReset` already passed → now works after Step 1

```tsx
return (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {/* statusPills unchanged */}
    </div>
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Input + 2 Selects */}
        </div>
        <ActiveFilterBadges ... onReset={handleReset} />
      </div>
    </ToolbarContainer>
  </div>
);
```

---

### Step 6 — `AdvancePaymentsFiltersBar`
**File:** `src/features/advancedPayments/components/AdvancePaymentsFiltersBar.tsx`

- Add `ToolbarContainer` import + wrap outer `<div className="space-y-3">` in it
- `onReset` already passed → now works after Step 1

---

### Step 7 — `AnnualReportsFiltersBar`
**File:** `src/features/annualReports/components/shared/AnnualReportsFiltersBar.tsx`

- Already uses ToolbarContainer — no structural change
- Remove pointless `handleReset` passthrough: replace `onReset={handleReset}` with `onReset={onReset}` and delete the local function
- Change `ClientSearchInput` placeholder: `"חפש לפי שם, ת.ז. / ח.פ..."` → `"שם, ת.ז. / ח.פ..."` (drop "חפש לפי")

---

### Step 8 — `VatWorkItemsFiltersCard`
**File:** `src/features/vatReports/components/VatWorkItemsFiltersCard.tsx`

- Already uses ToolbarContainer — no structural change
- Change `ClientSearchInput` placeholder: `'שם / ת"ז / ח.פ'` → `"שם, ת.ז. / ח.פ..."`
- `onReset={onClear}` already passed → now works after Step 1

---

### Step 9 — `TaxDeadlinesFilters`
**File:** `src/features/taxDeadlines/components/TaxDeadlinesFilters.tsx`

- Add `ToolbarContainer` import + wrap outer `<div className="space-y-3">` in it
- Labels/placeholders are correct for this context ("חיפוש עסק" / "שם עסק...") — keep as-is
- `onReset` already passed → now works after Step 1

---

### Step 10 — `UsersFiltersBar` + backend (requires backend change)

**Backend first:**

`app/users/api/users.py` — add `search` param to `list_users`:
```python
@router.get("", response_model=UserManagementListResponse)
def list_users(
    db: DBSession,
    user: CurrentUser,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_active: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
):
    service = UserManagementService(db)
    items, total = service.list_users(
        actor_role=user.role,
        page=page,
        page_size=page_size,
        is_active=is_active,
        search=search,
    )
```

Also update `UserManagementService.list_users` and repository to filter by `full_name` / `email` ILIKE when `search` is provided. Check service/repo files before editing.

**Frontend:**

`src/features/users/api/contracts.ts` — add `search?: string` to `ListUsersParams`

`src/features/users/types.ts` — add `search?: string` to `UsersFilters`

`src/features/users/hooks/useUsersPage.ts` — add:
```ts
const search = searchParams.get("search") ?? "";
const filters = { page, page_size, is_active, search };
```

`src/features/users/components/UsersFiltersBar.tsx` — full rewrite:
- Add `useSearchDebounce`, `Input`, `ActiveFilterBadges`, `ToolbarContainer`, `Search`, `X` imports
- Add debounced text search ("חיפוש משתמש" / "שם או כתובת מייל...")
- Add `ActiveFilterBadges` with `onReset` that clears both `search` and `is_active`
- Wrap in `ToolbarContainer`

---

## Files Modified

### Frontend (src/):
- `components/ui/table/ActiveFilterBadges.tsx` ← bug fix
- `features/clients/components/ClientsFiltersBar.tsx`
- `features/reminders/components/RemindersFiltersBar.tsx`
- `features/charges/components/ChargesFiltersCard.tsx`
- `features/binders/components/BindersFiltersBar.tsx`
- `features/advancedPayments/components/AdvancePaymentsFiltersBar.tsx`
- `features/annualReports/components/shared/AnnualReportsFiltersBar.tsx`
- `features/vatReports/components/VatWorkItemsFiltersCard.tsx`
- `features/taxDeadlines/components/TaxDeadlinesFilters.tsx`
- `features/users/components/UsersFiltersBar.tsx` ← rewrite
- `features/users/types.ts`
- `features/users/hooks/useUsersPage.ts`
- `features/users/api/contracts.ts`

### Backend:
- `app/users/api/users.py`
- `app/users/services/user_management_service.py` (verify before editing)
- `app/users/repositories/user_repository.py` (verify before editing)

---

## Verification

1. Visit each list page — confirm filter bar has ToolbarContainer style (gray bg, rounded border)
2. Apply a filter → `ActiveFilterBadges` shows with "נקה הכל" button that clears all filters
3. Reminders: confirm badges appear (previously no badges rendered at all)
4. Users: search by name/email → results filtered
5. All pages: URL reflects active filters (search params in address bar)
6. Run: `JWT_SECRET=test-secret pytest -q tests/users/`
