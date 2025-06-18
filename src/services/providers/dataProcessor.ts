// معالج البيانات للخدمات من الموردين

import type {
  Provider,
  ProviderService,
  ServiceType,
  Platform,
  QualityLevel,
} from "./types";

// حساب السعر النهائي مع نسبة الربح
export function calculateFinalPrice(
  originalRate: number,
  profitMargin: number,
): number {
  const markup = originalRate * (profitMargin / 100);
  return Math.round((originalRate + markup) * 100) / 100;
}

// ترجمة اسم الخدمة
export function translateServiceName(name: string): string {
  const translations: Record<string, string> = {
    followers: "متابعين",
    likes: "إعجابات",
    views: "مشاهدات",
    comments: "تعليقات",
    shares: "مشاركات",
    subscribers: "مشتركين",
    instagram: "انستغرام",
    tiktok: "تيك توك",
    youtube: "يوتيوب",
    twitter: "تويتر",
    facebook: "فيسبوك",
  };

  let translatedName = name.toLowerCase();
  Object.entries(translations).forEach(([eng, ar]) => {
    translatedName = translatedName.replace(new RegExp(eng, "gi"), ar);
  });

  return translatedName;
}

// ترجمة الوصف
export function translateDescription(description: string): string {
  if (!description) return "";

  const translations: Record<string, string> = {
    "high quality": "جودة عالية",
    "fast delivery": "تسليم سريع",
    "real users": "مستخدمين حقيقيين",
    "instant start": "بداية فورية",
    "refill guarantee": "ضمان إعادة التعبئة",
  };

  let translatedDesc = description.toLowerCase();
  Object.entries(translations).forEach(([eng, ar]) => {
    translatedDesc = translatedDesc.replace(new RegExp(eng, "gi"), ar);
  });

  return translatedDesc;
}

// توليد وصف تلقائي
export function generateDescription(service: any): string {
  const platform = service.category || "منصة";
  const type = service.type || "خدمة";
  return `خدمة ${type} عالية الجودة لمنصة ${platform} مع ضمان الجودة والتسليم السريع`;
}

// تحديد نوع الخدمة
export function mapServiceType(type: string): ServiceType {
  const typeMap: Record<string, ServiceType> = {
    followers: "followers",
    likes: "likes",
    views: "views",
    comments: "comments",
    shares: "shares",
    subscribers: "subscribers",
  };

  return typeMap[type?.toLowerCase()] || "followers";
}

// تحديد المنصة
export function mapPlatform(category: string): Platform {
  const platformMap: Record<string, Platform> = {
    instagram: "instagram",
    tiktok: "tiktok",
    youtube: "youtube",
    twitter: "twitter",
    facebook: "facebook",
    snapchat: "snapchat",
  };

  const categoryLower = category?.toLowerCase() || "";
  for (const [key, value] of Object.entries(platformMap)) {
    if (categoryLower.includes(key)) {
      return value;
    }
  }

  return "instagram";
}

// تحديد جودة الخدمة
export function determineQuality(service: any): QualityLevel {
  const rate = parseFloat(service.rate) || 0;
  const name = service.name?.toLowerCase() || "";

  if (name.includes("premium") || name.includes("high quality") || rate > 1) {
    return "high";
  } else if (name.includes("medium") || rate > 0.5) {
    return "medium";
  } else {
    return "low";
  }
}

// استخراج الحقول المخصصة
export function extractCustomFields(service: any): Record<string, any> {
  const standardFields = [
    "service",
    "name",
    "type",
    "rate",
    "min",
    "max",
    "category",
  ];
  const customFields: Record<string, any> = {};

  Object.keys(service).forEach((key) => {
    if (!standardFields.includes(key)) {
      customFields[key] = service[key];
    }
  });

  return customFields;
}

// معالجة وتحويل الخدمة
export async function processService(
  rawService: any,
  provider: Provider,
): Promise<ProviderService> {
  const originalRate = parseFloat(rawService.rate) || 0;
  const profitMargin = provider.profitMargin;
  const finalRate = calculateFinalPrice(originalRate, profitMargin);

  const service: ProviderService = {
    id: `${provider.id}-${rawService.service || rawService.id}`,
    providerId: provider.id,
    providerServiceId: rawService.service || rawService.id,
    name: rawService.name || `خدمة ${rawService.id}`,
    arabicName: translateServiceName(rawService.name || ""),
    description: rawService.description || generateDescription(rawService),
    arabicDescription: translateDescription(rawService.description || ""),
    type: mapServiceType(rawService.type),
    platform: mapPlatform(rawService.category),
    category: rawService.category || "عام",
    originalRate,
    profitMargin,
    finalRate,
    minOrder: parseInt(rawService.min) || 100,
    maxOrder: parseInt(rawService.max) || 10000,
    isActive: true,
    quality: determineQuality(rawService),
    refillEnabled: rawService.refill || false,
    cancelEnabled: rawService.cancel || false,
    averageTime: rawService.average_time || "24 ساعة",
    lastUpdated: new Date(),
    syncStatus: "synced",
    customFields: extractCustomFields(rawService),
  };

  return service;
}
