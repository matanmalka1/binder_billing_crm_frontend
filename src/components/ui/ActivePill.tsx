interface ActivePillProps {
  label: string;
  onRemove: () => void;
}

export const ActivePill: React.FC<ActivePillProps> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 py-0.5 pr-2.5 pl-1.5 text-xs font-medium text-primary-800">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary-200 transition-colors"
      aria-label={`הסר סינון ${label}`}
    >
      ×
    </button>
  </span>
);

ActivePill.displayName = "ActivePill";
