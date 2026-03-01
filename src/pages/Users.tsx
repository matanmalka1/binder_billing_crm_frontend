import { useMemo, useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { InlineToolbar } from "../components/ui/InlineToolbar";
import { PaginationCard } from "../components/ui/PaginationCard";
import { DataTable } from "../components/ui/DataTable";
import { AccessBanner } from "../components/ui/AccessBanner";
import { ErrorCard } from "../components/ui/ErrorCard";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { useRole } from "../hooks/useRole";
import { useAuthStore } from "../store/auth.store";
import { useUsersPage } from "../features/users/hooks/useUsersPage";
import { buildUserColumns } from "../features/users/components/usersColumns";
import { UsersFiltersBar } from "../features/users/components/UsersFiltersBar";
import { CreateUserModal } from "../features/users/components/CreateUserModal";
import { EditUserModal } from "../features/users/components/EditUserModal";
import { ResetPasswordModal } from "../features/users/components/ResetPasswordModal";
import { AuditLogsDrawer } from "../features/users/components/AuditLogsDrawer";
import type { UserResponse } from "../api/users.api";

export const Users: React.FC = () => {
  const { isAdvisor } = useRole();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [pendingToggle, setPendingToggle] = useState<UserResponse | null>(null);

  const {
    users, total, loading, error, filters,
    handleFilterChange, setPage,
    editUser, setEditUser,
    resetUser, setResetUser,
    showCreateModal, setShowCreateModal,
    showAuditLogs, setShowAuditLogs,
    createUser, createLoading,
    updateUser, updateLoading,
    toggleActive, toggleActiveLoading,
    resetPassword, resetPasswordLoading,
  } = useUsersPage();

  const columns = useMemo(
    () => buildUserColumns({
      onEdit: setEditUser,
      onToggleActive: (user) => setPendingToggle(user),
      onResetPassword: setResetUser,
      currentUserId,
    }),
    [setEditUser, setResetUser, currentUserId],
  );

  const filteredUsers = useMemo(() => {
    if (filters.is_active === "true") return users.filter((u) => u.is_active);
    if (filters.is_active === "false") return users.filter((u) => !u.is_active);
    return users;
  }, [users, filters.is_active]);

  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / filters.page_size));

  if (!isAdvisor) {
    return (
      <div className="space-y-6">
        <PageHeader title="ניהול משתמשים" description="ניהול חשבונות משתמשים במערכת" />
        <AccessBanner variant="warning" message="גישה לניהול משתמשים זמינה ליועצים בלבד." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="ניהול משתמשים"
        description="ניהול חשבונות משתמשים, תפקידים והרשאות"
        variant="gradient"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowAuditLogs(true)}>לוג ביקורת</Button>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>משתמש חדש</Button>
          </div>
        }
      />

      <InlineToolbar>
        <UsersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </InlineToolbar>

      {error && <ErrorCard message={error} />}

      <DataTable
        data={filteredUsers}
        columns={columns}
        getRowKey={(user) => user.id}
        isLoading={loading}
        emptyState={{
          title: "אין משתמשים להצגה",
          message: "לא נמצאו משתמשים. הוסף משתמש חדש למערכת.",
          action: { label: "משתמש חדש", onClick: () => setShowCreateModal(true) },
        }}
      />

      {!loading && filteredUsers.length > 0 && (
        <PaginationCard
          page={filters.page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
          showPageSizeSelect
          pageSize={filters.page_size}
          pageSizeOptions={[20, 50, 100]}
          onPageSizeChange={(size) => handleFilterChange("page_size", String(size))}
        />
      )}

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

      <AuditLogsDrawer
        open={showAuditLogs}
        onClose={() => setShowAuditLogs(false)}
      />

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
