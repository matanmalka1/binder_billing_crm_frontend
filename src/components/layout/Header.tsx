import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useUIStore } from "../../store/ui.store";
import { getRoleLabel } from "../../utils/enums";

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden text-gray-600"
          aria-label="פתח תפריט"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">יוסף מאיר מערכת ניהול</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <span>
            שלום,{" "}
            <span className="font-semibold text-gray-900">
              {user?.full_name || "אורח"}
            </span>
            {user?.role && (
              <span className="mr-1 text-gray-500">
                ({getRoleLabel(user.role)}) {/* ✅ Safe role display */}
              </span>
            )}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>התנתקות</span>
        </button>
      </div>
    </header>
  );
};
