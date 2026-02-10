import { Routes, Route } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { Binders } from "../pages/Binders";
import { Clients } from "../pages/Clients";
import { Login } from "../pages/Login";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageContainer } from "../components/layout/PageContainer";

export const AppRoutes: React.FC = () => {
  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <PageContainer>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/binders" element={<Binders />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </PageContainer>
      </div>
    </div>
  );
};
