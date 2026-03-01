import { useState, useRef, useEffect } from "react";
import { clientsApi } from "../../../api/clients.api";

export interface ClientSuggestion {
  id: number;
  full_name: string;
}

interface UseClientSearchResult {
  query: string;
  suggestions: ClientSuggestion[];
  isOpen: boolean;
  isLoading: boolean;
  handleQueryChange: (value: string) => void;
  handleSelect: (client: ClientSuggestion) => void;
  handleClose: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useClientSearch = (
  onSelect: (id: number, name: string) => void,
): UseClientSearchResult => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ClientSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await clientsApi.list({ search: value.trim(), page_size: 8 });
        setSuggestions(res.items);
        setIsOpen(res.items.length > 0);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSelect = (client: ClientSuggestion) => {
    onSelect(client.id, client.full_name);
    setQuery("");
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleClose = () => setIsOpen(false);

  return {
    query,
    suggestions,
    isOpen,
    isLoading,
    handleQueryChange,
    handleSelect,
    handleClose,
    containerRef,
  };
};
