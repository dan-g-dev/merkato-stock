import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  ShoppingCart,
  Receipt,
  Users,
  UserCog,
  BarChart3,
  History,
  Bell,
  Moon,
  Sun,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { MerkatoLogo } from "../common/MerkatoLogo";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import type { AppNotification, Role } from "../../types";

export type DashboardPageKey =
  | "overview"
  | "products"
  | "categories"
  | "suppliers"
  | "purchases"
  | "sales"
  | "customers"
  | "inventory"
  | "reports"
  | "employees"
  | "activity";

interface NavItem {
  key: DashboardPageKey;
  label: string;
  icon: React.ElementType;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { key: "products", label: "Products", icon: Package, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { key: "categories", label: "Categories", icon: Tags, roles: ["ADMIN", "MANAGER"] },
  { key: "sales", label: "Sales", icon: Receipt, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { key: "purchases", label: "Purchases", icon: ShoppingCart, roles: ["ADMIN", "MANAGER"] },
  { key: "inventory", label: "Inventory", icon: Package, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { key: "suppliers", label: "Suppliers", icon: Truck, roles: ["ADMIN", "MANAGER"] },
  { key: "customers", label: "Customers", icon: Users, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { key: "reports", label: "Reports", icon: BarChart3, roles: ["ADMIN", "MANAGER"] },
  { key: "employees", label: "Employees", icon: UserCog, roles: ["ADMIN"] },
  { key: "activity", label: "Activity Log", icon: History, roles: ["ADMIN", "MANAGER"] },
];

export const DashboardLayout: React.FC<{
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBackToHome: () => void;
  activePage: DashboardPageKey;
  onNavigate: (page: DashboardPageKey) => void;
  children: React.ReactNode;
}> = ({ isDarkMode, onToggleDarkMode, onBackToHome, activePage, onNavigate, children }) => {
  const { user, logout, hasRole } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const visibleNavItems = NAV_ITEMS.filter((item) => hasRole(...item.roles));
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    api
      .get("/notifications")
      .then((res) => setNotifications(res.notifications))
      .catch(() => {});
  }, [activePage]);

  const markAllRead = async () => {
    await api.put("/notifications/read-all").catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"}`}>
      {/* Sidebar - desktop */}
      <aside className={`hidden lg:flex flex-col w-60 shrink-0 border-r ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
        <SidebarContent
          isDarkMode={isDarkMode}
          visibleNavItems={visibleNavItems}
          activePage={activePage}
          onNavigate={onNavigate}
          onBackToHome={onBackToHome}
        />
      </aside>

      {/* Sidebar - mobile drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileNavOpen(false)} />
          <aside className={`relative w-64 h-full flex flex-col ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
            <button onClick={() => setIsMobileNavOpen(false)} className="absolute top-3 right-3 p-1.5 text-zinc-400">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent
              isDarkMode={isDarkMode}
              visibleNavItems={visibleNavItems}
              activePage={activePage}
              onNavigate={(page) => {
                onNavigate(page);
                setIsMobileNavOpen(false);
              }}
              onBackToHome={onBackToHome}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className={`h-16 flex items-center justify-between px-4 sm:px-6 border-b shrink-0 ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setIsMobileNavOpen(true)} className="lg:hidden p-1.5 -ml-1.5 text-zinc-500">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-black text-sm sm:text-base capitalize truncate">{NAV_ITEMS.find((n) => n.key === activePage)?.label}</h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen((v) => !v)}
                className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <div className={`absolute right-0 mt-2 w-72 rounded-xl border shadow-xl z-40 overflow-hidden ${isDarkMode ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-200"}`}>
                  <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs font-black">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[11px] font-bold text-red-500 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-zinc-400 text-center py-6">No notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`px-3.5 py-2.5 text-xs border-b border-zinc-100 dark:border-zinc-800 ${!n.is_read ? "font-semibold" : "text-zinc-500"}`}>
                          {n.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={onToggleDarkMode} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <div className="hidden sm:flex flex-col items-end leading-tight pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold">{user?.name}</span>
              <span className="text-[10px] text-zinc-400 font-semibold">{user?.role}</span>
            </div>
            <button onClick={logout} title="Sign out" className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

const SidebarContent: React.FC<{
  isDarkMode: boolean;
  visibleNavItems: NavItem[];
  activePage: DashboardPageKey;
  onNavigate: (page: DashboardPageKey) => void;
  onBackToHome: () => void;
}> = ({ isDarkMode, visibleNavItems, activePage, onNavigate, onBackToHome }) => (
  <>
    <div className="h-16 flex items-center px-5 border-b border-zinc-100 dark:border-zinc-800">
      <MerkatoLogo isDark={isDarkMode} size="md" />
    </div>
    <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
      {visibleNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              isActive
                ? "bg-red-50 text-[#E42528] dark:bg-red-950/40"
                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </button>
        );
      })}
    </nav>
    <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
      <button
        onClick={onBackToHome}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <ArrowLeft className="w-4 h-4" /> Back to homepage
      </button>
    </div>
  </>
);
