import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Server,
  Database,
  Wifi,
  Shield,
  Zap,
  Clock,
  HardDrive,
  Cpu,
  Users,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  BarChart3,
  Network,
  Gauge,
} from "lucide-react";
import ConnectionDiagnostics from "@/components/Common/ConnectionDiagnostics";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "critical";
  icon: any;
  description: string;
}

interface ServiceStatus {
  name: string;
  status: "online" | "offline" | "maintenance";
  uptime: string;
  lastCheck: string;
  responseTime: number;
  icon: any;
}

const SystemHealthDetailedPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [overallHealth, setOverallHealth] = useState<
    "healthy" | "warning" | "critical"
  >("healthy");

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    setIsLoading(true);

    // محاكاة بيانات النظام
    const metrics: SystemMetric[] = [
      {
        name: "استخدام المعالج",
        value: Math.random() * 80 + 10,
        unit: "%",
        status: Math.random() > 0.7 ? "warning" : "good",
        icon: Cpu,
        description: "الحمولة الحالية على المعالج",
      },
      {
        name: "استخدام الذاكرة",
        value: Math.random() * 85 + 5,
        unit: "%",
        status: Math.random() > 0.8 ? "critical" : "good",
        icon: Memory,
        description: "استخدام ذاكرة الوصول العشوائي",
      },
      {
        name: "مساحة التخزين",
        value: Math.random() * 70 + 20,
        unit: "%",
        status: Math.random() > 0.85 ? "warning" : "good",
        icon: HardDrive,
        description: "المساحة المستخدمة من القرص الصلب",
      },
      {
        name: "حركة الشبكة",
        value: Math.random() * 100 + 10,
        unit: "MB/s",
        status: "good",
        icon: Network,
        description: "سرعة نقل البيانات عبر الشبكة",
      },
      {
        name: "المستخدمون النشطون",
        value: Math.floor(Math.random() * 500 + 50),
        unit: "مستخدم",
        status: "good",
        icon: Users,
        description: "عدد المستخدمين المتصلين حالياً",
      },
      {
        name: "وقت الاستجابة",
        value: Math.random() * 200 + 50,
        unit: "ms",
        status: Math.random() > 0.7 ? "warning" : "good",
        icon: Gauge,
        description: "متوسط وقت الاستجابة للطلبات",
      },
    ];

    const servicesList: ServiceStatus[] = [
      {
        name: "خادم الويب",
        status: "online",
        uptime: "99.9%",
        lastCheck: new Date().toLocaleTimeString("ar-SA"),
        responseTime: Math.random() * 100 + 50,
        icon: Server,
      },
      {
        name: "قاعدة البيانات",
        status: Math.random() > 0.9 ? "maintenance" : "online",
        uptime: "99.7%",
        lastCheck: new Date().toLocaleTimeString("ar-SA"),
        responseTime: Math.random() * 150 + 30,
        icon: Database,
      },
      {
        name: "نظام المصادقة",
        status: "online",
        uptime: "99.8%",
        lastCheck: new Date().toLocaleTimeString("ar-SA"),
        responseTime: Math.random() * 80 + 20,
        icon: Shield,
      },
      {
        name: "واجهة برمجة التطبيقات",
        status: "online",
        uptime: "99.6%",
        lastCheck: new Date().toLocaleTimeString("ar-SA"),
        responseTime: Math.random() * 120 + 40,
        icon: Zap,
      },
      {
        name: "خدمات الدفع",
        status: Math.random() > 0.95 ? "offline" : "online",
        uptime: "99.4%",
        lastCheck: new Date().toLocaleTimeString("ar-SA"),
        responseTime: Math.random() * 200 + 100,
        icon: Globe,
      },
    ];

    setSystemMetrics(metrics);
    setServices(servicesList);

    // تحديد الحالة العامة
    const hasCritical =
      metrics.some((m) => m.status === "critical") ||
      servicesList.some((s) => s.status === "offline");
    const hasWarning =
      metrics.some((m) => m.status === "warning") ||
      servicesList.some((s) => s.status === "maintenance");

    if (hasCritical) {
      setOverallHealth("critical");
    } else if (hasWarning) {
      setOverallHealth("warning");
    } else {
      setOverallHealth("healthy");
    }

    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
      case "online":
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
      case "maintenance":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
      case "offline":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
      case "online":
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
      case "maintenance":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical":
      case "offline":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-600" />;
    }
  };

  const getOverallMessage = () => {
    switch (overallHealth) {
      case "healthy":
        return "جميع الأنظمة تعمل بشكل مثالي";
      case "warning":
        return "هناك بعض التحذيرات التي تحتاج متابعة";
      case "critical":
        return "هناك مشاكل حرجة تحتاج تدخل فوري";
      default:
        return "جاري فحص حالة النظام...";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">صحة النظام</h1>
          <p className="text-gray-600">
            مراقبة شاملة لأداء وحالة جميع أنظمة المنصة
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
          <Button
            onClick={loadSystemData}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            تحديث البيانات
          </Button>
        </div>
      </div>

      {/* الحالة العامة */}
      <Alert
        className={`border-l-4 ${
          overallHealth === "healthy"
            ? "border-l-green-500 bg-green-50"
            : overallHealth === "warning"
              ? "border-l-yellow-500 bg-yellow-50"
              : "border-l-red-500 bg-red-50"
        }`}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon(overallHealth)}
          <AlertDescription
            className={`font-medium ${
              overallHealth === "healthy"
                ? "text-green-800"
                : overallHealth === "warning"
                  ? "text-yellow-800"
                  : "text-red-800"
            }`}
          >
            {getOverallMessage()}
          </AlertDescription>
        </div>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="metrics">المقاييس</TabsTrigger>
          <TabsTrigger value="services">الخدمات</TabsTrigger>
          <TabsTrigger value="diagnostics">التشخيص</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* بطاقات الإحصائيات السريعة */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      الخدمات النشطة
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {services.filter((s) => s.status === "online").length}/
                      {services.length}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      متوسط وقت التشغيل
                    </p>
                    <p className="text-2xl font-bold text-blue-600">99.7%</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      وقت الاستجابة
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(
                        services.reduce((sum, s) => sum + s.responseTime, 0) /
                          services.length,
                      )}
                      ms
                    </p>
                  </div>
                  <Gauge className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      التحديث الأخير
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date().toLocaleTimeString("ar-SA")}
                    </p>
                  </div>
                  <RefreshCw className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الخدمات الحرجة */}
          <Card>
            <CardHeader>
              <CardTitle>حالة الخدمات الأساسية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.slice(0, 6).map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        service.status === "online"
                          ? "border-green-200 bg-green-50"
                          : service.status === "maintenance"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6 text-gray-700" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {service.name}
                            </h4>
                            {getStatusIcon(service.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            وقت التشغيل: {service.uptime}
                          </p>
                          <p className="text-xs text-gray-500">
                            الاستجابة: {Math.round(service.responseTime)}ms
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {metric.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {metric.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status === "good"
                          ? "جيد"
                          : metric.status === "warning"
                            ? "تحذير"
                            : "حرج"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {typeof metric.value === "number" &&
                          metric.value % 1 !== 0
                            ? metric.value.toFixed(1)
                            : metric.value}
                          {metric.unit}
                        </span>
                        <span className="text-sm text-gray-500">
                          {metric.status === "good"
                            ? "✅"
                            : metric.status === "warning"
                              ? "⚠️"
                              : "🚨"}
                        </span>
                      </div>

                      <Progress
                        value={
                          typeof metric.value === "number"
                            ? Math.min(metric.value, 100)
                            : 0
                        }
                        className={`h-2 ${
                          metric.status === "good"
                            ? "text-green-600"
                            : metric.status === "warning"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            آخر فحص: {service.lastCheck}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">وقت التشغيل</p>
                          <p className="font-semibold text-gray-900">
                            {service.uptime}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">الاستجابة</p>
                          <p className="font-semibold text-gray-900">
                            {Math.round(service.responseTime)}ms
                          </p>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status === "online"
                            ? "متصل"
                            : service.status === "maintenance"
                              ? "صيانة"
                              : "غير متصل"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-6">
          <ConnectionDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthDetailedPage;
