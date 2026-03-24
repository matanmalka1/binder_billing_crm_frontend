import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { AUTH_EXPIRED_EVENT } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { selectIsAuthenticated } from "../store/auth.selectors";
import { Login } from "../features/auth";
import { AnnualReportDetail, AnnualReportsKanban } from "../features/annualReports";
import { AdvancePayments } from "../features/advancedPayments";
import { Binders } from "../features/binders";
import { Charges } from "../features/charges";
import { ClientDetails, Clients } from "../features/clients";
import { BusinessDetails } from "../features/businesses";
import { Dashboard } from "../features/dashboard";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { PageLayout } from "../components/layout/PageLayout";
import { RemindersPage } from "../features/reminders";
import { Search } from "../features/search";
import { SignatureRequestsPage } from "../features/signatureRequests";
import { SigningPage } from "../features/signing";
import { TaxDeadlines } from "../features/taxDeadlines";
import { Users } from "../features/users";
import { VatWorkItemDetail, VatWorkItems } from "../features/vatReports";

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
        <Navbar toggleSidebar={toggleSidebar} />
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
            <Route path="clients/:clientId/businesses/:businessId" element={<BusinessDetails />} />
            <Route path="clients/:clientId/businesses/:businessId/documents" element={<BusinessDetails initialTab="documents" />} />
            <Route path="clients/:clientId/businesses/:businessId/timeline" element={<BusinessDetails initialTab="timeline" />} />
            <Route path="clients/:clientId/businesses/:businessId/vat" element={<BusinessDetails initialTab="vat" />} />
            <Route path="clients/:clientId/businesses/:businessId/advance-payments" element={<BusinessDetails initialTab="advance-payments" />} />
            <Route path="clients/:clientId/businesses/:businessId/deadlines" element={<BusinessDetails initialTab="deadlines" />} />
            <Route path="clients/:clientId/businesses/:businessId/annual-reports" element={<BusinessDetails initialTab="annual-reports" />} />
            <Route path="search" element={<Search />} />
            <Route path="charges" element={<Charges />} />
            <Route path="tax" element={<Navigate to="/tax/deadlines" replace />} />
            <Route path="tax/reports" element={<AnnualReportsKanban />} />
            <Route path="tax/reports/:reportId" element={<AnnualReportDetail />} />
            <Route path="tax/deadlines" element={<TaxDeadlines />} />
            <Route path="tax/advance-payments" element={<AdvancePayments />} />
            <Route path="tax/vat" element={<VatWorkItems />} />
            <Route path="tax/vat/:id" element={<VatWorkItemDetail />} />
            <Route path="reports/advance-payments" element={<Navigate to="/tax/advance-payments?tab=report" replace />} />
            <Route path="reports/aging" element={<Navigate to="/charges?tab=aging" replace />} />
            <Route path="reports/annual-reports" element={<Navigate to="/tax/reports?tab=status" replace />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="signature-requests" element={<SignatureRequestsPage />} />
            <Route path="settings/users" element={<Users />} />
          </Route>
        </Route>

        <Route path="/sign/:token" element={<SigningPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
