import { useCallback, useState, useMemo } from "react";
import { useQueries, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { remindersApi, remindersQK } from "../api";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { getErrorMessage, getHttpStatus, parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import type { Reminder } from "../api";
import {
  createReminderSchema,
  type CreateReminderFormValues,
} from "../schemas";
import { useReminderLinkedEntities } from "./useReminderLinkedEntities";
import {
  ACTIVE_REMINDER_STATUSES,
  ACTIVE_REMINDERS_PAGE_SIZE,
  DEFAULT_REMINDER_STATUS_FILTER,
  DUPLICATE_REMINDER_MESSAGE,
  REMINDERS_PAGE_SIZE,
} from "../constants";
import {
  buildReminderPayload,
  filterReminders,
  hasDuplicateReminder,
  makeReminderFormDefaults,
} from "../utils";

export const useReminders = (opts?: { clientId?: number; clientName?: string }) => {
  const clientId = opts?.clientId;
  const queryClient = useQueryClient();
  const { searchParams, setFilter } = useSearchParamFilters();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [markingSentId, setMarkingSentId] = useState<number | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(DEFAULT_REMINDER_STATUS_FILTER);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const page = clientId ? 1 : parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = clientId
    ? REMINDERS_PAGE_SIZE
    : parsePositiveInt(searchParams.get("page_size"), REMINDERS_PAGE_SIZE);

  const form = useForm<CreateReminderFormValues>({
    defaultValues: makeReminderFormDefaults(clientId),
    resolver: zodResolver(createReminderSchema),
  });

  const watchedClientRecordId = form.watch("client_record_id");
  const watchedReminderType = form.watch("reminder_type");
  // When the hook is used with a fixed clientId, use that; otherwise use the form value.
  const activeClientId = clientId ?? (watchedClientRecordId ? Number(watchedClientRecordId) : undefined);

  const linkedEntities = useReminderLinkedEntities(
    activeClientId,
    watchedReminderType,
    showCreateModal,
  );

  const remindersQuery = useQuery({
    queryKey: remindersQK.list(clientId, statusFilter, page, pageSize),
    queryFn: () =>
      remindersApi.list({
        ...(clientId ? { client_record_id: clientId } : {}),
        ...(statusFilter ? { status: statusFilter as import("../api/contracts").ReminderStatus } : {}),
        page,
        page_size: pageSize,
      }),
    enabled: clientId !== 0,
  });

  const pendingCountQuery = useQuery({
    queryKey: remindersQK.count(clientId, DEFAULT_REMINDER_STATUS_FILTER),
    queryFn: () =>
      remindersApi.list({
        ...(clientId ? { client_record_id: clientId } : {}),
        status: DEFAULT_REMINDER_STATUS_FILTER,
        page_size: 1,
      }),
    enabled: clientId !== 0 && statusFilter !== DEFAULT_REMINDER_STATUS_FILTER,
  });

  const sentCountQuery = useQuery({
    queryKey: remindersQK.count(clientId, "sent"),
    queryFn: () =>
      remindersApi.list({
        ...(clientId ? { client_record_id: clientId } : {}),
        status: "sent",
        page_size: 1,
      }),
    enabled: clientId !== 0 && statusFilter !== "sent",
  });

  const pendingCount =
    statusFilter === DEFAULT_REMINDER_STATUS_FILTER
      ? (remindersQuery.data?.total ?? 0)
      : (pendingCountQuery.data?.total ?? 0);

  const sentCount =
    statusFilter === "sent"
      ? (remindersQuery.data?.total ?? 0)
      : (sentCountQuery.data?.total ?? 0);

  const activeReminderQueries = useQueries({
    queries: ACTIVE_REMINDER_STATUSES.map((status) => ({
      queryKey: remindersQK.list(activeClientId, status),
      queryFn: () =>
        remindersApi.list({
          client_record_id: activeClientId,
          status,
          page_size: ACTIVE_REMINDERS_PAGE_SIZE,
        }),
      enabled: showCreateModal && activeClientId != null && activeClientId > 0,
    })),
  });

  const activeReminders = useMemo(
    () => activeReminderQueries.flatMap((query) => query.data?.items ?? []),
    [activeReminderQueries],
  );

  const reminders = useMemo(
    () => filterReminders(remindersQuery.data?.items ?? [], search, typeFilter),
    [remindersQuery.data?.items, search, typeFilter],
  );

  const hasFilters = !!search || !!typeFilter || statusFilter !== DEFAULT_REMINDER_STATUS_FILTER;

  const setPage = useCallback((nextPage: number) => {
    setFilter("page", String(nextPage), false);
  }, [setFilter]);

  const setReminderSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, [setPage]);

  const setReminderTypeFilter = useCallback((value: string) => {
    setTypeFilter(value);
    setPage(1);
  }, [setPage]);

  const setReminderStatusFilter = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, [setPage]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter(DEFAULT_REMINDER_STATUS_FILTER);
    setPage(1);
  };

  const createMutation = useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      toast.success("תזכורת נוצרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: remindersQK.all });
      setShowCreateModal(false);
      form.reset(makeReminderFormDefaults(clientId));
    },
    onError: (err) => {
      if (getHttpStatus(err) === 409) {
        toast.error(DUPLICATE_REMINDER_MESSAGE);
        return;
      }
      showErrorToast(err, "שגיאה ביצירת תזכורת");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: remindersApi.cancel,
    onSuccess: () => {
      toast.success("תזכורת בוטלה");
      queryClient.invalidateQueries({ queryKey: remindersQK.all });
    },
    onError: (error) => showErrorToast(error, "שגיאה בביטול תזכורת"),
    onSettled: () => setCancelingId(null),
  });

  const markSentMutation = useMutation({
    mutationFn: remindersApi.markSent,
    onSuccess: () => {
      toast.success("תזכורת סומנה כנשלחה");
      queryClient.invalidateQueries({ queryKey: remindersQK.all });
    },
    onError: (error) => showErrorToast(error, "שגיאה בסימון התזכורת"),
    onSettled: () => setMarkingSentId(null),
  });

  const onSubmit = form.handleSubmit((values) => {
    if (hasDuplicateReminder(activeReminders, values, clientId)) {
      form.setError("target_date", { type: "manual", message: DUPLICATE_REMINDER_MESSAGE });
      toast.error(DUPLICATE_REMINDER_MESSAGE);
      return;
    }
    void createMutation.mutateAsync(buildReminderPayload(values, clientId));
  });

  const handleCancel = (id: number) => {
    setCancelingId(id);
    void cancelMutation.mutateAsync(id);
  };

  const handleMarkSent = (id: number) => {
    setMarkingSentId(id);
    void markSentMutation.mutateAsync(id);
  };

  return {
    reminders,
    page,
    pageSize,
    rawTotal: remindersQuery.data?.total ?? 0,
    isLoading: remindersQuery.isLoading,
    error: remindersQuery.error
      ? getErrorMessage(remindersQuery.error, "שגיאה בטעינת תזכורות")
      : null,
    statusFilter,
    setStatusFilter: setReminderStatusFilter,
    search,
    setSearch: setReminderSearch,
    typeFilter,
    setTypeFilter: setReminderTypeFilter,
    setPage,
    hasFilters,
    clearFilters,
    pendingCount,
    sentCount,
    showCreateModal,
    setShowCreateModal,
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
    cancelingId,
    handleCancel,
    markingSentId,
    handleMarkSent,
    selectedReminder,
    setSelectedReminder,
    ...linkedEntities,
  };
};
