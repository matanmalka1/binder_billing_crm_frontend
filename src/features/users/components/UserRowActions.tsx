import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, KeyRound, UserX, UserCheck } from "lucide-react";
import { cn } from "../../../utils/utils";
import type { UserResponse } from "../../../api/users.api";

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
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const item = (label: string, onClick: () => void, icon: React.ReactNode, danger = false) => (
    <button
      key={label}
      type="button"
      onClick={(e) => { e.stopPropagation(); setOpen(false); onClick(); }}
      className={cn(
        "w-full px-3 py-2 text-right text-sm transition-colors hover:bg-gray-50",
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700",
      )}
    >
      <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
        <span className="truncate">{label}</span>
        <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      </span>
    </button>
  );

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600"
        aria-label={`פעולות למשתמש ${user.full_name}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {item("עריכה", () => onEdit(user), <Pencil className="h-4 w-4" />)}
          {item("איפוס סיסמה", () => onResetPassword(user), <KeyRound className="h-4 w-4" />)}
          {user.id !== currentUserId && (
            <>
              <div className="my-1 border-t border-gray-100" />
              {item(
                user.is_active ? "השבתה" : "הפעלה",
                () => onToggleActive(user),
                user.is_active
                  ? <UserX className="h-4 w-4" />
                  : <UserCheck className="h-4 w-4" />,
                user.is_active,
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

UserRowActions.displayName = "UserRowActions";
