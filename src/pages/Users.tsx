import { useMemo } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { InlineToolbar } from "../components/ui/InlineToolbar";
import { PaginationCard } from "../components/ui/PaginationCard";
import { DataTable } from "../components/ui/DataTable";
import { AccessBanner } from "../components/ui/AccessBanner";
import { ErrorCard } from "../components/ui/ErrorCard";
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

export const Users: React.FC = () => {
  const { isAdvisor } = useRole();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const {
    users, total, loading, error, filters,
    handleFilterChange, setPage,
    editUser, setEditUser,
    resetUser, setResetUser,
    showCreateModal, setShowCreateModal,
    showAuditLogs, setShowAuditLogs,
    createUser, createLoading,
    updateUser, updateLoading,
    toggleActive,
    resetPassword, resetPasswordLoading,
  } = useUsersPage();

  const columns = useMemo(
    () => buildUserColumns({
      onEdit: setEditUser,
      onToggleActive: toggleActive,
      onResetPassword: setResetUser,
      currentUserId,
    }),
    [setEditUser, toggleActive, setResetUser, currentUserId],
  );

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
        data={users}
        columns={columns}
        getRowKey={(user) => user.id}
        isLoading={loading}
        emptyState={{
          title: "אין משתמשים להצגה",
          message: "לא נמצאו משתמשים. הוסף משתמש חדש למערכת.",
          action: { label: "משתמש חדש", onClick: () => setShowCreateModal(true) },
        }}
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
    </div>
  );
};