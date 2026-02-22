import { cn } from "../../utils/utils";

interface DetailDrawerProps {
  open: boolean;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  open,
  title,
  subtitle,
  onClose,
  children,
}) => (
  <>
    <div
      className={cn(
        "fixed inset-0 z-40 bg-black/20 transition-opacity duration-200",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
      aria-hidden="true"
    />
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl",
        "transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full",
      )}
      dir="rtl"
    >
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="סגירה"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">{children}</div>
    </div>
  </>
);
DetailDrawer.displayName = "DetailDrawer";

// ── Field row ──────────────────────────────────────────────────────────────────

interface DrawerFieldProps {
  label: string;
  value: React.ReactNode;
}

export const DrawerField: React.FC<DrawerFieldProps> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-500 shrink-0">{label}</span>
    <span className="text-sm text-gray-900 text-left font-medium">{value ?? "—"}</span>
  </div>
);
DrawerField.displayName = "DrawerField";

// ── Section ────────────────────────────────────────────────────────────────────

interface DrawerSectionProps {
  title: string;
  children: React.ReactNode;
}

export const DrawerSection: React.FC<DrawerSectionProps> = ({ title, children }) => (
  <div>
    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</h4>
    <div className="rounded-lg border border-gray-100 px-4">{children}</div>
  </div>
);
DrawerSection.displayName = "DrawerSection";
