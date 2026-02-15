import { useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { AccessBanner } from "../components/ui/AccessBanner";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { DescriptionList } from "../components/ui/DescriptionList";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
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
      <PageHeader
        title={charge ? `חיוב #${charge.id}` : "פירוט חיוב"}
        breadcrumbs={[{ label: "חיובים", to: "/charges" }]}
      />

      {denied && (
        <AccessBanner
          variant="warning"
          message="אין לך הרשאה לבצע פעולה זו"
        />
      )}

      {loading && <PageLoading />}

      {error && <ErrorCard message={error} />}

      {!loading && !error && charge && (
        <Card
          title={`חיוב #${charge.id}`}
          footer={
            isAdvisor && (
              <div className="flex flex-wrap gap-2">
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
            )
          }
        >
          <DescriptionList
            columns={2}
            items={[
              { label: "מזהה לקוח", value: charge.client_id },
              { label: "סטטוס", value: charge.status },
              { label: "סוג חיוב", value: charge.charge_type },
              { label: "תקופה", value: charge.period || "—" },
              { label: "סכום", value: getChargeAmountText(charge) },
              { label: "נוצר בתאריך", value: formatDateTime(charge.created_at) },
              { label: "הונפק בתאריך", value: formatDateTime(charge.issued_at) },
              { label: "שולם בתאריך", value: formatDateTime(charge.paid_at) },
            ]}
          />
        </Card>
      )}
    </div>
  );
};
