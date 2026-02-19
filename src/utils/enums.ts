
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

export const getChargeStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    draft: "טיוטה",
    issued: "הונפק",
    paid: "שולם",
    canceled: "בוטל",
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
    idle_binder: "קלסר לא פעיל",
    missing_permanent_documents: "חסרים מסמכים קבועים",
    unpaid_charges: "חיובים שלא שולמו",
  };
  return labels[signal] || "—";
};

const ACTION_LABELS: Record<string, string> = {
  receive: "קליטת קלסר",
  ready: "מוכן לאיסוף",
  return: "החזרת קלסר",
  freeze: "הקפאת לקוח",
  activate: "הפעלת לקוח",
  mark_paid: "סימון חיוב כשולם",
  issue_charge: "הנפקת חיוב",
  cancel_charge: "ביטול חיוב",
};

export const getActionLabel = (action: string): string => {
  return ACTION_LABELS[action] || "—";
};

export const getBinderTypeLabel = (binderType: string): string => {
  const labels: Record<string, string> = {
    vat: 'מע"מ',
    income_tax: "מס הכנסה",
    national_insurance: "ביטוח לאומי",
    capital_declaration: "הצהרת הון",
    annual_report: "דוח שנתי",
    salary: "שכר",
    bookkeeping: "הנהלת חשבונות",
    other: "אחר",
  };
  return labels[binderType] || "—";
};

export const getSignatureRequestStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    draft: 'טיוטה',
    pending_signature: 'ממתין לחתימה',
    signed: 'נחתם',
    declined: 'נדחה',
    expired: 'פג תוקף',
    canceled: 'בוטל',
  };
  return labels[status] || '—';
};

export const getSignatureRequestTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    engagement_agreement: 'הסכם התקשרות',
    annual_report_approval: 'אישור דוח שנתי',
    power_of_attorney: 'ייפוי כוח',
    vat_return_approval: 'אישור דוח מע"מ',
    custom: 'מותאם אישית',
  };
  return labels[type] || '—';
};
