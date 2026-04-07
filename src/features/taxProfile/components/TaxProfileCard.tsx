import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Card } from "../../../components/ui/primitives/Card";
import { Button } from "../../../components/ui/primitives/Button";
import { DefinitionList } from "../../../components/ui/layout/DefinitionList";
import { Alert } from "../../../components/ui/overlays/Alert";
import { BUSINESS_TYPE_LABELS } from "../../clients/constants";
import { getVatTypeLabel } from "../../../utils/enums";
import { useTaxProfile } from "../hooks/useTaxProfile";
import { TaxProfileForm } from "./TaxProfileForm";

interface Props { businessId: number; readOnly?: boolean }

export const TaxProfileCard: React.FC<Props> = ({ businessId, readOnly = false }) => {
  const { profile, isLoading, error, updateProfile, isUpdating } = useTaxProfile(businessId);
  const [isEditing, setIsEditing] = useState(false);
  const businessType = profile?.business_type;
  const businessTypeLabel = businessType && businessType in BUSINESS_TYPE_LABELS
    ? BUSINESS_TYPE_LABELS[businessType as keyof typeof BUSINESS_TYPE_LABELS]
    : businessType;

  const resolvedVatType =
    profile?.business_type_key === "osek_murshe"
      ? profile.client_vat_reporting_frequency
      : profile?.vat_type;

  const items = [
    { label: "סוג דיווח", value: resolvedVatType ? getVatTypeLabel(resolvedVatType) : "—" },
    { label: "סוג עסק", value: businessTypeLabel ?? "—" },
    { label: "שנת מס ראשונה", value: profile?.tax_year_start ?? "—" },
    { label: "רואה חשבון מלווה", value: profile?.accountant_name ?? "—" },
    {
      label: "אחוז מקדמה",
      value: profile?.advance_rate != null ? `${profile.advance_rate}%` : "—",
    },
  ];

  return (
    <Card title="פרטי מס" subtitle="מידע מיסויי ספציפי ללקוח">
      {isLoading && (
        <p className="py-2 text-sm text-gray-500">טוען פרטי מס...</p>
      )}

      {error && <Alert variant="error" message={error} />}

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
            <DefinitionList items={items} columns={2} />
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
