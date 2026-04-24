import { type FC } from "react";
import { ChevronLeft, FolderOpen, Plus, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/primitives/Card";
import { Button } from "../../../components/ui/primitives/Button";
import { Badge } from "../../../components/ui/primitives/Badge";
import type { LucideIcon } from "lucide-react";
import type { ChargeResponse } from "@/features/charges";
import type { BinderDetailResponse } from "@/features/binders";
import { getChargeStatusLabel, getStatusLabel as getBinderStatusLabel } from "../../../utils/enums";
import { formatBinderNumber } from "../../../utils/utils";
import { getChargeTypeLabel } from "@/features/charges";

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
    <div className="group flex min-h-[76px] items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50">
      <div className={`shrink-0 rounded-lg p-2 ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 text-left">
        <div className="text-xl font-bold leading-none text-gray-900">{count}</div>
        <div className="mt-1 text-xs font-medium leading-tight text-gray-500">סה״כ {label}</div>
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
  getBadge?: (item: T) => React.ReactNode;
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
  getBadge,
  getItemHref,
}: RelatedItemsSectionProps<T>) => (
  <div className={className}>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-bold text-gray-800">{title}</span>
      {total > 5 && (
        <Link to={allHref} className="text-xs font-medium text-primary-600 hover:underline">
          הכל ({total})
        </Link>
      )}
    </div>
    <div className="space-y-2">
      {items.slice(0, 5).map((item) => (
        <Link
          key={getKey(item)}
          to={getItemHref(item)}
          className="group flex min-h-[72px] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors hover:border-primary-200 hover:bg-primary-50/40"
        >
          <div className="min-w-0 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{getTitle(item)}</span>
              {getBadge?.(item)}
            </div>
            <div className="mt-1 truncate text-xs font-medium text-gray-500">{getSubtitle(item)}</div>
          </div>
          <span className="ms-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors group-hover:bg-white group-hover:text-primary-700">
            <ChevronLeft className="h-4 w-4" />
          </span>
        </Link>
      ))}
    </div>
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────

type ClientRelatedDataProps = {
  clientId: number;
  binders: BinderDetailResponse[];
  bindersTotal: number;
  charges: ChargeResponse[];
  chargesTotal: number;
  canViewCharges: boolean;
  canCreateCharge?: boolean;
  onCreateCharge?: () => void;
  onCreateBinder?: () => void;
};

export const ClientRelatedData: FC<ClientRelatedDataProps> = ({
  clientId,
  binders,
  bindersTotal,
  charges,
  chargesTotal,
  canViewCharges,
  canCreateCharge,
  onCreateCharge,
  onCreateBinder,
}) => {
  const hasBinderList = binders.length > 0;
  const hasChargeList = canViewCharges && charges.length > 0;

  const actions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onCreateBinder} className="text-xs">
        <Plus className="h-3.5 w-3.5" />
        הוסף קלסר
      </Button>
      {canCreateCharge && (
        <Button variant="outline" size="sm" onClick={onCreateCharge} className="text-xs">
          <Plus className="h-3.5 w-3.5" />
          הוסף חיוב
        </Button>
      )}
    </div>
  );

  return (
    <Card title="נתונים קשורים" actions={actions}>
      <div className="grid grid-cols-2 gap-2">
        <StatPill
          icon={FolderOpen}
          iconColor="bg-primary-100 text-primary-600"
          count={bindersTotal}
          label="קלסרים"
          href={`/binders?client_record_id=${clientId}`}
        />
        {canViewCharges && (
          <StatPill
            icon={Receipt}
            iconColor="bg-positive-100 text-positive-700"
            count={chargesTotal}
            label="חיובים"
            href={`/charges?client_record_id=${clientId}`}
          />
        )}
      </div>

      {/* Recent binders */}
      {hasBinderList && (
        <RelatedItemsSection
          title="קלסרים אחרונים"
          total={bindersTotal}
          allHref={`/binders?client_record_id=${clientId}`}
          items={binders}
          className="mt-6"
          getKey={(binder) => binder.id}
          getTitle={(binder) => formatBinderNumber(binder.binder_number)}
          getSubtitle={(binder) => getBinderStatusLabel(binder.status)}
          getItemHref={() => `/binders?client_record_id=${clientId}`}
        />
      )}

      {/* Recent charges */}
      {hasChargeList && (
        <RelatedItemsSection
          title="חיובים אחרונים"
          total={chargesTotal}
          allHref={`/charges?client_record_id=${clientId}`}
          items={charges}
          className="mt-4"
          getKey={(charge) => charge.id}
          getTitle={(charge) => `חיוב #${charge.id}`}
          getSubtitle={(charge) => getChargeTypeLabel(charge.charge_type)}
          getBadge={(charge) => <Badge variant="neutral">{getChargeStatusLabel(charge.status)}</Badge>}
          getItemHref={() => `/charges?client_record_id=${clientId}`}
        />
      )}
    </Card>
  );
};
