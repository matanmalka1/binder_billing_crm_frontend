import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import {
  vatReportsApi,
  type CreateVatWorkItemPayload,
  type VatWorkItemsListParams,
} from "../../../api/vatReports.api";
import { getErrorMessage, parsePositiveInt } from "../../../utils/utils";
import { toOptionalString } from "../../../utils/filters";
import { useRole } from "../../../hooks/useRole";
import { QK } from "../../../lib/queryKeys";

export type VatWorkItemAction = "materialsComplete" | "readyForReview" | "sendBack" | "file";

export const useVatWorkItemsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdvisor } = useRole();

  const filters = {
    status: searchParams.get("status") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: VatWorkItemsListParams = {
    status: toOptionalString(filters.status),
    page: filters.page,
    page_size: filters.page_size,
  };

  const listQuery = useQuery({
    queryKey: QK.tax.vatWorkItems.list(apiParams),
    queryFn: () => vatReportsApi.list(apiParams),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateVatWorkItemPayload) => vatReportsApi.create(payload),
    onSuccess: async () => {
      toast.success('תיק מע"מ נוצר בהצלחה');
      await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.all });
    },
  });

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const actionMutation = useMutation({
    mutationFn: async ({ action, itemId }: { action: VatWorkItemAction; itemId: number }) => {
      if (action === "materialsComplete") return vatReportsApi.markMaterialsComplete(itemId);
      if (action === "readyForReview") return vatReportsApi.markReadyForReview(itemId);
      if (action === "file") return vatReportsApi.fileVatReturn(itemId, { filing_method: "online" });
      // sendBack requires a note — handled separately via modal
      return vatReportsApi.markReadyForReview(itemId);
    },
    onSuccess: async () => {
      toast.success("הפעולה בוצעה בהצלחה");
      await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.all });
    },
  });

  const runAction = useCallback(
    async (itemId: number, action: VatWorkItemAction) => {
      if ((action === "sendBack" || action === "file") && !isAdvisor) {
        toast.error("פעולה זו זמינה ליועץ בלבד");
        return;
      }
      try {
        setActionLoadingId(itemId);
        await actionMutation.mutateAsync({ action, itemId });
      } catch (requestError: unknown) {
        toast.error(getErrorMessage(requestError, "שגיאה בביצוע הפעולה"));
      } finally {
        setActionLoadingId(null);
      }
    },
    [actionMutation, isAdvisor],
  );

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const submitCreate = async (payload: CreateVatWorkItemPayload): Promise<boolean> => {
    if (!isAdvisor) return false;
    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (requestError: unknown) {
      toast.error(getErrorMessage(requestError, 'שגיאה ביצירת תיק מע"מ'));
      return false;
    }
  };

  return {
    actionLoadingId,
    workItems: listQuery.data?.items ?? [],
    createError: createMutation.error
      ? getErrorMessage(createMutation.error, 'שגיאה ביצירת תיק מע"מ')
      : null,
    createLoading: createMutation.isPending,
    error: listQuery.error
      ? getErrorMessage(listQuery.error, 'שגיאה בטעינת תיקי מע"מ')
      : null,
    filters,
    isAdvisor,
    loading: listQuery.isPending,
    runAction,
    setFilter,
    setSearchParams,
    submitCreate,
    total: listQuery.data?.total ?? 0,
  };
};
