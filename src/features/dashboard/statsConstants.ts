export const DASHBOARD_STATS_LINKS = {
  clients: "/clients",
  binders: "/binders",
  vatReports: "/tax/vat",
  reminders: "/reminders",
} as const;

export const DASHBOARD_STATS_LABELS = {
  activeClientsTitle: "לקוחות",
  activeClientsAction: "פתח לקוחות פעילים",
  bindersTitle: "קלסרים במשרד",
  bindersAction: "פתח קלסרים במשרד",
  monthlyVatTitle: "מע״מ חודשי",
  bimonthlyVatTitle: "מע״מ דו־חודשי",
  vatAction: "פתח דוחות מע״מ",
  remindersTitle: "תזכורות לטיפול",
  remindersValueSuffix: "לטיפול עכשיו",
  remindersDescription: "כולל תזכורות שהגיע מועד השליחה שלהן",
  remindersAction: "פתח תזכורות",
} as const;
