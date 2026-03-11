import { type FC } from "react";
import { ChevronRight, FolderOpen, Receipt, FileText, Calculator, FileArchive } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import type { LucideIcon } from "lucide-react";
import type { ClientBinderSummary, ClientChargeSummary } from "../types";
import { formatDate } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";
import { getChargeTypeLabel } from "../../charges/utils";

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

// ── Main component ──────────────────────────────────────────────────────────

type ClientRelatedDataProps = {
  clientId: number;
  binders: ClientBinderSummary[];
  bindersTotal: number;
  charges: ClientChargeSummary[];
  chargesTotal: number;
  canViewCharges: boolean;
  annualReportsTotal: number;
  vatWorkItemsTotal: number;
  documentsTotal: number;
};

export const ClientRelatedData: FC<ClientRelatedDataProps> = ({
  clientId,
  binders,
  bindersTotal,
  charges,
  chargesTotal,
  canViewCharges,
  annualReportsTotal,
  vatWorkItemsTotal,
  documentsTotal,
}) => {
  const hasBinderList = binders.length > 0;
  const hasChargeList = canViewCharges && charges.length > 0;

  return (
    <Card title="נתונים קשורים">
      {/* Stat pills — 3-col grid wraps to 2 rows in narrow right column */}
      <div className="grid grid-cols-3 gap-2">
        <StatPill
          icon={FolderOpen}
          iconColor="bg-primary-100 text-primary-600"
          count={bindersTotal}
          label="קלסרים"
        />
        {canViewCharges && (
          <StatPill
            icon={Receipt}
            iconColor="bg-green-100 text-green-600"
            count={chargesTotal}
            label="חיובים"
          />
        )}
        <StatPill
          icon={FileText}
          iconColor="bg-purple-100 text-purple-600"
          count={annualReportsTotal}
          label="דוחות שנתיים"
          href={`/tax/reports/season?client_id=${clientId}`}
        />
        <StatPill
          icon={Calculator}
          iconColor="bg-orange-100 text-orange-600"
          count={vatWorkItemsTotal}
          label='מע"מ'
          href={`/tax/vat?client_id=${clientId}`}
        />
        <StatPill
          icon={FileArchive}
          iconColor="bg-teal-100 text-teal-600"
          count={documentsTotal}
          label="מסמכים"
          href={`/documents?client_id=${clientId}`}
        />
      </div>

      {/* Recent binders */}
      {hasBinderList && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">קלסרים אחרונים</span>
            {bindersTotal > 5 && (
              <Link to={`/binders?client_id=${clientId}`} className="text-xs text-primary-600 hover:underline">
                הכל ({bindersTotal})
              </Link>
            )}
          </div>
          <div className="space-y-2">
            {binders.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">{b.binder_number}</div>
                  <div className="text-xs text-gray-500">נקלט: {formatDate(b.received_at)}</div>
                </div>
                <Link to={`/binders/${b.id}`}>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent charges */}
      {hasChargeList && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">חיובים אחרונים</span>
            {chargesTotal > 5 && (
              <Link to={`/charges?client_id=${clientId}`} className="text-xs text-primary-600 hover:underline">
                הכל ({chargesTotal})
              </Link>
            )}
          </div>
          <div className="space-y-2">
            {charges.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">חיוב #{c.id}</div>
                  <div className="text-xs text-gray-500">
                    {getChargeTypeLabel(c.charge_type)} • {getChargeStatusLabel(c.status)}
                  </div>
                </div>
                <Link to={`/charges/${c.id}`}>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
