import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Brain,
  X,
  Send,
  Lightbulb,
  Wand2,
  Eye,
  Palette,
  Type,
  Layout,
  Image,
  Zap,
  Target,
  Rocket,
  Magic,
} from "lucide-react";
import { SiteData } from "./context/SiteBuilderContext";

interface AIAssistantProps {
  siteData: SiteData;
  onSuggestion: (suggestion: AISuggestion) => void;
  onClose: () => void;
}

interface AISuggestion {
  type: "content" | "design" | "structure" | "seo" | "improvement";
  elementId?: string;
  data: Record<string, unknown>;
  description: string;
  confidence: number;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  siteData,
  onSuggestion,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [userMessage, setUserMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [chatHistory, setChatHistory] = useState<
    Array<{
      type: "user" | "ai";
      message: string;
      timestamp: Date;
    }>
  >([
    {
      type: "ai",
      message:
        "مرحباً! أنا مساعدك الذكي لتطوير المواقع. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
    },
  ]);

  const quickActions = [
    {
      icon: Lightbulb,
      title: "اقتراحات تحسين",
      description: "احصل على اقتراحات لتحسين موقعك",
      action: "improve",
    },
    {
      icon: Palette,
      title: "تحسين الألوان",
      description: "اقتراحات لتحسين نظام الألوان",
      action: "colors",
    },
    {
      icon: Type,
      title: "تحسين المحتوى",
      description: "اقتراحات لتحسين النصوص والمحتوى",
      action: "content",
    },
    {
      icon: Layout,
      title: "تحسين التخطيط",
      description: "اقتراحات لتحسين تنسيق الصفحة",
      action: "layout",
    },
    {
      icon: Eye,
      title: "تقييم شامل",
      description: "تحليل شامل لموقعك مع التوصيات",
      action: "analyze",
    },
    {
      icon: Target,
      title: "تحسين SEO",
      description: "اقتراحات لتحسين محركات البحث",
      action: "seo",
    },
  ];

  // تحليل الموقع وإنتاج اقتراحات ذكية
  const analyzeWebsite = useCallback(
    async (analysisType: string) => {
      setIsAnalyzing(true);

      // محاكاة تحليل ذكي
      setTimeout(() => {
        const newSuggestions: AISuggestion[] = generateSuggestions(
          siteData,
          analysisType,
        );
        setSuggestions(newSuggestions);

        const aiMessage = generateAnalysisMessage(
          analysisType,
          newSuggestions.length,
        );
        setChatHistory((prev) => [
          ...prev,
          {
            type: "ai",
            message: aiMessage,
            timestamp: new Date(),
          },
        ]);

        setIsAnalyzing(false);
      }, 2000);
    },
    [siteData],
  );

  // إرسال رسالة للمساعد الذكي
  const sendMessage = useCallback(async () => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      type: "user" as const,
      message: userMessage,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, newUserMessage]);

    // محاكاة رد ذكي
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage, siteData);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message: aiResponse,
          timestamp: new Date(),
        },
      ]);
    }, 1000);

    setUserMessage("");
  }, [userMessage, siteData]);

  // تطبيق اقتراح
  const applySuggestion = useCallback(
    (suggestion: AISuggestion) => {
      onSuggestion(suggestion);

      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message: `تم تطبيق الاقتراح: ${suggestion.description}`,
          timestamp: new Date(),
        },
      ]);
    },
    [onSuggestion],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end p-4">
      <Card className="w-96 h-[600px] flex flex-col bg-white shadow-2xl">
        {/* رأس المساعد */}
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              المساعد الذكي
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm opacity-90">مدعوم بالذكاء الاصطناعي</div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* الإجراءات السريعة */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold mb-3">إجراءات سريعة</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.slice(0, 4).map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-auto p-2 flex flex-col items-center text-center"
                    onClick={() => analyzeWebsite(action.action)}
                    disabled={isAnalyzing}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-xs">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* محادثة */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin">
                      <Brain className="w-4 h-4" />
                    </div>
                    <span className="text-sm">يتم التحليل...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* الاقتراحات */}
          {suggestions.length > 0 && (
            <div className="p-4 border-t border-gray-200 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-semibold mb-2">اقتراحات التحسين</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-blue-50 rounded border"
                  >
                    <div className="flex-1">
                      <p className="text-xs">{suggestion.description}</p>
                      <Badge
                        variant="secondary"
                        className={`text-xs mt-1 ${
                          suggestion.confidence > 0.8
                            ? "bg-green-100 text-green-800"
                            : suggestion.confidence > 0.6
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {Math.round(suggestion.confidence * 100)}% ثقة
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="mr-2"
                    >
                      <Wand2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* مربع الرسائل */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                placeholder="اكتب سؤالك هنا..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!userMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// توليد اقتراحات ذكية
const generateSuggestions = (
  siteData: SiteData,
  analysisType: string,
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];
  const activePage = siteData.pages.find(
    (page) => page.id === siteData.activePage,
  );

  if (!activePage) return suggestions;

  switch (analysisType) {
    case "improve":
      // اقتراحات عامة للتحسين
      if (activePage.elements.length < 3) {
        suggestions.push({
          type: "structure",
          description: "أضف المزيد من العناصر لجعل الصفحة أكثر تفاعلاً",
          data: { suggestion: "add_more_elements" },
          confidence: 0.9,
        });
      }

      if (!activePage.elements.some((el) => el.type === "testimonials")) {
        suggestions.push({
          type: "content",
          description: "أضف قسم آراء العملاء لزيادة الثقة",
          data: { elementType: "testimonials" },
          confidence: 0.8,
        });
      }
      break;

    case "colors":
      // اقتراحات الألوان
      suggestions.push({
        type: "design",
        description: "جرب ألوان أكثر تباينًا لتحسين قابلية القراءة",
        data: {
          colors: {
            primary: "#2563eb",
            secondary: "#64748b",
            accent: "#f59e0b",
          },
        },
        confidence: 0.7,
      });
      break;

    case "content":
      // اقتراحات المحتوى
      activePage.elements.forEach((element) => {
        if (element.type === "hero" && !element.content.subtitle) {
          suggestions.push({
            type: "content",
            elementId: element.id,
            description: "أضف عنوان فرعي لقسم البطل لتوضيح أكثر",
            data: { field: "subtitle", value: "عنوان فرعي مقترح" },
            confidence: 0.8,
          });
        }
      });
      break;

    case "layout":
      // اقتراحات التخطيط
      suggestions.push({
        type: "design",
        description: "حسّن المسافات بين العناصر لمظهر أكثر احترافية",
        data: { spacing: { section: "py-16 md:py-24" } },
        confidence: 0.7,
      });
      break;

    case "seo":
      // اقتراحات السيو
      if (
        !siteData.metadata.description ||
        siteData.metadata.description.length < 100
      ) {
        suggestions.push({
          type: "seo",
          description: "اكتب وصف أطول للموقع (100-160 حرف) لتحسين SEO",
          data: { field: "description" },
          confidence: 0.9,
        });
      }

      if (siteData.metadata.title.length < 30) {
        suggestions.push({
          type: "seo",
          description: "اجعل عنوان الموقع أكثر وصفية لتحسين نتائج البحث",
          data: { field: "title" },
          confidence: 0.8,
        });
      }
      break;

    case "analyze":
      // تحليل شامل
      const elementTypes = activePage.elements.map((el) => el.type);
      const missingElements = ["hero", "services", "about", "contact"].filter(
        (type) => !elementTypes.includes(type as any),
      );

      missingElements.forEach((elementType) => {
        suggestions.push({
          type: "structure",
          description: `أضف قسم ${getElementName(elementType)} لصفحة أكثر تكاملاً`,
          data: { elementType },
          confidence: 0.6,
        });
      });
      break;
  }

  return suggestions;
};

// توليد رد ذكي
const generateAIResponse = (
  userMessage: string,
  siteData: SiteData,
): string => {
  const message = userMessage.toLowerCase();

  if (message.includes("لون") || message.includes("ألوان")) {
    return "يمكنني مساعدتك في اختيار ألوان متناسقة! جرب الألوان المتباينة لتحسين القراءة، أو استخدم عجلة الألوان للحصول على تناغم مثالي.";
  }

  if (message.includes("محتوى") || message.includes("نص")) {
    return "لكتابة محتوى فعال، اجعل النصوص واضحة ومختصرة. استخدم عناوين جذابة واكتب بلغة يفهمها جمهورك المستهدف.";
  }

  if (message.includes("تصميم") || message.includes("شكل")) {
    return "التصميم الجيد يركز على البساطة والوضوح. استخدم مسافات كافية بين العناصر، واختر خطوط سهلة القراءة، وحافظ على التناسق في جميع أنحاء الموقع.";
  }

  if (message.includes("سرعة") || message.includes("أداء")) {
    return "لتحسين سرعة الموقع، قم بضغط الصور، قلل من عدد العناصر، واستخدم تحميل تدريجي للمحتوى. السرعة مهمة جداً لتجربة المستخدم!";
  }

  if (message.includes("موبايل") || message.includes("هاتف")) {
    return "التصميم المتجاوب ضروري! تأكد من أن موقعك يبدو رائعاً على جميع الأجهزة. اختبر العناصر على شاشات مختلفة الأحجام.";
  }

  if (message.includes("seo") || message.includes("بحث")) {
    return "لتحسين محركات البحث، اكتب عناوين وصفية، استخدم الكلمات المفتاحية بذكاء، واكتب وصف جيد للموقع. المحتوى الجيد هو الأساس!";
  }

  // رد افتراضي
  return "شكراً لسؤالك! يمكنني مساعدتك في تحسين موقعك من خلال الاقتراحات الذكية. استخدم الإجراءات السريعة للحصول على نصائح محددة.";
};

// الحصول على اسم العنصر
const getElementName = (elementType: string): string => {
  const names: Record<string, string> = {
    hero: "البطل",
    services: "الخدمات",
    about: "نبذة عنا",
    contact: "التواصل",
    gallery: "المعرض",
    testimonials: "آراء العملاء",
  };
  return names[elementType] || elementType;
};

// توليد رسالة تحليل
const generateAnalysisMessage = (
  analysisType: string,
  suggestionsCount: number,
): string => {
  const messages: Record<string, string> = {
    improve: `تم تحليل موقعك! وجدت ${suggestionsCount} اقتراح لتحسين الموقع.`,
    colors: `تم تحليل نظام الألوان! إليك ${suggestionsCount} اقتراح لتحسين الألوان.`,
    content: `تم تحليل المحتوى! وجدت ${suggestionsCount} طريقة لتحسين النصوص.`,
    layout: `تم تحليل التخطيط! إليك ${suggestionsCount} اقتراح لتحسين التنسيق.`,
    seo: `تم تحليل السيو! وجدت ${suggestionsCount} طريقة لتحسين نتائج البحث.`,
    analyze: `تم إجراء تحليل شامل للموقع! وجدت ${suggestionsCount} اقتراح للتطوير.`,
  };

  return (
    messages[analysisType] || `تم التحليل! وجدت ${suggestionsCount} اقتراح.`
  );
};

export default AIAssistant;
