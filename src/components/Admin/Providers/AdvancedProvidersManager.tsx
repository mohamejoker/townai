import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  Globe,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { advancedProviderSync } from "@/services/providers/advancedProviderSync";
import type {
  Provider,
  ProviderService,
  SyncResult,
} from "@/services/providers/types";

const AdvancedProvidersManager = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [services, setServices] = useState<ProviderService[]>([]);
  const [filteredServices, setFilteredServices] = useState<ProviderService[]>(
    [],
  );
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [editingService, setEditingService] = useState<ProviderService | null>(
    null,
  );

  // فلاتر البحث
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, platformFilter, typeFilter, statusFilter]);

  const loadData = () => {
    setProviders(advancedProviderSync.getProviders());
    setServices(advancedProviderSync.getServices());
  };

  const handleSyncAll = async () => {
    setIsLoading(true);
    try {
      const results = await advancedProviderSync.syncAllProviders();
      setSyncResults(results);
      loadData();
    } catch (error) {
      console.error("خطأ في المزامنة:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncProvider = async (providerId: string) => {
    setIsLoading(true);
    try {
      const provider = providers.find((p) => p.id === providerId);
      if (provider) {
        const result = await advancedProviderSync.syncProvider(provider);
        setSyncResults((prev) => [...prev, result]);
        loadData();
      }
    } catch (error) {
      console.error("خطأ في مزامنة المورد:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfitMargin = (serviceId: string, margin: number) => {
    advancedProviderSync.updateServiceProfitMargin(serviceId, margin);
    loadData();
  };

  const handleUpdateServiceDescription = (
    serviceId: string,
    desc: string,
    arabicDesc: string,
  ) => {
    advancedProviderSync.updateServiceDescription(serviceId, desc, arabicDesc);
    loadData();
  };

  const handleToggleServiceStatus = (serviceId: string, isActive: boolean) => {
    advancedProviderSync.updateServiceStatus(serviceId, isActive);
    loadData();
  };

  const filterServices = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.arabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (platformFilter !== "all") {
      filtered = filtered.filter(
        (service) => service.platform === platformFilter,
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((service) => service.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((service) =>
        statusFilter === "active" ? service.isActive : !service.isActive,
      );
    }

    setFilteredServices(filtered);
  };

  const getProviderStats = (providerId: string) => {
    const providerServices = services.filter(
      (s) => s.providerId === providerId,
    );
    const activeServices = providerServices.filter((s) => s.isActive);
    const totalRevenue = providerServices.reduce(
      (sum, s) => sum + s.finalRate * 100,
      0,
    ); // تقدير

    return {
      total: providerServices.length,
      active: activeServices.length,
      revenue: totalRevenue,
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            إدارة الموردين والخدمات
          </h1>
          <p className="text-gray-600">
            سحب وإدارة الخدمات من الموردين مع التحكم في الأسعار والأرباح
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSyncAll}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            مزامنة جميع الموردين
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            إضافة مورد جديد
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  الموردين النشطين
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {providers.filter((p) => p.isActive).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الخدمات
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {services.length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  الخدمات النشطة
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {services.filter((s) => s.isActive).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  متوسط نسبة الربح
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {services.length > 0
                    ? Math.round(
                        services.reduce((sum, s) => sum + s.profitMargin, 0) /
                          services.length,
                      )
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="providers">إدارة الموردين</TabsTrigger>
          <TabsTrigger value="services">إدارة الخدمات</TabsTrigger>
          <TabsTrigger value="sync">سجل المزامنة</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* معلومات الموردين */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map((provider) => {
              const stats = getProviderStats(provider.id);
              return (
                <Card key={provider.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        {provider.name}
                        <Badge
                          variant={provider.isActive ? "default" : "secondary"}
                        >
                          {provider.isActive ? "نشط" : "معطل"}
                        </Badge>
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncProvider(provider.id)}
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>الموثوقية: {provider.reliability}%</span>
                      <span>السرعة: {provider.speed}</span>
                    </div>

                    <Progress value={provider.reliability} className="h-2" />

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">
                          {stats.total}
                        </p>
                        <p className="text-xs text-gray-500">إجمالي الخدمات</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          {stats.active}
                        </p>
                        <p className="text-xs text-gray-500">الخدمات النشطة</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-600">
                          {provider.profitMargin}%
                        </p>
                        <p className="text-xs text-gray-500">نسبة الربح</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {provider.supportedPlatforms
                        .slice(0, 3)
                        .map((platform) => (
                          <Badge
                            key={platform}
                            variant="outline"
                            className="text-xs"
                          >
                            {platform}
                          </Badge>
                        ))}
                      {provider.supportedPlatforms.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.supportedPlatforms.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الموردين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {provider.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <Label>نسبة الربح:</Label>
                            <Input
                              type="number"
                              value={provider.profitMargin}
                              onChange={(e) => {
                                const newMargin =
                                  parseFloat(e.target.value) || 0;
                                advancedProviderSync.updateProviderProfitMargin(
                                  provider.id,
                                  newMargin,
                                );
                                loadData();
                              }}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>الموثوقية:</Label>
                            <p className="mt-1 font-medium">
                              {provider.reliability}%
                            </p>
                          </div>
                          <div>
                            <Label>العملة:</Label>
                            <p className="mt-1 font-medium">
                              {provider.currency}
                            </p>
                          </div>
                          <div>
                            <Label>آخر مزامنة:</Label>
                            <p className="mt-1 text-xs">
                              {provider.lastSync.toLocaleString("ar-SA")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={provider.isActive}
                          onCheckedChange={(checked) => {
                            advancedProviderSync.updateProvider(provider.id, {
                              isActive: checked,
                            });
                            loadData();
                          }}
                        />
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {/* فلاتر البحث */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في الخدمات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={platformFilter}
                  onValueChange={setPlatformFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="المنصة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المنصات</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="followers">متابعين</SelectItem>
                    <SelectItem value="likes">إعجابات</SelectItem>
                    <SelectItem value="views">مشاهدات</SelectItem>
                    <SelectItem value="comments">تعليقات</SelectItem>
                    <SelectItem value="shares">مشاركات</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشطة</SelectItem>
                    <SelectItem value="inactive">معطلة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* قائمة الخدمات */}
          <div className="grid gap-4">
            {filteredServices.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">
                          {service.arabicName || service.name}
                        </h3>
                        <Badge className={getQualityColor(service.quality)}>
                          {service.quality === "high"
                            ? "جودة عالية"
                            : service.quality === "medium"
                              ? "جودة متوسطة"
                              : "جودة منخفضة"}
                        </Badge>
                        <Badge variant="outline">{service.platform}</Badge>
                        {getStatusIcon(service.syncStatus)}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {service.arabicDescription || service.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <Label>السعر الأصلي:</Label>
                          <p className="font-medium">${service.originalRate}</p>
                        </div>
                        <div>
                          <Label>نسبة الربح:</Label>
                          <Input
                            type="number"
                            value={service.profitMargin}
                            onChange={(e) => {
                              const margin = parseFloat(e.target.value) || 0;
                              handleUpdateProfitMargin(service.id, margin);
                            }}
                            className="mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label>السعر النهائي:</Label>
                          <p className="font-medium text-green-600">
                            ${service.finalRate}
                          </p>
                        </div>
                        <div>
                          <Label>الحد الأدنى:</Label>
                          <p className="font-medium">
                            {service.minOrder.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label>الحد الأقصى:</Label>
                          <p className="font-medium">
                            {service.maxOrder.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.isActive}
                        onCheckedChange={(checked) =>
                          handleToggleServiceStatus(service.id, checked)
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لا توجد خدمات
                </h3>
                <p className="text-gray-600">
                  لم يتم العثور على خدمات تطابق الفلاتر المحددة
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل المزامنة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    لا توجد عمليات مزامنة بعد
                  </p>
                ) : (
                  syncResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">
                            {providers.find((p) => p.id === result.providerId)
                              ?.name || result.providerId}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {result.syncTime.toLocaleString("ar-SA")}
                          </p>
                        </div>
                        <Badge
                          variant={
                            result.errors > 0 ? "destructive" : "default"
                          }
                        >
                          {result.errors > 0 ? "أخطاء" : "نجح"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <Label>إجمالي الخدمات:</Label>
                          <p className="font-medium">{result.totalServices}</p>
                        </div>
                        <div>
                          <Label>خدمات جديدة:</Label>
                          <p className="font-medium text-green-600">
                            {result.newServices}
                          </p>
                        </div>
                        <div>
                          <Label>خدمات محدثة:</Label>
                          <p className="font-medium text-blue-600">
                            {result.updatedServices}
                          </p>
                        </div>
                        <div>
                          <Label>مدة المزامنة:</Label>
                          <p className="font-medium">{result.duration}ث</p>
                        </div>
                      </div>

                      {result.errorDetails.length > 0 && (
                        <Alert className="mt-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>أخطاء المزامنة:</strong>
                            <ul className="mt-1 list-disc list-inside">
                              {result.errorDetails.map((error, i) => (
                                <li key={i} className="text-sm">
                                  {error}
                                </li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* مودال تعديل الخدمة */}
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>تعديل الخدمة: {editingService.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>الاسم العربي:</Label>
                  <Input
                    value={editingService.arabicName}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        arabicName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>نسبة الربح (%):</Label>
                  <Input
                    type="number"
                    value={editingService.profitMargin}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        profitMargin: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>الوصف العربي:</Label>
                <Textarea
                  value={editingService.arabicDescription}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      arabicDescription: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditingService(null)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateServiceDescription(
                      editingService.id,
                      editingService.description,
                      editingService.arabicDescription,
                    );
                    handleUpdateProfitMargin(
                      editingService.id,
                      editingService.profitMargin,
                    );
                    setEditingService(null);
                  }}
                >
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdvancedProvidersManager;
