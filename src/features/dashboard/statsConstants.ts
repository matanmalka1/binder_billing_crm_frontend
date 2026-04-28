export const DASHBOARD_STATS_LINKS = {
  clients: "/clients",
  binders: "/binders",
  vatReports: "/tax/vat",
  reminders: "/reminders",
} as const;

export const DASHBOARD_STATS_LABELS = {
  activeClientsTitle: "לקוחות",
  activeClientsDescription: "סך הכל לקוחות פעילים",
  bindersTitle: "קלסרים במשרד",
  bindersDescription: "כלל הקלסרים הפעילים",
  monthlyVatTitle: "מע״מ חודשי",
  bimonthlyVatTitle: "מע״מ דו־חודשי",
  vatAction: "פתח דוחות מע״מ",
  remindersTitle: "תזכורות לטיפול",
  remindersDescription: "ממתינות לפעולה עכשיו",
  remindersAction: "פתח תזכורות",
} as const;
