import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Bell, Calendar, AlertTriangle } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { Input } from "../../components/ui/Input";
import { PageLoading } from "../../components/ui/PageLoading";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { getErrorMessage, formatDate } from "../../utils/utils";
import { toast } from "sonner";
import { remindersApi } from "../../api/reminders.api";

// Reminder type definition matching backend model
interface Reminder {
  id: number;
  client_id: number;
  reminder_type:
    | "TAX_DEADLINE_APPROACHING"
    | "BINDER_IDLE"
    | "UNPAID_CHARGE"
    | "CUSTOM";
  target_date: string;
  days_before: number;
  send_on: string;
  message: string;
  status: "PENDING" | "SENT" | "CANCELED";
  created_at: string;
  sent_at?: string | null;
  canceled_at?: string | null;
  binder_id?: number | null;
  charge_id?: number | null;
  tax_deadline_id?: number | null;
}

// Create reminder request interface
interface CreateReminderRequest {
  client_id: number;
  reminder_type: Reminder["reminder_type"];
  target_date: string;
  days_before: number;
  message: string;
  binder_id?: number;
  charge_id?: number;
  tax_deadline_id?: number;
}

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

  // Form state for create modal
  const [formData, setFormData] = useState<CreateReminderRequest>({
    client_id: 0,
    reminder_type: "TAX_DEADLINE_APPROACHING",
    target_date: "",
    days_before: 7,
    message: "",
  });

  const remindersQuery = useQuery<Reminder[], Error>({
    queryKey: ["reminders", "list"],
    queryFn: () => remindersApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      toast.success("תזכורת נוצרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setShowCreateModal(false);
      // Reset form
      setFormData({
        client_id: 0,
        reminder_type: "TAX_DEADLINE_APPROACHING",
        target_date: "",
        days_before: 7,
        message: "",
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "שגיאה ביצירת תזכורת"));
    },
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.client_id || formData.client_id <= 0) {
      toast.error("נא להזין מזהה לקוח תקין");
      return;
    }
    if (!formData.target_date) {
      toast.error("נא לבחור תאריך יעד");
      return;
    }
    if (!formData.message || formData.message.trim() === "") {
      toast.error("נא להזין הודעת תזכורת");
      return;
    }
    if (formData.days_before < 0) {
      toast.error("מספר ימים לפני חייב להיות חיובי");
      return;
    }

    createMutation.mutate(formData);
  };

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
          <p className="text-sm text-gray-700 truncate" title={reminder.message}>
            {reminder.message}
          </p>
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
        <Card
          variant="elevated"
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-200 p-3">
              <Bell className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {pendingCount}
              </div>
              <div className="text-sm text-blue-700">תזכורות ממתינות</div>
            </div>
          </div>
        </Card>

        <Card
          variant="elevated"
          className="bg-gradient-to-br from-green-50 to-green-100"
        >
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

        <Card
          variant="elevated"
          className="bg-gradient-to-br from-purple-50 to-purple-100"
        >
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

      {/* Create Modal */}
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
              <Button
                type="button"
                variant="primary"
                onClick={handleCreateSubmit}
                isLoading={createMutation.isPending}
              >
                יצירה
              </Button>
            </div>
          }
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <Select
              label="סוג תזכורת"
              value={formData.reminder_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reminder_type: e.target.value as Reminder["reminder_type"],
                })
              }
            >
              <option value="TAX_DEADLINE_APPROACHING">מועד מס מתקרב</option>
              <option value="BINDER_IDLE">תיק לא פעיל</option>
              <option value="UNPAID_CHARGE">חשבונית שלא שולמה</option>
              <option value="CUSTOM">התאמה אישית</option>
            </Select>

            <Input
              type="number"
              label="מזהה לקוח"
              value={formData.client_id || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  client_id: parseInt(e.target.value) || 0,
                })
              }
              required
              min={1}
            />

            <Input
              type="date"
              label="תאריך יעד"
              value={formData.target_date}
              onChange={(e) =>
                setFormData({ ...formData, target_date: e.target.value })
              }
              required
            />

            <Input
              type="number"
              label="ימים לפני"
              value={formData.days_before}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  days_before: parseInt(e.target.value) || 0,
                })
              }
              required
              min={0}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                הודעה <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הזן הודעת תזכורת..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
