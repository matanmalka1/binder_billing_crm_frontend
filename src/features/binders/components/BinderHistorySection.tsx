import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { QK } from "../../../lib/queryKeys";
import { bindersApi } from "../../../api/binders.api";
import { getStatusLabel } from "../../../utils/enums";
import { staggerDelay } from "../../../utils/animation";

const STATUS_VARIANTS: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  in_office: "info",
  ready_for_pickup: "success",
  returned: "neutral",
  overdue: "error",
};

interface BinderHistorySectionProps {
  binderId: number;
}

export const BinderHistorySection: React.FC<BinderHistorySectionProps> = ({ binderId }) => {
  const { data, isLoading } = useQuery({
    queryKey: QK.binders.history(binderId),
    queryFn: () => bindersApi.getHistory(binderId),
  });

  const history = data?.history ?? [];

  if (isLoading) return null;

  return (
    <Card title="היסטוריית שינויים" subtitle={history.length ? `${history.length} שינויים` : undefined}>
      {history.length === 0 ? (
        <p className="text-sm text-gray-500">אין רשומות היסטוריה</p>
      ) : (
        <div className="relative">
          <div className="absolute right-4 top-2 bottom-2 w-0.5 bg-gray-200" />
          <ul className="space-y-4">
            {[...history].reverse().map((entry, index) => (
              <li
                key={index}
                className="relative pr-10 animate-fade-in"
                style={{ animationDelay: staggerDelay(index, 40) }}
              >
                <div className="absolute right-2.5 top-1.5 h-3 w-3 rounded-full bg-primary-500 ring-2 ring-white" />
                <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5 text-sm">
                    {entry.old_status && (
                      <>
                        <Badge variant={STATUS_VARIANTS[entry.old_status] ?? "neutral"} className="text-xs">
                          {getStatusLabel(entry.old_status)}
                        </Badge>
                        <ArrowLeft className="h-3 w-3 text-gray-400" />
                      </>
                    )}
                    <Badge variant={STATUS_VARIANTS[entry.new_status] ?? "neutral"} className="text-xs">
                      {getStatusLabel(entry.new_status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {format(parseISO(entry.changed_at), "d MMM yyyy HH:mm", { locale: he })}
                  </div>

                  {entry.notes && (
                    <p className="mt-1.5 text-xs text-gray-600 border-t border-gray-100 pt-1.5">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
