import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Search,
  ChevronRight,
  ChevronLeft,
  ReceiptText,
  FileText,
} from "lucide-react";
import { cn } from "../../utils/utils";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {

  const links = [
    { to: "/", label: "לוח בקרה", icon: LayoutDashboard },
    { to: "/binders", label: "תיקים", icon: Briefcase },
    { to: "/clients", label: "לקוחות", icon: Users },
    { to: "/search", label: "חיפוש", icon: Search },
    { to: "/charges", label: "חיובים", icon: ReceiptText },
    { to: "/documents", label: "מסמכים", icon: FileText },
  ];

  return (
    <aside
      className={cn(
        "bg-gray-900 text-white flex flex-col relative",
        isSidebarOpen ? "w-64" : "w-20",
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {isSidebarOpen ? (
          <span className="font-bold tracking-wider text-xl">בינדר</span>
        ) : (
          <span className="font-bold mx-auto">ב&ח</span>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg group",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )
            }
          >
            <link.icon className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-medium">{link.label}</span>}
            {!isSidebarOpen && (
              <div className="absolute right-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                {link.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggleSidebar}
        className="p-4 border-t border-gray-800 hover:bg-gray-800 flex items-center justify-center"
      >
        {isSidebarOpen ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
};
