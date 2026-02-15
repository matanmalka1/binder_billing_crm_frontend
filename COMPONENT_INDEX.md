# UI Architecture Components - Index

## 📦 Component Library Overview

This file provides a quick reference to all components created during the UI Architecture Refactoring project.

---

## 🎨 Layout Components

### PageHeader
**File:** `src/components/layout/PageHeader.tsx`

**Purpose:** Standardized page header with title, description, breadcrumbs, and actions

**Props:**
```typescript
interface PageHeaderProps {
  title: string;                    // Required: Page title
  description?: string;              // Optional: Page description
  breadcrumbs?: Breadcrumb[];       // Optional: Navigation breadcrumbs
  actions?: React.ReactNode;        // Optional: Action buttons (top-right)
}

interface Breadcrumb {
  label: string;
  to: string;
}
```

**Usage:**
```tsx
<PageHeader
  title="תיקים"
  description="רשימת כל התיקים במערכת"
  breadcrumbs={[{ label: "דף הבית", to: "/" }]}
  actions={<Button>פעולה חדשה</Button>}
/>
```

**Used In:** All pages

---

## 🎯 Data Display Components

### EmptyState
**File:** `src/components/ui/EmptyState.tsx`

**Purpose:** Universal empty state component with icon, message, and optional action

**Props:**
```typescript
interface EmptyStateProps {
  icon: LucideIcon;                  // Required: Icon component
  title?: string;                    // Optional: Title
  message: string;                   // Required: Message text
  action?: {                         // Optional: Call-to-action button
    label: string;
    onClick: () => void;
  };
  className?: string;
}
```

**Usage:**
```tsx
<EmptyState
  icon={FolderOpen}
  title="אין תיקים"
  message="לא נמצאו תיקים התואמים לחיפוש"
  action={{ label: "נקה סינונים", onClick: clearFilters }}
/>
```

**Used In:** All data views (tables, lists, grids)

---

### TableSkeleton
**File:** `src/components/ui/TableSkeleton.tsx`

**Purpose:** Loading skeleton for tables (better UX than generic spinners)

**Props:**
```typescript
interface TableSkeletonProps {
  rows?: number;                     // Default: 5
  columns?: number;                  // Default: 6
  className?: string;
}
```

**Usage:**
```tsx
<TableSkeleton rows={10} columns={8} />
```

**Used In:** All table views during loading

---

### PaginatedTableView
**File:** `src/components/ui/PaginatedTableView.tsx`

**Purpose:** Wrapper component that handles all table states (loading/error/empty/data) with integrated pagination

**Props:**
```typescript
interface PaginatedTableViewProps<T> {
  data: T[];                         // Table data
  loading: boolean;                  // Loading state
  error: string | null;              // Error message
  pagination: PaginationState;       // Pagination config
  renderTable: (data: T[]) => React.ReactNode;  // Table renderer
  emptyState?: {                     // Optional: Custom empty state
    icon?: React.ComponentType;
    title?: string;
    message?: string;
  };
  skeletonRows?: number;             // Default: 5
  skeletonColumns?: number;          // Default: 6
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}
```

**Usage:**
```tsx
<PaginatedTableView
  data={items}
  loading={loading}
  error={error}
  pagination={{
    page: 1,
    pageSize: 20,
    total: 100,
    onPageChange: setPage,
  }}
  renderTable={(data) => <MyTable items={data} />}
  emptyState={{
    icon: Inbox,
    message: "אין פריטים להצגה",
  }}
/>
```

**Used In:** Binders, Clients, Charges, Search pages

---

### DescriptionList
**File:** `src/components/ui/DescriptionList.tsx`

**Purpose:** Consistent key-value pair display for detail views

**Props:**
```typescript
interface DescriptionListProps {
  items: DescriptionItem[];          // List of key-value pairs
  columns?: 1 | 2 | 3;              // Default: 2
  className?: string;
}

interface DescriptionItem {
  label: string;                     // Key label
  value: React.ReactNode;            // Value (can be JSX)
  fullWidth?: boolean;               // Span all columns
}
```

**Usage:**
```tsx
<DescriptionList
  columns={2}
  items={[
    { label: "שם", value: "יוסי כהן" },
    { label: "תעודת זהות", value: "123456789" },
    { label: "כתובת", value: "רחוב הרצל 10, תל אביב", fullWidth: true },
  ]}
/>
```

**Used In:** ChargeDetails, future detail pages

---

## 🎛️ Filter Components

### FilterBar
**File:** `src/components/ui/FilterBar.tsx`

**Purpose:** Standardized wrapper for filter sections with optional reset button

**Props:**
```typescript
interface FilterBarProps {
  title?: string;                    // Default: "סינון"
  onReset?: () => void;              // Optional: Reset callback
  children: React.ReactNode;         // Filter form content
  className?: string;
}
```

**Usage:**
```tsx
<FilterBar title="סינון תוצאות" onReset={clearAllFilters}>
  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
    <Input label="שם" value={name} onChange={setName} />
    <Select label="סטטוס" value={status} onChange={setStatus}>
      ...
    </Select>
  </div>
</FilterBar>
```

**Used In:** All pages with filters (Binders, Clients, Charges, Search, Documents)

---

## 🔐 Permission Components

### AccessBanner
**File:** `src/components/ui/AccessBanner.tsx`

**Purpose:** Non-blocking permission/info message (better UX than full-page AccessDenied)

**Props:**
```typescript
interface AccessBannerProps {
  message: string;                   // Message text
  variant?: "warning" | "info";     // Default: "warning"
  className?: string;
}
```

**Usage:**
```tsx
<AccessBanner
  variant="warning"
  message="אין הרשאה לבצע פעולה זו"
/>

<AccessBanner
  variant="info"
  message="ניתן לצפות בנתונים אך לא לערוך אותם"
/>
```

**Used In:** Charges, ChargeDetails, Dashboard (when access limited)

---

## 📊 Dashboard Components

### StatsCard
**File:** `src/components/ui/StatsCard.tsx`

**Purpose:** Consistent statistics display for dashboard

**Props:**
```typescript
interface StatsCardProps {
  title: string;                     // Stat title
  value: string | number;            // Stat value
  description?: string;              // Optional: Description text
  icon?: LucideIcon;                 // Optional: Icon component
  variant?: "blue" | "green" | "red" | "orange" | "purple" | "neutral";
  className?: string;
}
```

**Usage:**
```tsx
<StatsCard
  title="לקוחות פעילים"
  value={156}
  description="לקוחות עם תיקים פתוחים"
  icon={Users}
  variant="blue"
/>
```

**Used In:** Dashboard

---

## 📏 Spacing Standards

All pages should use **`space-y-6`** for consistent spacing between major sections:

```tsx
<div className="space-y-6">
  <PageHeader ... />
  <FilterBar ... />
  <PaginatedTableView ... />
</div>
```

---

## 🎨 Design Tokens

### Color Variants

Most components support these color variants:

- `blue` - Primary actions, info
- `green` - Success, active states
- `red` - Errors, alerts, overdue
- `orange` - Warnings, due soon
- `purple` - Secondary stats
- `neutral` - Default, inactive

### Icon Sizes

Standard icon sizes used across components:

- Small: `h-4 w-4` (16px)
- Medium: `h-5 w-5` (20px)
- Large: `h-6 w-6` (24px)
- XLarge: `h-8 w-8` (32px)

---

## 🔄 Common Patterns

### Pattern 1: List Page with Filters

```tsx
<div className="space-y-6">
  <PageHeader title="..." description="..." />
  <FilterBar onReset={clearFilters}>
    <YourFilters />
  </FilterBar>
  <PaginatedTableView
    data={items}
    loading={loading}
    error={error}
    pagination={paginationState}
    renderTable={(data) => <YourTable items={data} />}
    emptyState={{ icon: YourIcon, message: "..." }}
  />
</div>
```

### Pattern 2: Detail Page

```tsx
<div className="space-y-6">
  <PageHeader
    title="..."
    breadcrumbs={[{ label: "Back", to: "/list" }]}
  />
  {loading && <PageLoading />}
  {error && <ErrorCard message={error} />}
  {!loading && !error && data && (
    <Card title="..." footer={<YourActions />}>
      <DescriptionList columns={2} items={items} />
    </Card>
  )}
</div>
```

### Pattern 3: Dashboard with Stats

```tsx
<div className="space-y-6">
  <PageHeader title="..." description="..." />
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <StatsCard ... variant="blue" />
    <StatsCard ... variant="green" />
    <StatsCard ... variant="red" />
  </div>
  <YourPanels />
</div>
```

---

## 📚 Additional Resources

- **Implementation Guide:** `IMPLEMENTATION_GUIDE.md`
- **Architecture Summary:** `ARCHITECTURE_SUMMARY.md`
- **Example Pages:** `examples/` directory

---

## 🆘 Troubleshooting

### Import Issues
```tsx
// Layout components
import { PageHeader } from "../components/layout/PageHeader";

// UI components
import { EmptyState } from "../components/ui/EmptyState";
import { FilterBar } from "../components/ui/FilterBar";
import { TableSkeleton } from "../components/ui/TableSkeleton";
import { PaginatedTableView } from "../components/ui/PaginatedTableView";
import { AccessBanner } from "../components/ui/AccessBanner";
import { StatsCard } from "../components/ui/StatsCard";
import { DescriptionList } from "../components/ui/DescriptionList";
```

### Type Errors
All components have full TypeScript support. Check the component file for detailed prop interfaces.

### Missing Icons
```tsx
import { IconName } from "lucide-react";
```

---

**Last Updated:** February 2026  
**Total Components:** 8 core components  
**Status:** Production Ready ✅
