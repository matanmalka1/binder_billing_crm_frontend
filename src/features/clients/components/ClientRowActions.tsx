import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../utils/utils";

interface ClientRowActionsProps {
  clientId: number;
}

export const ClientRowActions: React.FC<ClientRowActionsProps> = ({ clientId }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const item = (label: string, onClick: () => void, icon: React.ReactNode, danger = false) => (
    <button
      key={label}
      type="button"
      onClick={(e) => { e.stopPropagation(); setOpen(false); onClick(); }}
      className={cn(
        "w-full px-3 py-2 text-right text-sm transition-colors hover:bg-gray-50",
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700",
      )}
    >
      <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
        <span className="truncate">{label}</span>
        <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      </span>
    </button>
  );

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600"
        aria-label={`פעולות ללקוח ${clientId}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {item("ציר זמן", () => navigate(`/clients/${clientId}/timeline`), <Clock className="h-4 w-4" />)}
        </div>
      )}
    </div>
  );
};

ClientRowActions.displayName = "ClientRowActions";
