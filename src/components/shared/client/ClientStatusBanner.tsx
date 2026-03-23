import { Alert } from "@/components/ui/Alert";
import type { ClientStatus } from "@/utils/clientStatus";

interface ClientStatusBannerProps {
  status?: ClientStatus | string | null;
  className?: string;
}

export const ClientStatusBanner: React.FC<ClientStatusBannerProps> = ({ status, className }) => {
  if (status === "closed") {
    return <Alert variant="error" message="לקוח סגור – צפייה בלבד" className={className} />;
  }
  if (status === "frozen") {
    return <Alert variant="warning" message="לקוח מוקפא – אין יצירת עבודה חדשה" className={className} />;
  }
  return null;
};

ClientStatusBanner.displayName = "ClientStatusBanner";
