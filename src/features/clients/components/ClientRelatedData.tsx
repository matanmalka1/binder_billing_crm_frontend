import { type FC } from "react";
import { ChevronRight, FolderOpen, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/primitives/Card";
import { Button } from "../../../components/ui/primitives/Button";
import type { LucideIcon } from "lucide-react";
import type { ClientChargeSummary } from "../types";
import type { BinderDetailResponse } from "@/features/binders/api";
import { getChargeStatusLabel } from "../../../utils/enums";
import { getChargeTypeLabel } from "@/features/charges";
import { BINDER_STATUS_OPTIONS } from "@/features/binders";

const getBinderStatusLabel = (status: string): string =>
  BINDER_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;

// ── Stat pill ───────────────────────────────────────────────────────────────

interface StatPillProps {
  icon: LucideIcon;
  iconColor: string;
  count: number;
  label: string;
  href?: string;
}

const StatPill: FC<StatPillProps> = ({ icon: Icon, iconColor, count, label, href }) => {
  const inner = (
    <div className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 hover:bg-gray-100 transition-colors">
      <div className={`shrink-0 rounded-md p-1.5 ${iconColor}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-base font-bold text-gray-900 leading-none">{count}</div>
        <div className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</div>
      </div>
    </div>
  );

  return href ? <Link to={href} className="block">{inner}</Link> : inner;
};

interface RelatedItemsSectionProps<T> {
  title: string;
  total: number;
  allHref: string;
  items: T[];
  className?: string;
  getKey: (item: T) => number;
  getTitle: (item: T) => React.ReactNode;
  getSubtitle: (item: T) => React.ReactNode;
  getItemHref: (item: T) => string;
}

const RelatedItemsSection = <T,>({
  title,
  total,
  allHref,
  items,
  className,
  getKey,
  getTitle,
  getSubtitle,
  getItemHref,
}: RelatedItemsSectionProps<T>) => (
  <div className={className}>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-700">{title}</span>
      {total > 5 && (
        <Link to={allHref} className="text-xs text-primary-600 hover:underline">
          הכל ({total})
        </Link>
      )}
    </div>
    <div className="space-y-2">
      {items.slice(0, 5).map((item) => (
        <div
          key={getKey(item)}
          className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 transition-colors hover:bg-gray-100"
        >
          <div>
            <div className="text-sm font-medium text-gray-900">{getTitle(item)}</div>
            <div className="text-xs text-gray-500">{getSubtitle(item)}</div>
          </div>
          <Link to={getItemHref(item)}>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────

type ClientRelatedDataProps = {
  clientId: number;
  binders: BinderDetailResponse[];
  bindersTotal: number;
  charges: ClientChargeSummary[];
  chargesTotal: number;
  canViewCharges: boolean;
};

export const ClientRelatedData: FC<ClientRelatedDataProps> = ({
  clientId,
  binders,
  bindersTotal,
  charges,
  chargesTotal,
  canViewCharges,
}) => {
  const hasBinderList = binders.length > 0;
  const hasChargeList = canViewCharges && charges.length > 0;

  return (
    <Card title="נתונים קשורים">
      {/* Stat pills — 3-col grid wraps to 2 rows in narrow right column */}
      <div className="grid grid-cols-2 gap-2">
        <StatPill
          icon={FolderOpen}
          iconColor="bg-primary-100 text-primary-600"
          count={bindersTotal}
          label="קלסרים"
        />
        {canViewCharges && (
          <StatPill
            icon={Receipt}
            iconColor="bg-positive-100 text-positive-700"
            count={chargesTotal}
            label="חיובים"
          />
        )}
      </div>

      {/* Recent binders */}
      {hasBinderList && (
        <RelatedItemsSection
          title="קלסרים אחרונים"
          total={bindersTotal}
          allHref={`/binders?client_id=${clientId}`}
          items={binders}
          className="mt-6"
          getKey={(binder) => binder.id}
          getTitle={(binder) => binder.binder_number}
          getSubtitle={(binder) => getBinderStatusLabel(binder.status)}
          getItemHref={(binder) => `/binders/${binder.id}`}
        />
      )}

      {/* Recent charges */}
      {hasChargeList && (
        <RelatedItemsSection
          title="חיובים אחרונים"
          total={chargesTotal}
          allHref={`/charges?client_id=${clientId}`}
          items={charges}
          className="mt-4"
          getKey={(charge) => charge.id}
          getTitle={(charge) => `חיוב #${charge.id}`}
          getSubtitle={(charge) => `${getChargeTypeLabel(charge.charge_type)} • ${getChargeStatusLabel(charge.status)}`}
          getItemHref={(charge) => `/charges/${charge.id}`}
        />
      )}
    </Card>
  );
};
