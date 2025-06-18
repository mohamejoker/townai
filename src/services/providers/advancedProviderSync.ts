// نظام متقدم لسحب وإدارة الخدمات من الموردين

import type { Provider, ProviderService, SyncResult } from "./types";
import { DataProcessor } from "./dataProcessor";

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

  // معا��جة وتحويل الخدمة
  private async processService(
    rawService: any,
    provider: Provider,
  ): Promise<ProviderService> {
    return DataProcessor.processService(rawService, provider);
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
