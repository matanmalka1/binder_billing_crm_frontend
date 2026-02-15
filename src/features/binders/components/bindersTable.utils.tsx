import { StatusBadge } from "../../../components/ui/StatusBadge";
import { getStatusLabel } from "../../../utils/enums";

export const getStatusBadge = (status: string): React.ReactNode => {
  return (
    <StatusBadge
      status={status}
      getLabel={getStatusLabel}
      variantMap={{
        in_office: "info",
        ready_for_pickup: "success",
        overdue: "error",
      }}
    />
  );
};
