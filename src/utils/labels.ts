type LookupMap = Record<string, string>;

export const makeLabelGetter = (map: LookupMap, fallback = "—") => {
  return (key: string) => map[key] ?? fallback;
};

export const makeClassGetter = (map: LookupMap, fallbackKey?: string, fallbackValue = "") => {
  const resolvedFallback = fallbackKey ? map[fallbackKey] ?? fallbackValue : fallbackValue;
  return (key: string) => map[key] ?? resolvedFallback;
};
