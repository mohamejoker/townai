// تعريفات الأنواع للموردين والخدمات

export interface Provider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  isActive: boolean;
  description: string;
  reliability: number;
  speed: "fast" | "medium" | "slow";
  supportedPlatforms: string[];
  lastSync: Date;
  profitMargin: number;
  currency: "USD" | "SAR" | "EGP";
  syncInterval: number;
}

export interface ProviderService {
  id: string;
  providerId: string;
  providerServiceId: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  type: "followers" | "likes" | "views" | "comments" | "shares" | "subscribers";
  platform:
    | "instagram"
    | "tiktok"
    | "youtube"
    | "twitter"
    | "snapchat"
    | "facebook";
  category: string;
  originalRate: number;
  profitMargin: number;
  finalRate: number;
  minOrder: number;
  maxOrder: number;
  isActive: boolean;
  quality: "high" | "medium" | "low";
  refillEnabled: boolean;
  cancelEnabled: boolean;
  averageTime: string;
  lastUpdated: Date;
  syncStatus: "synced" | "pending" | "error";
  errorMessage?: string;
  customFields?: Record<string, any>;
}

export interface SyncResult {
  providerId: string;
  totalServices: number;
  newServices: number;
  updatedServices: number;
  errors: number;
  syncTime: Date;
  duration: number;
  errorDetails: string[];
}

export type ServiceType = ProviderService["type"];
export type Platform = ProviderService["platform"];
export type QualityLevel = ProviderService["quality"];
export type SyncStatus = ProviderService["syncStatus"];
