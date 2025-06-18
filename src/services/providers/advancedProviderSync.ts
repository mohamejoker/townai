// نظام متقدم لسحب وإدارة الخدمات من الموزعين

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
  profitMargin: number; // نسبة الربح الافتراضية
  currency: "USD" | "SAR" | "EGP";
  syncInterval: number; // بالدقائق
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
  originalRate: number; // السعر الأصلي من المورد
  profitMargin: number; // نسبة الربح
  finalRate: number; // السعر النهائي
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
  duration: number; // بالثواني
  errorDetails: string[];
}

class AdvancedProviderSync {
  private providers: Provider[] = [];
  private services: ProviderService[] = [];
  private syncHistory: SyncResult[] = [];

  constructor() {
    this.loadProviders();
    this.loadServices();
    this.setupAutoSync();
  }

  // تحميل الموردين من قاعدة البيانات
  private loadProviders() {
    this.providers = [
      {
        id: "smm-party",
        name: "SMM Party",
        apiUrl: "https://smmparty.com/api/v2",
        apiKey: "8b9d9d15570d233646b130210dba475a",
        isActive: true,
        description: "مورد خدمات سوشيال ميديا عالي الجودة",
        reliability: 96,
        speed: "fast",
        supportedPlatforms: [
          "instagram",
          "tiktok",
          "youtube",
          "twitter",
          "facebook",
        ],
        lastSync: new Date(),
        profitMargin: 30, // 30% ربح افتراضي
        currency: "USD",
        syncInterval: 60, // كل ساعة
      },
      {
        id: "arabic-smm",
        name: "Arabic SMM",
        apiUrl: "https://api.arabicsmm.com/v1",
        apiKey: "demo-api-key",
        isActive: true,
        description: "مورد خدمات عربي متخصص",
        reliability: 89,
        speed: "medium",
        supportedPlatforms: ["instagram", "tiktok", "snapchat"],
        lastSync: new Date(),
        profitMargin: 25,
        currency: "SAR",
        syncInterval: 120,
      },
    ];
  }

  // تحميل الخدمات المحفوظة
  private loadServices() {
    const savedServices = localStorage.getItem("provider_services");
    if (savedServices) {
      try {
        this.services = JSON.parse(savedServices);
      } catch (error) {
        console.error("خطأ في تحميل الخدمات المحفوظة:", error);
        this.services = [];
      }
    }
  }

  // حفظ الخدمات
  private saveServices() {
    localStorage.setItem("provider_services", JSON.stringify(this.services));
  }

  // سحب الخدمات من جميع الموردين
  async syncAllProviders(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const provider of this.providers) {
      if (provider.isActive) {
        const result = await this.syncProvider(provider);
        results.push(result);
      }
    }

    this.syncHistory.push(...results);
    this.saveServices();

    return results;
  }

  // سحب الخدمات من مورد واحد
  async syncProvider(provider: Provider): Promise<SyncResult> {
    const startTime = Date.now();
    const result: SyncResult = {
      providerId: provider.id,
      totalServices: 0,
      newServices: 0,
      updatedServices: 0,
      errors: 0,
      syncTime: new Date(),
      duration: 0,
      errorDetails: [],
    };

    try {
      console.log(`بدء سحب الخدمات من ${provider.name}...`);

      const providerServices = await this.fetchProviderServices(provider);
      result.totalServices = providerServices.length;

      for (const service of providerServices) {
        try {
          const processedService = await this.processService(service, provider);
          const existingIndex = this.services.findIndex(
            (s) =>
              s.providerId === provider.id &&
              s.providerServiceId === service.id,
          );

          if (existingIndex >= 0) {
            // تحديث خدمة موجودة
            this.services[existingIndex] = processedService;
            result.updatedServices++;
          } else {
            // إضافة خدمة جديدة
            this.services.push(processedService);
            result.newServices++;
          }
        } catch (error) {
          result.errors++;
          result.errorDetails.push(
            `خطأ في معالجة الخدمة ${service.name}: ${error}`,
          );
        }
      }

      provider.lastSync = new Date();
    } catch (error) {
      result.errors++;
      result.errorDetails.push(`خطأ في الاتصال بالمورد: ${error}`);
    }

    result.duration = Math.round((Date.now() - startTime) / 1000);
    console.log(
      `انتهى سحب الخدمات من ${provider.name} في ${result.duration} ثانية`,
    );

    return result;
  }

  // جلب الخدمات من مورد
  private async fetchProviderServices(provider: Provider): Promise<any[]> {
    switch (provider.id) {
      case "smm-party":
        return this.fetchSMMPartyServices(provider);
      case "arabic-smm":
        return this.fetchArabicSMMServices(provider);
      default:
        return this.fetchGenericServices(provider);
    }
  }

  // جلب خدمات SMM Party
  private async fetchSMMPartyServices(provider: Provider): Promise<any[]> {
    const response = await fetch(provider.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: provider.apiKey,
        action: "services",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.services || [];
  }

  // جلب خدمات Arabic SMM (محاكاة)
  private async fetchArabicSMMServices(provider: Provider): Promise<any[]> {
    // محاكاة بيانات مورد عربي
    return [
      {
        id: "1",
        name: "Instagram Arabic Followers",
        type: "followers",
        rate: "0.5",
        min: "100",
        max: "10000",
        category: "Instagram",
      },
      {
        id: "2",
        name: "TikTok Views Saudi",
        type: "views",
        rate: "0.3",
        min: "1000",
        max: "100000",
        category: "TikTok",
      },
    ];
  }

  // جلب خدمات عامة
  private async fetchGenericServices(provider: Provider): Promise<any[]> {
    const response = await fetch(`${provider.apiUrl}/services`, {
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // معالجة وتحويل الخدمة
  private async processService(
    rawService: any,
    provider: Provider,
  ): Promise<ProviderService> {
    const originalRate = parseFloat(rawService.rate) || 0;
    const profitMargin = provider.profitMargin;
    const finalRate = this.calculateFinalPrice(originalRate, profitMargin);

    const service: ProviderService = {
      id: `${provider.id}-${rawService.service || rawService.id}`,
      providerId: provider.id,
      providerServiceId: rawService.service || rawService.id,
      name: rawService.name || `خدمة ${rawService.id}`,
      arabicName: this.translateServiceName(rawService.name || ""),
      description:
        rawService.description || this.generateDescription(rawService),
      arabicDescription: this.translateDescription(
        rawService.description || "",
      ),
      type: this.mapServiceType(rawService.type),
      platform: this.mapPlatform(rawService.category),
      category: rawService.category || "عام",
      originalRate,
      profitMargin,
      finalRate,
      minOrder: parseInt(rawService.min) || 100,
      maxOrder: parseInt(rawService.max) || 10000,
      isActive: true,
      quality: this.determineQuality(rawService),
      refillEnabled: rawService.refill || false,
      cancelEnabled: rawService.cancel || false,
      averageTime: rawService.average_time || "24 ساعة",
      lastUpdated: new Date(),
      syncStatus: "synced",
      customFields: this.extractCustomFields(rawService),
    };

    return service;
  }

  // حساب السعر النهائي مع نسبة الربح
  private calculateFinalPrice(
    originalRate: number,
    profitMargin: number,
  ): number {
    const markup = originalRate * (profitMargin / 100);
    return Math.round((originalRate + markup) * 100) / 100;
  }

  // ترجمة اسم الخدمة
  private translateServiceName(name: string): string {
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
  private translateDescription(description: string): string {
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
  private generateDescription(service: any): string {
    const platform = service.category || "منصة";
    const type = service.type || "خدمة";
    return `خدمة ${type} عالية الجودة لمنصة ${platform} مع ضمان الجودة والتسليم السريع`;
  }

  // تحديد نوع الخدمة
  private mapServiceType(type: string): ProviderService["type"] {
    const typeMap: Record<string, ProviderService["type"]> = {
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
  private mapPlatform(category: string): ProviderService["platform"] {
    const platformMap: Record<string, ProviderService["platform"]> = {
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
  private determineQuality(service: any): ProviderService["quality"] {
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
  private extractCustomFields(service: any): Record<string, any> {
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

  // إعداد المزامنة التلقائية
  private setupAutoSync() {
    // مزامنة كل 30 دقيقة
    setInterval(
      () => {
        this.syncAllProviders().catch(console.error);
      },
      30 * 60 * 1000,
    );
  }

  // تحديث نسبة الربح لمورد
  updateProviderProfitMargin(providerId: string, profitMargin: number) {
    const provider = this.providers.find((p) => p.id === providerId);
    if (provider) {
      provider.profitMargin = profitMargin;

      // تحديث جميع خدمات هذا المورد
      this.services.forEach((service) => {
        if (service.providerId === providerId) {
          service.profitMargin = profitMargin;
          service.finalRate = this.calculateFinalPrice(
            service.originalRate,
            profitMargin,
          );
        }
      });

      this.saveServices();
    }
  }

  // تحديث نسبة الربح لخدمة واحدة
  updateServiceProfitMargin(serviceId: string, profitMargin: number) {
    const service = this.services.find((s) => s.id === serviceId);
    if (service) {
      service.profitMargin = profitMargin;
      service.finalRate = this.calculateFinalPrice(
        service.originalRate,
        profitMargin,
      );
      this.saveServices();
    }
  }

  // تحديث وصف خدمة
  updateServiceDescription(
    serviceId: string,
    description: string,
    arabicDescription: string,
  ) {
    const service = this.services.find((s) => s.id === serviceId);
    if (service) {
      service.description = description;
      service.arabicDescription = arabicDescription;
      this.saveServices();
    }
  }

  // الحصول على جميع الخدمات
  getServices(): ProviderService[] {
    return this.services;
  }

  // الحصول على خدمات مورد معين
  getProviderServices(providerId: string): ProviderService[] {
    return this.services.filter((s) => s.providerId === providerId);
  }

  // الحصول على إحصائيات المزامنة
  getSyncStats() {
    const activeProviders = this.providers.filter((p) => p.isActive).length;
    const totalServices = this.services.length;
    const lastSync = Math.max(
      ...this.providers.map((p) => p.lastSync.getTime()),
    );

    return {
      activeProviders,
      totalServices,
      lastSync: new Date(lastSync),
      syncHistory: this.syncHistory.slice(-10), // آخر 10 عمليات مزامنة
    };
  }

  // فلترة الخدمات
  filterServices(filters: {
    platform?: string;
    type?: string;
    minRate?: number;
    maxRate?: number;
    quality?: string;
    isActive?: boolean;
  }): ProviderService[] {
    return this.services.filter((service) => {
      if (filters.platform && service.platform !== filters.platform)
        return false;
      if (filters.type && service.type !== filters.type) return false;
      if (filters.minRate && service.finalRate < filters.minRate) return false;
      if (filters.maxRate && service.finalRate > filters.maxRate) return false;
      if (filters.quality && service.quality !== filters.quality) return false;
      if (
        filters.isActive !== undefined &&
        service.isActive !== filters.isActive
      )
        return false;

      return true;
    });
  }

  // تحديث حالة خدمة
  updateServiceStatus(serviceId: string, isActive: boolean) {
    const service = this.services.find((s) => s.id === serviceId);
    if (service) {
      service.isActive = isActive;
      this.saveServices();
    }
  }

  // حذف خدمة
  deleteService(serviceId: string) {
    const index = this.services.findIndex((s) => s.id === serviceId);
    if (index >= 0) {
      this.services.splice(index, 1);
      this.saveServices();
    }
  }

  // إضافة مورد جديد
  addProvider(provider: Provider) {
    this.providers.push(provider);
  }

  // تحديث مورد
  updateProvider(providerId: string, updates: Partial<Provider>) {
    const provider = this.providers.find((p) => p.id === providerId);
    if (provider) {
      Object.assign(provider, updates);
    }
  }

  // حذف مورد
  deleteProvider(providerId: string) {
    const index = this.providers.findIndex((p) => p.id === providerId);
    if (index >= 0) {
      this.providers.splice(index, 1);
      // حذف جميع خدمات هذا المورد
      this.services = this.services.filter((s) => s.providerId !== providerId);
      this.saveServices();
    }
  }

  // الحصول على جميع الموردين
  getProviders(): Provider[] {
    return this.providers;
  }
}

export const advancedProviderSync = new AdvancedProviderSync();
