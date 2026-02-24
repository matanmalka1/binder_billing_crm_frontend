import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "../../../api/dashboard.api";
import type {
  DashboardOverviewResponse,
  DashboardSummaryResponse,
} from "../../../api/dashboard.api";
import { getErrorMessage, getHttpStatus } from "../../../utils/utils";
import type { ActionCommand } from "../../../lib/actions/types";
import { useRole } from "../../../hooks/useRole";
import { useActionRunner } from "../../actions/hooks/useActionRunner";
import { QK } from "../../../lib/queryKeys";
type DashboardData =
  | (DashboardOverviewResponse & { role_view: "advisor" })
  | (DashboardSummaryResponse & { role_view: "secretary" });
type DashboardState = {
  status: "idle" | "loading" | "ok" | "error";
  message: string;
  data: DashboardData | null;
};

const isOverviewData = (
  data: DashboardOverviewResponse | DashboardSummaryResponse | undefined,
): data is DashboardOverviewResponse =>
  Boolean(data && "total_clients" in data);

const isSummaryData = (
  data: DashboardOverviewResponse | DashboardSummaryResponse | undefined,
): data is DashboardSummaryResponse =>
  Boolean(data && "binders_in_office" in data);

export const useDashboardPage = () => {
  const queryClient = useQueryClient();
  const { role, isAdvisor, isSecretary } = useRole();
  const [actionDenied, setActionDenied] = useState(false);
  const hasRole = Boolean(role);
  const dashboardQuery = useQuery<DashboardOverviewResponse | DashboardSummaryResponse>({
    enabled: hasRole,
    queryKey: isAdvisor ? QK.dashboard.overview : QK.dashboard.summary,
    queryFn: isAdvisor ? dashboardApi.getOverview : dashboardApi.getSummary,
  });

  const {
    activeActionKey: activeQuickAction,
    handleAction: handleQuickActionBase,
    pendingAction: pendingQuickAction,
    confirmPendingAction: confirmPendingActionBase,
    cancelPendingAction: cancelPendingActionBase,
  } = useActionRunner({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK.dashboard.all }),
    errorFallback: "שגיאה בביצוע פעולה מהירה",
    canonicalAction: true,
    onError: (err) => {
      if (getHttpStatus(err) === 403) {
        setActionDenied(true);
      }
    },
  });

  const denied = useMemo(() => {
    const queryDenied = getHttpStatus(dashboardQuery.error) === 403;
    return queryDenied || actionDenied;
  }, [actionDenied, dashboardQuery.error]);

  const dashboard = useMemo<DashboardState>(() => {
    if (!hasRole) {
      return {
        status: "error",
        message: "לא ניתן לזהות תפקיד משתמש",
        data: null,
      };
    }

    if (dashboardQuery.isPending) {
      return {
        status: "loading",
        message: "טוען נתוני לוח בקרה...",
        data: null,
      };
    }

    if (dashboardQuery.error) {
      return {
        status: "error",
        message: getErrorMessage(
          dashboardQuery.error,
          "שגיאה בטעינת לוח הבקרה",
        ),
        data: null,
      };
    }

    if (isAdvisor && isOverviewData(dashboardQuery.data)) {
      return {
        status: "ok",
        message: "נתונים נטענו בהצלחה",
        data: { role_view: "advisor", ...dashboardQuery.data },
      };
    }

    if (isSecretary && isSummaryData(dashboardQuery.data)) {
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

  const handleQuickAction = useCallback(
    (action: ActionCommand) => {
      setActionDenied(false);
      handleQuickActionBase(action);
    },
    [handleQuickActionBase],
  );

  const confirmPendingAction = useCallback(async () => {
    setActionDenied(false);
    await confirmPendingActionBase();
  }, [confirmPendingActionBase]);

  const cancelPendingAction = useCallback(() => {
    setActionDenied(false);
    cancelPendingActionBase();
  }, [cancelPendingActionBase]);

  return {
    activeQuickAction,
    attentionItems,
    dashboard,
    denied,
    handleQuickAction,
    confirmPendingAction,
    pendingQuickAction,
    cancelPendingAction,
  };
};
