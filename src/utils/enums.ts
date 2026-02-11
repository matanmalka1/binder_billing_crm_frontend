/**
 * Safe enum label mappers - ensures Hebrew-only UI
 *
 * All unknown values return safe fallback "—" (em dash)
 * No English text can leak to UI
 */

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    in_office: "במשרד",
    ready_for_pickup: "מוכן לאיסוף",
    returned: "הוחזר",
    overdue: "באיחור",
  };
  return labels[status] || "—"; // Safe fallback, no English
};

export const getClientTypeLabel = (clientType: string): string => {
  const labels: Record<string, string> = {
    osek_patur: "עוסק פטור",
    osek_murshe: "עוסק מורשה",
    company: "חברה",
    employee: "שכיר",
  };
  return labels[clientType] || "—";
};

export const getClientStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: "פעיל",
    frozen: "מוקפא",
    closed: "סגור",
  };
  return labels[status] || "—";
};

export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    advisor: "יועץ",
    secretary: "מזכירה",
  };
  return labels[role] || "משתמש"; // Safe fallback for unknown roles
};
