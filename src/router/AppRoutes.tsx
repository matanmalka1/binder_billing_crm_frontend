import { Routes, Route, Navigate } from "react-router-dom";
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
import { GlobalToast } from "../components/ui/GlobalToast";
import { RoleGuard } from "../components/auth/RoleGuard";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <GlobalToast />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/overview"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <RoleGuard allow={["advisor"]}>
                <Dashboard />
              </RoleGuard>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/binders"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Binders />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Clients />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients/:clientId/timeline"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ClientTimeline />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Search />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/charges"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Charges />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/charges/:chargeId"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ChargeDetails />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Documents />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
