import { useQuery } from "@tanstack/react-query";
import { signatureRequestsApi } from "../api";
import { QK } from "../../../lib/queryKeys";
import {
  DetailDrawer,
  DrawerField,
  DrawerSection,
} from "../../../components/ui/DetailDrawer";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { formatDate, formatDateTime } from "../../../utils/utils";
import {
  getSignatureRequestTypeLabel,
  getSignatureRequestStatusLabel,
} from "../../../utils/enums";

const signatureStatusVariants: Record<string, "neutral" | "info" | "warning" | "success" | "error"> = {
  draft: "neutral",
  pending_signature: "info",
  signed: "success",
  declined: "error",
  expired: "warning",
  canceled: "neutral",
};

interface Props {
  requestId: number | null;
  onClose: () => void;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  created: "נוצרה",
  sent: "נשלחה",
  viewed: "נצפתה",
  signed: "נחתמה",
  annual_report_signed: "דוח שנתי נחתם",
  declined: "נדחתה",
  canceled: "בוטלה",
  expired: "פגה תוקף",
};

const ACTOR_TYPE_LABELS: Record<string, string> = {
  advisor: "יועץ",
  secretary: "מזכירה",
  signer: "חותם",
  system: "מערכת",
};

export const SignatureRequestAuditDrawer: React.FC<Props> = ({
  requestId,
  onClose,
}) => {
  const open = requestId != null;

  const { data, isLoading } = useQuery({
    queryKey: QK.signatureRequests.detail(requestId ?? 0),
    queryFn: () => signatureRequestsApi.getById(requestId!),
    enabled: open,
  });

  const events = data?.audit_trail ?? [];

  return (
    <DetailDrawer
      open={open}
      title={data?.title ?? "בקשת חתימה"}
      subtitle={
        data ? getSignatureRequestTypeLabel(data.request_type) : undefined
      }
      onClose={onClose}
    >
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 rounded bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {data && (
        <>
          <DrawerSection title="פרטי הבקשה">
            <DrawerField
              label="סטטוס"
              value={<StatusBadge status={data.status} getLabel={getSignatureRequestStatusLabel} variantMap={signatureStatusVariants} />}
            />
            <DrawerField label="חותם" value={data.signer_name} />
            {data.signer_email && (
              <DrawerField label='דוא"ל' value={data.signer_email} />
            )}
            {data.signer_phone && (
              <DrawerField label="טלפון" value={data.signer_phone} />
            )}
            <DrawerField label="נוצר" value={formatDateTime(data.created_at)} />
            {data.sent_at && (
              <DrawerField label="נשלח" value={formatDateTime(data.sent_at)} />
            )}
            {data.expires_at && (
              <DrawerField label="תפוגה" value={formatDate(data.expires_at)} />
            )}
            {data.signed_at && (
              <DrawerField label="נחתם" value={formatDateTime(data.signed_at)} />
            )}
            {data.decline_reason && (
              <DrawerField label="סיבת דחייה" value={data.decline_reason} />
            )}
          </DrawerSection>

          <DrawerSection title="היסטוריית פעילות">
            {events.length === 0 && (
              <p className="py-3 text-sm text-gray-400">אין אירועים</p>
            )}
            <div className="divide-y divide-gray-50">
              {events.map((event) => (
                <div key={event.id} className="py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(event.occurred_at)}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {ACTOR_TYPE_LABELS[event.actor_type] ?? event.actor_type}
                    {event.actor_name ? ` — ${event.actor_name}` : ""}
                    {event.notes ? ` · ${event.notes}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </DrawerSection>
        </>
      )}
    </DetailDrawer>
  );
};
