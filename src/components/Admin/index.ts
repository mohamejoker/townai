// تصدير مركزي لجميع مكونات الإدارة

// Layout Components
export { default as AdminLayout } from "./AdminLayout";
export { default as AdminHeader } from "./AdminHeader";
export { default as AdminSidebar } from "./AdminSidebar";

// Dashboard Components
export { default as EnhancedDashboard } from "./EnhancedDashboard";
export { default as AdminMetricsGrid } from "./AdminMetricsGrid";
export { default as AdminControlCenter } from "./AdminControlCenter";

// Management Components
export { default as UserManagement } from "./UserManagement";
export { default as ServicesManager } from "./ServicesManager";
export { default as OrdersManager } from "./OrdersManager";
export { default as ProvidersManager } from "./ProvidersManager";

// Payment Components
export { default as PaymentsDashboard } from "./PaymentsDashboard";
export { default as PaymentMethodsManager } from "./PaymentMethodsManager";
export { default as EgyptianPaymentManager } from "./EgyptianPaymentManager";

// System Components
export { default as SystemDiagnostics } from "./SystemDiagnostics";
export { default as SystemMonitoring } from "./SystemMonitoring";
export { default as SystemSettings } from "./SystemSettings";

// Theme & UI Components
export { default as ThemeManager } from "./ThemeManager";
export { default as ThemeControlPanel } from "./ThemeControlPanel";
export { default as UISettingsPanel } from "./UISettingsPanel";

// Advanced Features
export { default as AdvancedAdminControls } from "./AdvancedAdminControls";
export { default as AdvancedUserManagement } from "./AdvancedUserManagement";
export { default as AdvancedReportsManager } from "./AdvancedReportsManager";

// Analytics & Reports
export { default as AnalyticsPanel } from "./AnalyticsPanel";
export { default as PerformancePanel } from "./PerformancePanel";
export { default as SecurityPanel } from "./SecurityPanel";

// Automation & Tools
export { default as AutomationManager } from "./AutomationManager";
export { default as LiveCSSEditor } from "./LiveCSSEditor";
export { default as VisualPageBuilder } from "./VisualPageBuilder";
export { default as ComponentExporter } from "./ComponentExporter";

// Specialized Modules
export * from "./Dashboard";
export * from "./NotificationSystem";
export * from "./Orders";
export * from "./Payments";
export * from "./Providers";
export * from "./RoleManagement";
export * from "./Services";
export * from "./SystemMaintenance";
export * from "./SystemSettings";
export * from "./ThemeManager";
export * from "./UISettings";
export * from "./UserManagement";
export * from "./Users";
