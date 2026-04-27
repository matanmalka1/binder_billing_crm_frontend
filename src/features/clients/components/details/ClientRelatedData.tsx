import { type FC, type ReactNode } from "react";
import { ChevronLeft, FolderOpen, Plus, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../../../components/ui/primitives/Badge";
import { Button } from "../../../../components/ui/primitives/Button";
import { Card } from "../../../../components/ui/primitives/Card";
import type { LucideIcon } from "lucide-react";
import type { ChargeResponse } from "@/features/charges";
import type { BinderDetailResponse } from "@/features/binders";
import { getChargeTypeLabel } from "@/features/charges";
import {
  getChargeStatusLabel,
  getStatusLabel as getBinderStatusLabel,
} from "../../../../utils/enums";
import { formatBinderNumber } from "../../../../utils/utils";

type StatPillProps = {
  icon: LucideIcon;
  iconColor: string;
  count: number;
  label: string;
  href?: string;
};

const StatPill: FC<StatPillProps> = ({
  icon: Icon,
  iconColor,
  count,
  label,
  href,
}) => {
  const content = (
    <div className="flex min-h-16 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-3 transition-colors hover:border-primary-200 hover:bg-primary-50/40">
      <div className="min-w-0 text-right">
        <div className="text-xl font-bold leading-none text-gray-900">
          {count}
        </div>
        <div className="mt-1 text-xs font-medium text-gray-500">
          סה״כ {label}
        </div>
      </div>
      <div className={`shrink-0 rounded-md p-2 ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );

  return href ? (
    <Link to={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
};

type RelatedItemsSectionProps<T> = {
  title: string;
  total: number;
  allHref: string;
  items: T[];
  emptyText: string;
  getKey: (item: T) => number;
  getTitle: (item: T) => ReactNode;
  getSubtitle: (item: T) => ReactNode;
  getBadge?: (item: T) => ReactNode;
  getItemHref: (item: T) => string;
};

const RelatedItemsSection = <T,>({
  title,
  total,
  allHref,
  items,
  emptyText,
  getKey,
  getTitle,
  getSubtitle,
  getBadge,
  getItemHref,
}: RelatedItemsSectionProps<T>) => (
  <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {total > 0 && (
        <Link
          to={allHref}
          className="text-xs font-medium text-primary-600 hover:underline"
        >
          הכל ({total})
        </Link>
      )}
    </div>
    {items.length === 0 ? (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-5 text-center text-sm text-gray-500">
        {emptyText}
      </div>
    ) : (
      <div className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <Link
            key={getKey(item)}
            to={getItemHref(item)}
            className="group flex min-h-16 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors hover:border-primary-200 hover:bg-primary-50/40"
          >
            <div className="min-w-0 text-right">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-gray-900">
                  {getTitle(item)}
                </span>
                {getBadge?.(item)}
              </div>
              <div className="mt-1 truncate text-xs font-medium text-gray-500">
                {getSubtitle(item)}
              </div>
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors group-hover:bg-white group-hover:text-primary-700">
              <ChevronLeft className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    )}
  </section>
);

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
  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onCreateBinder}
        className="text-xs"
      >
        <Plus className="h-3.5 w-3.5" />
        הוסף קלסר
      </Button>
      {canCreateCharge && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateCharge}
          className="text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          הוסף חיוב
        </Button>
      )}
    </div>
  );

  return (
    <Card title="נתונים קשורים" actions={actions} className="shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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

        <div className="grid gap-4 md:grid-cols-2">
          <RelatedItemsSection
            title="קלסרים אחרונים"
            total={bindersTotal}
            allHref={`/binders?client_record_id=${clientId}`}
            items={binders}
            emptyText="אין קלסרים להצגה"
            getKey={(binder) => binder.id}
            getTitle={(binder) => formatBinderNumber(binder.binder_number)}
            getSubtitle={(binder) => getBinderStatusLabel(binder.status)}
            getItemHref={(binder) =>
              `/binders?client_record_id=${clientId}&binder_id=${binder.id}`
            }
          />
          {canViewCharges && (
            <RelatedItemsSection
              title="חיובים אחרונים"
              total={chargesTotal}
              allHref={`/charges?client_record_id=${clientId}`}
              items={charges}
              emptyText="אין חיובים להצגה"
              getKey={(charge) => charge.id}
              getTitle={(charge) => `חיוב #${charge.id}`}
              getSubtitle={(charge) => getChargeTypeLabel(charge.charge_type)}
              getBadge={(charge) => (
                <Badge variant="neutral">
                  {getChargeStatusLabel(charge.status)}
                </Badge>
              )}
              getItemHref={() => `/charges?client_record_id=${clientId}`}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
