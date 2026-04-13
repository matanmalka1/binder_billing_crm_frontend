import { Clock, Pencil, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/overlays/DropdownMenu";
import { formatClientOfficeId } from "@/utils/utils";
import { CLIENT_ROUTES } from "../api/endpoints";

interface ClientRowActionsProps {
  clientId: number;
  onEditClient?: () => void;
}

export const ClientRowActions: React.FC<ClientRowActionsProps> = ({ clientId, onEditClient }) => {
  const navigate = useNavigate();
  const clientOfficeId = formatClientOfficeId(clientId);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות ללקוח ${clientOfficeId}`}>
        <DropdownMenuItem
          label="פתח פרופיל"
          onClick={() => navigate(CLIENT_ROUTES.detail(clientId))}
          icon={<UserCircle className="h-4 w-4" />}
        />
        {onEditClient && (
          <DropdownMenuItem
            label="עריכת לקוח"
            onClick={() => onEditClient()}
            icon={<Pencil className="h-4 w-4" />}
          />
        )}
        <DropdownMenuItem
          label="ציר זמן"
          onClick={() => navigate(CLIENT_ROUTES.timeline(clientId))}
          icon={<Clock className="h-4 w-4" />}
        />
      </DropdownMenu>
    </div>
  );
};

ClientRowActions.displayName = "ClientRowActions";
