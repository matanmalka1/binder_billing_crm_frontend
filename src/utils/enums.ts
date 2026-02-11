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
  return labels[role] || "—";
};

export const getWorkStateLabel = (workState: string): string => {
  const labels: Record<string, string> = {
    waiting_for_work: "ממתין לטיפול",
    in_progress: "בטיפול",
    completed: "הושלם",
  };
  return labels[workState] || "—";
};

export const getSlaStateLabel = (slaState: string): string => {
  const labels: Record<string, string> = {
    on_track: "במסלול",
    approaching: "מתקרב ליעד",
    overdue: "באיחור",
  };
  return labels[slaState] || "—";
};

export const getSignalLabel = (signal: string): string => {
  const labels: Record<string, string> = {
    overdue: "באיחור",
    near_sla: "קרוב ליעד",
    ready_for_pickup: "מוכן לאיסוף",
    idle_binder: "תיק לא פעיל",
    missing_permanent_documents: "חסרים מסמכים קבועים",
    unpaid_charges: "חיובים שלא שולמו",
  };
  return labels[signal] || "—";
};

export const getActionLabel = (action: string): string => {
  const labels: Record<string, string> = {
    receive: "קליטת תיק",
    ready: "מוכן לאיסוף",
    return: "החזרת תיק",
    freeze: "הקפאת לקוח",
    activate: "הפעלת לקוח",
  };
  return labels[action] || "—";
};
