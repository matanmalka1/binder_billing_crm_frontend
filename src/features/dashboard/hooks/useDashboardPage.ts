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
import { getErrorMessage, getHttpStatus, showErrorToast } from "../../../utils/utils";
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

  const dashboardQuery = useQuery<DashboardOverviewResponse | DashboardSummaryResponse>({
    enabled: hasRole,
    queryKey: ["dashboard", isAdvisor ? "overview" : "summary"] as const,
    queryFn: isAdvisor ? dashboardApi.getOverview : dashboardApi.getSummary,
  });

  const actionMutation = useMutation({
    mutationFn: (action: ActionCommand) => executeAction(action),
    onSuccess: async () => {
      toast.success("הפעולה המהירה בוצעה בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
    },
  });

  const denied = useMemo(() => {
    const queryDenied = getHttpStatus(dashboardQuery.error) === 403;
    return queryDenied || actionDenied;
  }, [actionDenied, dashboardQuery.error]);

  const dashboard = useMemo<DashboardState>(() => {
    if (!hasRole) {
      return { status: "error", message: "לא ניתן לזהות תפקיד משתמש", data: null };
    }

    if (dashboardQuery.isPending) {
      return { status: "loading", message: "טוען נתוני לוח בקרה...", data: null };
    }

    if (dashboardQuery.error) {
      return {
        status: "error",
        message: getErrorMessage(dashboardQuery.error, "שגיאה בטעינת לוח הבקרה"),
        data: null,
      };
    }

    if (isAdvisor && dashboardQuery.data) {
      return {
        status: "ok",
        message: "נתונים נטענו בהצלחה",
        data: { role_view: "advisor", ...dashboardQuery.data },
      };
    }

    if (isSecretary && dashboardQuery.data) {
      return {
        status: "ok",
        message: "נתונים נטענו בהצלחה",
        data: { role_view: "secretary", ...dashboardQuery.data },
      };
    }

    return { status: "idle", message: "", data: null };
  }, [
    dashboardQuery.data,
    dashboardQuery.error,
    dashboardQuery.isPending,
    hasRole,
    isAdvisor,
    isSecretary,
  ]);

  const attentionItems = dashboardQuery.data?.attention.items ?? [];

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
