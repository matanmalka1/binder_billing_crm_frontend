import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
import { AccessDenied } from "../components/auth/AccessDenied";
import { useAuthStore } from "../store/auth.store";
import { useChargeDetailsPage } from "../features/charges/hooks/useChargeDetailsPage";
import { getChargeAmountText } from "../features/charges/utils/chargeStatus";


import { formatDateTime } from "../utils/utils";
export const ChargeDetails: React.FC = () => {
  const { chargeId } = useParams();
  const { user } = useAuthStore();
  const isAdvisor = user?.role === "advisor";
  const { actionLoading, charge, denied, error, loading, runAction } =
    useChargeDetailsPage(chargeId, isAdvisor);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">פירוט חיוב</h2>
        <Link to="/charges" className="inline-block text-sm font-medium text-blue-600">
          חזרה לרשימת חיובים
        </Link>
      </header>

      {denied && <AccessDenied message="אין לך הרשאה לבצע פעולה זו" />}

      {loading && <PageLoading />}

      {error && <ErrorCard message={error} />}

      {!loading && !error && charge && (
        <Card title={`חיוב #${charge.id}`}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <p className="text-sm text-gray-700">לקוח: {charge.client_id}</p>
            <p className="text-sm text-gray-700">סטטוס: {charge.status}</p>
            <p className="text-sm text-gray-700">סוג חיוב: {charge.charge_type}</p>
            <p className="text-sm text-gray-700">תקופה: {charge.period || "—"}</p>
            <p className="text-sm text-gray-700">סכום: {getChargeAmountText(charge)}</p>

            <p className="text-sm text-gray-700">
              נוצר בתאריך: {formatDateTime(charge.created_at)}
            </p>
            <p className="text-sm text-gray-700">
              הונפק בתאריך: {formatDateTime(charge.issued_at)}
            </p>
            <p className="text-sm text-gray-700">
              שולם בתאריך: {formatDateTime(charge.paid_at)}
            </p>
          </div>

          {isAdvisor && (
            <div className="mt-4 flex flex-wrap gap-2">
              {charge.status === "draft" && (
                <Button
                  type="button"
                  variant="outline"
                  isLoading={actionLoading}
                  onClick={() => runAction("issue")}
                >
                  הנפקה
                </Button>
              )}

              {charge.status === "issued" && (
                <Button
                  type="button"
                  variant="outline"
                  isLoading={actionLoading}
                  onClick={() => runAction("markPaid")}
                >
                  סימון שולם
                </Button>
              )}

              {(charge.status === "draft" || charge.status === "issued") && (
                <Button
                  type="button"
                  variant="outline"
                  isLoading={actionLoading}
                  onClick={() => runAction("cancel")}
                >
                  ביטול
                </Button>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
