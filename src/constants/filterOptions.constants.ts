
export const getResultTypeLabel = (resultType: string) => {
  if (resultType === "binder") return "קלסר";
  if (resultType === "client") return "לקוח";
  return "—";
};
