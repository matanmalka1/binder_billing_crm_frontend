import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { AUTH_EXPIRED_EVENT } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { Dashboard } from "../pages/Dashboard";
import { Binders } from "../pages/Binders";
import { Clients } from "../pages/Clients";
import { ClientDetails } from "../pages/ClientDetails";
import { Search } from "../pages/Search";
import { ClientTimeline } from "../pages/ClientTimeline";
import { Charges } from "../pages/Charges";
import { ChargeDetails } from "../pages/ChargeDetails";
import { Documents } from "../pages/Documents";
import { TaxDashboard } from "../pages/TaxDashboard";
import { AnnualReportsKanban } from "../pages/AnnualReportsKanban";
import { TaxDeadlines } from "../pages/TaxDeadlines";
import { Login } from "../pages/Login";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageLayout } from "../components/layout/PageLayout";
import { AgingReportPage } from "../pages/reports/AgingReport";
import { RemindersPage } from "../pages/reports/Reminders";
import { ExcelImportExportPage } from "../pages/reports/ExcelImportExportPage";

const AuthExpiredNavigationHandler: React.FC = () => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    const handleAuthExpired = () => {
      if (!window.location.pathname.startsWith("/login")) {
        navigateRef.current("/login", { replace: true });
      }
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  return null;
};

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
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
        <PageLayout>
          <Outlet />
        </PageLayout>
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
            <Route path="clients/:clientId/timeline" element={<ClientTimeline />} />
            <Route path="search" element={<Search />} />
            <Route path="charges" element={<Charges />} />
            <Route path="charges/:chargeId" element={<ChargeDetails />} />
            <Route path="documents" element={<Documents />} />
            <Route path="tax" element={<TaxDashboard />} />
            <Route path="tax/reports" element={<AnnualReportsKanban />} />
            <Route path="tax/deadlines" element={<TaxDeadlines />} />
            <Route path="reports/aging" element={<AgingReportPage />} />
            <Route path="reports/reminders" element={<RemindersPage />} />
            <Route path="reports/import-export" element={<ExcelImportExportPage entityType="clients" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
