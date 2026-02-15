import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "../../../utils/toast";
import { dashboardApi } from "../../../api/dashboard.api";
import type {
  AttentionResponse,
  DashboardOverviewResponse,
  DashboardSummaryResponse,
} from "../../../api/dashboard.api";
import { useAuthStore } from "../../../store/auth.store";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { executeAction } from "../../../lib/actions/runtime";
import type { ActionCommand } from "../../../lib/actions/types";

type DashboardData =
  | (DashboardOverviewResponse & { role_view: "advisor" })
  | (DashboardSummaryResponse & { role_view: "secretary" });

type DashboardState = {
  status: "idle" | "loading" | "ok" | "error";
  message: string;
  data: DashboardData | null;
};

export const useDashboardPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [pendingQuickAction, setPendingQuickAction] = useState<ActionCommand | null>(null);
  const [actionDenied, setActionDenied] = useState(false);

  const hasRole = Boolean(user?.role);
  const isAdvisor = user?.role === "advisor";
  const isSecretary = user?.role === "secretary";

  const overviewQuery = useQuery({
    enabled: isAdvisor,
    queryKey: ["dashboard", "overview"] as const,
    queryFn: dashboardApi.getOverview,
  });

  const summaryQuery = useQuery({
    enabled: isSecretary,
    queryKey: ["dashboard", "summary"] as const,
    queryFn: dashboardApi.getSummary,
  });

  const attentionQuery = useQuery({
    enabled: hasRole,
    queryKey: ["dashboard", "attention"] as const,
    queryFn: dashboardApi.getAttention,
  });

  const actionMutation = useMutation({
    mutationFn: (action: ActionCommand) => executeAction(action),
    onSuccess: async () => {
      toast.success("הפעולה המהירה בוצעה בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "attention"] }),
      ]);
    },
  });

  const getStatusCode = (error: unknown): number | null => {
    if (!axios.isAxiosError(error)) return null;
    const status = error.response?.status;
    return typeof status === "number" ? status : null;
  };

  const denied = useMemo(() => {
    const queryErrors = [
      overviewQuery.error,
      summaryQuery.error,
      attentionQuery.error,
    ];
    const queryDenied = queryErrors.some((error) => getStatusCode(error) === 403);

    return queryDenied || actionDenied;
  }, [
    actionDenied,
    attentionQuery.error,
    overviewQuery.error,
    summaryQuery.error,
  ]);

  const dashboard = useMemo<DashboardState>(() => {
    if (!hasRole) {
      return { status: "error", message: "לא ניתן לזהות תפקיד משתמש", data: null };
    }

    const roleQueryLoading = isAdvisor
      ? overviewQuery.isPending
      : isSecretary
        ? summaryQuery.isPending
        : false;

    if (attentionQuery.isPending || roleQueryLoading) {
      return { status: "loading", message: "טוען נתוני לוח בקרה...", data: null };
    }

    const roleQueryError = isAdvisor
      ? overviewQuery.error
      : isSecretary
        ? summaryQuery.error
        : null;
    const loadError = roleQueryError || attentionQuery.error;
    if (loadError) {
      return {
        status: "error",
        message: getErrorMessage(loadError, "שגיאה בטעינת לוח הבקרה"),
        data: null,
      };
    }

    if (isAdvisor && overviewQuery.data) {
      return {
        status: "ok",
        message: "נתונים נטענו בהצלחה",
        data: { role_view: "advisor", ...overviewQuery.data },
      };
    }

    if (isSecretary && summaryQuery.data) {
      return {
        status: "ok",
        message: "נתונים נטענו בהצלחה",
        data: { role_view: "secretary", ...summaryQuery.data },
      };
    }

    return { status: "idle", message: "", data: null };
  }, [
    attentionQuery.error,
    attentionQuery.isPending,
    hasRole,
    isAdvisor,
    isSecretary,
    overviewQuery.data,
    overviewQuery.error,
    overviewQuery.isPending,
    summaryQuery.data,
    summaryQuery.error,
    summaryQuery.isPending,
  ]);

  const attentionItems = (attentionQuery.data?.items ?? []) as AttentionResponse["items"];

  const runQuickAction = useCallback(
    async (action: ActionCommand) => {
      setActiveQuickAction(action.uiKey);
      try {
        setActionDenied(false);
        await actionMutation.mutateAsync(action);
      } catch (requestError: unknown) {
        if (getStatusCode(requestError) === 403) {
          setActionDenied(true);
        }
        showErrorToast(requestError, "שגיאה בביצוע פעולה מהירה", { canonicalAction: true });
      } finally {
        setActiveQuickAction(null);
      }
    },
    [actionMutation],
  );

  const handleQuickAction = (action: ActionCommand) => {
    if (action.confirm) return setPendingQuickAction(action);
    void runQuickAction(action);
  };

  const confirmPendingAction = useCallback(async () => {
    if (!pendingQuickAction) return;
    try {
      await runQuickAction(pendingQuickAction);
    } finally {
      setPendingQuickAction(null);
    }
  }, [pendingQuickAction, runQuickAction]);

  return {
    activeQuickAction,
    attentionItems,
    dashboard,
    denied,
    handleQuickAction,
    confirmPendingAction,
    pendingQuickAction,
    runQuickAction,
    setPendingQuickAction,
  };
};
