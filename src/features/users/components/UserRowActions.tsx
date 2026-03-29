import { Pencil, KeyRound, UserX, UserCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/overlays/DropdownMenu";
import type { UserResponse } from "../api";

interface UserRowActionsProps {
  user: UserResponse;
  currentUserId: number | undefined;
  onEdit: (user: UserResponse) => void;
  onResetPassword: (user: UserResponse) => void;
  onToggleActive: (user: UserResponse) => void;
}

export const UserRowActions: React.FC<UserRowActionsProps> = ({
  user,
  currentUserId,
  onEdit,
  onResetPassword,
  onToggleActive,
}) => (
  <div onClick={(e) => e.stopPropagation()}>
    <DropdownMenu ariaLabel={`פעולות למשתמש ${user.full_name}`}>
      <DropdownMenuItem label="עריכה" onClick={() => onEdit(user)} icon={<Pencil className="h-4 w-4" />} />
      <DropdownMenuItem label="איפוס סיסמה" onClick={() => onResetPassword(user)} icon={<KeyRound className="h-4 w-4" />} />
      {user.id !== currentUserId && (
        <>
          <div className="my-1 border-t border-gray-100" />
          <DropdownMenuItem
            label={user.is_active ? "השבתה" : "הפעלה"}
            onClick={() => onToggleActive(user)}
            icon={user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
            danger={user.is_active}
          />
        </>
      )}
    </DropdownMenu>
  </div>
);

UserRowActions.displayName = "UserRowActions";
