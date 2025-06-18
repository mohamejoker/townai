import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Shield,
  LogOut,
  RefreshCw,
  Settings,
  Crown,
  UserCheck,
} from "lucide-react";

const DevAuthControls: React.FC = () => {
  const { user, isAuthenticated, logout, switchToAdmin, switchToUser } =
    useAuth();

  // إظهار الأدوات فقط في وضع التطوير
  if (!import.meta.env.DEV) return null;

  return (
    <Card
      data-tour="dev-auth"
      className="fixed bottom-4 right-4 w-80 bg-yellow-50 border-yellow-200 shadow-lg z-50"
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm">
          <Settings className="w-4 h-4 mr-2" />
          أدوات التطوير - المصادقة
          <Badge
            variant="outline"
            className="mr-2 bg-yellow-100 text-yellow-800"
          >
            DEV
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* حالة المستخدم الحالي */}
        {isAuthenticated && user && (
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  {(user as any).role === "admin" ? (
                    <Crown className="w-4 h-4 text-blue-600" />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {(user as any).name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(user as any).email}
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  (user as any).role === "admin" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {(user as any).role === "admin" ? "مدير" : "مستخدم"}
              </Badge>
            </div>

            {/* أزرار التبديل */}
            <div className="flex gap-2">
              {switchToAdmin && (
                <Button
                  size="sm"
                  variant={
                    (user as any).role === "admin" ? "default" : "outline"
                  }
                  onClick={switchToAdmin}
                  className="flex-1"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  مدير
                </Button>
              )}

              {switchToUser && (
                <Button
                  size="sm"
                  variant={
                    (user as any).role === "user" ? "default" : "outline"
                  }
                  onClick={switchToUser}
                  className="flex-1"
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  مستخدم
                </Button>
              )}

              <Button size="sm" variant="outline" onClick={logout}>
                <LogOut className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* رسالة عدم تسجيل الدخول */}
        {!isAuthenticated && (
          <div className="text-center p-3 bg-white rounded-lg border">
            <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-3">غير مسجل الدخول</p>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">للتجربة:</div>
              <div className="text-xs bg-gray-100 p-2 rounded">
                <strong>مدير:</strong> admin@townmedia.sa
                <br />
                <strong>مستخدم:</strong> user@townmedia.sa
                <br />
                <strong>كلمة المرور:</strong> أي شيء
              </div>
            </div>
          </div>
        )}

        {/* معلومات سريعة */}
        <div className="text-xs text-gray-500 p-2 bg-yellow-100 rounded">
          💡 <strong>وضع التطوير:</strong> يمكنك التبديل بين المستخدمين بسهولة
        </div>
      </CardContent>
    </Card>
  );
};

export default DevAuthControls;
