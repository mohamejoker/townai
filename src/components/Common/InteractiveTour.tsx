import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HelpCircle,
  X,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Target,
  Lightbulb,
  Navigation,
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  position: "top" | "bottom" | "left" | "right";
  page: string; // route path
  action?: () => void;
  highlight?: boolean;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "مرحباً بك في Town Media!",
    description:
      "سنأخذك في جولة سريعة لاكتشاف جميع المميزات الرائعة في منصتنا.",
    target: "body",
    position: "bottom",
    page: "/",
    highlight: true,
  },
  {
    id: "navbar",
    title: "شريط التنقل",
    description:
      "من هنا يمكنك الوصول لجميع أقسام الموقع بسهولة. جرب الضغط على أي قسم!",
    target: "nav",
    position: "bottom",
    page: "/",
  },
  {
    id: "services-link",
    title: "صفحة الخدمات",
    description: "اكتشف مجموعة واسعة من خدمات وسائل التواصل الاجتماعي.",
    target: '[href="/services"]',
    position: "bottom",
    page: "/",
    action: () => (window.location.href = "/services"),
  },
  {
    id: "ai-chat-link",
    title: "المساعد الذكي",
    description:
      "مساعد ذكي مدعوم بالذكاء الاصطناعي لمساعدتك في جميع احتياجاتك.",
    target: '[href="/ai-chat"]',
    position: "bottom",
    page: "/",
    action: () => (window.location.href = "/ai-chat"),
  },
  {
    id: "site-builder-link",
    title: "منشئ المواقع المتقدم",
    description:
      "أداة قوية لإنشاء مواقع احترافية بالسحب والإفلات بدون كتابة كود!",
    target: '[href="/site-builder"]',
    position: "bottom",
    page: "/",
    action: () => (window.location.href = "/site-builder"),
    highlight: true,
  },
  {
    id: "floating-ai",
    title: "زر المساعد العائم",
    description: "يمكنك الوصول للمساعد الذكي من أي صفحة عبر هذا الزر العائم.",
    target: '[data-tour="floating-ai"]',
    position: "left",
    page: "/",
  },
  {
    id: "dev-tools",
    title: "أدوات التطوير",
    description:
      "في وضع التطوير، تجد هنا أدوات مفيدة للتبديل بين المستخدمين والاختبار.",
    target: '[data-tour="dev-auth"]',
    position: "top",
    page: "/",
  },
  {
    id: "admin-area",
    title: "منطقة الإدارة",
    description: "مخصصة للمديرين فقط. ستجد هنا لوحة تحكم شاملة لإدارة النظام.",
    target: "body",
    position: "bottom",
    page: "/admin",
    action: () => (window.location.href = "/login"),
  },
];

const InteractiveTour: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // تحقق من عرض الجولة للمرة الأولى
  useEffect(() => {
    const tourSeen = localStorage.getItem("tour_completed");
    setHasSeenTour(!!tourSeen);

    // عرض الجولة تلقائياً للمستخدمين الجدد
    if (!tourSeen && location.pathname === "/") {
      setTimeout(() => {
        setIsActive(true);
        setIsPlaying(true);
      }, 2000);
    }
  }, [location.pathname]);

  // تشغيل تلقائي للخطوات
  useEffect(() => {
    if (!isPlaying || !isActive) return;

    const timer = setTimeout(() => {
      nextStep();
    }, 4000); // 4 ثواني لكل خطوة

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, isActive]);

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
    setIsPlaying(true);
    navigate("/");
  };

  const stopTour = () => {
    setIsActive(false);
    setIsPlaying(false);
    setCurrentStep(0);
    localStorage.setItem("tour_completed", "true");
    setHasSeenTour(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      const nextStepData = tourSteps[nextStepIndex];

      // الانتقال للصفحة المطلوبة إذا كانت مختلفة
      if (nextStepData.page !== location.pathname) {
        navigate(nextStepData.page);
      }

      setCurrentStep(nextStepIndex);
    } else {
      stopTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      const prevStepData = tourSteps[prevStepIndex];

      if (prevStepData.page !== location.pathname) {
        navigate(prevStepData.page);
      }

      setCurrentStep(prevStepIndex);
    }
  };

  const getCurrentStep = () => tourSteps[currentStep];

  // الحصول على موقع العنصر المستهدف
  const getTargetPosition = () => {
    const step = getCurrentStep();
    const element = document.querySelector(step.target);

    if (!element) return { top: 50, left: 50 };

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height,
    };
  };

  // إضافة التمييز للعنصر المستهدف
  useEffect(() => {
    if (!isActive) return;

    const step = getCurrentStep();
    const element = document.querySelector(step.target);

    if (element && step.highlight) {
      element.classList.add("tour-highlight");

      return () => {
        element.classList.remove("tour-highlight");
      };
    }
  }, [currentStep, isActive]);

  if (!isActive) {
    return (
      <div className="fixed bottom-44 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={startTour}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          title="جولة تفاعلية في الموقع"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  const currentStepData = getCurrentStep();
  const position = getTargetPosition();

  return (
    <>
      {/* خلفية مظلمة */}
      <div className="fixed inset-0 bg-black/40 z-50" />

      {/* تمييز العنصر المستهدف */}
      <div
        className="fixed z-50 border-4 border-blue-500 rounded-lg pointer-events-none"
        style={{
          top: position.top - 4,
          left: position.left - 4,
          width: (position.width || 0) + 8,
          height: (position.height || 0) + 8,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.4)",
          transition: "all 0.3s ease",
        }}
      />

      {/* نافذة الشرح */}
      <Card
        className="fixed z-50 w-80 shadow-2xl border-2 border-blue-200"
        style={{
          top:
            currentStepData.position === "bottom"
              ? position.top + (position.height || 0) + 20
              : currentStepData.position === "top"
                ? position.top - 200
                : position.top,
          left:
            currentStepData.position === "right"
              ? position.left + (position.width || 0) + 20
              : currentStepData.position === "left"
                ? position.left - 320
                : position.left,
          maxWidth: "320px",
        }}
      >
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              {currentStepData.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {currentStep + 1} / {tourSteps.length}
              </Badge>
              <Button variant="ghost" size="sm" onClick={stopTour}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <p className="text-gray-700 mb-4 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* أزرار التحكم */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex space-x-2">
              {currentStepData.action && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={currentStepData.action}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  جرب
                </Button>
              )}

              <Button
                size="sm"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === tourSteps.length - 1 ? "إنهاء" : "التالي"}
                <ArrowRight className="w-4 h-4 mr-1" />
              </Button>
            </div>
          </div>

          {/* شريط التقدم */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>التقدم</span>
              <span>
                {Math.round(((currentStep + 1) / tourSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* نصائح إضافية */}
          {currentStepData.highlight && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <Lightbulb className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">ميزة مهمة!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* معلومات الجولة */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">جولة تفاعلية</span>
              {isPlaying && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSS للتمييز */}
      <style jsx global>{`
        .tour-highlight {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
      `}</style>
    </>
  );
};

export default InteractiveTour;
