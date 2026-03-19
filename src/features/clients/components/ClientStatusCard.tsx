import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FileText, Receipt, CreditCard, TrendingUp, FolderOpen, FileCheck } from "lucide-react";
import { clientsApi } from "../../../api/clients.api";
import { QK } from "../../../lib/queryKeys";
import { Card } from "../../../components/ui/Card";

interface Props {
  clientId: number;
}

interface TileProps {
  icon: React.ReactNode;
  title: string;
  primary: string;
  secondary: string;
  onClick?: () => void;
}

const Tile: React.FC<TileProps> = ({ icon, title, primary, secondary, onClick }) => (
  <div
    className={`flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 ${onClick ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""}`}
    onClick={onClick}
  >
    <div className="mt-0.5 shrink-0 text-blue-600">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{title}</p>
      <p className="mt-0.5 text-lg font-semibold text-gray-900 leading-tight">{primary}</p>
      <p className="mt-0.5 text-xs text-gray-500">{secondary}</p>
    </div>
  </div>
);

const fmt = (n: number | null | undefined) =>
  n != null ? `₪${Number(n).toLocaleString("he-IL", { maximumFractionDigits: 0 })}` : "—";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

export const ClientStatusCard: React.FC<Props> = ({ clientId }) => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

  const { data, isLoading } = useQuery({
    queryKey: QK.clients.statusCard(clientId, selectedYear),
    queryFn: () => clientsApi.getStatusCard(clientId, selectedYear),
    staleTime: 30_000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <Card title="סטטוס לקוח">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const { vat, annual_report, charges, advance_payments, binders, documents, year } = data;

  const vatStatus =
    vat.periods_total === 0
      ? "אין דיווחים"
      : `${vat.periods_filed}/${vat.periods_total} דווחו`;

  const arStatus = annual_report.status
    ? annual_report.form_type
      ? `טופס ${annual_report.form_type}`
      : annual_report.status
    : "אין דוח";

  const arSecondary = annual_report.filing_deadline
    ? `הגשה: ${annual_report.filing_deadline}`
    : annual_report.refund_due != null
      ? `החזר: ${fmt(annual_report.refund_due)}`
      : annual_report.tax_due != null
        ? `תשלום: ${fmt(annual_report.tax_due)}`
        : "—";

  const yearSelector = (
    <div className="flex gap-1">
      {YEAR_OPTIONS.map((y) => (
        <button
          key={y}
          type="button"
          onClick={() => setSelectedYear(y)}
          className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
            selectedYear === y
              ? "bg-primary-100 text-primary-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {y}
        </button>
      ))}
    </div>
  );

  return (
    <Card title={`סטטוס לקוח — ${year}`} actions={yearSelector}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Tile
          icon={<Receipt size={18} />}
          title='מע"מ'
          primary={fmt(vat.net_vat_total)}
          secondary={vatStatus}
          onClick={() => navigate(`/clients/${clientId}/vat`)}
        />
        <Tile
          icon={<FileText size={18} />}
          title="דוח שנתי"
          primary={arStatus}
          secondary={arSecondary}
          onClick={() => navigate(`/clients/${clientId}/annual-reports`)}
        />
        <Tile
          icon={<CreditCard size={18} />}
          title="חיובים פתוחים"
          primary={fmt(charges.total_outstanding)}
          secondary={`${charges.unpaid_count} חיובים`}
          onClick={() => navigate(`/clients/${clientId}`)}
        />
        <Tile
          icon={<TrendingUp size={18} />}
          title="מקדמות"
          primary={fmt(advance_payments.total_paid)}
          secondary={`${advance_payments.count} תשלומים`}
          onClick={() => navigate(`/clients/${clientId}/advance-payments`)}
        />
        <Tile
          icon={<FolderOpen size={18} />}
          title="קלסרים"
          primary={`${binders.active_count} פעילים`}
          secondary={`${binders.in_office_count} במשרד`}
          onClick={() => navigate(`/clients/${clientId}`)}
        />
        <Tile
          icon={<FileCheck size={18} />}
          title="מסמכים"
          primary={`${documents.present_count}/${documents.total_count}`}
          secondary="מסמכים קיימים"
          onClick={() => navigate(`/clients/${clientId}/documents`)}
        />
      </div>
    </Card>
  );
};