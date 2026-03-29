import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../utils/utils";
import { FormField } from "./FormField";
import { DatePickerCalendar } from "./DatePickerCalendar";

export interface DatePickerProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  name?: string;
  maxDate?: Date;
  compact?: boolean;
  noWrapper?: boolean;
  usePortal?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  value,
  onChange,
  onBlur,
  disabled,
  maxDate,
  compact = false,
  noWrapper = false,
  usePortal = false,
}) => {
  const [open, setOpen] = useState(false);
  const [month, setMonthState] = useState<Date>(new Date());
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = value
    ? (() => {
        const d = parse(value, "yyyy-MM-dd", new Date());
        return isValid(d) ? d : undefined;
      })()
    : undefined;

  useEffect(() => {
    if (selected) setMonthState(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const displayValue = selected ? format(selected, "dd/MM/yyyy") : "";

  const handleOpen = () => {
    if (disabled) return;
    if (!open && usePortal && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    }
    setOpen((o) => !o);
  };

  const handleSelect = (day: Date | undefined) => {
    onChange?.(day ? format(day, "yyyy-MM-dd") : "");
    setOpen(false);
    onBlur?.();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideContainer = containerRef.current?.contains(target);
      const insideTrigger = triggerRef.current?.contains(target);
      if (!insideContainer && !insideTrigger) {
        setOpen(false);
        onBlur?.();
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onBlur]);

  const calendar = (
    <DatePickerCalendar
      selected={selected}
      month={month}
      onMonthChange={setMonthState}
      onSelect={handleSelect}
      maxDate={maxDate}
      containerRef={usePortal ? containerRef : undefined}
      className={usePortal ? "fixed z-[9999]" : "absolute z-50 mt-1 end-0"}
      style={usePortal && dropdownPos ? { top: dropdownPos.top, left: dropdownPos.left } : undefined}
    />
  );

  const picker = (
    <div ref={usePortal ? undefined : containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className={cn(
          "w-full flex items-center justify-between rounded-lg border shadow-sm text-sm transition-all bg-white text-right",
          compact ? "px-2 py-1 h-7 text-xs" : "px-3 py-3",
          error ? "border-red-500" : "border-gray-300",
          open && "border-primary-500 ring-2 ring-primary-500",
          disabled && "bg-gray-50 cursor-not-allowed text-gray-400",
          !disabled && "hover:border-gray-400",
        )}
      >
        <span className={cn("flex-1 text-right", !displayValue && "text-gray-400")}>
          {displayValue || "בחר תאריך"}
        </span>
        <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ms-2" />
      </button>

      {open && (usePortal ? createPortal(calendar, document.body) : calendar)}
    </div>
  );

  if (noWrapper) return picker;
  return <FormField label={label} error={error}>{picker}</FormField>;
};

DatePicker.displayName = "DatePicker";
