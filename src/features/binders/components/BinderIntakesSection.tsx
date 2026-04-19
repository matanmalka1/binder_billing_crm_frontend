import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/primitives/Card";
import { Badge } from "../../../components/ui/primitives/Badge";
import { Timeline, TimelineEntry } from "../../../components/ui/feedback/Timeline";
import { bindersApi, bindersQK } from "../api";
import { vatReportsApi, vatReportsQK } from "@/features/vatReports/api";
import { staggerDelay } from "../../../utils/animation";
import { getBinderTypeLabel } from "../constants";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { VAT_STATUS_BADGE_VARIANTS } from "../../vatReports/constants";
import type { BinderIntakeMaterialResponse } from "../types";
import { formatStructuredBinderPeriod, toBinderPeriodValue } from "../utils";

const VatStatusBadge: React.FC<{ material: BinderIntakeMaterialResponse; clientId: number }> = ({
  material,
  clientId,
}) => {
  const navigate = useNavigate();
  const period = material.period_year && material.period_month_start && material.period_month_end
    ? toBinderPeriodValue(material.period_year, material.period_month_start, material.period_month_end)
    : null;

  const { data: lookup } = useQuery({
    queryKey: vatReportsQK.lookup(clientId, period!),
    queryFn: () => vatReportsApi.lookup(clientId, period!),
    enabled: clientId > 0 && !!period,
    staleTime: 30_000,
  });

  if (!lookup) return null;

  return (
    <Badge
      variant={VAT_STATUS_BADGE_VARIANTS[lookup.status] ?? "neutral"}
      className="cursor-pointer mr-1"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/tax/vat/${lookup.id}`);
      }}
    >
      {getVatWorkItemStatusLabel(lookup.status)}
    </Badge>
  );
};

interface BinderIntakesSectionProps {
  binderId: number;
  clientId: number;
}

export const BinderIntakesSection: React.FC<BinderIntakesSectionProps> = ({ binderId, clientId }) => {
  const { data, isLoading } = useQuery({
    queryKey: bindersQK.intakes(binderId),
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

              {intake.materials.length > 0 && (
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {intake.materials.map((m) => (
                    <div key={m.id} className="flex items-center gap-1 text-xs text-gray-700 font-medium">
                      <span>{getBinderTypeLabel(m.material_type)}</span>
                      {m.material_type === "vat" && m.period_year && m.period_month_start && m.period_month_end ? (
                        <span className="font-normal text-gray-500">
                          {" · "}
                          {formatStructuredBinderPeriod(
                            m.period_year,
                            m.period_month_start,
                            m.period_month_end,
                          )}
                        </span>
                      ) : formatStructuredBinderPeriod(
                        m.period_year,
                        m.period_month_start,
                        m.period_month_end,
                      ) ? (
                        <span className="font-normal text-gray-500">
                          {" · "}
                          {formatStructuredBinderPeriod(
                            m.period_year,
                            m.period_month_start,
                            m.period_month_end,
                          )}
                        </span>
                      ) : m.description ? (
                        <span className="font-normal text-gray-500"> · {m.description}</span>
                      ) : null}
                      {m.material_type === "vat" && m.period_year && m.period_month_start && m.period_month_end && (
                        <VatStatusBadge material={m} clientId={clientId} />
                      )}
                    </div>
                  ))}
                </div>
              )}

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
