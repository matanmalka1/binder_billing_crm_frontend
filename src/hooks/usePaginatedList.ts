import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "../utils/utils";

interface Options<TItem> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<{ items: TItem[]; total: number }>;
  errorMessage?: string;
}

export function usePaginatedList<TItem>({ queryKey, queryFn, errorMessage = "שגיאה בטעינת הנתונים" }: Options<TItem>) {
  const { data, isPending, error } = useQuery({ queryKey, queryFn });
  return {
    items: data?.items ?? [] as TItem[],
    total: data?.total ?? 0,
    loading: isPending,
    error: error ? getErrorMessage(error, errorMessage) : null,
  };
}
