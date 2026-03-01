import { X } from "lucide-react";
import { useClientSearch } from "../hooks/useClientSearch";

interface SelectedClientProps {
  name: string;
  id: number;
  onClear: () => void;
}

const SelectedClient: React.FC<SelectedClientProps> = ({ name, id, onClear }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">לקוח</label>
    <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
      <span className="flex-1 text-sm font-medium text-blue-900">{name}</span>
      <span className="text-xs text-blue-500">#{id}</span>
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

SelectedClient.displayName = "SelectedClient";

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
  const { query, suggestions, isOpen, isLoading, handleQueryChange, handleSelect, containerRef } =
    useClientSearch(onSelect);

  if (selectedClientId > 0) {
    return (
      <SelectedClient
        name={selectedClientName}
        id={selectedClientId}
        onClear={onClear}
      />
    );
  }

  return (
    <div ref={containerRef} className="relative space-y-1">
      <label className="block text-sm font-medium text-gray-700">לקוח</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="חפש שם לקוח..."
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading && (
          <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </span>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((client) => (
            <li
              key={client.id}
              onMouseDown={() => handleSelect(client)}
              className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm hover:bg-blue-50"
            >
              <span className="font-medium text-gray-900">{client.full_name}</span>
              <span className="text-xs text-gray-400">#{client.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ClientSearchField.displayName = "ClientSearchField";