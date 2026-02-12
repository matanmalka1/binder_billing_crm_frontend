export type QueryPrimitive = string | number | boolean | null | undefined;
export type QueryValue = QueryPrimitive | QueryPrimitive[];

const shouldSkipValue = (value: QueryPrimitive): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
};

export const toQueryParams = <T extends object>(input: T): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(input as Record<string, QueryValue>).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (shouldSkipValue(item)) return;
        params.append(key, String(item));
      });
      return;
    }

    if (shouldSkipValue(value)) return;
    params.set(key, String(value));
  });

  return params;
};
