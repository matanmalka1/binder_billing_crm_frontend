import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/overlays/Alert";
import { Button } from "@/components/ui/primitives/Button";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { PaginatedDataTable } from "@/components/ui/table/PaginatedDataTable";
import { useAuthStore } from "@/store/auth.store";
import {
  AuditLogsDrawer,
  buildUserColumns,
  CreateUserModal,
  EditUserModal,
  ResetPasswordModal,
  useUsersPage,
  type UserResponse,
  UsersFiltersBar,
} from "@/features/users";

export const Users: React.FC = () => {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [pendingToggle, setPendingToggle] = useState<UserResponse | null>(null);
  const {
    users,
    total,
    loading,
    error,
    filters,
    handleFilterChange,
    setPage,
    editUser,
    setEditUser,
    resetUser,
    setResetUser,
    showCreateModal,
    setShowCreateModal,
    showAuditLogs,
    setShowAuditLogs,
    createUser,
    createLoading,
    updateUser,
    updateLoading,
    toggleActive,
    toggleActiveLoading,
    resetPassword,
    resetPasswordLoading,
    isAdvisor,
  } = useUsersPage();
  const columns = useMemo(
    () =>
      buildUserColumns({
        onEdit: setEditUser,
        onToggleActive: (user) => setPendingToggle(user),
        onResetPassword: setResetUser,
        currentUserId,
      }),
    [setEditUser, setResetUser, currentUserId],
  );

  if (!isAdvisor) {
    return (
      <div className="space-y-6">
        <PageHeader title="ניהול משתמשים" description="ניהול חשבונות משתמשים במערכת" />
        <Alert variant="warning" message="גישה לניהול משתמשים זמינה ליועצים בלבד." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="ניהול משתמשים"
        description="ניהול חשבונות משתמשים, תפקידים והרשאות"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowAuditLogs(true)}>
              לוג ביקורת
            </Button>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              משתמש חדש
            </Button>
          </div>
        }
      />
      <UsersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      <PaginatedDataTable
        data={users}
        columns={columns}
        getRowKey={(user) => user.id}
        isLoading={loading}
        error={error}
        page={filters.page}
        pageSize={filters.page_size}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => handleFilterChange("page_size", String(size))}
        emptyState={{
          title: "אין משתמשים להצגה",
          message: "לא נמצאו משתמשים. הוסף משתמש חדש למערכת.",
          action: { label: "משתמש חדש", onClick: () => setShowCreateModal(true) },
        }}
      />
      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createUser}
        isLoading={createLoading}
      />
      <EditUserModal
        open={Boolean(editUser)}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSubmit={updateUser}
        isLoading={updateLoading}
      />
      <ResetPasswordModal
        open={Boolean(resetUser)}
        user={resetUser}
        onClose={() => setResetUser(null)}
        onSubmit={resetPassword}
        isLoading={resetPasswordLoading}
      />
      <AuditLogsDrawer open={showAuditLogs} onClose={() => setShowAuditLogs(false)} />
      <ConfirmDialog
        open={Boolean(pendingToggle)}
        title={pendingToggle?.is_active ? "השבתת משתמש" : "הפעלת משתמש"}
        message={
          pendingToggle?.is_active
            ? `האם להשבית את המשתמש ${pendingToggle?.full_name}? המשתמש לא יוכל להתחבר למערכת.`
            : `האם להפעיל את המשתמש ${pendingToggle?.full_name}?`
        }
        confirmLabel={pendingToggle?.is_active ? "השבת" : "הפעל"}
        cancelLabel="ביטול"
        isLoading={toggleActiveLoading}
        onConfirm={() => {
          if (pendingToggle) {
            toggleActive(pendingToggle);
            setPendingToggle(null);
          }
        }}
        onCancel={() => setPendingToggle(null)}
      />
    </div>
  );
};
