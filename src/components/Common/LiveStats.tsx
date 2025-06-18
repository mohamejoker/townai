import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Users,
  Eye,
  Clock,
  Wifi,
  Database,
  TrendingUp,
  BarChart3,
  Zap,
  Monitor,
  X,
  RefreshCw,
} from "lucide-react";

interface SystemStats {
  users: {
    active: number;
    total: number;
    growth: number;
  };
  performance: {
    loadTime: number;
    responseTime: number;
    uptime: number;
  };
  traffic: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
  };
  system: {
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
}

const LiveStats: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<SystemStats>({
    users: { active: 0, total: 0, growth: 0 },
    performance: { loadTime: 0, responseTime: 0, uptime: 0 },
    traffic: { pageViews: 0, uniqueVisitors: 0, bounceRate: 0 },
    system: { memoryUsage: 0, cpuUsage: 0, diskUsage: 0 },
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // محاكاة البيانات المباشرة
  const generateRandomStats = (): SystemStats => {
    const baseTime = Date.now();

    return {
      users: {
        active: Math.floor(Math.random() * 50) + 120,
        total: Math.floor(Math.random() * 100) + 2800,
        growth: Math.floor(Math.random() * 20) + 5,
      },
      performance: {
        loadTime: Math.random() * 2 + 1, // 1-3 ثواني
        responseTime: Math.random() * 100 + 50, // 50-150ms
        uptime: 99.5 + Math.random() * 0.5, // 99.5-100%
      },
      traffic: {
        pageViews: Math.floor(Math.random() * 500) + 1200,
        uniqueVisitors: Math.floor(Math.random() * 200) + 800,
        bounceRate: Math.random() * 30 + 20, // 20-50%
      },
      system: {
        memoryUsage: Math.random() * 40 + 30, // 30-70%
        cpuUsage: Math.random() * 50 + 20, // 20-70%
        diskUsage: Math.random() * 20 + 40, // 40-60%
      },
    };
  };

  // تحديث الإحصائيات كل 3 ثواني
  useEffect(() => {
    if (!isVisible) return;

    const updateStats = () => {
      setStats(generateRandomStats());
      setLastUpdate(new Date());
    };

    // تحديث فوري
    updateStats();

    // تحديث دوري
    const interval = setInterval(updateStats, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // حساب الأداء الحقيقي للمتصفح
  useEffect(() => {
    if (isVisible && "performance" in window) {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const realLoadTime =
          (navigation.loadEventEnd - navigation.navigationStart) / 1000;
        setStats((prev) => ({
          ...prev,
          performance: {
            ...prev.performance,
            loadTime: realLoadTime,
          },
        }));
      }

      // قياس استهلاك الذاكرة إذا كان متاحاً
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const memoryUsagePercent =
          (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        setStats((prev) => ({
          ...prev,
          system: {
            ...prev.system,
            memoryUsage: memoryUsagePercent,
          },
        }));
      }
    }
  }, [isVisible]);

  const getStatusColor = (
    value: number,
    type: "performance" | "usage" | "growth",
  ) => {
    switch (type) {
      case "performance":
        return value > 90
          ? "text-green-600"
          : value > 70
            ? "text-yellow-600"
            : "text-red-600";
      case "usage":
        return value < 50
          ? "text-green-600"
          : value < 80
            ? "text-yellow-600"
            : "text-red-600";
      case "growth":
        return value > 10
          ? "text-green-600"
          : value > 5
            ? "text-yellow-600"
            : "text-gray-600";
    }
  };

  const formatNumber = (num: number, decimals: number = 0) => {
    return new Intl.NumberFormat("ar-SA", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-32 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 bg-white rounded-lg shadow-xl border z-40 max-h-[70vh] overflow-y-auto">
      {/* رأس الإحصائيات */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            <h3 className="font-semibold text-gray-900">إحصائيات مباشرة</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 text-xs"
            >
              متصل
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          آخر تحديث: {lastUpdate.toLocaleTimeString("ar-SA")}
        </div>
      </div>

      {/* إحصائيات المستخدمين */}
      <div className="p-4 border-b">
        <h4 className="flex items-center font-medium text-gray-800 mb-3">
          <Users className="w-4 h-4 mr-2" />
          المستخدمون
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-700">
              {formatNumber(stats.users.active)}
            </div>
            <div className="text-xs text-blue-600">نشط الآن</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-700">
              {formatNumber(stats.users.total)}
            </div>
            <div className="text-xs text-gray-600">إجمالي</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div
              className={`text-lg font-bold ${getStatusColor(stats.users.growth, "growth")}`}
            >
              +{formatNumber(stats.users.growth)}%
            </div>
            <div className="text-xs text-green-600">نمو</div>
          </div>
        </div>
      </div>

      {/* إحصائيات الأداء */}
      <div className="p-4 border-b">
        <h4 className="flex items-center font-medium text-gray-800 mb-3">
          <Zap className="w-4 h-4 mr-2" />
          الأداء
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">وقت التحميل</span>
            <div className="flex items-center">
              <span
                className={`font-semibold ${getStatusColor(stats.performance.uptime, "performance")}`}
              >
                {formatNumber(stats.performance.loadTime, 2)}s
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">زمن الاستجابة</span>
            <span className="font-semibold text-green-600">
              {formatNumber(stats.performance.responseTime, 0)}ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">وقت التشغيل</span>
            <span
              className={`font-semibold ${getStatusColor(stats.performance.uptime, "performance")}`}
            >
              {formatNumber(stats.performance.uptime, 2)}%
            </span>
          </div>
        </div>
      </div>

      {/* إحصائيات الزوار */}
      <div className="p-4 border-b">
        <h4 className="flex items-center font-medium text-gray-800 mb-3">
          <Eye className="w-4 h-4 mr-2" />
          الزوار
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-700">
              {formatNumber(stats.traffic.pageViews)}
            </div>
            <div className="text-xs text-purple-600">مشاهدات الصفحة</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-700">
              {formatNumber(stats.traffic.uniqueVisitors)}
            </div>
            <div className="text-xs text-orange-600">زوار فريدون</div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-600">معدل الارتداد: </span>
          <span
            className={`font-semibold ${getStatusColor(100 - stats.traffic.bounceRate, "performance")}`}
          >
            {formatNumber(stats.traffic.bounceRate, 1)}%
          </span>
        </div>
      </div>

      {/* إحصائيات النظام */}
      <div className="p-4">
        <h4 className="flex items-center font-medium text-gray-800 mb-3">
          <Monitor className="w-4 h-4 mr-2" />
          النظام
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>استهلاك الذاكرة</span>
              <span
                className={getStatusColor(stats.system.memoryUsage, "usage")}
              >
                {formatNumber(stats.system.memoryUsage, 1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.system.memoryUsage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>استهلاك المعالج</span>
              <span className={getStatusColor(stats.system.cpuUsage, "usage")}>
                {formatNumber(stats.system.cpuUsage, 1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.system.cpuUsage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>مساحة التخزين</span>
              <span className={getStatusColor(stats.system.diskUsage, "usage")}>
                {formatNumber(stats.system.diskUsage, 1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.system.diskUsage}%` }}
              />
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <strong>نوع الجهاز:</strong>{" "}
              {window.innerWidth >= 1024
                ? "Desktop"
                : window.innerWidth >= 768
                  ? "Tablet"
                  : "Mobile"}
            </div>
            <div>
              <strong>المتصفح:</strong> {navigator.userAgent.split(" ")[0]}
            </div>
            <div>
              <strong>الدقة:</strong> {window.innerWidth} × {window.innerHeight}
            </div>
            <div>
              <strong>الاتصال:</strong> {navigator.onLine ? "متصل" : "غير متصل"}
            </div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="mt-3 flex justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setStats(generateRandomStats());
              setLastUpdate(new Date());
            }}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            تحديث
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">مباشر</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStats;
