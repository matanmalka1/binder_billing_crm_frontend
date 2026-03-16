import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../utils/utils";
import { FormField } from "./FormField";
import "react-day-picker/style.css";

interface DatePickerProps {
  label?: string;
  error?: string;
  value?: string; // "yyyy-MM-dd"
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  name?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  value,
  onChange,
  onBlur,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value
    ? (() => {
        const d = parse(value, "yyyy-MM-dd", new Date());
        return isValid(d) ? d : undefined;
      })()
    : undefined;

  const displayValue = selected ? format(selected, "dd/MM/yyyy") : "";

  const handleSelect = (day: Date | undefined) => {
    onChange?.(day ? format(day, "yyyy-MM-dd") : "");
    setOpen(false);
    onBlur?.();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onBlur]);

  return (
    <FormField label={label} error={error}>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          className={cn(
            "w-full flex items-center justify-between rounded-lg border px-3 py-3 shadow-sm text-sm transition-all bg-white text-right",
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

        {open && (
          <div className="absolute z-50 mt-1 rounded-xl border border-gray-200 bg-white shadow-lg end-0">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              locale={he}
              dir="rtl"
              classNames={{
                root: "p-3",
                month_caption: "flex justify-center items-center mb-2 font-medium text-sm text-gray-800",
                nav: "flex items-center justify-between mb-2",
                button_previous: "p-1 rounded hover:bg-gray-100 text-gray-500",
                button_next: "p-1 rounded hover:bg-gray-100 text-gray-500",
                weeks: "border-collapse",
                weekdays: "flex",
                weekday: "w-9 text-center text-xs text-gray-400 font-normal pb-1",
                week: "flex",
                day: "w-9 h-9 text-center text-sm",
                day_button: cn(
                  "w-9 h-9 rounded-lg text-sm font-normal transition-colors",
                  "hover:bg-primary-50 hover:text-primary-700",
                ),
                selected: "[&>button]:bg-primary-600 [&>button]:text-white [&>button]:hover:bg-primary-700",
                today: "[&>button]:font-semibold [&>button]:text-primary-600",
                outside: "opacity-30",
                disabled: "opacity-30 cursor-not-allowed",
              }}
            />
          </div>
        )}
      </div>
    </FormField>
  );
};

DatePicker.displayName = "DatePicker";
