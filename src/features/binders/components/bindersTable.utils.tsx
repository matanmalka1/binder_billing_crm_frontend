import React from "react";
import { Badge } from "../../../components/ui/Badge";
import { getStatusLabel } from "../../../utils/enums";

export const getStatusBadge = (status: string): React.ReactNode => {
  const label = getStatusLabel(status);
  if (status === "in_office") return <Badge variant="info">{label}</Badge>;
  if (status === "ready_for_pickup") return <Badge variant="success">{label}</Badge>;
  if (status === "overdue") return <Badge variant="error">{label}</Badge>;
  return <Badge variant="neutral">{label}</Badge>;
};

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("he-IL");
