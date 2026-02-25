import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { AUTH_EXPIRED_EVENT } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { selectIsAuthenticated } from "../store/auth.selectors";
import { Dashboard } from "../pages/Dashboard";
import { Binders } from "../pages/Binders";
import { Clients } from "../pages/Clients";
import { ClientDetails } from "../pages/ClientDetails";
import { Search } from "../pages/Search";
import { Charges } from "../pages/Charges";
import { AnnualReportsKanban } from "../pages/AnnualReportsKanban";
import { TaxDeadlines } from "../pages/TaxDeadlines";
import { Login } from "../pages/Login";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageLayout } from "../components/layout/PageLayout";
import { RemindersPage } from "../pages/reports/Reminders";
import { SignatureRequestsPage } from "../pages/reports/SignatureRequests";
import { AgingReport } from "../pages/reports/AgingReport";
import { AdvancePayments } from "../pages/tax/AdvancePayments";
import { VatWorkItems } from "../pages/tax/VatWorkItems";
import { Users } from "../pages/Users";
import { SigningPage } from "../pages/SigningPage";

const AuthExpiredNavigationHandler: React.FC = () => {
  const navigate = useNavigate();
  const resetSession = useAuthStore((s) => s.resetSession);
  const navigateRef = useRef(navigate);

  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  useEffect(() => {
    const handleAuthExpired = () => {
      resetSession();
      if (!window.location.pathname.startsWith("/login")) {
        navigateRef.current("/login", { replace: true });
      }
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [resetSession]);

  return null;
};

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const AuthenticatedLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <PageLayout><Outlet /></PageLayout>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <>
      <AuthExpiredNavigationHandler />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="binders" element={<Binders />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:clientId" element={<ClientDetails />} />
            <Route path="search" element={<Search />} />
            <Route path="charges" element={<Charges />} />
            <Route path="tax" element={<Navigate to="/tax/deadlines" replace />} />
            <Route path="tax/reports" element={<AnnualReportsKanban />} />
            <Route path="tax/deadlines" element={<TaxDeadlines />} />
            <Route path="tax/advance-payments" element={<AdvancePayments />} />
            <Route path="tax/vat" element={<VatWorkItems />} />
            <Route path="reports/aging" element={<AgingReport />} />
            <Route path="reports/reminders" element={<RemindersPage />} />
            <Route path="reports/signature-requests" element={<SignatureRequestsPage />} />
            <Route path="settings/users" element={<Users />} />
          </Route>
        </Route>

        <Route path="/sign/:token" element={<SigningPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};