const deadlineTypeLabels: Record<string, string> = {
  vat: "מע״מ",
  advance_payment: "מקדמות",
  national_insurance: "ביטוח לאומי",
  annual_report: "דוח שנתי",
  other: "אחר",
};

const urgencyLabels: Record<string, string> = {
  green: "תקין",
  yellow: "קרוב למועד",
  red: "דחוף",
  overdue: "באיחור",
};

const urgencyColors: Record<string, string> = {
  green: "bg-green-100 text-green-800 border-green-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  red: "bg-red-100 text-red-800 border-red-200",
  // Use a strong red tone so באיחור stands out clearly in the UI
  overdue: "bg-red-600 text-white border-red-700",
};

const deadlineIcons: Record<string, string> = {
  vat: "📊",
  advance_payment: "💰",
  national_insurance: "🏥",
  annual_report: "📑",
  other: "📌",
};

export const getDeadlineTypeLabel = (type: string): string => {
  return deadlineTypeLabels[type] || "אחר";
};

export const getUrgencyLabel = (urgency: string): string => {
  return urgencyLabels[urgency] || "—";
};

export const getUrgencyColor = (urgency: string): string => {
  return urgencyColors[urgency] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const formatCurrency = (amount: number | null, currency = "ILS"): string => {
  if (amount === null) return "—";
  return `${amount.toLocaleString("he-IL", { minimumFractionDigits: 2 })} ${currency}`;
};

export const calculateDaysRemaining = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getDeadlineIcon = (type: string): string => {
  return deadlineIcons[type] || "📌";
};
