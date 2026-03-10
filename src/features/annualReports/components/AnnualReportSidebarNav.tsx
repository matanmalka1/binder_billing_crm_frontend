import { cn } from "../../../utils/utils";
import type { SectionKey } from "../types";

interface AnnualReportSidebarNavProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
}

const NAV_ITEMS: { key: SectionKey; icon: string; label: string }[] = [
  { key: "overview", icon: "📋", label: "סקירה" },
  { key: "financials", icon: "💰", label: "הכנסות והוצאות" },
  { key: "tax", icon: "⚖️", label: "חישוב מס" },
  { key: "deductions", icon: "✂️", label: "ניכויים" },
  { key: "documents", icon: "📄", label: "מסמכים" },
  { key: "timeline", icon: "📅", label: "ציר זמן" },
];

const navItemVariants: Record<"active" | "inactive", string> = {
  active: "bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600",
  inactive: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
};

const AnnualReportSidebarNav = ({
  activeSection,
  onSectionChange,
}: AnnualReportSidebarNavProps) => {
  const handleNavClick = (section: SectionKey) => {
    onSectionChange(section);
  };

  return (
    <nav className="flex flex-col gap-1 py-2" dir="rtl">
      {NAV_ITEMS.map(({ key, icon, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => handleNavClick(key)}
          className={cn(
            "flex items-center gap-2 pr-3 py-2 rounded-lg text-sm transition-colors w-full text-right",
            navItemVariants[activeSection === key ? "active" : "inactive"],
          )}
        >
          <span>{icon}</span>
          <span className="hidden lg:inline">{label}</span>
        </button>
      ))}
    </nav>
  );
};

AnnualReportSidebarNav.displayName = "AnnualReportSidebarNav";

export default AnnualReportSidebarNav;
