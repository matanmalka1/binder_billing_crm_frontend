import { type FC } from "react";
import { ChevronRight, FolderOpen, Receipt, FileText, Calculator, FileArchive } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import type { LucideIcon } from "lucide-react";
import type { ClientBinderSummary, ClientChargeSummary } from "../types";
import { formatDate } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";

// ── Local primitive ────────────────────────────────────────────────────────────

interface SummaryStatCardProps {
  icon: LucideIcon;
  iconColor: string;
  count: number;
  label: string;
  href?: string;
}

const SummaryStatCard: FC<SummaryStatCardProps> = ({ icon: Icon, iconColor, count, label, href }) => {
  const inner = (
    <Card className={href ? "hover:shadow-md transition-shadow cursor-pointer h-full" : "h-full"}>
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-3 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{count}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </Card>
  );

  return href ? <Link to={href} className="block">{inner}</Link> : inner;
};

// ── Main component ─────────────────────────────────────────────────────────────

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
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <SummaryStatCard
          icon={FolderOpen}
          iconColor="bg-blue-100 text-blue-600"
          count={bindersTotal}
          label="קלסרים"
        />

        {canViewCharges && (
          <SummaryStatCard
            icon={Receipt}
            iconColor="bg-green-100 text-green-600"
            count={chargesTotal}
            label="חיובים"
          />
        )}

        <SummaryStatCard
          icon={FileText}
          iconColor="bg-purple-100 text-purple-600"
          count={annualReportsTotal}
          label="דוחות שנתיים"
          href={`/tax/reports/season?client_id=${clientId}`}
        />

        <SummaryStatCard
          icon={Calculator}
          iconColor="bg-orange-100 text-orange-600"
          count={vatWorkItemsTotal}
          label='תיקי מע"מ'
          href={`/tax/vat?client_id=${clientId}`}
        />

        <SummaryStatCard
          icon={FileArchive}
          iconColor="bg-teal-100 text-teal-600"
          count={documentsTotal}
          label="מסמכים קבועים"
          href={`/documents?client_id=${clientId}`}
        />
      </div>

      {binders.length > 0 && (
        <Card
          title="קלסרים אחרונים"
          footer={
            bindersTotal > 5 ? (
              <Link to={`/binders?client_id=${clientId}`} className="text-sm text-blue-600">
                צפה בכל הקלסרים ({bindersTotal})
              </Link>
            ) : undefined
          }
        >
          <div className="space-y-3">
            {binders.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium text-gray-900">{b.binder_number}</div>
                  <div className="text-sm text-gray-600">נקלט: {formatDate(b.received_at)}</div>
                </div>
                <Link to={`/binders/${b.id}`}>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {canViewCharges && charges.length > 0 && (
        <Card
          title="חיובים אחרונים"
          footer={
            chargesTotal > 5 ? (
              <Link to={`/charges?client_id=${clientId}`} className="text-sm text-blue-600">
                צפה בכל החיובים ({chargesTotal})
              </Link>
            ) : undefined
          }
        >
          <div className="space-y-3">
            {charges.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium text-gray-900">חיוב #{c.id}</div>
                  <div className="text-sm text-gray-600">
                    {c.charge_type} • {getChargeStatusLabel(c.status)}
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
        </Card>
      )}
    </>
  );
};