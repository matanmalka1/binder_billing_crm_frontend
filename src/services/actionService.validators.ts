export const isEntityId = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0;

export const isNonEmptyText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const hasValidReceivePayload = (
  payload?: Record<string, unknown>,
): payload is Record<string, unknown> & { client_id: number; binder_number: string } => {
  const clientId = payload?.client_id;
  const binderNumber = payload?.binder_number;
  return (
    typeof clientId === "number" &&
    Number.isInteger(clientId) &&
    clientId > 0 &&
    isNonEmptyText(binderNumber)
  );
};
