import { useQuery } from "@tanstack/react-query";
import { DetailDrawer } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { usersApi } from "../../../api/users.api";
import { QK } from "../../../lib/queryKeys";
import { formatDateTime } from "../../../utils/utils";

const auditActionLabel: Record<string, string> = {
  login_success: "כניסה למערכת",
  login_failure: "כניסה נכשלה",
  user_created: "משתמש נוצר",
  user_updated: "פרטים עודכנו",
  user_activated: "הופעל",
  user_deactivated: "הושבת",
  password_reset: "סיסמה אופסה",
};

interface AuditLogsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const PAGE_SIZE = 20;

export const AuditLogsDrawer: React.FC<AuditLogsDrawerProps> = ({
  open,
  onClose,
}) => {
  const params = { page: 1, page_size: PAGE_SIZE };

  const { data, isPending, isError } = useQuery({
    queryKey: QK.users.auditLogs(params),
    queryFn: () => usersApi.listAuditLogs(params),
    enabled: open,
  });

  const logs = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title="לוג ביקורת משתמשים"
      subtitle={total > 0 ? `${total} רשומות` : undefined}
    >
      {isPending && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-600">שגיאה בטעינת לוג הביקורת</p>
      )}

      {!isPending && !isError && logs.length === 0 && (
        <p className="text-sm text-gray-500">אין רשומות להצגה</p>
      )}

      {!isPending && !isError && logs.length > 0 && (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-800">
                  {auditActionLabel[log.action] ?? log.action}
                </span>
                <Badge variant={log.status === "success" ? "success" : "error"}>
                  {log.status === "success" ? "הצלחה" : "כישלון"}
                </Badge>
              </div>
              {log.email && (
                <p className="text-xs text-gray-500">אימייל: {log.email}</p>
              )}
              {log.reason && (
                <p className="text-xs text-gray-500">סיבה: {log.reason}</p>
              )}
              <p className="text-xs text-gray-400">{formatDateTime(log.created_at)}</p>
            </div>
          ))}

          {total > PAGE_SIZE && (
            <p className="text-center text-xs text-gray-400">
              מציג {PAGE_SIZE} מתוך {total} רשומות
            </p>
          )}
        </div>
      )}

      <div className="pt-2">
        <Button variant="outline" fullWidth onClick={onClose}>
          סגירה
        </Button>
      </div>
    </DetailDrawer>
  );
};
