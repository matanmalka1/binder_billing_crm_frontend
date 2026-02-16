// Add these routes to src/router/AppRoutes.tsx

// Import the new pages at the top:
import { AgingReportPage } from "../pages/reports/AgingReport";
import { RemindersPage } from "../pages/reports/Reminders";
import { ExcelImportExportPage } from "../pages/reports/ExcelImportExport";

// Add these routes inside the <Route path="/" element={<ProtectedRoute />}> section:
<Route path="reports/aging" element={<AgingReportPage />} />
<Route path="reports/reminders" element={<RemindersPage />} />
<Route path="reports/import-export" element={<ExcelImportExportPage entityType="clients" />} />
