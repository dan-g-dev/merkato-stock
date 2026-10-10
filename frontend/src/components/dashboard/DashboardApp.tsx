import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LoadingSpinner } from "./ui/Ui";
import { LoginScreen } from "./LoginScreen";
import { DashboardLayout, DashboardPageKey } from "./DashboardLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { SuppliersPage } from "./pages/SuppliersPage";
import { PurchasesPage } from "./pages/PurchasesPage";
import { SalesPage } from "./pages/SalesPage";
import { CustomersPage } from "./pages/CustomersPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ReportsPage } from "./pages/ReportsPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { ActivityLogPage } from "./pages/ActivityLogPage";

interface DashboardAppProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBackToHome: () => void;
}

// This is the component App.tsx mounts for currentView === "dashboard".
// It expects an <AuthProvider> and <ToastProvider> further up the tree
// (App.tsx provides both) so the landing page's sign-in modal and this
// dashboard share exactly one session.
export const DashboardApp: React.FC<DashboardAppProps> = ({ isDarkMode, onToggleDarkMode, onBackToHome }) => {
  const { user, isLoading } = useAuth();
  const [activePage, setActivePage] = useState<DashboardPageKey>("overview");

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <LoadingSpinner label="Loading Merkato Stock..." />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen isDarkMode={isDarkMode} onBackToHome={onBackToHome} />;
  }

  const pages: Record<DashboardPageKey, React.ReactNode> = {
    overview: <OverviewPage />,
    products: <ProductsPage />,
    categories: <CategoriesPage />,
    suppliers: <SuppliersPage />,
    purchases: <PurchasesPage />,
    sales: <SalesPage />,
    customers: <CustomersPage />,
    inventory: <InventoryPage />,
    reports: <ReportsPage />,
    employees: <EmployeesPage />,
    activity: <ActivityLogPage />,
  };

  return (
    <DashboardLayout
      isDarkMode={isDarkMode}
      onToggleDarkMode={onToggleDarkMode}
      onBackToHome={onBackToHome}
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {pages[activePage]}
    </DashboardLayout>
  );
};
