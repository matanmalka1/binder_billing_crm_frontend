# 📊 Reports UI Integration Guide

## Overview
This package contains UI components for the new reporting features:
1. **Aging Report** - Client debt analysis by age
2. **Reminders** - Automated reminder management
3. **PDF Viewer** - Inline PDF display
4. **Excel Import/Export** - Data import/export functionality

## 📁 File Structure

```
src/
├── api/
│   └── reports.api.ts              # NEW - Reports API layer
├── pages/
│   └── reports/
│       ├── AgingReport.tsx         # NEW - Aging report page
│       ├── Reminders.tsx           # NEW - Reminders management
│       └── ExcelImportExport.tsx   # NEW - Excel import/export
└── components/
    └── ui/
        ├── ExportButton.tsx        # NEW - Reusable export dropdown
        ├── PDFViewer.tsx           # NEW - PDF viewer modal
        └── InlinePDFViewer.tsx     # NEW - Embedded PDF viewer
```

## 🚀 Installation Steps

### Step 1: Copy Files

Copy all files from this package to your project:

```bash
# API layer
cp reports.api.ts src/api/

# Pages
mkdir -p src/pages/reports
cp AgingReportPage.tsx src/pages/reports/AgingReport.tsx
cp RemindersPage.tsx src/pages/reports/Reminders.tsx
cp ExcelImportExportPage.tsx src/pages/reports/ExcelImportExport.tsx

# Components
cp ExportButton.tsx src/components/ui/
cp PDFViewer.tsx src/components/ui/
```

### Step 2: Update Endpoints

Add to `src/api/endpoints.ts`:

```typescript
export const ENDPOINTS = {
  // ... existing endpoints
  reportsAging: "/reports/aging",
  reportsAgingExport: "/reports/aging/export",
} as const;
```

### Step 3: Add Routes

Update `src/router/AppRoutes.tsx`:

```typescript
// Add imports
import { AgingReportPage } from "../pages/reports/AgingReport";
import { RemindersPage } from "../pages/reports/Reminders";
import { ExcelImportExportPage } from "../pages/reports/ExcelImportExport";

// Add routes inside ProtectedRoute
<Route path="reports/aging" element={<AgingReportPage />} />
<Route path="reports/reminders" element={<RemindersPage />} />
<Route path="reports/import-export" element={<ExcelImportExportPage entityType="clients" />} />
```

### Step 4: Update Sidebar Navigation

Update `src/components/layout/Sidebar.tsx`:

```typescript
// Add imports
import { BarChart3, Bell, FileSpreadsheet } from "lucide-react";

// Add to links array
const links = [
  // ... existing links
  { to: "/reports/aging", label: "דוח חובות", icon: BarChart3 },
  { to: "/reports/reminders", label: "תזכורות", icon: Bell },
  { to: "/reports/import-export", label: "ייבוא/ייצוא", icon: FileSpreadsheet },
];
```

## 🎨 Component Usage

### 1. Aging Report

Navigate to `/reports/aging` to view:
- Client debt breakdown by age buckets
- Summary statistics
- Excel/PDF export functionality
- Date filtering

```typescript
// The page is self-contained and ready to use
// Just add the route and navigate to it
```

### 2. Export Button (Reusable)

Use in any component that needs export functionality:

```typescript
import { ExportButton } from "../components/ui/ExportButton";

<ExportButton
  onExport={async (format) => {
    // Handle export logic
    await myExportFunction(format);
  }}
/>
```

### 3. PDF Viewer

#### Modal Viewer:
```typescript
import { PDFViewer } from "../components/ui/PDFViewer";

const [showPdf, setShowPdf] = useState(false);

<PDFViewer
  url="/api/documents/123/view"
  filename="document.pdf"
  open={showPdf}
  onClose={() => setShowPdf(false)}
/>
```

#### Inline Viewer:
```typescript
import { InlinePDFViewer } from "../components/ui/PDFViewer";

<InlinePDFViewer
  url="/api/documents/123/view"
  height="600px"
/>
```

### 4. Excel Import/Export

Navigate to `/reports/import-export`:
- Upload Excel files for bulk import
- Download current data as Excel
- Template download for correct format

## 🔧 API Integration

### Backend Requirements

Ensure your backend has these endpoints:

```python
# Reports
GET  /api/v1/reports/aging
GET  /api/v1/reports/aging/export?format=excel|pdf

# Reminders (if implementing)
GET  /api/v1/reminders
POST /api/v1/reminders
POST /api/v1/reminders/{id}/cancel

# Excel Import/Export (if implementing)
GET  /api/v1/{entity}/export
POST /api/v1/{entity}/import
```

### Example API Response Formats

**Aging Report:**
```json
{
  "report_date": "2026-02-16T10:30:00Z",
  "total_outstanding": 150000.00,
  "summary": {
    "current": 50000.00,
    "days_30": 30000.00,
    "days_60": 40000.00,
    "days_90_plus": 30000.00
  },
  "items": [
    {
      "client_id": 123,
      "client_name": "חברה בע\"מ",
      "total_outstanding": 25000.00,
      "current": 10000.00,
      "days_30": 5000.00,
      "days_60": 5000.00,
      "days_90_plus": 5000.00,
      "oldest_invoice_date": "2025-11-01",
      "oldest_invoice_days": 107
    }
  ]
}
```

**Export Response:**
```json
{
  "download_url": "/tmp/exports/aging_report_20260216.xlsx",
  "filename": "aging_report_20260216.xlsx",
  "format": "excel",
  "generated_at": "2026-02-16T10:30:00Z"
}
```

## 🎯 Features Summary

### ✅ Aging Report
- [x] Date filtering
- [x] Summary statistics with StatsCard
- [x] Detailed client breakdown
- [x] Color-coded debt buckets
- [x] Excel/PDF export
- [x] Responsive design
- [x] Loading states
- [x] Error handling

### ✅ PDF Viewer
- [x] Modal viewer with zoom
- [x] Inline embedded viewer
- [x] Download functionality
- [x] Fullscreen mode
- [x] Responsive iframe

### ✅ Excel Import/Export
- [x] File upload with drag-drop ready
- [x] Template download
- [x] Format validation
- [x] Progress indicators
- [x] Usage instructions

### ⏳ Reminders (Template Ready)
- [x] UI framework
- [ ] API integration needed
- [ ] Create reminder form
- [ ] Notification system

## 🎨 Design Patterns Used

### Consistent with Existing Codebase
- ✅ Reuses existing components (Card, Button, DataTable, etc.)
- ✅ Follows established color schemes (blue, green, red, orange)
- ✅ Uses existing animation utilities (staggerDelay)
- ✅ Matches RTL layout patterns
- ✅ Consistent error handling with toast notifications
- ✅ React Query for data fetching
- ✅ TypeScript for type safety

### Component Patterns
```typescript
// All components follow this structure:
1. Type definitions at top
2. React Query hooks for data
3. Event handlers
4. Conditional rendering (loading, error, success)
5. Return JSX with proper spacing
```

## 🚨 Important Notes

### 1. Backend Integration Required
These components expect backend endpoints to exist. Update the API URLs if your backend structure differs.

### 2. Permissions
Add role-based access control as needed:
```typescript
const isAdvisor = user?.role === "advisor";
if (!isAdvisor) {
  return <AccessDenied />;
}
```

### 3. Reminders API
The Reminders page is a template. Implement the actual API calls in `remindersApi`:
```typescript
const remindersApi = {
  list: async () => {
    const response = await api.get<Reminder[]>("/reminders");
    return response.data;
  },
  // ... implement other methods
};
```

## 📚 Additional Resources

### Related Components
- `StatsCard` - Used for summary metrics
- `DataTable` - Used for tabular data
- `Card` - Container component
- `PageHeader` - Page titles and actions
- `Modal` - Dialog overlays

### Utilities
- `toast` - Notifications
- `getErrorMessage` - Error formatting
- `formatDate` - Date formatting
- `cn` - Classname utility

## 🔍 Testing Checklist

- [ ] Navigate to `/reports/aging`
- [ ] Filter by date
- [ ] Click Excel export
- [ ] Click PDF export
- [ ] Navigate to `/reports/reminders`
- [ ] View reminders table
- [ ] Navigate to `/reports/import-export`
- [ ] Test file upload UI
- [ ] Test PDF viewer modal
- [ ] Test responsive design (mobile)

## 💡 Customization Tips

### Change Colors
```typescript
// In StatsCard usage:
<StatsCard variant="blue" />    // Blue theme
<StatsCard variant="green" />   // Green theme
<StatsCard variant="red" />     // Red theme
<StatsCard variant="purple" />  // Purple theme
```

### Adjust Table Columns
```typescript
// Modify columns array in AgingReportPage.tsx
const columns: Column<AgingReportItem>[] = [
  // Add/remove/reorder columns
  { key: "new_field", header: "שדה חדש", render: (item) => item.new_field }
];
```

### Add Filters
```typescript
// Add state
const [statusFilter, setStatusFilter] = useState("");

// Add to query key
queryKey: ["reports", "aging", asOfDate, statusFilter]

// Add UI
<Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
  <option value="">הכל</option>
  <option value="overdue">באיחור</option>
</Select>
```

## 🤝 Support

If you encounter issues:
1. Check console for errors
2. Verify backend endpoints are accessible
3. Ensure all imports are correct
4. Check that endpoints.ts is updated
5. Verify routes are added to AppRoutes.tsx

## ✨ Future Enhancements

Consider adding:
- [ ] Report scheduling
- [ ] Email notifications for reminders
- [ ] Advanced filters (client type, amount range)
- [ ] Comparison reports (month-over-month)
- [ ] Dashboard widgets
- [ ] Custom report builder
- [ ] Batch operations on reminders
- [ ] Export history log

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-16  
**Author:** Binder Billing CRM Team
