import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { clientsApi } from "../../../api/clients.api";

interface ClientSuggestion {
  id: number;
  full_name: string;
}

interface ClientSearchFieldProps {
  selectedClientId: number;
  selectedClientName: string;
  onSelect: (id: number, name: string) => void;
  onClear: () => void;
}

export const ClientSearchField: React.FC<ClientSearchFieldProps> = ({
  selectedClientId,
  selectedClientName,
  onSelect,
  onClear,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ClientSuggestion[]>([]);
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

  const handleChange = (q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await clientsApi.list({ search: q.trim(), page_size: 8 });
        setSuggestions(res.items);
        setOpen(res.items.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (client: ClientSuggestion) => {
    onSelect(client.id, client.full_name);
    setQuery("");
    setOpen(false);
    setSuggestions([]);
  };

  if (selectedClientId > 0) {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">לקוח</label>
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
          <span className="flex-1 text-sm font-medium text-blue-900">{selectedClientName}</span>
          <span className="text-xs text-blue-500">#{selectedClientId}</span>
          <button
            type="button"
            onClick={onClear}
            className="rounded p-0.5 text-blue-400 hover:bg-blue-100 hover:text-blue-600"
            aria-label="נקה בחירה"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative space-y-1">
      <label className="block text-sm font-medium text-gray-700">לקוח</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="חפש שם לקוח..."
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {loading && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </span>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((c) => (
            <li
              key={c.id}
              onMouseDown={() => handleSelect(c)}
              className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm hover:bg-blue-50"
            >
              <span className="font-medium text-gray-900">{c.full_name}</span>
              <span className="text-xs text-gray-400">#{c.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};