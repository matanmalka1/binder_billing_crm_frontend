import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/utils";

interface InlineSelectProps {
  value: number;
  options: { label: string; value: number }[];
  onChange: (val: number) => void;
}

export const DatePickerInlineSelect: React.FC<InlineSelectProps> = ({ value, options, onChange }) => {
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
};

DatePickerInlineSelect.displayName = "DatePickerInlineSelect";
