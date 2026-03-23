import { Badge } from "../../../components/ui/Badge";
import type { Column } from "../../../components/ui/DataTable";
import type { UserResponse } from "../api";
import { formatDateTime } from "../../../utils/utils";
import { UserRowActions } from "./UserRowActions";

const ROLE_LABELS: Record<string, string> = {
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
      <span className="text-sm font-semibold text-gray-900">{user.full_name}</span>
    ),
  },
  {
    key: "email",
    header: "אימייל",
    render: (user) => <span className="text-sm text-gray-500">{user.email}</span>,
  },
  {
    key: "role",
    header: "תפקיד",
    render: (user) => (
      <Badge variant={user.role === "advisor" ? "info" : "neutral"}>
        {ROLE_LABELS[user.role] ?? user.role}
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
      <span className="text-sm text-gray-500 tabular-nums">
        {formatDateTime(user.last_login_at)}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "נוצר בתאריך",
    render: (user) => (
      <span className="text-sm text-gray-500 tabular-nums">
        {formatDateTime(user.created_at)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    headerClassName: "w-10",
    className: "w-10",
    render: (user) => (
      <UserRowActions
        user={user}
        currentUserId={currentUserId}
        onEdit={onEdit}
        onResetPassword={onResetPassword}
        onToggleActive={onToggleActive}
      />
    ),
  },
];
