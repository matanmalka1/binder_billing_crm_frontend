import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { Dashboard } from '../pages/Dashboard';
import { Binders } from '../pages/Binders';
import { Clients } from '../pages/Clients';
import { Search } from '../pages/Search';
import { ClientTimeline } from '../pages/ClientTimeline';
import { Login } from '../pages/Login';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { PageContainer } from '../components/layout/PageContainer';
import { GlobalToast } from '../components/ui/GlobalToast';

// Protected Route wrapper
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

// Authenticated Layout
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
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
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

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
