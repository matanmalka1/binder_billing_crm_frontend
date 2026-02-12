import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { Dashboard } from "../pages/Dashboard";
import { Binders } from "../pages/Binders";
import { Clients } from "../pages/Clients";
import { Search } from "../pages/Search";
import { ClientTimeline } from "../pages/ClientTimeline";
import { Charges } from "../pages/Charges";
import { ChargeDetails } from "../pages/ChargeDetails";
import { Documents } from "../pages/Documents";
import { Login } from "../pages/Login";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageContainer } from "../components/layout/PageContainer";
import { RoleGuard } from "../components/auth/RoleGuard";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="dashboard/overview"
            element={
              <RoleGuard allow={["advisor"]}>
                <Dashboard />
              </RoleGuard>
            }
          />
          <Route path="binders" element={<Binders />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:clientId/timeline" element={<ClientTimeline />} />
          <Route path="search" element={<Search />} />
          <Route path="charges" element={<Charges />} />
          <Route path="charges/:chargeId" element={<ChargeDetails />} />
          <Route path="documents" element={<Documents />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
