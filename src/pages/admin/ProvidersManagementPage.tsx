import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Globe,
  DollarSign,
  TrendingUp,
  Settings,
  BarChart3,
  Percent,
  RefreshCw,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";
import AdvancedProvidersManager from "@/components/Admin/Providers/AdvancedProvidersManager";
import ProfitabilityAnalytics from "@/components/Admin/Providers/ProfitabilityAnalytics";
import PricingManagement from "@/components/Admin/Providers/PricingManagement";
import ProviderSystemTester from "@/components/Admin/Providers/ProviderSystemTester";
import { advancedProviderSync } from "@/services/providers/advancedProviderSync";

const ProvidersManagementPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // إحصائيات سريعة
  const stats = advancedProviderSync.getSyncStats();
  const services = advancedProviderSync.getServices();
  const providers = advancedProviderSync.getProviders();

  const handleQuickSync = async () => {
    setIsLoading(true);
    try {
      await advancedProviderSync.syncAllProviders();
    } catch (error) {
      console.error("خطأ في المزامنة السريعة:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // حساب إحصائيات الربحية
  const totalRevenue = services.reduce((sum, s) => sum + s.finalRate * 100, 0);
  const totalCost = services.reduce((sum, s) => sum + s.originalRate * 100, 0);
  const totalProfit = totalRevenue - totalCost;
  const averageMargin =
    services.length > 0
      ? services.reduce((sum, s) => sum + s.profitMargin, 0) / services.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            إدارة الموردين والخدمات
          </h1>
          <p className="text-gray-600">
            نظام شامل لسحب وإدارة الخدمات من الموردين مع التحكم في الأسعار ونسب
            الربح
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleQuickSync}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            مزامنة سريعة
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة مورد جديد
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  الموردين النشطين
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.activeProviders}
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
                  {stats.totalServices}
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
                  إجمالي الأرباح
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(totalProfit).toLocaleString()} ريال
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط الربح</p>
                <p className="text-2xl font-bold text-red-600">
                  {Math.round(averageMargin)}%
                </p>
              </div>
              <Percent className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* حالة المزامنة */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">حالة المزامنة</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">
                    آخر مزامنة: {stats.lastSync.toLocaleString("ar-SA")}
                  </span>
                </div>
                {providers.filter((p) => p.isActive).length > 0 && (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    جميع الموردين متصلين
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">عمليات المزامنة</p>
              <p className="text-xl font-bold">{stats.syncHistory.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التنقل الرئيسي */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            إدارة عامة
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            تحليل الربحية
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            إدارة الأسعار
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            اختبار النظام
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            التقارير
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdvancedProvidersManager />
        </TabsContent>

        <TabsContent value="analytics">
          <ProfitabilityAnalytics />
        </TabsContent>

        <TabsContent value="pricing">
          <PricingManagement />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* تقارير متقدمة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>تقرير الأداء الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>نمو الإيرادات:</span>
                    <span className="font-bold text-green-600">+15.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>نمو الأرباح:</span>
                    <span className="font-bold text-blue-600">+12.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>خدمات جديدة:</span>
                    <span className="font-bold text-purple-600">
                      {
                        services.filter((s) => {
                          const monthAgo = new Date();
                          monthAgo.setMonth(monthAgo.getMonth() - 1);
                          return s.lastUpdated > monthAgo;
                        }).length
                      }
                    </span>
                  </div>
                  <Button className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    تحميل التقرير المفصل
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تحليل المنافسة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>موقعنا في السوق:</span>
                    <span className="font-bold text-green-600">المرتب�� 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>فرق الأسعار:</span>
                    <span className="font-bold text-orange-600">-8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ميزة الجودة:</span>
                    <span className="font-bold text-blue-600">+22%</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    تحليل تفصيلي
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* توصيات ذكية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                توصيات ذكية لتحسين الربحية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-green-800">
                    فرصة زيادة الأرباح
                  </h4>
                  <p className="text-sm text-gray-600">
                    يمكن زيادة نسبة الربح لخدمات Instagram عالية الجودة بنسبة 5%
                    لتحقيق زيادة في الأرباح قدرها{" "}
                    {Math.round(totalProfit * 0.15).toLocaleString()} ريال
                    شهرياً
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-blue-800">تحسين التسعير</h4>
                  <p className="text-sm text-gray-600">
                    {services.filter((s) => s.profitMargin < 20).length} خدمة
                    لديها نسبة ربح أقل من 20%. يُنصح بمراجعة أسعارها أو تحسين
                    جودتها.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-orange-800">موردين جدد</h4>
                  <p className="text-sm text-gray-600">
                    إضافة مورد جديد لخدمات TikTok يمكن أن يزيد التنوع ويحسن
                    الأسعار التنافسية
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* إجراءات سريعة */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="flex flex-col items-center gap-2 h-20">
                  <Download className="h-6 w-6" />
                  تصدير جميع البيانات
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20"
                >
                  <RefreshCw className="h-6 w-6" />
                  مزامنة شاملة
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20"
                >
                  <Settings className="h-6 w-6" />
                  إعدادات متقدمة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProvidersManagementPage;
