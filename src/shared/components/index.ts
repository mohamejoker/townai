// المكونات المشتركة عبر التطبيق

// UI Components - Export specific commonly used components only
export { Button } from "../../components/ui/button";
export { Input } from "../../components/ui/input";
export {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

// Common Components - Export specific components to avoid circular deps
export { default as LoadingSpinner } from "../../components/Common/LoadingSpinner";
export {
  StateProvider,
  useAppState,
} from "../../components/Common/StateManager";
export { PageLoading } from "../../components/Common/LoadingStates";

// Layout Components
export { default as Header } from "../../components/Layout/Header";
export { default as Footer } from "../../components/Layout/Footer";

// Frontend Components
export { default as Navbar } from "../../components/Frontend/Navbar";

// Error Handling
export { default as ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";

// Authentication
export { default as AuthProvider } from "../../components/Auth/AuthProvider";
export { default as ProtectedRoute } from "../../components/Auth/ProtectedRoute";
