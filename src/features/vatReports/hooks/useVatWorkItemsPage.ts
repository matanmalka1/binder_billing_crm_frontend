import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import {
  vatReportsApi,
  type CreateVatWorkItemPayload,
  type VatWorkItemsListParams,
} from "../../../api/vatReports.api";
import { getErrorMessage, parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { toOptionalString } from "../../../utils/filters";
import { useRole } from "../../../hooks/useRole";
import { QK } from "../../../lib/queryKeys";

export type VatWorkItemAction = "materialsComplete" | "readyForReview" | "sendBack" | "file";

export const useVatWorkItemsPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setSearchParams } = useSearchParamFilters();
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
      // sendBack requires a correction note — must be triggered via the dedicated sendBackWithNote flow
      throw new Error("sendBack must be called via sendBackWithNote");
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
        showErrorToast(requestError, "שגיאה בביצוע הפעולה");
      } finally {
        setActionLoadingId(null);
      }
    },
    [actionMutation, isAdvisor],
  );

  const sendBackWithNote = useCallback(
    async (itemId: number, correctionNote: string): Promise<void> => {
      if (!isAdvisor) {
        toast.error("פעולה זו זמינה ליועץ בלבד");
        return;
      }
      try {
        setActionLoadingId(itemId);
        await vatReportsApi.sendBack(itemId, correctionNote);
        toast.success("התיק הוחזר לתיקון");
        await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.all });
      } catch (requestError: unknown) {
        showErrorToast(requestError, "שגיאה בהחזרת התיק לתיקון");
      } finally {
        setActionLoadingId(null);
      }
    },
    [isAdvisor, queryClient],
  );

  // setFilter provided by useSearchParamFilters

  const submitCreate = async (payload: CreateVatWorkItemPayload): Promise<boolean> => {
    if (!isAdvisor) return false;
    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (requestError: unknown) {
      showErrorToast(requestError, 'שגיאה ביצירת תיק מע"מ');
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
    sendBackWithNote,
    setFilter,
    setSearchParams,
    submitCreate,
    total: listQuery.data?.total ?? 0,
  };
};
