import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Copy,
  Percent,
  TrendingUp,
  Target,
  Users,
  Calendar,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { advancedProviderSync } from "@/services/providers/advancedProviderSync";
import type { ProviderService } from "@/services/providers/types";

interface PricingRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    platform?: string;
    serviceType?: string;
    qualityLevel?: string;
    minQuantity?: number;
    maxQuantity?: number;
  };
  profitMargin: number;
  markup: number; // إضافة ثابتة
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BulkPricing {
  id: string;
  name: string;
  tiers: {
    minQuantity: number;
    maxQuantity: number;
    discountPercentage: number;
  }[];
  applicableServices: string[];
  isActive: boolean;
}

interface DynamicPricing {
  id: string;
  name: string;
  baseMargin: number;
  demandMultiplier: number; // مضاعف الطلب
  competitorAdjustment: number; // تعديل المنافسة
  timeBasedRules: {
    dayOfWeek: number;
    startHour: number;
    endHour: number;
    marginAdjustment: number;
  }[];
  isActive: boolean;
}

const PricingManagement = () => {
  const [services, setServices] = useState<ProviderService[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [bulkPricing, setBulkPricing] = useState<BulkPricing[]>([]);
  const [dynamicPricing, setDynamicPricing] = useState<DynamicPricing[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // New rule form
  const [newRule, setNewRule] = useState<Partial<PricingRule>>({
    name: "",
    description: "",
    conditions: {},
    profitMargin: 25,
    markup: 0,
    isActive: true,
    priority: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setServices(advancedProviderSync.getServices());
    loadPricingRules();
    loadBulkPricing();
    loadDynamicPricing();
  };

  const loadPricingRules = () => {
    // تحميل قواعد التسعير من التخزين المحلي
    const saved = localStorage.getItem("pricing_rules");
    if (saved) {
      try {
        setPricingRules(JSON.parse(saved));
      } catch (error) {
        console.error("خطأ في تحميل قواعد التسعير:", error);
      }
    }
  };

  const loadBulkPricing = () => {
    const saved = localStorage.getItem("bulk_pricing");
    if (saved) {
      try {
        setBulkPricing(JSON.parse(saved));
      } catch (error) {
        console.error("خطأ في تحميل التسعير المجمع:", error);
      }
    }
  };

  const loadDynamicPricing = () => {
    const saved = localStorage.getItem("dynamic_pricing");
    if (saved) {
      try {
        setDynamicPricing(JSON.parse(saved));
      } catch (error) {
        console.error("خطأ في تحميل التسعير الديناميكي:", error);
      }
    }
  };

  const savePricingRules = (rules: PricingRule[]) => {
    localStorage.setItem("pricing_rules", JSON.stringify(rules));
  };

  const handleCreateRule = () => {
    const rule: PricingRule = {
      id: Date.now().toString(),
      name: newRule.name || "",
      description: newRule.description || "",
      conditions: newRule.conditions || {},
      profitMargin: newRule.profitMargin || 25,
      markup: newRule.markup || 0,
      isActive: newRule.isActive !== false,
      priority: newRule.priority || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedRules = [...pricingRules, rule];
    setPricingRules(updatedRules);
    savePricingRules(updatedRules);

    // إعادة تعيين النموذج
    setNewRule({
      name: "",
      description: "",
      conditions: {},
      profitMargin: 25,
      markup: 0,
      isActive: true,
      priority: 1,
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = pricingRules.filter((rule) => rule.id !== ruleId);
    setPricingRules(updatedRules);
    savePricingRules(updatedRules);
  };

  const handleToggleRule = (ruleId: string) => {
    const updatedRules = pricingRules.map((rule) =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule,
    );
    setPricingRules(updatedRules);
    savePricingRules(updatedRules);
  };

  const applyPricingRules = () => {
    setIsLoading(true);

    try {
      services.forEach((service) => {
        // تطبيق القواعد بناءً على الأولوية
        const applicableRules = pricingRules
          .filter((rule) => rule.isActive)
          .filter((rule) => matchesConditions(service, rule.conditions))
          .sort((a, b) => b.priority - a.priority);

        if (applicableRules.length > 0) {
          const rule = applicableRules[0]; // أعلى أولوية
          let newMargin = rule.profitMargin;

          // إضافة markup إذا كان موجود
          if (rule.markup > 0) {
            const markupPercentage = (rule.markup / service.originalRate) * 100;
            newMargin += markupPercentage;
          }

          advancedProviderSync.updateServiceProfitMargin(service.id, newMargin);
        }
      });

      // تحديث البيانات
      setServices(advancedProviderSync.getServices());
    } catch (error) {
      console.error("خطأ في تطبيق قواعد التسعير:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const matchesConditions = (
    service: ProviderService,
    conditions: PricingRule["conditions"],
  ): boolean => {
    if (conditions.platform && service.platform !== conditions.platform)
      return false;
    if (conditions.serviceType && service.type !== conditions.serviceType)
      return false;
    if (conditions.qualityLevel && service.quality !== conditions.qualityLevel)
      return false;
    if (conditions.minQuantity && service.minOrder < conditions.minQuantity)
      return false;
    if (conditions.maxQuantity && service.maxOrder > conditions.maxQuantity)
      return false;

    return true;
  };

  const handleBulkMarginUpdate = (margin: number) => {
    if (selectedServices.length === 0) return;

    selectedServices.forEach((serviceId) => {
      advancedProviderSync.updateServiceProfitMargin(serviceId, margin);
    });

    setServices(advancedProviderSync.getServices());
    setSelectedServices([]);
  };

  const exportPricingData = () => {
    const data = {
      services: services.map((s) => ({
        id: s.id,
        name: s.name,
        platform: s.platform,
        originalRate: s.originalRate,
        profitMargin: s.profitMargin,
        finalRate: s.finalRate,
      })),
      pricingRules,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pricing-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            إدارة الأسعار والعروض
          </h2>
          <p className="text-gray-600">
            تحكم متقدم في استراتيجيات التسعير ونسب الربح
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportPricingData}>
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button
            onClick={applyPricingRules}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            تطبيق القواعد
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="rules">قواعد التسعير</TabsTrigger>
          <TabsTrigger value="bulk">التسعير المجمع</TabsTrigger>
          <TabsTrigger value="dynamic">التسعير الديناميكي</TabsTrigger>
          <TabsTrigger value="analysis">تحليل الأسعار</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  تحديث سريع للهوامش
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleBulkMarginUpdate(20)}
                    disabled={selectedServices.length === 0}
                  >
                    20%
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleBulkMarginUpdate(30)}
                    disabled={selectedServices.length === 0}
                  >
                    30%
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleBulkMarginUpdate(40)}
                    disabled={selectedServices.length === 0}
                  >
                    40%
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  محدد: {selectedServices.length} خدمة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>متوسط الربح:</span>
                    <span className="font-bold">
                      {services.length > 0
                        ? Math.round(
                            services.reduce(
                              (sum, s) => sum + s.profitMargin,
                              0,
                            ) / services.length,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>أعلى ربح:</span>
                    <span className="font-bold">
                      {services.length > 0
                        ? Math.max(...services.map((s) => s.profitMargin))
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>أقل ربح:</span>
                    <span className="font-bold">
                      {services.length > 0
                        ? Math.min(...services.map((s) => s.profitMargin))
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  تحذيرات التسعير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {services.filter((s) => s.profitMargin < 10).length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {services.filter((s) => s.profitMargin < 10).length}{" "}
                        خدمات بربح أقل من 10%
                      </AlertDescription>
                    </Alert>
                  )}
                  {services.filter((s) => s.profitMargin > 100).length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {services.filter((s) => s.profitMargin > 100).length}{" "}
                        خدمات بربح أكثر من 100%
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Table with Selection */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة الخدمات والأسعار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-2">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServices(services.map((s) => s.id));
                            } else {
                              setSelectedServices([]);
                            }
                          }}
                          checked={
                            selectedServices.length === services.length &&
                            services.length > 0
                          }
                        />
                      </th>
                      <th className="text-right py-2">الخدمة</th>
                      <th className="text-right py-2">المنصة</th>
                      <th className="text-right py-2">السعر الأصلي</th>
                      <th className="text-right py-2">نسبة الربح</th>
                      <th className="text-right py-2">السعر النهائي</th>
                      <th className="text-right py-2">الحالة</th>
                      <th className="text-right py-2">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.slice(0, 20).map((service) => (
                      <tr
                        key={service.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-2">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices([
                                  ...selectedServices,
                                  service.id,
                                ]);
                              } else {
                                setSelectedServices(
                                  selectedServices.filter(
                                    (id) => id !== service.id,
                                  ),
                                );
                              }
                            }}
                          />
                        </td>
                        <td className="py-2">
                          <div>
                            <p className="font-medium">
                              {service.arabicName || service.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {service.type}
                            </p>
                          </div>
                        </td>
                        <td className="py-2">
                          <Badge variant="outline">{service.platform}</Badge>
                        </td>
                        <td className="py-2">${service.originalRate}</td>
                        <td className="py-2">
                          <Input
                            type="number"
                            value={service.profitMargin}
                            onChange={(e) => {
                              const margin = parseFloat(e.target.value) || 0;
                              advancedProviderSync.updateServiceProfitMargin(
                                service.id,
                                margin,
                              );
                              setServices(advancedProviderSync.getServices());
                            }}
                            className="w-20 h-8"
                          />
                        </td>
                        <td className="py-2 font-bold text-green-600">
                          ${service.finalRate}
                        </td>
                        <td className="py-2">
                          <Badge
                            variant={service.isActive ? "default" : "secondary"}
                          >
                            {service.isActive ? "نشط" : "معطل"}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          {/* Create New Rule */}
          <Card>
            <CardHeader>
              <CardTitle>إنشاء قاعدة تسعير جديدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>اسم القاعدة</Label>
                  <Input
                    value={newRule.name}
                    onChange={(e) =>
                      setNewRule({ ...newRule, name: e.target.value })
                    }
                    placeholder="مثال: خدمات Instagram عالية الجودة"
                  />
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Input
                    value={newRule.description}
                    onChange={(e) =>
                      setNewRule({ ...newRule, description: e.target.value })
                    }
                    placeholder="وصف موجز للقاعدة"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>المنصة</Label>
                  <Select
                    value={newRule.conditions?.platform || "all"}
                    onValueChange={(value) =>
                      setNewRule({
                        ...newRule,
                        conditions: {
                          ...newRule.conditions,
                          platform: value === "all" ? undefined : value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنصة" />
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
                </div>

                <div>
                  <Label>نوع الخدمة</Label>
                  <Select
                    value={newRule.conditions?.serviceType || "all"}
                    onValueChange={(value) =>
                      setNewRule({
                        ...newRule,
                        conditions: {
                          ...newRule.conditions,
                          serviceType: value === "all" ? undefined : value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="followers">متابعين</SelectItem>
                      <SelectItem value="likes">إعجابات</SelectItem>
                      <SelectItem value="views">مشاهدات</SelectItem>
                      <SelectItem value="comments">تعليقات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>مستوى الجودة</Label>
                  <Select
                    value={newRule.conditions?.qualityLevel || "all"}
                    onValueChange={(value) =>
                      setNewRule({
                        ...newRule,
                        conditions: {
                          ...newRule.conditions,
                          qualityLevel: value === "all" ? undefined : value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجودة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المستويات</SelectItem>
                      <SelectItem value="high">جودة عالية</SelectItem>
                      <SelectItem value="medium">جودة متوسطة</SelectItem>
                      <SelectItem value="low">جودة منخفضة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>نسبة الربح (%)</Label>
                  <Input
                    type="number"
                    value={newRule.profitMargin}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        profitMargin: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>إضافة ثابتة ($)</Label>
                  <Input
                    type="number"
                    value={newRule.markup}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        markup: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>الأولوية (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newRule.priority}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        priority: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={newRule.isActive !== false}
                  onCheckedChange={(checked) =>
                    setNewRule({ ...newRule, isActive: checked })
                  }
                />
                <Label>تفعيل القاعدة</Label>
              </div>

              <Button
                onClick={handleCreateRule}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                إنشاء القاعدة
              </Button>
            </CardContent>
          </Card>

          {/* Existing Rules */}
          <Card>
            <CardHeader>
              <CardTitle>قواعد التسعير الحالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingRules.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    لا توجد قواعد تسعير بعد
                  </p>
                ) : (
                  pricingRules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{rule.name}</h3>
                            <Badge
                              variant={rule.isActive ? "default" : "secondary"}
                            >
                              {rule.isActive ? "نشط" : "معطل"}
                            </Badge>
                            <Badge variant="outline">
                              أولوية {rule.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {rule.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <Label>نسبة الربح:</Label>
                              <p className="font-medium">
                                {rule.profitMargin}%
                              </p>
                            </div>
                            {rule.markup > 0 && (
                              <div>
                                <Label>إضافة ثابتة:</Label>
                                <p className="font-medium">${rule.markup}</p>
                              </div>
                            )}
                            <div>
                              <Label>الشروط:</Label>
                              <p className="font-medium">
                                {Object.keys(rule.conditions).length > 0
                                  ? Object.keys(rule.conditions).join(", ")
                                  : "جميع الخدمات"}
                              </p>
                            </div>
                            <div>
                              <Label>آخر تحديث:</Label>
                              <p className="font-medium text-xs">
                                {rule.updatedAt.toLocaleDateString("ar-SA")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                          />
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التسعير المجمع (قريباً)</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  ميزة التسعير المجمع قيد التطوير. ستتيح إنشاء مستويات أسعار
                  مختلفة حسب الكمية.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dynamic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التسعير الديناميكي (قريباً)</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  ميزة التسعير الديناميكي قيد التطوير. ستتيح تعديل الأسعار
                  تلقائياً حسب الطلب والمنافسة.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل الأسعار (قريباً)</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  تحليل متقدم للأسعار والمنافسة قيد التطوير.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingManagement;
