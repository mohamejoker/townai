// تصدير مركزي لجميع الخدمات

// Core Services - Specific exports to avoid Node 22.x context issues
export { advancedProviderSync } from "./providers/advancedProviderSync";
export * from "./providers/types";
export { calculateFinalPrice, processService } from "./providers/dataProcessor";

// Payment Services
export { default as egyptianPaymentService } from "./payment/egyptianPaymentService";
export { default as paymentService } from "./payment/paymentService";

// AI Services
export { default as openaiService } from "./openai/openaiService";
export { default as conversationManager } from "./ai/conversationManager";

// Analytics
export { default as intelligentAnalytics } from "./analytics/intelligentAnalytics";

// Authentication & Security
export { default as roleService } from "./roleService";
export { default as apiKeyService } from "./apiKeyService";

// Utilities - Key services only
export { default as accountAnalyzer } from "./accountAnalyzer";
export { default as aiAgent } from "./aiAgent";
export { default as serviceService } from "./serviceService";
export { default as servicesManager } from "./servicesManager";
export { default as themeManager } from "./themeManager";
export { default as platformExpansion } from "./platformExpansion";

// State Management
export { stateManager } from "./state/stateManager";

// Theme Services
export { themeManager as themeService } from "./theme/manager";
