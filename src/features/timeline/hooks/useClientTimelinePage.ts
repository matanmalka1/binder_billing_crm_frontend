import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { timelineApi } from "../../../api/timeline.api";
import { getErrorMessage, showErrorToast, isPositiveInt, parsePositiveInt } from "../../../utils/utils";
import { executeAction } from "../../../lib/actions/runtime";
import { useConfirmableAction } from "../../actions/hooks/useConfirmableAction";
import type { ActionCommand } from "../../../lib/actions/types";
import { timelineKeys } from "../queryKeys";

export const useClientTimelinePage = (clientId: string | undefined) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(searchParams.get("page_size"), 50);
  const clientIdNumber = Number(clientId || 0);
  const hasValidClient = isPositiveInt(clientIdNumber);

  const timelineParams = useMemo(
    () => ({ page, page_size: pageSize }),
    [page, pageSize],
  );

  const timelineQuery = useQuery({
    enabled: hasValidClient,
    queryKey: timelineKeys.events(clientIdNumber, timelineParams),
    queryFn: () => timelineApi.getClientTimeline(clientIdNumber, timelineParams),
  });

  const actionMutation = useMutation({
    mutationFn: (action: ActionCommand) => executeAction(action),
    onSuccess: async () => {
      toast.success("הפעולה בוצעה בהצלחה");
      await queryClient.invalidateQueries({
        queryKey: timelineKeys.client(clientIdNumber),
      });
    },
  });

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };
  const setPageSize = (nextPageSize: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("page_size", nextPageSize);
    next.set("page", "1");
    setSearchParams(next);
  };

  const runAction = useCallback(
    async (action: ActionCommand) => {
      setActiveActionKey(action.uiKey);
      try {
        await actionMutation.mutateAsync(action);
      } catch (requestError: unknown) {
        showErrorToast(requestError, "שגיאה בביצוע פעולה", { canonicalAction: true });
      } finally {
        setActiveActionKey(null);
      }
    },
    [actionMutation],
  );

  const {
    cancelPendingAction,
    confirmPendingAction,
    handleAction,
    pendingAction,
  } = useConfirmableAction(runAction, (action) => Boolean(action.confirm));

  return {
    activeActionKey,
    error:
      !hasValidClient
        ? "מזהה לקוח חסר"
        : timelineQuery.error
          ? getErrorMessage(timelineQuery.error, "שגיאה בטעינת ציר זמן")
          : null,
    events: timelineQuery.data?.events ?? [],
    handleAction,
    loading: hasValidClient ? timelineQuery.isPending : false,
    page,
    pageSize,
    pendingAction,
    runAction,
    setPage,
    setPageSize,
    total: timelineQuery.data?.total ?? 0,
    cancelPendingAction,
    confirmPendingAction,
  };
};
