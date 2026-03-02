export type QueryPrimitive = string | number | boolean | null | undefined;

const shouldSkipValue = (value: QueryPrimitive): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
};

export const toQueryParams = <T extends object>(input: T): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(input as Record<string, QueryPrimitive>).forEach(([key, value]) => {
    if (shouldSkipValue(value)) return;
    params.set(key, String(value));
  });

  return params;
};
