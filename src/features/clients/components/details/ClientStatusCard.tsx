import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FileText, Receipt, CreditCard, TrendingUp, FolderOpen, FileCheck, ChevronLeft } from "lucide-react";
import { clientsApi, clientsQK } from "../../api";
import { CLIENT_ROUTES } from "../../api/endpoints";
import { vatReportsApi, vatReportsQK } from "@/features/vatReports";
import { Card } from "../../../../components/ui/primitives/Card";
import { useFirstBusinessId } from "../../hooks/useFirstBusinessId";
import { fmtCurrency as fmt } from "@/utils/utils";
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
    className={`relative flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 ${onClick ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""}`}
    onClick={onClick}
  >
    <div className="mt-0.5 shrink-0 text-primary-600">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-gray-500">{title}</p>
      <p className="mt-0.5 text-lg font-semibold text-gray-900 leading-tight">{primary}</p>
      <p className="mt-0.5 text-xs text-gray-500">{secondary}</p>
    </div>
    {onClick && <ChevronLeft className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />}
  </div>
);

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

export const ClientStatusCard: React.FC<Props> = ({ clientId }) => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const { id: firstBusinessId, isLoading: isBusinessLoading } = useFirstBusinessId(clientId);

  const { data: vatSummary, isLoading: isVatLoading } = useQuery({
    queryKey: vatReportsQK.clientSummary(clientId),
    queryFn: () => vatReportsApi.getClientSummary(clientId),
    enabled: clientId > 0,
    staleTime: 30_000,
    retry: 1,
  });

  const { data, isLoading: isStatusLoading } = useQuery({
    queryKey: clientsQK.statusCard(clientId, selectedYear),
    queryFn: () => clientsApi.getStatusCard(clientId, selectedYear),
    enabled: clientId > 0,
    staleTime: 30_000,
    retry: 1,
  });

  const isLoading = isBusinessLoading || isStatusLoading || isVatLoading;
  const vatYear = vatSummary?.annual?.find((entry) => entry.year === selectedYear);
  const vatPrimary = vatYear ? fmt(vatYear.net_vat) : "—";
  const vatStatus = vatYear
    ? vatYear.periods_count === 0
      ? "אין דיווחים"
      : `${vatYear.filed_count}/${vatYear.periods_count} דווחו`
    : "אין דיווחים";

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

  const { annual_report, charges, advance_payments, binders, documents, year } = data;

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

  return (
    <Card title={`סטטוס לקוח — ${year}`} actions={yearSelector}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Tile
          icon={<Receipt size={18} />}
          title='מע"מ (לקוח)'
          primary={vatPrimary}
          secondary={vatStatus}
          onClick={() => navigate(CLIENT_ROUTES.vat(clientId))}
        />
        <Tile
          icon={<FileText size={18} />}
          title="דוח שנתי"
          primary={arStatus}
          secondary={arSecondary}
          onClick={() => navigate(CLIENT_ROUTES.annualReports(clientId))}
        />
        <Tile
          icon={<CreditCard size={18} />}
          title="חיובים פתוחים"
          primary={fmt(charges.total_outstanding)}
          secondary={`${charges.unpaid_count} חיובים`}
          onClick={() => navigate(`/charges?client_record_id=${clientId}`)}
        />
        <Tile
          icon={<TrendingUp size={18} />}
          title="מקדמות"
          primary={fmt(advance_payments.total_paid)}
          secondary={`${advance_payments.count} תשלומים`}
          onClick={() => navigate(CLIENT_ROUTES.advancePayments(clientId))}
        />
        <Tile
          icon={<FolderOpen size={18} />}
          title="קלסרים"
          primary={firstBusinessId == null ? "—" : `${binders.active_count} פעילים`}
          secondary={firstBusinessId == null ? "אין עסקים רשומים" : `${binders.in_office_count} במשרד`}
          onClick={firstBusinessId == null ? undefined : () => navigate(`/binders?client_record_id=${clientId}`)}
        />
        <Tile
          icon={<FileCheck size={18} />}
          title="מסמכים"
          primary={firstBusinessId == null ? "—" : `${documents.present_count}/${documents.total_count}`}
          secondary={firstBusinessId == null ? "אין עסקים רשומים" : "מסמכים קיימים"}
          onClick={firstBusinessId == null ? undefined : () => navigate(CLIENT_ROUTES.documents(clientId))}
        />
      </div>
    </Card>
  );
};
