import { useQuery } from "@tanstack/react-query";
import { Card } from "../../../components/ui/primitives/Card";
import { clientsApi, clientsQK } from "../api";
import { formatDateTime } from "../../../utils/utils";

const ACTION_LABELS: Record<string, string> = {
  created: "נוצר",
  updated: "עודכן",
  deleted: "נמחק",
  restored: "שוחזר",
};

const ACTION_COLORS: Record<string, string> = {
  created: "bg-positive-100 text-positive-700",
  updated: "bg-blue-100 text-blue-700",
  deleted: "bg-negative-100 text-negative-700",
  restored: "bg-yellow-100 text-yellow-700",
};

function parseSnapshot(raw: string | null): Record<string, string> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const FIELD_LABELS: Record<string, string> = {
  full_name: "שם מלא",
  phone: "טלפון",
  email: 'דוא"ל',
  address_street: "רחוב",
  address_building_number: "מספר בניין",
  address_apartment: "דירה",
  address_city: "עיר",
  address_zip_code: "מיקוד",
  notes: "הערות",
  status: "סטטוס",
};

interface Props {
  clientId: number;
}

export const ClientAuditCard: React.FC<Props> = ({ clientId }) => {
  const { data, isLoading } = useQuery({
    queryKey: clientsQK.auditTrail(clientId),
    queryFn: () => clientsApi.getAuditTrail(clientId),
    enabled: clientId > 0,
  });

  const entries = [...(data?.items ?? [])].reverse();

  return (
    <Card title="היסטוריית שינויים">
      {isLoading && (
        <p className="text-sm text-gray-400 py-4 text-center">טוען...</p>
      )}
      {!isLoading && entries.length === 0 && (
        <p className="text-sm text-gray-400 py-4 text-center">אין רשומות</p>
      )}
      {!isLoading && entries.length > 0 && (
        <ol className="space-y-3">
          {entries.map((entry) => {
            const oldVal = parseSnapshot(entry.old_value);
            const newVal = parseSnapshot(entry.new_value);
            const changedFields = newVal ? Object.keys(newVal) : [];

            return (
              <li key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-2 w-2 rounded-full bg-gray-300 shrink-0" />
                  <span className="flex-1 w-px bg-gray-100" />
                </div>
                <div className="pb-3 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[entry.action] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </span>
                    <span className="text-xs text-gray-500">
                      {entry.performed_by_name ?? `משתמש ${entry.performed_by}`}
                    </span>
                    <span className="text-xs text-gray-400">{formatDateTime(entry.performed_at)}</span>
                  </div>
                  {changedFields.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {changedFields.map((field) => (
                        <li key={field} className="text-xs text-gray-600">
                          <span className="font-medium">{FIELD_LABELS[field] ?? field}:</span>{" "}
                          <span className="line-through text-gray-400">{oldVal?.[field] ?? "—"}</span>
                          {" → "}
                          <span>{newVal?.[field] ?? "—"}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
};
