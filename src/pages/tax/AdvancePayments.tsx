import { useState, useRef, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { Button } from "../../components/ui/Button";
import { Plus, X } from "lucide-react";
import { AdvancePaymentSummary } from "../../features/advancedPayments/components/AdvancePaymentSummary";
import { AdvancePaymentTable } from "../../features/advancedPayments/components/AdvancePaymentTable";
import { CreateAdvancePaymentModal } from "../../features/advancedPayments/components/CreateAdvancePaymentModal";
import { useAdvancePayments } from "../../features/advancedPayments/hooks/useAdvancePayments";
import { useAdvancePaymentFilters } from "../../features/advancedPayments/hooks/useAdvancePaymentFilters";
import { clientsApi } from "../../api/clients.api";
import { getYear } from "date-fns";

const CURRENT_YEAR = getYear(new Date());
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

interface ClientSuggestion {
  id: number;
  full_name: string;
}

const ClientSearchField: React.FC<{
  selectedClientId: number;
  selectedClientName: string;
  onSelect: (id: number, name: string) => void;
  onClear: () => void;
}> = ({ selectedClientId, selectedClientName, onSelect, onClear }) => {
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

export const AdvancePayments: React.FC = () => {
  const { filters, setFilter } = useAdvancePaymentFilters();
  const [selectedClientName, setSelectedClientName] = useState("");
  const { rows, isLoading, error, totalExpected, totalPaid, create, isCreating } =
    useAdvancePayments(filters.client_id, filters.year);
  const [showCreate, setShowCreate] = useState(false);

  const handleClientSelect = (id: number, name: string) => {
    setSelectedClientName(name);
    setFilter("client_id", id);
  };

  const handleClientClear = () => {
    setSelectedClientName("");
    setFilter("client_id", 0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="מחשבון מקדמות"
        description="מעקב תשלומי מקדמה חודשיים לכל לקוח"
        variant="gradient"
      />

      <Card title="בחירת לקוח ושנה">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-md">
          <ClientSearchField
            selectedClientId={filters.client_id}
            selectedClientName={selectedClientName}
            onSelect={handleClientSelect}
            onClear={handleClientClear}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">שנת מס</label>
            <select
              value={filters.year}
              onChange={(e) => setFilter("year", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {error && <ErrorCard message={error} />}

      {filters.client_id > 0 && (
        <AdvancePaymentSummary
          totalExpected={totalExpected}
          totalPaid={totalPaid}
        />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">מקדמות חודשיות</h3>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={filters.client_id <= 0}
          onClick={() => setShowCreate(true)}
        >
          <Plus className="h-4 w-4" />
          מקדמה חדשה
        </Button>
      </div>

      <AdvancePaymentTable rows={rows} isLoading={isLoading} />

      <CreateAdvancePaymentModal
        open={showCreate}
        clientId={filters.client_id}
        year={filters.year}
        onClose={() => setShowCreate(false)}
        onCreate={create}
        isCreating={isCreating}
      />
    </div>
  );
};
