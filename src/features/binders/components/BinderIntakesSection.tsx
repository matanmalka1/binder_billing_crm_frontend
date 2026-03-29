import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Timeline, TimelineEntry } from "../../../components/ui/Timeline";
import { bindersApi, bindersQK } from "../api";
import { vatReportsApi, vatReportsQK } from "@/features/vatReports/api";
import { staggerDelay } from "../../../utils/animation";
import { getBinderTypeLabel } from "../constants";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import type { BinderIntakeMaterialResponse } from "../types";

const VAT_STATUS_VARIANTS: Record<string, "success" | "warning" | "info" | "neutral"> = {
  filed: "success",
  ready_for_review: "warning",
  data_entry_in_progress: "info",
  material_received: "info",
  pending_materials: "neutral",
};

const VatStatusBadge: React.FC<{ material: BinderIntakeMaterialResponse }> = ({ material }) => {
  const navigate = useNavigate();
  const period = material.description?.slice(0, 7);

  const { data: lookup } = useQuery({
    queryKey: vatReportsQK.lookup(material.business_id!, period!),
    queryFn: () => vatReportsApi.lookup(material.business_id!, period!),
    enabled: !!material.business_id && !!period && /^\d{4}-\d{2}$/.test(period),
    staleTime: 30_000,
  });

  if (!lookup) return null;

  return (
    <Badge
      variant={VAT_STATUS_VARIANTS[lookup.status] ?? "neutral"}
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
}

export const BinderIntakesSection: React.FC<BinderIntakesSectionProps> = ({ binderId }) => {
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
                      {m.description && (
                        <span className="font-normal text-gray-500"> · {m.description}</span>
                      )}
                      {m.material_type === "vat" && m.business_id && m.description && (
                        <VatStatusBadge material={m} />
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
