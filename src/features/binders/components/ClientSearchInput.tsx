import { useState, useRef, useEffect } from "react";
import { searchApi } from "../../../api/search.api";
import type { SearchResult } from "../../../api/search.api";

interface ClientSearchInputProps {
  value: string;
  onChange: (query: string) => void;
  onSelect: (client: { id: number; name: string; id_number: string }) => void;
  error?: string;
}

export const ClientSearchInput: React.FC<ClientSearchInputProps> = ({
  value,
  onChange,
  onSelect,
  error,
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
    onSelect({ id: result.client_id, name: result.client_name, id_number: "" });
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-1">
      <label className="block text-sm font-medium text-gray-700">לקוח</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="חפש לפי שם, ת.ז. / ח.פ..."
          autoComplete="off"
          className={`w-full rounded-lg border px-3 py-3 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {loading && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((result) => (
            <li
              key={result.client_id}
              onMouseDown={() => handleSelect(result)}
              className="flex cursor-pointer items-center justify-between px-4 py-2.5 hover:bg-blue-50 text-sm"
            >
              <span className="font-medium text-gray-900">{result.client_name}</span>
              <span className="text-xs text-gray-400">#{result.client_id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
