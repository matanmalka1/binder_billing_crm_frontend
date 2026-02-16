# 🚀 Reports UI Quick Start

## What's Included

This package provides UI components for:
- **📊 Aging Report** - Debt analysis by age (0-30, 31-60, 61-90, 90+ days)
- **🔔 Reminders** - Management interface for automated reminders
- **📄 PDF Viewer** - Modal and inline PDF display components
- **📊 Excel Import/Export** - Bulk data operations

## Quick Installation (5 minutes)

### 1. Copy Files
```bash
# From the reports-ui/ directory:
cp reports.api.ts <your-project>/src/api/
cp AgingReportPage.tsx <your-project>/src/pages/reports/AgingReport.tsx
cp RemindersPage.tsx <your-project>/src/pages/reports/Reminders.tsx
cp ExcelImportExportPage.tsx <your-project>/src/pages/reports/ExcelImportExport.tsx
cp ExportButton.tsx <your-project>/src/components/ui/
cp PDFViewer.tsx <your-project>/src/components/ui/
```

### 2. Update Endpoints (`src/api/endpoints.ts`)
```typescript
reportsAging: "/reports/aging",
reportsAgingExport: "/reports/aging/export",
```

### 3. Add Routes (`src/router/AppRoutes.tsx`)
```typescript
import { AgingReportPage } from "../pages/reports/AgingReport";
import { RemindersPage } from "../pages/reports/Reminders";

// Inside ProtectedRoute:
<Route path="reports/aging" element={<AgingReportPage />} />
<Route path="reports/reminders" element={<RemindersPage />} />
```

### 4. Update Sidebar (`src/components/layout/Sidebar.tsx`)
```typescript
import { BarChart3, Bell } from "lucide-react";

// Add to links array:
{ to: "/reports/aging", label: "דוח חובות", icon: BarChart3 },
{ to: "/reports/reminders", label: "תזכורות", icon: Bell },
```

## 🎯 Features

### Aging Report (`/reports/aging`)
- ✅ Client debt breakdown by age buckets
- ✅ Summary statistics
- ✅ Excel/PDF export
- ✅ Date filtering
- ✅ Color-coded amounts

### PDF Viewer (Component)
```typescript
<PDFViewer 
  url="/api/documents/123"
  open={showPdf}
  onClose={() => setShowPdf(false)}
/>
```

### Export Button (Component)
```typescript
<ExportButton 
  onExport={async (format) => {
    await myExportFunction(format);
  }}
/>
```

## 📋 Backend Requirements

Your backend needs these endpoints:

```
GET  /api/v1/reports/aging
GET  /api/v1/reports/aging/export?format=excel|pdf
```

See `INTEGRATION_GUIDE.md` for response formats.

## ✅ Test It

1. Navigate to `/reports/aging`
2. Change the date filter
3. Click Excel export button
4. View the debt breakdown table

## 📚 Full Documentation

See `INTEGRATION_GUIDE.md` for:
- Complete API integration details
- Component usage examples
- Customization guide
- Troubleshooting tips

## 🎨 Consistent Design

All components:
- ✅ Reuse existing UI components
- ✅ Follow RTL layout patterns
- ✅ Use established color schemes
- ✅ Include loading/error states
- ✅ Fully TypeScript typed
- ✅ Responsive design

## 🔧 Dependencies

No additional npm packages required! Uses:
- Existing components (Card, Button, DataTable, etc.)
- React Query (already installed)
- Lucide React (already installed)

## 💬 Need Help?

Check the detailed `INTEGRATION_GUIDE.md` for:
- Step-by-step instructions
- API response formats
- Customization tips
- Troubleshooting
