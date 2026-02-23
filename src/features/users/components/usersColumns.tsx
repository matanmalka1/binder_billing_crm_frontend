import { UserCheck, UserX, KeyRound, Pencil } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import type { Column } from "../../../components/ui/DataTable";
import type { UserResponse } from "../../../api/users.api";
import { formatDateTime } from "../../../utils/utils";

const roleLabel: Record<string, string> = {
  advisor: "יועץ",
  secretary: "מזכירה",
};

interface BuildUserColumnsParams {
  onEdit: (user: UserResponse) => void;
  onToggleActive: (user: UserResponse) => void;
  onResetPassword: (user: UserResponse) => void;
  currentUserId: number | undefined;
}

export const buildUserColumns = ({
  onEdit,
  onToggleActive,
  onResetPassword,
  currentUserId,
}: BuildUserColumnsParams): Column<UserResponse>[] => [
  {
    key: "full_name",
    header: "שם מלא",
    render: (user) => (
      <span className="font-medium text-gray-900">{user.full_name}</span>
    ),
  },
  {
    key: "email",
    header: "אימייל",
    render: (user) => (
      <span className="text-sm text-gray-600">{user.email}</span>
    ),
  },
  {
    key: "role",
    header: "תפקיד",
    render: (user) => (
      <Badge variant={user.role === "advisor" ? "info" : "neutral"}>
        {roleLabel[user.role] ?? user.role}
      </Badge>
    ),
  },
  {
    key: "is_active",
    header: "סטטוס",
    render: (user) => (
      <Badge variant={user.is_active ? "success" : "error"}>
        {user.is_active ? "פעיל" : "מושבת"}
      </Badge>
    ),
  },
  {
    key: "last_login_at",
    header: "כניסה אחרונה",
    render: (user) => (
      <span className="text-sm text-gray-500">{formatDateTime(user.last_login_at)}</span>
    ),
  },
  {
    key: "created_at",
    header: "נוצר בתאריך",
    render: (user) => (
      <span className="text-sm text-gray-500">{formatDateTime(user.created_at)}</span>
    ),
  },
  {
    key: "actions",
    header: "פעולות",
    render: (user) => {
      const isSelf = user.id === currentUserId;
      return (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            title="עריכה"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResetPassword(user)}
            title="איפוס סיסמה"
          >
            <KeyRound className="w-4 h-4" />
          </Button>
          {!isSelf && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleActive(user)}
              title={user.is_active ? "השבתה" : "הפעלה"}
            >
              {user.is_active ? (
                <UserX className="w-4 h-4 text-red-500" />
              ) : (
                <UserCheck className="w-4 h-4 text-green-600" />
              )}
            </Button>
          )}
        </div>
      );
    },
  },
];
