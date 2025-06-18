// المكونات المشتركة عبر التطبيق

// Essential Components - Minimal exports for Node 20.x/22.x compatibility
export { Button } from "../../components/ui/button";
export { Card } from "../../components/ui/card";

// Critical Common Components only
export { default as LoadingSpinner } from "../../components/Common/LoadingSpinner";
export {
  StateProvider,
  useAppState,
} from "../../components/Common/StateManager";

// Essential Layout
export { default as ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
