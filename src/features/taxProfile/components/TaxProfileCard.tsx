import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { DescriptionList } from "../../../components/ui/DescriptionList";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { useTaxProfile } from "../hooks/useTaxProfile";
import { TaxProfileForm } from "./TaxProfileForm";

const VAT_TYPE_LABELS: Record<string, string> = {
  monthly: "חודשי",
  bimonthly: "דו-חודשי",
  exempt: "פטור",
};

interface Props { clientId: number; readOnly?: boolean }

export const TaxProfileCard: React.FC<Props> = ({ clientId, readOnly = false }) => {
  const { profile, isLoading, error, updateProfile, isUpdating } = useTaxProfile(clientId);
  const [isEditing, setIsEditing] = useState(false);

  const items = [
    { label: "סוג מע״מ", value: profile?.vat_type ? (VAT_TYPE_LABELS[profile.vat_type] ?? "—") : "—" },
    { label: "תחום עיסוק", value: profile?.business_type ?? "—" },
    { label: "שנת מס ראשונה", value: profile?.tax_year_start ?? "—" },
    { label: "רואה חשבון מלווה", value: profile?.accountant_name ?? "—" },
  ];

  return (
    <Card title="פרטי מס" subtitle="מידע מיסויי ספציפי ללקוח">
      {isLoading && (
        <p className="py-2 text-sm text-gray-500">טוען פרטי מס...</p>
      )}

      {error && <ErrorCard message={error} />}

      {!isLoading && !error && (
        isEditing ? (
          <TaxProfileForm
            profile={profile}
            onSave={(data) => { updateProfile(data); setIsEditing(false); }}
            onCancel={() => setIsEditing(false)}
            isSaving={isUpdating}
          />
        ) : (
          <div className="space-y-4">
            <DescriptionList items={items} columns={2} />
            {!readOnly && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  עריכה
                </Button>
              </div>
            )}
          </div>
        )
      )}
    </Card>
  );
};