import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Keyboard,
  X,
  Home,
  Settings,
  User,
  Search,
  Command,
  HelpCircle,
} from "lucide-react";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: string;
}

const KeyboardShortcuts: React.FC = () => {
  const [showHelper, setShowHelper] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const shortcuts: Shortcut[] = [
    // التنقل
    {
      key: "Alt+H",
      description: "الانتقال للصفحة الرئيسية",
      action: () => navigate("/"),
      category: "التنقل",
    },
    {
      key: "Alt+S",
      description: "صفحة الخدمات",
      action: () => navigate("/services"),
      category: "التنقل",
    },
    {
      key: "Alt+A",
      description: "المساعد الذكي",
      action: () => navigate("/ai-chat"),
      category: "التنقل",
    },
    {
      key: "Alt+B",
      description: "منشئ المواقع",
      action: () => navigate("/site-builder"),
      category: "التنقل",
    },
    {
      key: "Alt+D",
      description: "لوحة الإدارة",
      action: () => navigate("/admin"),
      category: "التنقل",
    },
    {
      key: "Alt+L",
      description: "صفحة تسجيل الدخول",
      action: () => navigate("/login"),
      category: "التنقل",
    },

    // الأدوات
    {
      key: "Alt+T",
      description: "صفحة الاختبارات",
      action: () => navigate("/test"),
      category: "الأدوات",
    },
    {
      key: "F1",
      description: "إظهار المساعدة",
      action: () => setShowHelper(true),
      category: "الأدوات",
    },
    {
      key: "F5",
      description: "إعادة تحميل الصفحة",
      action: () => window.location.reload(),
      category: "الأدوات",
    },
    {
      key: "Escape",
      description: "إغلاق النوافذ المنبثقة",
      action: () => setShowHelper(false),
      category: "الأدوات",
    },

    // التحكم
    {
      key: "Ctrl+S",
      description: "حفظ (في منشئ المواقع)",
      action: () => {
        // إرسال حدث حفظ مخصص
        window.dispatchEvent(new CustomEvent("keyboard-save"));
      },
      category: "التحكم",
    },
    {
      key: "Ctrl+Z",
      description: "تراجع (في منشئ المواقع)",
      action: () => {
        window.dispatchEvent(new CustomEvent("keyboard-undo"));
      },
      category: "التحكم",
    },
    {
      key: "Ctrl+Y",
      description: "إعادة (في منشئ المواقع)",
      action: () => {
        window.dispatchEvent(new CustomEvent("keyboard-redo"));
      },
      category: "التحكم",
    },
  ];

  // معالج الضغط على المفاتيح
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newPressed = new Set(pressedKeys);

      // إضافة المفاتيح المضغوطة
      if (event.ctrlKey) newPressed.add("Ctrl");
      if (event.altKey) newPressed.add("Alt");
      if (event.shiftKey) newPressed.add("Shift");
      if (event.metaKey) newPressed.add("Meta");

      // إضافة المفتاح الرئيسي
      if (event.code) {
        const key = event.code.replace("Key", "").replace("Digit", "");
        newPressed.add(key);
      }

      setPressedKeys(newPressed);

      // البحث عن اختصار مطابق
      const keyCombo = Array.from(newPressed).join("+");
      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === keyCombo.toLowerCase() ||
          s.key.toLowerCase() === event.key.toLowerCase() ||
          (event.key === "F1" && s.key === "F1") ||
          (event.key === "F5" && s.key === "F5") ||
          (event.key === "Escape" && s.key === "Escape"),
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }

      // اختصارات خاصة
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case "h":
            event.preventDefault();
            navigate("/");
            break;
          case "s":
            event.preventDefault();
            navigate("/services");
            break;
          case "a":
            event.preventDefault();
            navigate("/ai-chat");
            break;
          case "b":
            event.preventDefault();
            navigate("/site-builder");
            break;
          case "d":
            event.preventDefault();
            navigate("/admin");
            break;
          case "l":
            event.preventDefault();
            navigate("/login");
            break;
          case "t":
            event.preventDefault();
            navigate("/test");
            break;
        }
      }

      // مفاتيح خاصة
      if (event.key === "F1") {
        event.preventDefault();
        setShowHelper(true);
      }
      if (event.key === "Escape") {
        setShowHelper(false);
      }
    };

    const handleKeyUp = () => {
      setPressedKeys(new Set());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [navigate, pressedKeys, shortcuts]);

  // تجميع الاختصارات حسب الفئة
  const categorizedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>,
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "التنقل":
        return <Home className="w-4 h-4" />;
      case "الأدوات":
        return <Settings className="w-4 h-4" />;
      case "التحكم":
        return <Command className="w-4 h-4" />;
      default:
        return <Keyboard className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* زر إظهار المساعدة */}
      <div className="fixed bottom-20 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHelper(true)}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          title="اختصارات لوحة المفاتيح (F1)"
        >
          <Keyboard className="w-4 h-4" />
        </Button>
      </div>

      {/* مساعد الاختصارات */}
      {showHelper && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Keyboard className="w-5 h-5 mr-2" />
                  اختصارات لوحة المفاتيح
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelper(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categorizedShortcuts).map(
                  ([category, shortcuts]) => (
                    <div key={category}>
                      <h3 className="flex items-center font-semibold text-lg mb-4 text-gray-800">
                        {getCategoryIcon(category)}
                        <span className="mr-2">{category}</span>
                      </h3>
                      <div className="space-y-3">
                        {shortcuts.map((shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="text-sm text-gray-600 mb-1">
                                {shortcut.description}
                              </div>
                              <Badge
                                variant="outline"
                                className="text-xs font-mono"
                              >
                                {shortcut.key}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={shortcut.action}
                              className="mr-2"
                            >
                              تجربة
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* نصائح إضافية */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="flex items-center font-semibold text-blue-800 mb-2">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  نصائح سريعة
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • استخدم{" "}
                    <Badge variant="outline" className="mx-1">
                      F1
                    </Badge>{" "}
                    في أي وقت لإظهار هذه المساعدة
                  </li>
                  <li>
                    • اضغط{" "}
                    <Badge variant="outline" className="mx-1">
                      Escape
                    </Badge>{" "}
                    لإغلاق النوافذ المنبثقة
                  </li>
                  <li>• الاختصارات تعمل في جميع صفحات الموقع</li>
                  <li>
                    • يمكنك استخدام الماوس للنقر على "تجربة" لاختبار الاختصار
                  </li>
                </ul>
              </div>

              {/* إحصائيات سريعة */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">
                    {shortcuts.length}
                  </div>
                  <div className="text-sm text-gray-500">اختصار متاح</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">
                    {Object.keys(categorizedShortcuts).length}
                  </div>
                  <div className="text-sm text-gray-500">فئة</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">100%</div>
                  <div className="text-sm text-gray-500">سرعة الوصول</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* مؤشر المفاتيح المضغوطة (للتطوير) */}
      {import.meta.env.DEV && pressedKeys.size > 0 && (
        <div className="fixed top-32 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm z-40">
          مفاتيح مضغوطة: {Array.from(pressedKeys).join(" + ")}
        </div>
      )}
    </>
  );
};

export default KeyboardShortcuts;
