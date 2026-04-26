import { Clock, Pencil, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RowActionItem, RowActionsMenu } from "@/components/ui/table";
import { formatClientOfficeId } from "@/utils/utils";
import { CLIENT_ROUTES } from "../../api/endpoints";

interface ClientRowActionsProps {
  clientId: number;
  officeClientNumber: number | null;
  onEditClient?: () => void;
}

export const ClientRowActions: React.FC<ClientRowActionsProps> = ({
  clientId,
  officeClientNumber,
  onEditClient,
}) => {
  const navigate = useNavigate();
  const clientOfficeId = formatClientOfficeId(officeClientNumber);

  const tooltip = onEditClient
    ? "פתח פרופיל, עריכת לקוח, ציר זמן"
    : "פתח פרופיל, ציר זמן";

  return (
    <RowActionsMenu ariaLabel={`פעולות ללקוח ${clientOfficeId}`} title={tooltip}>
      <RowActionItem
        label="פתח פרופיל"
        onClick={() => navigate(CLIENT_ROUTES.detail(clientId))}
        icon={<UserCircle className="h-4 w-4" />}
      />
      {onEditClient && (
        <RowActionItem
          label="עריכת לקוח"
          onClick={() => onEditClient()}
          icon={<Pencil className="h-4 w-4" />}
        />
      )}
      <RowActionItem
        label="ציר זמן"
        onClick={() => navigate(CLIENT_ROUTES.timeline(clientId))}
        icon={<Clock className="h-4 w-4" />}
      />
    </RowActionsMenu>
  );
};

ClientRowActions.displayName = "ClientRowActions";
