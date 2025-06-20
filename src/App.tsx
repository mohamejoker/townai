
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import UsersPage from "@/pages/admin/UsersPage";
import ServicesPage from "@/pages/admin/ServicesPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import PaymentsDashboard from "@/components/Admin/PaymentsDashboard";
import SystemDiagnosticsPage from "@/pages/admin/SystemDiagnosticsPage";
import SystemHealthPage from "@/pages/admin/SystemHealthPage";
import PerformancePage from "@/pages/admin/PerformancePage";
import MonitoringPage from "@/pages/admin/MonitoringPage";
import MaintenancePage from "@/pages/admin/MaintenancePage";
import ServicesOverview from "@/components/Services/ServicesOverview";
import OrdersManagement from "@/components/Orders/OrdersManagement";
import NotificationsHub from "@/components/Notifications/NotificationsHub";
import AdvancedAnalytics from "@/components/Analytics/AdvancedAnalytics";
import AdvancedAdminControls from "@/components/Admin/AdvancedAdminControls";
import ProvidersPage from "@/pages/admin/ProvidersPage";
import PaymentMethodsPage from "@/pages/admin/PaymentMethodsPage";
import ThemeControlPage from "@/pages/admin/ThemeControlPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import UIPage from "@/pages/admin/UIPage";
import ErrorBoundaryWrapper from "@/components/Common/ErrorBoundaryWrapper";
import { PageLoading } from "@/components/Common/LoadingStates";
import AdminLayout from "@/components/Admin/AdminLayout";
import FloatingAIButton from "@/components/AI/FloatingAIButton";
import { Suspense } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen w-full">
              <Suspense fallback={<PageLoading message="جاري تحميل الصفحة..." />}>
                <Routes>
                  {/* الصفحة الرئيسية */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* صفحات المصادقة */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* الخدمات العامة */}
                  <Route path="/services" element={<ServicesOverview />} />

                  {/* المسارات الإدارية */}
                  <Route
                    path="/admin"
                    element={
                      <ErrorBoundaryWrapper context="Admin Layout">
                        <ProtectedRoute requiredRole="admin">
                          <AdminLayout />
                        </ProtectedRoute>
                      </ErrorBoundaryWrapper>
                    }
                  >
                    <Route index element={<DashboardPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="orders-management" element={<OrdersManagement />} />
                    <Route path="providers" element={<ProvidersPage />} />
                    <Route path="payment-methods" element={<PaymentMethodsPage />} />
                    <Route path="payments" element={<PaymentsDashboard />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="analytics" element={<AdvancedAnalytics />} />
                    <Route path="notifications" element={<NotificationsHub />} />
                    <Route path="theme" element={<ThemeControlPage />} />
                    <Route path="ui" element={<UIPage />} />
                    <Route path="advanced-controls" element={<AdvancedAdminControls />} />
                    <Route path="diagnostics" element={<SystemDiagnosticsPage />} />
                    <Route path="monitoring" element={<MonitoringPage />} />
                    <Route path="maintenance" element={<MaintenancePage />} />
                    <Route path="health" element={<SystemHealthPage />} />
                    <Route path="performance" element={<PerformancePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  {/* إعادة توجيه للمسارات القديمة */}
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  
                  {/* مسار افتراضي */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
              
              {/* زر الذكاء الاصطناعي العائم */}
              <FloatingAIButton />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
