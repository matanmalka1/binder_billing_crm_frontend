import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Bell, Calendar, AlertTriangle } from "lucide-react";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { DataTable, type Column } from "../../../components/ui/DataTable";
import { PageLoading } from "../../../components/ui/PageLoading";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { getErrorMessage, formatDate } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { cn } from "../../../utils/utils";

// Types (should match backend)
interface Reminder {
  id: number;
  client_id: number;
  reminder_type: "TAX_DEADLINE_APPROACHING" | "BINDER_IDLE" | "UNPAID_CHARGE" | "CUSTOM";
  target_date: string;
  days_before: number;
  send_on: string;
  message: string;
  status: "PENDING" | "SENT" | "CANCELED";
  created_at: string;
  binder_id?: number | null;
  charge_id?: number | null;
  tax_deadline_id?: number | null;
}

// Mock API (replace with actual API calls)
const remindersApi = {
  list: async (): Promise<Reminder[]> => {
    // TODO: Replace with actual API call
    return [];
  },
  create: async (data: Partial<Reminder>): Promise<Reminder> => {
    // TODO: Replace with actual API call
    throw new Error("Not implemented");
  },
  cancel: async (id: number): Promise<void> => {
    // TODO: Replace with actual API call
  },
};

const reminderTypeLabels: Record<string, string> = {
  TAX_DEADLINE_APPROACHING: "מועד מס מתקרב",
  BINDER_IDLE: "תיק לא פעיל",
  UNPAID_CHARGE: "חשבונית שלא שולמה",
  CUSTOM: "התאמה אישית",
};

const statusLabels: Record<string, string> = {
  PENDING: "ממתין",
  SENT: "נשלח",
  CANCELED: "בוטל",
};

export const RemindersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const remindersQuery = useQuery({
    queryKey: ["reminders", "list"],
    queryFn: remindersApi.list,
  });

  const cancelMutation = useMutation({
    mutationFn: remindersApi.cancel,
    onSuccess: () => {
      toast.success("תזכורת בוטלה");
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "שגיאה בביטול תזכורת"));
    },
  });

  const columns: Column<Reminder>[] = [
    {
      key: "type",
      header: "סוג",
      render: (reminder) => (
        <Badge variant="info">
          {reminderTypeLabels[reminder.reminder_type] || reminder.reminder_type}
        </Badge>
      ),
    },
    {
      key: "client",
      header: "לקוח",
      render: (reminder) => (
        <span className="font-mono text-sm">לקוח #{reminder.client_id}</span>
      ),
    },
    {
      key: "message",
      header: "הודעה",
      render: (reminder) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-700 truncate">{reminder.message}</p>
        </div>
      ),
    },
    {
      key: "target_date",
      header: "תאריך יעד",
      render: (reminder) => (
        <div className="text-sm">
          <div className="text-gray-700">{formatDate(reminder.target_date)}</div>
          <div className="text-xs text-gray-500">
            {reminder.days_before} ימים לפני
          </div>
        </div>
      ),
    },
    {
      key: "send_on",
      header: "שליחה ב",
      render: (reminder) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {formatDate(reminder.send_on)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "סטטוס",
      render: (reminder) => (
        <Badge
          variant={
            reminder.status === "SENT"
              ? "success"
              : reminder.status === "CANCELED"
              ? "error"
              : "warning"
          }
        >
          {statusLabels[reminder.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "פעולות",
      render: (reminder) =>
        reminder.status === "PENDING" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => cancelMutation.mutate(reminder.id)}
            isLoading={cancelMutation.isPending}
          >
            ביטול
          </Button>
        ) : (
          <span className="text-gray-500 text-sm">—</span>
        ),
    },
  ];

  if (remindersQuery.isPending) {
    return (
      <div className="space-y-6">
        <PageHeader title="תזכורות" />
        <PageLoading message="טוען תזכורות..." />
      </div>
    );
  }

  if (remindersQuery.error) {
    return (
      <div className="space-y-6">
        <PageHeader title="תזכורות" />
        <ErrorCard
          message={getErrorMessage(remindersQuery.error, "שגיאה בטעינת תזכורות")}
        />
      </div>
    );
  }

  const reminders = remindersQuery.data || [];
  const pendingCount = reminders.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="ניהול תזכורות"
        description="תזכורות אוטומטיות למועדי מס, תיקים לא פעילים וחשבוניות שלא שולמו"
        variant="gradient"
        actions={
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            תזכורת חדשה
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-200 p-3">
              <Bell className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{pendingCount}</div>
              <div className="text-sm text-blue-700">תזכורות ממתינות</div>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-200 p-3">
              <Calendar className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {reminders.filter((r) => r.status === "SENT").length}
              </div>
              <div className="text-sm text-green-700">תזכורות שנשלחו</div>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-200 p-3">
              <AlertTriangle className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {reminders.length}
              </div>
              <div className="text-sm text-purple-700">סה״כ תזכורות</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Reminders Table */}
      <DataTable
        data={reminders}
        columns={columns}
        getRowKey={(reminder) => reminder.id}
        emptyMessage="אין תזכורות להצגה"
      />

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <Modal
          open={showCreateModal}
          title="תזכורת חדשה"
          onClose={() => setShowCreateModal(false)}
          footer={
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                ביטול
              </Button>
              <Button type="button" variant="primary">
                יצירה
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Select label="סוג תזכורת">
              <option value="TAX_DEADLINE_APPROACHING">מועד מס מתקרב</option>
              <option value="BINDER_IDLE">תיק לא פעיל</option>
              <option value="UNPAID_CHARGE">חשבונית שלא שולמה</option>
              <option value="CUSTOM">התאמה אישית</option>
            </Select>
            <Input type="number" label="מזהה לקוח" />
            <Input type="date" label="תאריך יעד" />
            <Input type="number" label="ימים לפני" defaultValue="7" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                הודעה
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="הזן הודעת תזכורת..."
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
