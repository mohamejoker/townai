// Hooks مشتركة عبر التطبيق

// Authentication Hooks
export { useAuth } from "../../contexts/AuthContext";
export { useRoleAuth } from "../../hooks/useRoleAuth";
export { useDevAuth } from "../../hooks/useDevAuth";
export { useSupabaseAuth } from "../../hooks/useSupabaseAuth";

// UI Hooks
export { useMobile } from "../../hooks/use-mobile";
export { useToast } from "../../hooks/use-toast";
export { useTheme } from "../../hooks/useTheme";

// Data Hooks
export { useNotifications } from "../../hooks/useNotifications";
export { useSystemHealth } from "../../hooks/useSystemHealth";
export { useActivityLogs } from "../../hooks/useActivityLogs";

// Advanced Hooks
export { useAdvancedDashboard } from "../../hooks/useAdvancedDashboard";
export { useAdvancedReports } from "../../hooks/useAdvancedReports";
export { useErrorHandler } from "../../hooks/useErrorHandler";

// Utility Hooks
export { useCountdown } from "../../hooks/useCountdown";
export { useVisibilityCounter } from "../../hooks/useVisibilityCounter";
export { usePushNotifications } from "../../hooks/usePushNotifications";

// External Integrations
export { useGoogleAuth } from "../../hooks/useGoogleAuth";
export { useSupabaseUsers } from "../../hooks/useSupabaseUsers";
export { useSyncSmmPartyServices } from "../../hooks/useSyncSmmPartyServices";
