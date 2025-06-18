import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  AlertCircle,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // إضافة إشعارات تجريبية
  useEffect(() => {
    const welcomeNotification: Notification = {
      id: "1",
      type: "success",
      title: "مرحباً بك!",
      message: "تم تحميل النظام بنجاح. جميع الخدمات تعمل بكفاءة.",
      timestamp: new Date(),
      read: false,
      action: {
        label: "اكتشف المميزات",
        onClick: () => (window.location.href = "/site-builder"),
      },
    };

    setNotifications([welcomeNotification]);
  }, []);

  // إضافة إشعار جديد
  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // تشغيل صوت الإشعار
    if (soundEnabled) {
      playNotificationSound();
    }

    // إزالة تلقائية بعد 5 ثوان للإشعارات العادية
    if (notification.type === "info") {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  // تشغيل صوت الإشعار
  const playNotificationSound = () => {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUiBjiL0fPTgjEDK3DA7tWVQQ8YaLpq6KNVGAg+ltj04X05CAFicWWxXrOZXsLxejECIQr",
      );
      audio.volume = 0.3;
      audio.play().catch(() => {
        // فشل تشغيل الصوت - تجاهل الخطأ
      });
    } catch (error) {
      // تجاهل أخطاء الصوت
    }
  };

  // إزالة إشعار
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // تحديد الإشعار كمقروء
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  // مسح جميع الإشعارات
  const clearAll = () => {
    setNotifications([]);
  };

  // تحديد جميع الإشعارات كمقروءة
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "info":
        return "border-blue-200 bg-blue-50";
    }
  };

  // تجربة الإشعارات
  const testNotifications = () => {
    const testTypes: Notification["type"][] = [
      "success",
      "error",
      "warning",
      "info",
    ];
    const messages = [
      {
        type: "success",
        title: "نجح التحديث",
        message: "تم تحديث البيانات بنجاح",
      },
      {
        type: "error",
        title: "خطأ في الاتصال",
        message: "فشل في الاتصال بالخادم",
      },
      {
        type: "warning",
        title: "تحذير",
        message: "يرجى حفظ عملك قبل المتابعة",
      },
      { type: "info", title: "معلومة", message: "يوجد تحديث جديد متاح" },
    ];

    messages.forEach((msg, index) => {
      setTimeout(() => {
        addNotification(msg);
      }, index * 1000);
    });
  };

  return (
    <>
      {/* زر الإشعارات */}
      <div className="fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 min-w-[20px] h-5 text-xs bg-red-500 text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* لوحة الإشعارات */}
      {isOpen && (
        <div className="fixed top-16 left-4 w-80 max-h-96 bg-white rounded-lg shadow-xl border z-50">
          {/* رأس الإشعارات */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">الإشعارات</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="flex space-x-2 mt-2">
                <Button size="sm" variant="outline" onClick={markAllAsRead}>
                  تحديد الكل كمقروء
                </Button>
                <Button size="sm" variant="outline" onClick={clearAll}>
                  مسح الكل
                </Button>
                {import.meta.env.DEV && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={testNotifications}
                  >
                    اختبار
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* قائمة الإشعارات */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد إشعارات</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${getColor(notification.type)} ${
                      notification.read ? "opacity-60" : ""
                    } cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold truncate">
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="flex-shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {notification.timestamp.toLocaleTimeString(
                                "ar-SA",
                              )}
                            </span>
                            {notification.action && (
                              <Button
                                size="sm"
                                variant="link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action!.onClick();
                                }}
                                className="h-auto p-0 text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSystem;
