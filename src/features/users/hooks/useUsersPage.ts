import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../../api/users.api";
import type { CreateUserPayload, UpdateUserPayload, UserResponse } from "../../../api/users.api";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { parsePositiveInt } from "../../../utils/utils";

const PAGE_SIZE = 20;

export const useUsersPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setPage } = useSearchParamFilters();

  const page = parsePositiveInt(searchParams.get("page"), 1);
  const page_size = parsePositiveInt(searchParams.get("page_size"), PAGE_SIZE);

  const filters = { page, page_size };

  const listQuery = useQuery({
    queryKey: QK.users.list(filters),
    queryFn: () => usersApi.list(filters),
  });

  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      toast.success("משתמש נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.users.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת משתמש"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: number; payload: UpdateUserPayload }) =>
      usersApi.update(userId, payload),
    onSuccess: () => {
      toast.success("פרטי המשתמש עודכנו");
      queryClient.invalidateQueries({ queryKey: QK.users.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון המשתמש"),
  });

  const activateMutation = useMutation({
    mutationFn: (userId: number) => usersApi.activate(userId),
    onSuccess: () => {
      toast.success("המשתמש הופעל בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.users.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בהפעלת המשתמש"),
  });

  const deactivateMutation = useMutation({
    mutationFn: (userId: number) => usersApi.deactivate(userId),
    onSuccess: () => {
      toast.success("המשתמש הושבת בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.users.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בהשבתת המשתמש"),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ userId, newPassword }: { userId: number; newPassword: string }) =>
      usersApi.resetPassword(userId, { new_password: newPassword }),
    onSuccess: () => {
      toast.success("הסיסמה אופסה בהצלחה");
    },
    onError: (err) => showErrorToast(err, "שגיאה באיפוס הסיסמה"),
  });

  const handleFilterChange = (key: string, value: string) => setFilter(key, value);

  return {
    users: listQuery.data?.items ?? [],
    total: listQuery.data?.total ?? 0,
    loading: listQuery.isPending,
    error: listQuery.isError ? "שגיאה בטעינת המשתמשים" : null,
    filters,
    handleFilterChange,
    setPage,

    selectedUser,
    setSelectedUser,
    showAuditLogs,
    setShowAuditLogs,

    createUser: (payload: CreateUserPayload) => createMutation.mutateAsync(payload),
    createLoading: createMutation.isPending,

    updateUser: (userId: number, payload: UpdateUserPayload) =>
      updateMutation.mutateAsync({ userId, payload }),
    updateLoading: updateMutation.isPending,

    activateUser: (userId: number) => activateMutation.mutateAsync(userId),
    activateLoading: activateMutation.isPending,

    deactivateUser: (userId: number) => deactivateMutation.mutateAsync(userId),
    deactivateLoading: deactivateMutation.isPending,

    resetPassword: (userId: number, newPassword: string) =>
      resetPasswordMutation.mutateAsync({ userId, newPassword }),
    resetPasswordLoading: resetPasswordMutation.isPending,
  };
};
