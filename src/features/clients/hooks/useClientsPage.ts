import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { clientsApi, type ListClientsParams } from "../../../api/clients.api";
import { parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { useActionRunner } from "../../actions/hooks/useActionRunner";
import { QK } from "../../../lib/queryKeys";
import type { CreateClientPayload } from "../../../api/clients.api";
import { useRole } from "../../../hooks/useRole";
import { toast } from "../../../utils/toast";

export const useClientsPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setPage } = useSearchParamFilters();
  const { isAdvisor, can } = useRole();

  const filters = {
    has_signals: searchParams.get("has_signals") ?? "",
    status: searchParams.get("status") ?? "",
    search: searchParams.get("search") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: ListClientsParams = {
    has_signals: filters.has_signals ? filters.has_signals === "true" : undefined,
    status: filters.status || undefined,
    search: filters.search || undefined,
    page: filters.page,
    page_size: filters.page_size,
  };

  const { items: clientItems, total, loading, error } = usePaginatedList({
    queryKey: QK.clients.list(apiParams),
    queryFn: () => clientsApi.list(apiParams),
    errorMessage: "שגיאה בטעינת רשימת לקוחות",
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      toast.success("לקוח נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.clients.all });
    },
    onError: (err) =>
      showErrorToast(err, "שגיאה ביצירת לקוח"),
  });

  const {
    activeActionKey,
    activeActionKeyRef,
    cancelPendingAction,
    confirmPendingAction,
    handleAction: onAction,
    pendingAction,
  } = useActionRunner({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK.clients.all }),
    errorFallback: "שגיאה בביצוע פעולת לקוח",
    canonicalAction: true,
  });

  const handleFilterChange = (name: "has_signals" | "status" | "page_size" | "search", value: string) => {
    setFilter(name, value);
  };

  return {
    activeActionKey,
    activeActionKeyRef,
    clients: clientItems,
    error,
    filters,
    onAction,
    handleFilterChange,
    loading,
    pendingAction,
    setPage,
    total,
    cancelPendingAction,
    confirmPendingAction,
    createClient: async (payload: CreateClientPayload): Promise<void> => {
      await createMutation.mutateAsync(payload);
    },
    createLoading: createMutation.isPending,
    isAdvisor,
    can,
  };
};
