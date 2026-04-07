import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, FolderOpen, Bell, FileText, Building2 } from "lucide-react";
import { dashboardApi, dashboardQK } from "../api";
import type {
  DashboardOverviewResponse,
  DashboardSummaryResponse,
} from "../api";
import { getErrorMessage, getHttpStatus } from "../../../utils/utils";
import type { ActionCommand } from "../../../lib/actions/types";
import { useRole } from "../../../hooks/useRole";
import { useActionRunner } from "@/features/actions";
import type { StatItem } from "../components/DashboardStatsGrid";

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
  Boolean(data && !("total_clients" in data));

const buildStats = (
  data: Pick<
    DashboardOverviewResponse,
    | "binders_in_office"
    | "binders_ready_for_pickup"
    | "open_reminders"
    | "vat_due_this_month"
    | "total_clients"
    | "active_clients"
  >,
): StatItem[] => [
  {
    key: "total_clients",
    title: "עסקים",
    value: data.total_clients,
    description: "סך הכל עסקים פעילים",
    icon: Building2,
    variant: "blue",
  },
  {
    key: "active_clients",
    title: "לקוחות",
    value: data.active_clients,
    description: "סך הכל לקוחות פעילים",
    icon: Users,
    variant: "purple",
    href: "/clients",
  },
  {
    key: "in_office",
    title: "קלסרים במשרד",
    value: data.binders_in_office,
    description: "כלל הקלסרים הפעילים",
    icon: FolderOpen,
    variant: "blue",
    href: "/binders?status=in_office",
  },
  {
    key: "ready",
    title: "מוכן לאיסוף",
    value: data.binders_ready_for_pickup,
    description: "ממתינים לאיסוף לקוח",
    icon: Users,
    variant: "green",
    href: "/binders?status=ready_for_pickup",
  },
  {
    key: "open_reminders",
    title: "תזכורות פתוחות",
    value: data.open_reminders,
    description: "תזכורות הממתינות לטיפול",
    icon: Bell,
    variant: "amber",
    urgent: data.open_reminders > 0,
    href: "/reminders",
  },
  {
    key: "vat_due_this_month",
    title: "דוחות מע״מ לחודש",
    value: data.vat_due_this_month,
    description: "טרם הוגשו לחודש הנוכחי",
    icon: FileText,
    variant: data.vat_due_this_month > 0 ? "red" : "green",
    urgent: data.vat_due_this_month > 0,
    href: "/tax/vat",
  },
];

export const useDashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { role, isAdvisor, isSecretary } = useRole();
  const [actionDenied, setActionDenied] = useState(false);
  const hasRole = Boolean(role);
  const dashboardQuery = useQuery<DashboardOverviewResponse | DashboardSummaryResponse>({
    enabled: hasRole,
    queryKey: isAdvisor ? dashboardQK.overview : dashboardQK.summary,
    queryFn: isAdvisor ? dashboardApi.getOverview : dashboardApi.getSummary,
  });

  const {
    activeActionKey: activeQuickAction,
    handleAction: handleQuickActionBase,
    pendingAction: pendingQuickAction,
    confirmPendingAction: confirmPendingActionBase,
    cancelPendingAction: cancelPendingActionBase,
  } = useActionRunner({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dashboardQK.all }),
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

  const stats = useMemo<StatItem[]>(() => {
    if (dashboard.status !== "ok" || !dashboard.data) return [];
    return buildStats(dashboard.data);
  }, [dashboard]);

  const handleQuickAction = useCallback(
    (action: ActionCommand) => {
      setActionDenied(false);
      if (action.method === "get") {
        navigate(action.endpoint);
        return;
      }
      handleQuickActionBase(action);
    },
    [handleQuickActionBase, navigate],
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
    stats,
  };
};
