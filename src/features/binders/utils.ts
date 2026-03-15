export const canMarkReady = (status: string): boolean => status === "in_office";

export const canReturn = (status: string): boolean => status === "ready_for_pickup";
