import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { Card } from "../../../components/ui/Card";
import { Timeline, TimelineEntry } from "../../../components/ui/Timeline";
import { QK } from "../../../lib/queryKeys";
import { bindersApi } from "../../../api/binders.api";
import { staggerDelay } from "../../../utils/animation";
import { getBinderTypeLabel } from "../constants";

interface BinderIntakesSectionProps {
  binderId: number;
  binderType: string;
}

export const BinderIntakesSection: React.FC<BinderIntakesSectionProps> = ({ binderId, binderType }) => {
  const { data, isLoading } = useQuery({
    queryKey: QK.binders.intakes(binderId),
    queryFn: () => bindersApi.getIntakes(binderId),
  });

  const intakes = data?.intakes ?? [];

  if (isLoading) return null;

  return (
    <Card title="קליטות חומר" subtitle={intakes.length ? `${intakes.length} קליטות` : undefined}>
      {intakes.length === 0 ? (
        <p className="text-sm text-gray-500">אין קליטות חומר</p>
      ) : (
        <Timeline>
          {[...intakes].reverse().map((intake, index) => (
            <TimelineEntry key={intake.id} animationDelay={staggerDelay(index, 40)}>
              <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {format(parseISO(intake.received_at), "d MMM yyyy", { locale: he })}
              </div>

              <p className="text-xs text-gray-700 font-medium mt-0.5">{getBinderTypeLabel(binderType)}</p>

              {intake.received_by_name && (
                <p className="text-xs text-gray-500 mt-0.5">{intake.received_by_name}</p>
              )}

              {intake.notes && (
                <p className="mt-1.5 text-xs text-gray-600 border-t border-gray-100 pt-1.5">
                  {intake.notes}
                </p>
              )}
            </TimelineEntry>
          ))}
        </Timeline>
      )}
    </Card>
  );
};

BinderIntakesSection.displayName = "BinderIntakesSection";
