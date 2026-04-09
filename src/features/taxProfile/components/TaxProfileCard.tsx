import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Card } from "../../../components/ui/primitives/Card";
import { Button } from "../../../components/ui/primitives/Button";
import { DefinitionList } from "../../../components/ui/layout/DefinitionList";
import { Alert } from "../../../components/ui/overlays/Alert";
import { DetailDrawer } from "../../../components/ui/overlays/DetailDrawer";
import { getVatTypeLabel } from "../../../utils/enums";
import { useTaxProfile } from "../hooks/useTaxProfile";
import { TaxProfileForm } from "./TaxProfileForm";

interface Props { clientId: number | null; readOnly?: boolean }

const TAX_PROFILE_FORM_ID = "tax-profile-form";

export const TaxProfileCard: React.FC<Props> = ({ clientId, readOnly = false }) => {
  const { profile, isLoading, error, updateProfile, isUpdating } = useTaxProfile(clientId ?? 0);
  const [isEditing, setIsEditing] = useState(false);

  const items = [
    { label: "תדירות דיווח מע\"מ", value: profile?.vat_reporting_frequency ? getVatTypeLabel(profile.vat_reporting_frequency) : "—" },
    { label: "סוג עסק", value: profile?.business_type_label ?? "—" },
    { label: "שנת מס ראשונה", value: profile?.tax_year_start ?? "—" },
    { label: "רואה חשבון מלווה", value: profile?.accountant_name ?? "—" },
    {
      label: "אחוז מקדמה",
      value: profile?.advance_rate != null ? `${profile.advance_rate}%` : "—",
    },
  ];

  return (
    <>
      <Card title="פרטי מס" subtitle="מידע מיסויי ספציפי ללקוח">
        {isLoading && (
          <p className="py-2 text-sm text-gray-500">טוען פרטי מס...</p>
        )}

        {error && <Alert variant="error" message={error} />}

        {!isLoading && !error && (
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
        )}
      </Card>

      <DetailDrawer
        open={isEditing}
        title="עריכת פרטי מס"
        onClose={() => setIsEditing(false)}
        footer={(
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isUpdating}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              form={TAX_PROFILE_FORM_ID}
              variant="primary"
              isLoading={isUpdating}
              disabled={isUpdating}
            >
              שמור שינויים
            </Button>
          </div>
        )}
      >
        <TaxProfileForm
          profile={profile}
          onSave={(data) => {
            updateProfile(data);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          isSaving={isUpdating}
          hideFooter
          formId={TAX_PROFILE_FORM_ID}
        />
      </DetailDrawer>
    </>
  );
};
