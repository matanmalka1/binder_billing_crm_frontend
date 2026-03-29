import { ChevronDown } from "lucide-react";
import { cn } from "../../../utils/utils";
import { SidebarItem } from "./SidebarItem";
import type { NavGroup } from "./sidebar.constants";

interface SidebarGroupProps {
  group: NavGroup;
  isSidebarOpen: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
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
          className="flex w-full items-center justify-between px-4 py-2 text-left text-gray-400 transition-colors hover:text-white"
          aria-expanded={isExpanded}
          aria-controls={`nav-group-${group.key}`}
        >
          <span className="select-none text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">
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
        <div className="mx-3 my-3 border-t border-gray-800/80" />
      )}

      <div
        id={`nav-group-${group.key}`}
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded || !isSidebarOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="space-y-1">
          {group.items.map((item) => (
            <SidebarItem key={item.to} item={item} isSidebarOpen={isSidebarOpen} />
          ))}
        </div>
      </div>
    </div>
  );
};
