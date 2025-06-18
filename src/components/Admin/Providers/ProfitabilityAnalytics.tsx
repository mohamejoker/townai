import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Percent,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import { advancedProviderSync } from "@/services/providers/advancedProviderSync";
import type { ProviderService } from "@/services/providers/types";

interface ProfitMetrics {
  totalRevenue: number;
  totalProfit: number;
  averageMargin: number;
  topPerformingServices: ProviderService[];
  marginDistribution: { margin: string; count: number; percentage: number }[];
  platformBreakdown: {
    platform: string;
    revenue: number;
    profit: number;
    services: number;
  }[];
  qualityAnalysis: { quality: string; averageMargin: number; count: number }[];
  trendData: {
    date: string;
    revenue: number;
    profit: number;
    margin: number;
  }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const ProfitabilityAnalytics = () => {
  const [services, setServices] = useState<ProviderService[]>([]);
  const [metrics, setMetrics] = useState<ProfitMetrics | null>(null);
  const [timeFilter, setTimeFilter] = useState("30d");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeFilter, platformFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allServices = advancedProviderSync.getServices();
      let filteredServices = allServices;

      // فلترة حسب المنصة
      if (platformFilter !== "all") {
        filteredServices = allServices.filter(
          (s) => s.platform === platformFilter,
        );
      }

      setServices(filteredServices);
      const calculatedMetrics = calculateMetrics(filteredServices);
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error("خطأ في تحميل البيانات:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (services: ProviderService[]): ProfitMetrics => {
    // حساب الإيرادات والأرباح (تقديري بناءً على الأسعار)
    const totalRevenue = services.reduce(
      (sum, s) => sum + s.finalRate * 100,
      0,
    );
    const totalCost = services.reduce(
      (sum, s) => sum + s.originalRate * 100,
      0,
    );
    const totalProfit = totalRevenue - totalCost;
    const averageMargin =
      services.length > 0
        ? services.reduce((sum, s) => sum + s.profitMargin, 0) / services.length
        : 0;

    // أفضل الخدمات أداءً
    const topPerformingServices = services
      .sort(
        (a, b) =>
          (b.finalRate - b.originalRate) * 100 -
          (a.finalRate - a.originalRate) * 100,
      )
      .slice(0, 10);

    // توزيع نسب الربح
    const marginRanges = [
      { range: "0-10%", min: 0, max: 10 },
      { range: "10-20%", min: 10, max: 20 },
      { range: "20-30%", min: 20, max: 30 },
      { range: "30-50%", min: 30, max: 50 },
      { range: "50%+", min: 50, max: 1000 },
    ];

    const marginDistribution = marginRanges.map((range) => {
      const count = services.filter(
        (s) => s.profitMargin >= range.min && s.profitMargin < range.max,
      ).length;
      const percentage =
        services.length > 0 ? (count / services.length) * 100 : 0;

      return {
        margin: range.range,
        count,
        percentage: Math.round(percentage),
      };
    });

    // تحليل المنصات
    const platforms = [
      "instagram",
      "tiktok",
      "youtube",
      "twitter",
      "facebook",
      "snapchat",
    ];
    const platformBreakdown = platforms
      .map((platform) => {
        const platformServices = services.filter(
          (s) => s.platform === platform,
        );
        const revenue = platformServices.reduce(
          (sum, s) => sum + s.finalRate * 100,
          0,
        );
        const cost = platformServices.reduce(
          (sum, s) => sum + s.originalRate * 100,
          0,
        );
        const profit = revenue - cost;

        return {
          platform,
          revenue: Math.round(revenue),
          profit: Math.round(profit),
          services: platformServices.length,
        };
      })
      .filter((p) => p.services > 0);

    // تحليل الجودة
    const qualityAnalysis = ["high", "medium", "low"]
      .map((quality) => {
        const qualityServices = services.filter((s) => s.quality === quality);
        const averageMargin =
          qualityServices.length > 0
            ? qualityServices.reduce((sum, s) => sum + s.profitMargin, 0) /
              qualityServices.length
            : 0;

        return {
          quality,
          averageMargin: Math.round(averageMargin * 100) / 100,
          count: qualityServices.length,
        };
      })
      .filter((q) => q.count > 0);

    // بيانات الاتجاه (محاكاة)
    const trendData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const baseRevenue = totalRevenue / 30;
      const variation = (Math.random() - 0.5) * 0.2; // تغيير ±20%
      const revenue = Math.round(baseRevenue * (1 + variation));
      const cost = Math.round(revenue * 0.75); // تكلفة ثابتة 75%
      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        date: date.toLocaleDateString("ar-SA", {
          day: "2-digit",
          month: "2-digit",
        }),
        revenue,
        profit,
        margin: Math.round(margin * 100) / 100,
      };
    });

    return {
      totalRevenue: Math.round(totalRevenue),
      totalProfit: Math.round(totalProfit),
      averageMargin: Math.round(averageMargin * 100) / 100,
      topPerformingServices,
      marginDistribution,
      platformBreakdown,
      qualityAnalysis,
      trendData,
    };
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">جاري تحليل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            تحليل الربحية والأداء
          </h2>
          <p className="text-gray-600">
            إحصائيات مفصلة للأرباح والعوائد من الخدمات
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-48">
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

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 أيام</SelectItem>
              <SelectItem value="30d">30 يوم</SelectItem>
              <SelectItem value="90d">90 يوم</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الإيرادات
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  {getChangeIcon(12.5)}
                  <span className="mr-1">12.5% هذا الشهر</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
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
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(metrics.totalProfit)}
                </p>
                <div className="flex items-center text-sm text-blue-600 mt-1">
                  {getChangeIcon(8.3)}
                  <span className="mr-1">8.3% هذا الشهر</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
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
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.averageMargin}%
                </p>
                <div className="flex items-center text-sm text-purple-600 mt-1">
                  {getChangeIcon(2.1)}
                  <span className="mr-1">2.1% هذا الشهر</span>
                </div>
              </div>
              <Percent className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">هامش الربح</p>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics.totalRevenue > 0
                    ? Math.round(
                        (metrics.totalProfit / metrics.totalRevenue) * 100,
                      )
                    : 0}
                  %
                </p>
                <div className="flex items-center text-sm text-orange-600 mt-1">
                  {getChangeIcon(5.2)}
                  <span className="mr-1">5.2% هذا الشهر</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>اتجاه الإيرادات والأرباح</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#0088FE"
                  fill="#0088FE"
                  fillOpacity={0.6}
                  name="الإيرادات"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="2"
                  stroke="#00C49F"
                  fill="#00C49F"
                  fillOpacity={0.6}
                  name="الأرباح"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الأرباح حسب المنصة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.platformBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ platform, percentage }) =>
                    `${platform} (${percentage}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="profit"
                >
                  {metrics.platformBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Margin Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع نسب الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.marginDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="margin" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="عدد الخدمات" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>تحليل الجودة والربحية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.qualityAnalysis.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {item.quality === "high"
                        ? "جودة عالية"
                        : item.quality === "medium"
                          ? "جودة متوسطة"
                          : "جودة منخفضة"}
                    </p>
                    <p className="text-sm text-gray-600">{item.count} خدمة</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{item.averageMargin}%</p>
                    <p className="text-sm text-gray-600">متوسط الربح</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Services */}
      <Card>
        <CardHeader>
          <CardTitle>أفضل الخدمات أداءً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.topPerformingServices.slice(0, 5).map((service, index) => {
              const profit = (service.finalRate - service.originalRate) * 100;
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <h3 className="font-medium">
                        {service.arabicName || service.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {service.platform} • {service.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      +{formatCurrency(profit)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {service.profitMargin}% ربح
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Platform Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات تفصيلية للمنصات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-2">المنصة</th>
                  <th className="text-right py-2">عدد الخدمات</th>
                  <th className="text-right py-2">الإيرادات</th>
                  <th className="text-right py-2">الأرباح</th>
                  <th className="text-right py-2">هامش الربح</th>
                  <th className="text-right py-2">الأداء</th>
                </tr>
              </thead>
              <tbody>
                {metrics.platformBreakdown.map((platform, index) => {
                  const margin =
                    platform.revenue > 0
                      ? (platform.profit / platform.revenue) * 100
                      : 0;
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <Badge variant="outline">{platform.platform}</Badge>
                      </td>
                      <td className="py-3">{platform.services}</td>
                      <td className="py-3">
                        {formatCurrency(platform.revenue)}
                      </td>
                      <td className="py-3 text-green-600">
                        {formatCurrency(platform.profit)}
                      </td>
                      <td className="py-3">
                        {Math.round(margin * 100) / 100}%
                      </td>
                      <td className="py-3">
                        <Progress value={margin} className="h-2 w-20" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitabilityAnalytics;
