import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  Wifi,
  WifiOff,
} from "lucide-react";

const EnhancedProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();

  // مراقبة حالة الاتصال
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // محاكاة التحميل عند تغيير المسار
  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    setLoadingStatus("loading");

    // محاكاة مراحل التحميل
    const loadingSteps = [
      { progress: 20, delay: 100, status: "تحميل الصفحة..." },
      { progress: 40, delay: 200, status: "تحميل البيانات..." },
      { progress: 60, delay: 150, status: "تحميل المكونات..." },
      { progress: 80, delay: 100, status: "تطبيق التنسيقات..." },
      { progress: 100, delay: 100, status: "مكتمل!" },
    ];

    let currentStep = 0;

    const executeStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];

        setTimeout(() => {
          setProgress(step.progress);

          if (step.progress === 100) {
            setLoadingStatus("success");
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }

          currentStep++;
          executeStep();
        }, step.delay);
      }
    };

    executeStep();
  }, [location.pathname]);

  // إخفاء شريط التقدم عند عدم التحميل
  if (!isLoading && loadingStatus === "success") {
    return null;
  }

  const getProgressColor = () => {
    switch (loadingStatus) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusIcon = () => {
    switch (loadingStatus) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* شريط التقدم الرئيسي */}
      <div className="h-1 bg-gray-200">
        <div
          className={`h-full transition-all duration-300 ease-out ${getProgressColor()}`}
          style={{
            width: `${progress}%`,
            boxShadow: `0 0 10px ${
              loadingStatus === "success"
                ? "#22c55e"
                : loadingStatus === "error"
                  ? "#ef4444"
                  : "#3b82f6"
            }40`,
          }}
        />
      </div>

      {/* معلومات التحميل */}
      {isLoading && (
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <span className="text-sm font-medium text-gray-700">
                  {loadingStatus === "loading" && "جاري التحميل..."}
                  {loadingStatus === "success" && "تم التحميل بنجاح!"}
                  {loadingStatus === "error" && "حدث خطأ في التحميل"}
                </span>
                <Badge variant="outline" className="text-xs">
                  {progress}%
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                {/* مؤشر حالة الاتصال */}
                <div className="flex items-center space-x-1">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-xs text-gray-500">
                    {isOnline ? "متصل" : "غير متصل"}
                  </span>
                </div>

                {/* مؤشر السرعة */}
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-800"
                >
                  سريع
                </Badge>
              </div>
            </div>

            {/* شريط تقدم تفصيلي */}
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      )}

      {/* إشعار عدم الاتصال */}
      {!isOnline && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-2">
              <WifiOff className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">
                لا يوجد اتصال بالإنترنت. بعض الميزات قد لا تعمل بشكل صحيح.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProgressBar;
