// Small helpers to build typed react-query key factories without repetition
export const createListDetailKeys = <Filters, Id = number>(resource: string) => {
  const all = [resource] as const;
  const lists = () => [...all, "list"] as const;
  const list = (filters: Filters) => [...lists(), filters] as const;
  const details = () => [...all, "detail"] as const;
  const detail = (id: Id) => [...details(), id] as const;

  return { all, lists, list, details, detail } as const;
};
