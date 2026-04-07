import { Clock, Pencil, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/overlays/DropdownMenu";

interface ClientRowActionsProps {
  clientId: number;
  onEditClient?: () => void;
}

export const ClientRowActions: React.FC<ClientRowActionsProps> = ({ clientId, onEditClient }) => {
  const navigate = useNavigate();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות ללקוח ${clientId}`}>
        <DropdownMenuItem
          label="פתח פרופיל"
          onClick={() => navigate(`/clients/${clientId}`)}
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
          onClick={() => navigate(`/clients/${clientId}`)}
          icon={<Clock className="h-4 w-4" />}
        />
      </DropdownMenu>
    </div>
  );
};

ClientRowActions.displayName = "ClientRowActions";
