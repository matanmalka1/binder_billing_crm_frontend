import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/DropdownMenu";
import { clientsApi } from "../api";
import { QK } from "../../../lib/queryKeys";

interface ClientRowActionsProps {
  clientId: number;
}

export const ClientRowActions: React.FC<ClientRowActionsProps> = ({ clientId }) => {
  const navigate = useNavigate();

  const { data: businesses } = useQuery({
    queryKey: QK.clients.businesses(clientId),
    queryFn: () => clientsApi.listBusinessesForClient(clientId),
    staleTime: 60_000,
  });
  const firstBusinessId = businesses?.items?.[0]?.id ?? null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות ללקוח ${clientId}`}>
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
