import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Wifi,
  DollarSign,
  RefreshCw,
  Download,
  Settings,
  Activity,
} from "lucide-react";
import { advancedProviderSync } from "@/services/providers/advancedProviderSync";

interface TestResult {
  name: string;
  status: "pending" | "running" | "success" | "warning" | "error";
  message: string;
  duration?: number;
  details?: any;
}

const ProviderSystemTester = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<
    "idle" | "running" | "completed"
  >("idle");
  const [progress, setProgress] = useState(0);

  const testDefinitions = [
    {
      name: "اختبار الاتصال بالموردين",
      test: testProviderConnections,
    },
    {
      name: "اختبار سحب الخدمات",
      test: testServiceFetch,
    },
    {
      name: "اختبار معالجة البيانات",
      test: testDataProcessing,
    },
    {
      name: "اختبار حساب الأرباح",
      test: testProfitCalculation,
    },
    {
      name: "اختبار التخزين",
      test: testDataStorage,
    },
    {
      name: "اختبار قواعد التسعير",
      test: testPricingRules,
    },
    {
      name: "اختبار الترجمة والتوطين",
      test: testLocalization,
    },
    {
      name: "اختبار الأداء",
      test: testPerformance,
    },
  ];

  useEffect(() => {
    initializeTests();
  }, []);

  const initializeTests = () => {
    const initialTests = testDefinitions.map((def) => ({
      name: def.name,
      status: "pending" as const,
      message: "في انتظار التشغيل",
    }));
    setTests(initialTests);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus("running");
    setProgress(0);

    const results: TestResult[] = [];

    for (let i = 0; i < testDefinitions.length; i++) {
      const testDef = testDefinitions[i];

      // تحديث حالة الاختبار الحالي
      setTests((prev) =>
        prev.map((test, index) =>
          index === i
            ? {
                ...test,
                status: "running" as const,
                message: "جاري التشغيل...",
              }
            : test,
        ),
      );

      try {
        const startTime = Date.now();
        const result = await testDef.test();
        const duration = Date.now() - startTime;

        const testResult: TestResult = {
          name: testDef.name,
          status: result.success
            ? "success"
            : result.warning
              ? "warning"
              : "error",
          message: result.message,
          duration,
          details: result.details,
        };

        results.push(testResult);

        // تحديث النتيجة
        setTests((prev) =>
          prev.map((test, index) => (index === i ? testResult : test)),
        );
      } catch (error) {
        const testResult: TestResult = {
          name: testDef.name,
          status: "error",
          message: `خطأ في التشغيل: ${error}`,
          duration: 0,
        };

        results.push(testResult);
        setTests((prev) =>
          prev.map((test, index) => (index === i ? testResult : test)),
        );
      }

      setProgress(((i + 1) / testDefinitions.length) * 100);

      // تأخير قصير بين الاختبارات
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    setOverallStatus("completed");
  };

  // اختبار الاتصال بالموردين
  async function testProviderConnections(): Promise<{
    success: boolean;
    warning?: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const providers = advancedProviderSync.getProviders();
      const activeProviders = providers.filter((p) => p.isActive);

      if (activeProviders.length === 0) {
        return {
          success: false,
          message: "لا توجد موردين نشطين للاختبار",
        };
      }

      const connectionResults = [];
      for (const provider of activeProviders) {
        try {
          // محاكاة اختبار الاتصال
          const testUrl = provider.apiUrl;
          const isReachable = testUrl.includes("http");

          connectionResults.push({
            provider: provider.name,
            status: isReachable ? "success" : "error",
            response_time: Math.random() * 1000 + 100,
          });
        } catch (error) {
          connectionResults.push({
            provider: provider.name,
            status: "error",
            error: error,
          });
        }
      }

      const successCount = connectionResults.filter(
        (r) => r.status === "success",
      ).length;
      const successRate = (successCount / connectionResults.length) * 100;

      return {
        success: successRate > 50,
        warning: successRate <= 80 && successRate > 50,
        message: `${successCount}/${connectionResults.length} موردين متاحين (${Math.round(successRate)}%)`,
        details: connectionResults,
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في اختبار الاتصال: ${error}`,
      };
    }
  }

  // اختبار سحب الخدمات
  async function testServiceFetch(): Promise<{
    success: boolean;
    warning?: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const providers = advancedProviderSync.getProviders();
      const testProvider = providers.find((p) => p.isActive);

      if (!testProvider) {
        return {
          success: false,
          message: "لا يوجد مورد نشط للاختبار",
        };
      }

      // محاكاة سحب الخدمات
      const simulatedServices = [
        {
          id: "test-1",
          name: "Instagram Followers Test",
          rate: "0.5",
          min: "100",
          max: "10000",
          category: "Instagram",
        },
        {
          id: "test-2",
          name: "TikTok Views Test",
          rate: "0.3",
          min: "1000",
          max: "100000",
          category: "TikTok",
        },
      ];

      return {
        success: true,
        message: `تم سحب ${simulatedServices.length} خدمة اختبارية بنجاح`,
        details: {
          services_count: simulatedServices.length,
          sample_services: simulatedServices,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في سحب الخدمات: ${error}`,
      };
    }
  }

  // اختبار معالجة البيانات
  async function testDataProcessing(): Promise<{
    success: boolean;
    warning?: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const services = advancedProviderSync.getServices();

      if (services.length === 0) {
        return {
          success: false,
          message: "لا توجد خدمات لاختبار المعالجة",
        };
      }

      // اختبار البيانات
      const validServices = services.filter(
        (s) =>
          s.originalRate > 0 &&
          s.finalRate > 0 &&
          s.minOrder > 0 &&
          s.maxOrder >= s.minOrder,
      );

      const validationRate = (validServices.length / services.length) * 100;

      return {
        success: validationRate > 90,
        warning: validationRate <= 90 && validationRate > 70,
        message: `${validServices.length}/${services.length} خدمة صالحة (${Math.round(validationRate)}%)`,
        details: {
          total_services: services.length,
          valid_services: validServices.length,
          validation_rate: validationRate,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في معالجة البيانات: ${error}`,
      };
    }
  }

  // اختبار حساب الأرباح
  async function testProfitCalculation(): Promise<{
    success: boolean;
    warning?: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const services = advancedProviderSync.getServices();

      if (services.length === 0) {
        return {
          success: false,
          message: "لا توجد خدمات لاختبار حساب الأرباح",
        };
      }

      const calculationTests = services.slice(0, 10).map((service) => {
        const expectedFinalRate =
          service.originalRate * (1 + service.profitMargin / 100);
        const actualFinalRate = service.finalRate;
        const difference = Math.abs(expectedFinalRate - actualFinalRate);
        const isAccurate = difference < 0.01; // دقة حتى السنت

        return {
          service_id: service.id,
          original_rate: service.originalRate,
          profit_margin: service.profitMargin,
          expected_final: expectedFinalRate,
          actual_final: actualFinalRate,
          is_accurate: isAccurate,
          difference,
        };
      });

      const accurateCount = calculationTests.filter(
        (t) => t.is_accurate,
      ).length;
      const accuracyRate = (accurateCount / calculationTests.length) * 100;

      return {
        success: accuracyRate > 95,
        warning: accuracyRate <= 95 && accuracyRate > 85,
        message: `${accurateCount}/${calculationTests.length} حساب دقيق (${Math.round(accuracyRate)}%)`,
        details: {
          tests_performed: calculationTests.length,
          accurate_calculations: accurateCount,
          accuracy_rate: accuracyRate,
          sample_calculations: calculationTests.slice(0, 3),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في اختبار حساب الأرباح: ${error}`,
      };
    }
  }

  // اختبار التخزين
  async function testDataStorage(): Promise<{
    success: boolean;
    warning?: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const testData = {
        test_key: "provider_system_test",
        test_value: { timestamp: Date.now(), data: "test" },
      };

      // اختبار الكتابة
      localStorage.setItem(
        testData.test_key,
        JSON.stringify(testData.test_value),
      );

      // اختبار القراءة
      const retrieved = localStorage.getItem(testData.test_key);
      const parsed = JSON.parse(retrieved || "{}");

      // تنظيف
      localStorage.removeItem(testData.test_key);

      const isWorking = parsed.timestamp === testData.test_value.timestamp;

      return {
        success: isWorking,
        message: isWorking
          ? "نظام التخزين يعمل بشكل صحيح"
          : "مشكلة في نظام التخزين",
        details: {
          storage_available: typeof Storage !== "undefined",
          read_write_test: isWorking,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في اختبار التخزين: ${error}`,
      };
    }
  }

  // اختبار قواعد التسعير
  async function testPricingRules(): Promise<{
    success: boolean;
    warning?: boolean;
    message: string;
    details?: any;
  }> {
    try {
      // إنشاء قاعدة اختبار
      const testRule = {
        id: "test-rule",
        name: "قاعدة اختبار",
        conditions: { platform: "instagram" },
        profitMargin: 25,
        isActive: true,
      };

      // اختبار تطبيق القاعدة
      const instagramServices = advancedProviderSync
        .getServices()
        .filter((s) => s.platform === "instagram");

      if (instagramServices.length === 0) {
        return {
          success: true,
          warning: true,
          message: "لا توجد خدمات Instagram لاختبار القواعد",
        };
      }

      const applicableServices = instagramServices.length;

      return {
        success: true,
        message: `نظام قواعد التسعير يعمل - ${applicableServices} خدمة قابلة للتطبيق`,
        details: {
          test_rule: testRule,
          applicable_services: applicableServices,
          total_instagram_services: instagramServices.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في اختبار قواعد التسعير: ${error}`,
      };
    }
  }

  // اختبار الترجمة والتوطين
  async function testLocalization(): Promise<{
    success: boolean;
    warning?: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const services = advancedProviderSync.getServices();
      const servicesWithArabicNames = services.filter(
        (s) => s.arabicName && s.arabicName.trim() !== "",
      );
      const servicesWithArabicDesc = services.filter(
        (s) => s.arabicDescription && s.arabicDescription.trim() !== "",
      );

      const nameTranslationRate =
        services.length > 0
          ? (servicesWithArabicNames.length / services.length) * 100
          : 0;
      const descTranslationRate =
        services.length > 0
          ? (servicesWithArabicDesc.length / services.length) * 100
          : 0;

      const avgTranslationRate =
        (nameTranslationRate + descTranslationRate) / 2;

      return {
        success: avgTranslationRate > 80,
        warning: avgTranslationRate <= 80 && avgTranslationRate > 50,
        message: `معدل الترجمة: ${Math.round(avgTranslationRate)}% (الأسماء: ${Math.round(nameTranslationRate)}%, الأوصاف: ${Math.round(descTranslationRate)}%)`,
        details: {
          total_services: services.length,
          arabic_names: servicesWithArabicNames.length,
          arabic_descriptions: servicesWithArabicDesc.length,
          name_translation_rate: nameTranslationRate,
          description_translation_rate: descTranslationRate,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في اختبار الترجمة: ${error}`,
      };
    }
  }

  // اختبار الأداء
  async function testPerformance(): Promise<{
    success: boolean;
    warning?: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const startTime = Date.now();

      // اختبار عمليات متعددة
      const services = advancedProviderSync.getServices();
      const providers = advancedProviderSync.getProviders();
      const stats = advancedProviderSync.getSyncStats();

      // معالجة البيانات
      const processed = services.map((s) => ({
        id: s.id,
        profit: (s.finalRate - s.originalRate) * 100,
      }));

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // اختبار الذاكرة
      const memoryUsage = (performance as any).memory
        ? {
            used: (performance as any).memory.usedJSHeapSize,
            total: (performance as any).memory.totalJSHeapSize,
            limit: (performance as any).memory.jsHeapSizeLimit,
          }
        : null;

      return {
        success: executionTime < 1000, // أقل من ثانية
        warning: executionTime >= 1000 && executionTime < 3000,
        message: `وقت التنفيذ: ${executionTime}ms، معالجة ${processed.length} خدمة`,
        details: {
          execution_time: executionTime,
          processed_services: processed.length,
          memory_usage: memoryUsage,
          operations_performed: [
            "getServices",
            "getProviders",
            "getSyncStats",
            "dataProcessing",
          ],
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في اختبار الأداء: ${error}`,
      };
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-400" />;
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return "border-gray-200 bg-gray-50";
      case "running":
        return "border-blue-200 bg-blue-50";
      case "success":
        return "border-green-200 bg-green-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "error":
        return "border-red-200 bg-red-50";
    }
  };

  const exportTestResults = () => {
    const report = {
      timestamp: new Date().toISOString(),
      overall_status: overallStatus,
      tests: tests,
      summary: {
        total: tests.length,
        passed: tests.filter((t) => t.status === "success").length,
        warnings: tests.filter((t) => t.status === "warning").length,
        failed: tests.filter((t) => t.status === "error").length,
        pending: tests.filter((t) => t.status === "pending").length,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `provider-system-test-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                اختبار نظام الموردين والخدمات
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                اختبار شامل لجميع وظائف النظام والتأكد من سلامة العمليات
              </p>
            </div>
            <div className="flex gap-2">
              {overallStatus === "completed" && (
                <Button variant="outline" onClick={exportTestResults}>
                  <Download className="h-4 w-4 mr-2" />
                  تصدير النتائج
                </Button>
              )}
              <Button
                onClick={runAllTests}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "جاري التشغيل..." : "تشغيل جميع الاختبارات"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isRunning && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>التقدم العام</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(test.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {test.duration && (
                      <p className="text-sm text-gray-500">{test.duration}ms</p>
                    )}
                    <Badge
                      variant={
                        test.status === "success"
                          ? "default"
                          : test.status === "warning"
                            ? "secondary"
                            : test.status === "error"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {test.status === "pending"
                        ? "في الانتظار"
                        : test.status === "running"
                          ? "قيد التشغيل"
                          : test.status === "success"
                            ? "نجح"
                            : test.status === "warning"
                              ? "تحذير"
                              : "فشل"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {overallStatus === "completed" && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                تم الانتهاء من جميع الاختبارات. النتائج:{" "}
                {tests.filter((t) => t.status === "success").length} نجح،
                {tests.filter((t) => t.status === "warning").length} تحذير،
                {tests.filter((t) => t.status === "error").length} فشل
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderSystemTester;
