import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../utils/utils";

interface SortableHeaderProps {
  label: string;
  columnKey: string;
  sortBy: string;
  sortDir: string;
  onSort: (key: string) => void;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({ label, columnKey, sortBy, sortDir, onSort }) => {
  const isActive = sortBy === columnKey;
  const Icon = isActive ? (sortDir === "asc" ? ChevronUp : ChevronDown) : ChevronsUpDown;
  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className={cn(
        "inline-flex items-center gap-1 font-semibold uppercase tracking-wide",
        isActive ? "text-gray-800" : "text-gray-500 hover:text-gray-700",
      )}
    >
      {label}
      <Icon className="h-3 w-3 shrink-0" />
    </button>
  );
};

SortableHeader.displayName = "SortableHeader";
