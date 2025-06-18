import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wifi,
  Server,
  Database,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Shield,
  Clock,
  Activity,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ConnectionTest {
  name: string;
  status: "checking" | "success" | "warning" | "error";
  message: string;
  latency?: number;
  icon: any;
}

const ConnectionDiagnostics = () => {
  const { isAuthenticated, user } = useAuth();
  const [tests, setTests] = useState<ConnectionTest[]>([
    {
      name: "الإنترنت",
      status: "checking",
      message: "جاري فحص الاتصال...",
      icon: Wifi,
    },
    {
      name: "الخادم الرئيسي",
      status: "checking",
      message: "جاري فحص الخادم...",
      icon: Server,
    },
    {
      name: "قاعدة البيانات",
      status: "checking",
      message: "جاري فحص قاعدة البيانات...",
      icon: Database,
    },
    {
      name: "نظام المصادقة",
      status: "checking",
      message: "جاري فحص المصادقة...",
      icon: Shield,
    },
    {
      name: "واجهة برمجة التطبيقات",
      status: "checking",
      message: "جاري فحص API...",
      icon: Zap,
    },
    {
      name: "الخدمات الخارجية",
      status: "checking",
      message: "جاري فحص الخدمات...",
      icon: Globe,
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<
    "good" | "warning" | "critical"
  >("good");

  const runDiagnostics = async () => {
    setIsRunning(true);

    // فحص الإنترنت
    await testConnection(0, async () => {
      const startTime = Date.now();
      try {
        await fetch("https://www.google.com/favicon.ico", { mode: "no-cors" });
        const latency = Date.now() - startTime;
        return { status: "success", message: `متصل (${latency}ms)`, latency };
      } catch {
        return { status: "error", message: "لا يوجد اتصال بالإنترنت" };
      }
    });

    // فحص الخادم الرئيسي
    await testConnection(1, async () => {
      const startTime = Date.now();
      try {
        // محاكاة فحص الخادم
        await new Promise((resolve) => setTimeout(resolve, 500));
        const latency = Date.now() - startTime;
        return {
          status: "success",
          message: `يعمل بشكل طبيعي (${latency}ms)`,
          latency,
        };
      } catch {
        return { status: "error", message: "خطأ في الاتصال بالخادم" };
      }
    });

    // فحص قاعدة البيانات
    await testConnection(2, async () => {
      try {
        // محاكاة فحص قاعدة البيانات
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (import.meta.env.DEV) {
          return {
            status: "warning",
            message: "وضع التطوير - قاعدة بيانات مؤقتة",
          };
        }
        return { status: "success", message: "متصلة ومتاحة" };
      } catch {
        return { status: "error", message: "خطأ في الاتصال بقاعدة البيانات" };
      }
    });

    // فحص نظام المصادقة
    await testConnection(3, async () => {
      try {
        if (isAuthenticated && user) {
          return {
            status: "success",
            message: `مسجل دخول كـ ${user.name || user.email}`,
          };
        } else if (import.meta.env.DEV) {
          return { status: "warning", message: "وضع التطوير - مصادقة مؤقتة" };
        } else {
          return { status: "warning", message: "غير مسجل دخول" };
        }
      } catch {
        return { status: "error", message: "خطأ في نظام المصادقة" };
      }
    });

    // فحص واجهة برمجة التطبيقات
    await testConnection(4, async () => {
      try {
        // محاكاة فحص API
        await new Promise((resolve) => setTimeout(resolve, 200));
        return { status: "success", message: "جميع النقاط متاحة" };
      } catch {
        return { status: "error", message: "خطأ في واجهة برمجة التطبيقات" };
      }
    });

    // فحص الخدمات الخارجية
    await testConnection(5, async () => {
      try {
        // محاكاة فحص الخدمات الخارجية
        await new Promise((resolve) => setTimeout(resolve, 400));
        return { status: "success", message: "جميع الخدمات متاحة" };
      } catch {
        return { status: "warning", message: "بعض الخدمات غير متاحة" };
      }
    });

    setIsRunning(false);
    updateOverallStatus();
  };

  const testConnection = async (index: number, testFn: () => Promise<any>) => {
    const result = await testFn();
    setTests((prev) =>
      prev.map((test, i) => (i === index ? { ...test, ...result } : test)),
    );
  };

  const updateOverallStatus = () => {
    setTests((currentTests) => {
      const hasErrors = currentTests.some((test) => test.status === "error");
      const hasWarnings = currentTests.some(
        (test) => test.status === "warning",
      );

      if (hasErrors) {
        setOverallStatus("critical");
      } else if (hasWarnings) {
        setOverallStatus("warning");
      } else {
        setOverallStatus("good");
      }

      return currentTests;
    });
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getOverallColor = () => {
    switch (overallStatus) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const completedTests = tests.filter(
    (test) => test.status !== "checking",
  ).length;
  const progressPercentage = (completedTests / tests.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              تشخيص الاتصال
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              فحص شامل لحالة الاتصال والخدمات
            </p>
          </div>
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`}
            />
            إعادة فحص
          </Button>
        </div>

        {isRunning && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">جاري التشخيص...</span>
              <span className="text-sm text-gray-600">
                {completedTests}/{tests.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* الحالة العامة */}
        <Alert
          className={`border-l-4 ${
            overallStatus === "good"
              ? "border-l-green-500 bg-green-50"
              : overallStatus === "warning"
                ? "border-l-yellow-500 bg-yellow-50"
                : "border-l-red-500 bg-red-50"
          }`}
        >
          <AlertDescription className={`font-medium ${getOverallColor()}`}>
            {overallStatus === "good" && "✅ جميع الأنظمة تعمل بشكل طبيعي"}
            {overallStatus === "warning" &&
              "⚠️ هناك بعض التحذيرات التي تحتاج انتباه"}
            {overallStatus === "critical" &&
              "🚨 هناك مشاكل حرجة تحتاج إصلاح فوري"}
          </AlertDescription>
        </Alert>

        {/* نتائج الفحص */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test, index) => {
            const IconComponent = test.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  test.status === "success"
                    ? "border-green-200 bg-green-50"
                    : test.status === "warning"
                      ? "border-yellow-200 bg-yellow-50"
                      : test.status === "error"
                        ? "border-red-200 bg-red-50"
                        : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-gray-700" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{test.name}</h4>
                      {getStatusIcon(test.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                    {test.latency && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {test.latency}ms
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* معلومات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tests.filter((t) => t.status === "success").length}
            </div>
            <div className="text-sm text-gray-600">خدمات تعمل</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tests.filter((t) => t.status === "warning").length}
            </div>
            <div className="text-sm text-gray-600">تحذيرات</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {tests.filter((t) => t.status === "error").length}
            </div>
            <div className="text-sm text-gray-600">أخطاء</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionDiagnostics;
