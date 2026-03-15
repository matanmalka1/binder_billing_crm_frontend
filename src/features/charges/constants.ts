export const chargeStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  draft: "neutral",
  issued: "info",
  paid: "success",
  canceled: "error",
};
