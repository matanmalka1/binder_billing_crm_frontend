import { Clock, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/overlays/DropdownMenu";
import { useFirstBusinessId } from "../hooks/useFirstBusinessId";

interface ClientRowActionsProps {
  clientId: number;
  onEditClient?: () => void;
}

export const ClientRowActions: React.FC<ClientRowActionsProps> = ({ clientId, onEditClient }) => {
  const navigate = useNavigate();
  const firstBusinessId = useFirstBusinessId(clientId);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות ללקוח ${clientId}`}>
        <DropdownMenuItem
          label="עריכת לקוח"
          onClick={() => onEditClient?.()}
          icon={<Pencil className="h-4 w-4" />}
        />
        {firstBusinessId != null && (
          <DropdownMenuItem
            label="ציר זמן"
            onClick={() => navigate(`/clients/${clientId}/businesses/${firstBusinessId}/timeline`)}
            icon={<Clock className="h-4 w-4" />}
          />
        )}
      </DropdownMenu>
    </div>
  );
};

ClientRowActions.displayName = "ClientRowActions";
