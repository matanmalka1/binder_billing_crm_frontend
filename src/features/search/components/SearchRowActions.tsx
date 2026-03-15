import { useEffect, useRef, useState } from "react";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../utils/utils";
import type { SearchResult } from "../../../api/search.api";
import { toQueryParams } from "../../../api/queryParams";

const buildDetailUrl = (result: SearchResult): string | null => {
  if (result.result_type === "client") return `/clients/${result.client_id}`;
  if (result.result_type === "binder" && result.binder_id) {
    const params = toQueryParams({ binder_id: result.binder_id, client_id: result.client_id });
    return `/binders?${params.toString()}`;
  }
  return null;
};

interface SearchRowActionsProps {
  result: SearchResult;
}

export const SearchRowActions: React.FC<SearchRowActionsProps> = ({ result }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const url = buildDetailUrl(result);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!url) return <span className="text-sm text-gray-300">—</span>;

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600"
        aria-label="פעולות"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); navigate(url); }}
            className={cn(
              "w-full px-3 py-2 text-right text-sm text-gray-700 transition-colors hover:bg-gray-50",
            )}
          >
            <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
              <span className="truncate">פירוט</span>
              <span className="flex h-4 w-4 items-center justify-center">
                <ExternalLink className="h-4 w-4" />
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

SearchRowActions.displayName = "SearchRowActions";
