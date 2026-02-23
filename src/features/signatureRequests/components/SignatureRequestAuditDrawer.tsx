import { useQuery } from "@tanstack/react-query";
import { signatureRequestsApi } from "../../../api/signatureRequests.api";
import { QK } from "../../../lib/queryKeys";
import {
  DetailDrawer,
  DrawerField,
  DrawerSection,
} from "../../../components/ui/DetailDrawer";
import { SignatureStatusBadge } from "./SignatureStatusBadge";
import { formatDate, formatDateTime } from "../../../utils/utils";
import {
  getSignatureRequestTypeLabel,
} from "../../../utils/enums";

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
              value={<SignatureStatusBadge status={data.status} />}
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
            {data.audit_trail.length === 0 && (
              <p className="py-3 text-sm text-gray-400">אין אירועים</p>
            )}
            <div className="divide-y divide-gray-50">
              {data.audit_trail.map((event) => (
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
