import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/inputs/Input";
import { searchApi } from "@/features/search/api";
import type { SearchResult } from "@/features/search/api";
import { formatClientOfficeId } from "@/utils/utils";

// ── Controlled search input (value/onChange) ──────────────────────────────────

interface ClientSearchInputProps {
  value: string;
  onChange: (query: string) => void;
  onSelect: (client: { id: number; name: string; id_number: string; client_status?: string | null }) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export const ClientSearchInput: React.FC<ClientSearchInputProps> = ({
  value,
  onChange,
  onSelect,
  error,
  label = "לקוח",
  placeholder = "חפש לפי שם, ת.ז. / ח.פ...",
}) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (query: string) => {
    onChange(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchApi.search({ query: query.trim(), page_size: 8 });
        const clientResults = res.results.filter((r) => r.result_type === "client");
        setResults(clientResults);
        setOpen(clientResults.length > 0);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (result: SearchResult) => {
    onSelect({ id: result.client_id, name: result.client_name, id_number: "", client_status: result.client_status });
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        label={label}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        error={error}
        startIcon={<Search className="h-4 w-4" />}
        endElement={
          loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          ) : value ? (
            <button type="button" onClick={() => { onChange(""); setResults([]); setOpen(false); }} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          ) : undefined
        }
      />

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((result) => (
            <li
              key={result.client_id}
              onMouseDown={() => handleSelect(result)}
              className="flex cursor-pointer items-center justify-between px-4 py-2.5 hover:bg-primary-50 text-sm"
            >
              <span className="font-medium text-gray-900">{result.client_name}</span>
              <span className="text-xs text-gray-400">{formatClientOfficeId(result.client_id)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ClientSearchInput.displayName = "ClientSearchInput";

// ── Selected-client display (with clear button) ───────────────────────────────

interface SelectedClientDisplayProps {
  name: string;
  id: number;
  onClear: () => void;
  label?: string;
}

export const SelectedClientDisplay: React.FC<SelectedClientDisplayProps> = ({
  name,
  id,
  onClear,
  label = "לקוח",
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-3">
      <span className="flex-1 text-sm font-medium text-primary-900">{name}</span>
      <span className="text-xs text-primary-500">{formatClientOfficeId(id)}</span>
      <button
        type="button"
        onClick={onClear}
        className="rounded p-0.5 text-primary-400 hover:bg-primary-100 hover:text-primary-600"
        aria-label="נקה בחירה"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
);

SelectedClientDisplay.displayName = "SelectedClientDisplay";
