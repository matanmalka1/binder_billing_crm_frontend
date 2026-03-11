export const canMarkMaterialsComplete = (status: string): boolean =>
  status === "pending_materials";

export const canAddInvoice = (status: string): boolean =>
  status === "material_received" ||
  status === "data_entry_in_progress" ||
  status === "ready_for_review";

export const canMarkReadyForReview = (status: string): boolean =>
  status === "data_entry_in_progress";

export const canSendBack = (status: string): boolean =>
  status === "ready_for_review";

export const canFile = (status: string): boolean =>
  status === "ready_for_review";

export const isFiled = (status: string): boolean => status === "filed";

/** Formats a VAT amount as ₪X.XX, or "—" for null/NaN */
export const formatVatAmount = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return "—";
  return `₪${Number(amount).toFixed(2)}`;
};