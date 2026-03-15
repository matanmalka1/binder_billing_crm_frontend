import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/DropdownMenu";

interface ClientRowActionsProps {
  clientId: number;
}

export const ClientRowActions: React.FC<ClientRowActionsProps> = ({ clientId }) => {
  const navigate = useNavigate();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות ללקוח ${clientId}`}>
        <DropdownMenuItem
          label="ציר זמן"
          onClick={() => navigate(`/clients/${clientId}/timeline`)}
          icon={<Clock className="h-4 w-4" />}
        />
      </DropdownMenu>
    </div>
  );
};

ClientRowActions.displayName = "ClientRowActions";
