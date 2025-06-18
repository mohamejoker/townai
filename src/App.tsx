import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import LandingPage from "@/pages/LandingPage";
import EnhancedLandingPage from "@/pages/EnhancedLandingPage";
import EnhancedServicesPage from "@/pages/EnhancedServicesPage";
import AIChatPage from "@/pages/AIChatPage";
import SiteBuilderPage from "@/pages/SiteBuilderPage";
import TestLoginPage from "@/pages/TestLoginPage";
import SystemTestPage from "@/pages/SystemTestPage";
import {
  AdminDashboardPage,
  TestDashboardPage,
  UsersPage,
  ServicesPage,
  OrdersPage,
  SettingsPage,
} from "@/pages/admin";
import { PaymentsDashboard } from "@/components/Admin";
import {
  SystemDiagnosticsPage,
  SystemHealthPage,
  PerformancePage,
  MonitoringPage,
  MaintenancePage,
} from "@/pages/admin";
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
import JobsPage from "@/pages/JobsPage";
import JobsAdminPage from "@/pages/admin/JobsAdminPage";
import SystemHealthDetailedPage from "@/pages/admin/SystemHealthDetailedPage";
import ErrorBoundaryWrapper from "@/components/Common/ErrorBoundaryWrapper";
import { PageLoading } from "@/components/Common/LoadingStates";
import AdminLayout from "@/components/Admin/AdminLayout";
import FloatingAIButton from "@/components/AI/FloatingAIButton";
import DevAuthControls from "@/components/Common/DevAuthControls";
import NotificationSystem from "@/components/Common/NotificationSystem";
import KeyboardShortcuts from "@/components/Common/KeyboardShortcuts";
import LiveStats from "@/components/Common/LiveStats";
import EnhancedProgressBar from "@/components/Common/EnhancedProgressBar";
import InteractiveTour from "@/components/Common/InteractiveTour";
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
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {/* شريط التقدم المحسن */}
              <EnhancedProgressBar />
              <div className="min-h-screen w-full">
                <Suspense
                  fallback={<PageLoading message="جاري تحميل الصفحة..." />}
                >
                  <Routes>
                    {/* الصفحة الرئيسية */}
                    <Route path="/" element={<EnhancedLandingPage />} />
                    <Route path="/simple" element={<LandingPage />} />

                    {/* صفحات المصادقة */}
                    <Route path="/login" element={<TestLoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* الخدمات العامة */}
                    <Route
                      path="/services"
                      element={<EnhancedServicesPage />}
                    />
                    <Route
                      path="/services-old"
                      element={<ServicesOverview />}
                    />
                    <Route path="/ai-chat" element={<AIChatPage />} />
                    <Route path="/site-builder" element={<SiteBuilderPage />} />
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/test" element={<SystemTestPage />} />

                    {/* صفحة المستخدم المحمية */}
                    <Route
                      path="/user-dashboard"
                      element={
                        <ProtectedRoute>
                          <div className="min-h-screen bg-gray-50 p-6">
                            <div className="max-w-6xl mx-auto">
                              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                                لوحة تحكم المستخدم
                              </h1>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow">
                                  <h2 className="text-xl font-semibold mb-4">
                                    طلباتي
                                  </h2>
                                  <p className="text-gray-600">
                                    مشاهدة وإدارة طلباتك
                                  </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow">
                                  <h2 className="text-xl font-semibold mb-4">
                                    محادثات الذكاء الاصطناعي
                                  </h2>
                                  <p className="text-gray-600">
                                    تاريخ محادثاتك مع AI
                                  </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow">
                                  <h2 className="text-xl font-semibold mb-4">
                                    الإعدادات
                                  </h2>
                                  <p className="text-gray-600">
                                    إدارة حسابك وتفضيلاتك
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ProtectedRoute>
                      }
                    />

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
                      <Route index element={<TestDashboardPage />} />
                      <Route
                        path="dashboard"
                        element={<AdminDashboardPage />}
                      />
                      <Route path="users" element={<UsersPage />} />
                      <Route path="services" element={<ServicesPage />} />
                      <Route path="jobs" element={<JobsAdminPage />} />
                      <Route path="orders" element={<OrdersPage />} />
                      <Route
                        path="orders-management"
                        element={<OrdersManagement />}
                      />
                      <Route path="providers" element={<ProvidersPage />} />
                      <Route
                        path="payment-methods"
                        element={<PaymentMethodsPage />}
                      />
                      <Route path="payments" element={<PaymentsDashboard />} />
                      <Route path="reports" element={<ReportsPage />} />
                      <Route path="analytics" element={<AdvancedAnalytics />} />
                      <Route
                        path="notifications"
                        element={<NotificationsHub />}
                      />
                      <Route path="theme" element={<ThemeControlPage />} />
                      <Route path="ui" element={<UIPage />} />
                      <Route
                        path="advanced-controls"
                        element={<AdvancedAdminControls />}
                      />
                      <Route
                        path="diagnostics"
                        element={<SystemDiagnosticsPage />}
                      />
                      <Route path="monitoring" element={<MonitoringPage />} />
                      <Route path="maintenance" element={<MaintenancePage />} />
                      <Route path="health" element={<SystemHealthPage />} />
                      <Route
                        path="health-detailed"
                        element={<SystemHealthDetailedPage />}
                      />
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

                {/* أدوات التطوير */}
                <DevAuthControls />

                {/* نظام الإشعارات */}
                <NotificationSystem />

                {/* اختصارات لوحة المفاتيح */}
                <KeyboardShortcuts />

                {/* إحصائيات مباشرة */}
                <LiveStats />

                {/* الجولة التفاعلية */}
                <InteractiveTour />
              </div>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
