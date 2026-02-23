import { useMemo, useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { PaginationCard } from "../components/ui/PaginationCard";
import { DataTable } from "../components/ui/DataTable";
import { AccessBanner } from "../components/ui/AccessBanner";
import { Button } from "../components/ui/Button";
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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<UserResponse | null>(null);
  const [resetUser, setResetUser] = useState<UserResponse | null>(null);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<UserResponse | null>(null);

  const {
    users,
    total,
    loading,
    error,
    filters,
    handleFilterChange,
    setPage,
    createUser,
    createLoading,
    updateUser,
    updateLoading,
    activateUser,
    deactivateUser,
    resetPassword,
    resetPasswordLoading,
  } = useUsersPage();

  const handleToggleActive = async (user: UserResponse) => {
    if (pendingToggle?.id === user.id) return;
    setPendingToggle(user);
    try {
      if (user.is_active) {
        await deactivateUser(user.id);
      } else {
        await activateUser(user.id);
      }
    } finally {
      setPendingToggle(null);
    }
  };

  const columns = useMemo(
    () =>
      buildUserColumns({
        onEdit: setEditUser,
        onToggleActive: handleToggleActive,
        onResetPassword: setResetUser,
        currentUserId,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUserId, pendingToggle],
  );

  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / filters.page_size));

  if (!isAdvisor) {
    return (
      <div className="space-y-6">
        <PageHeader title="ניהול משתמשים" description="ניהול חשבונות משתמשים במערכת" />
        <AccessBanner
          variant="warning"
          message="גישה לניהול משתמשים זמינה ליועצים בלבד."
        />
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
            <Button
              variant="outline"
              onClick={() => setShowAuditLogs(true)}
            >
              לוג ביקורת
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
            >
              משתמש חדש
            </Button>
          </div>
        }
      />

      <FilterBar>
        <UsersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </FilterBar>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <DataTable
          data={users}
          columns={columns}
          getRowKey={(user) => user.id}
          isLoading={loading}
          emptyMessage="אין משתמשים להצגה"
        />

        {!loading && users.length > 0 && (
          <PaginationCard
            page={filters.page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            showPageSizeSelect
            pageSize={filters.page_size}
            pageSizeOptions={[20, 50, 100]}
            onPageSizeChange={(pageSize) =>
              handleFilterChange("page_size", String(pageSize))
            }
          />
        )}
      </div>

      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={async (payload) => {
          await createUser(payload);
          setShowCreateModal(false);
        }}
        isLoading={createLoading}
      />

      <EditUserModal
        open={Boolean(editUser)}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSubmit={async (userId, payload) => {
          await updateUser(userId, payload);
          setEditUser(null);
        }}
        isLoading={updateLoading}
      />

      <ResetPasswordModal
        open={Boolean(resetUser)}
        user={resetUser}
        onClose={() => setResetUser(null)}
        onSubmit={async (userId, newPassword) => {
          await resetPassword(userId, newPassword);
          setResetUser(null);
        }}
        isLoading={resetPasswordLoading}
      />

      <AuditLogsDrawer
        open={showAuditLogs}
        onClose={() => setShowAuditLogs(false)}
      />
    </div>
  );
};
