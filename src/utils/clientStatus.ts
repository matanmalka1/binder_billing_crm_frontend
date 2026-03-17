export type ClientStatus = "active" | "frozen" | "closed";

export const isClientClosed = (s?: ClientStatus | string | null): boolean => s === "closed";
export const isClientFrozen = (s?: ClientStatus | string | null): boolean => s === "frozen";
export const isClientLockedForCreate = (s?: ClientStatus | string | null): boolean =>
  s === "closed" || s === "frozen";
