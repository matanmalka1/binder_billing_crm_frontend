import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Search,
  ChevronRight,
  ChevronLeft,
  ReceiptText,
  FileSpreadsheet,
  CalendarDays,
  Bell,
  FileSignature,
  KanbanSquare,
  ClipboardList,
  Settings,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../utils/utils";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
}

interface NavGroup {
  label: string;
  key: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    key: "main",
    label: "ראשי",
    items: [
      { to: "/", label: "לוח בקרה", icon: LayoutDashboard, end: true },
      { to: "/binders", label: "קלסרים", icon: Briefcase },
      { to: "/clients", label: "לקוחות", icon: Users },
      { to: "/search", label: "חיפוש", icon: Search },
      { to: "/charges", label: "חיובים", icon: ReceiptText },
    ],
  },
  {
    key: "tax",
    label: "מיסים",
    items: [
      { to: "/tax/deadlines", label: "דוחות מס", icon: FileSpreadsheet },
      { to: "/tax/reports", label: "קנבן דוחות", icon: KanbanSquare, end: true },
      { to: "/tax/advance-payments", label: "מקדמות", icon: CalendarDays },
      { to: "/tax/vat", label: 'דוחות מע"מ', icon: ClipboardList },
    ],
  },
  {
    key: "reports",
    label: "דוחות",
    items: [
      { to: "/reports/aging", label: "דוח חובות", icon: TrendingDown },
      { to: "/reports/reminders", label: "תזכורות", icon: Bell },
      { to: "/reports/signature-requests", label: "בקשות חתימה", icon: FileSignature },
    ],
  },
  {
    key: "settings",
    label: "הגדרות",
    items: [
      { to: "/settings/users", label: "משתמשים", icon: Settings },
    ],
  },
];

interface NavGroupSectionProps {
  group: NavGroup;
  isSidebarOpen: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const NavGroupSection: React.FC<NavGroupSectionProps> = ({
  group,
  isSidebarOpen,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="mb-2">
      {isSidebarOpen ? (
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-between px-4 py-2 text-left text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500 select-none">
            {group.label}
          </span>
          <ChevronDown
            className={cn(
              "h-3 w-3 text-gray-600 transition-transform duration-200",
              isExpanded ? "rotate-0" : "-rotate-90",
            )}
          />
        </button>
      ) : (
        <div className="my-3 mx-3 border-t border-gray-800/80" />
      )}

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded || !isSidebarOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="space-y-1">
          {group.items.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end ?? link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-row-reverse items-center justify-start gap-3 rounded-xl px-4 py-2.5 group transition-colors text-right",
                  isActive
                    ? "bg-[#4f7dff] text-white shadow-[0_12px_28px_rgba(79,125,255,0.25)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )
              }
            >
              <link.icon className="h-5 w-5 shrink-0 stroke-[1.6]" />
              {isSidebarOpen && (
                <span className="text-sm font-medium text-right tracking-tight flex-1">
                  {link.label}
                </span>
              )}
              {!isSidebarOpen && (
                <div className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-50 text-left">
                  {link.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    main: true,
    tax: true,
    reports: true,
    settings: true,
  });

  const toggleGroup = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className={cn(
        "bg-gradient-to-b from-[#101b2f] via-[#0c1526] to-[#0a0f1f] text-white flex flex-col relative transition-all duration-200 shadow-xl shadow-black/30 border-r border-white/5",
        isSidebarOpen ? "w-64" : "w-16",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
        {isSidebarOpen ? (
          <span className="font-bold tracking-wider text-xl">YM Tax Crm</span>
        ) : (
          <span className="font-bold mx-auto text-sm">YM</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-2">
        {NAV_GROUPS.map((group) => (
          <NavGroupSection
            key={group.key}
            group={group}
            isSidebarOpen={isSidebarOpen}
            isExpanded={expanded[group.key] ?? true}
            onToggle={() => toggleGroup(group.key)}
          />
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="p-4 border-t border-white/5 hover:bg-white/5 flex items-center justify-center shrink-0 text-gray-400 hover:text-white transition-colors"
        aria-label={isSidebarOpen ? "כווץ תפריט" : "הרחב תפריט"}
      >
        {isSidebarOpen ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
};
