import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import type { UserRole } from "../../types/common";
import { AccessDenied } from "./AccessDenied";

interface RoleGuardProps {
  allow: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allow,
  children,
  fallback,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allow.includes(user.role)) {
    return <>{fallback ?? <AccessDenied />}</>;
  }

  return <>{children}</>;
};
