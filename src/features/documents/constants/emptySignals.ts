import type { OperationalSignalsResponse } from "../../../api/documents.api";

export const emptySignals: OperationalSignalsResponse = {
  client_id: 0,
  missing_documents: [],
  binders_nearing_sla: [],
  binders_overdue: [],
};
