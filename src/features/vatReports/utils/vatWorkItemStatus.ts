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

export const formatVatAmount = (amount: string | null): string => {
  if (amount === null || amount === undefined) return "—";
  const n = Number(amount);
  if (isNaN(n)) return "—";
  return `₪${n.toFixed(2)}`;
};
