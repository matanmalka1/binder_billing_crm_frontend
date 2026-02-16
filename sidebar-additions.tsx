// Add these menu items to src/components/layout/Sidebar.tsx

// Import icons at the top:
import { BarChart3, Bell, FileSpreadsheet } from "lucide-react";

// Add these links to the links array:
{ to: "/reports/aging", label: "דוח חובות", icon: BarChart3 },
{ to: "/reports/reminders", label: "תזכורות", icon: Bell },
{ to: "/reports/import-export", label: "ייבוא/ייצוא", icon: FileSpreadsheet },
