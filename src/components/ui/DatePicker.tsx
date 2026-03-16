import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid, setMonth, setYear, getMonth, getYear, addMonths, subMonths } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/utils";
import { FormField } from "./FormField";
import "react-day-picker/style.css";

interface DatePickerProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  name?: string;
}

const MONTH_NAMES = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const START_YEAR = 2000;
const END_YEAR = 2099;

function InlineSelect({
  value,
  options,
  onChange,
}: {
  value: number;
  options: { label: string; value: number }[];
  onChange: (val: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.querySelector("[data-selected=true]") as HTMLElement;
      if (selected) selected.scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-800 transition-colors"
      >
        {current?.label}
        <ChevronDown className={cn("h-3 w-3 text-gray-500 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          ref={listRef}
          className="absolute z-[60] top-full mt-1 start-0 w-28 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              data-selected={opt.value === value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                "w-full text-right px-3 py-1.5 text-sm transition-colors",
                opt.value === value
                  ? "bg-primary-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CaptionRow({
  displayMonth,
  onMonthChange,
}: {
  displayMonth: Date;
  onMonthChange: (month: Date) => void;
}) {
  const monthOptions = MONTH_NAMES.map((label, i) => ({ label, value: i }));
  const yearOptions = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => ({
    label: String(START_YEAR + i),
    value: START_YEAR + i,
  }));

  return (
    <div className="flex items-center justify-between mb-3">
      <button
        type="button"
        onClick={() => onMonthChange(subMonths(displayMonth, 1))}
        className="p-1.5 rounded-lg hover:bg-primary-50 hover:text-primary-600 text-gray-400 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="flex gap-1.5">
        <InlineSelect
          value={getMonth(displayMonth)}
          options={monthOptions}
          onChange={(m) => onMonthChange(setMonth(displayMonth, m))}
        />
        <InlineSelect
          value={getYear(displayMonth)}
          options={yearOptions}
          onChange={(y) => onMonthChange(setYear(displayMonth, y))}
        />
      </div>

      <button
        type="button"
        onClick={() => onMonthChange(addMonths(displayMonth, 1))}
        className="p-1.5 rounded-lg hover:bg-primary-50 hover:text-primary-600 text-gray-400 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
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
  const [month, setMonthState] = useState<Date>(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value
    ? (() => {
        const d = parse(value, "yyyy-MM-dd", new Date());
        return isValid(d) ? d : undefined;
      })()
    : undefined;

  useEffect(() => {
    if (selected) setMonthState(selected);
  }, [value]);

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
            <div className="p-3">
              <CaptionRow displayMonth={month} onMonthChange={setMonthState} />
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={handleSelect}
                month={month}
                onMonthChange={setMonthState}
                locale={he}
                dir="rtl"
                hideNavigation
                classNames={{
                  root: "",
                  month_caption: "hidden",
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
          </div>
        )}
      </div>
    </FormField>
  );
};

DatePicker.displayName = "DatePicker";
