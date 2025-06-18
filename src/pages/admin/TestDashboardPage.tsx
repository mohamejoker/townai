import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  Settings,
  BarChart3,
  Shield,
  CheckCircle,
  AlertCircle,
  Crown,
} from "lucide-react";

const TestDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { userRole, isAdmin, hasRole } = useRoleAuth();

  // إحصائيات وهمية للاختبار
  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "الطلبات اليوم",
      value: "126",
      change: "+8%",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "الإيرادات الشهرية",
      value: "45,231 ريال",
      change: "+23%",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      title: "معدل النشاط",
      value: "89%",
      change: "+5%",
      icon: Activity,
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    { title: "إدارة المستخدمين", icon: Users, href: "/admin/users" },
    { title: "الطلبات والخدمات", icon: ShoppingCart, href: "/admin/orders" },
    { title: "التقارير المالية", icon: BarChart3, href: "/admin/reports" },
    { title: "إعدادات النظام", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600">مرحباً بك في نظام إدارة Town Media</p>
        </div>

        <div className="flex items-center space-x-4">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            النظام يعمل بشكل طبيعي
          </Badge>

          {isAdmin && (
            <Badge variant="default" className="bg-purple-100 text-purple-800">
              <Crown className="w-3 h-3 mr-1" />
              مدير النظام
            </Badge>
          )}
        </div>
      </div>

      {/* معلومات المستخدم الحالي */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            معلومات المصادقة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                المستخدم:
              </label>
              <p className="text-lg font-semibold">
                {(user as any)?.name || "غير محدد"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                البريد الإلكتروني:
              </label>
              <p className="text-lg font-semibold">
                {(user as any)?.email || "غير محدد"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                الدور:
              </label>
              <Badge
                variant={isAdmin ? "default" : "secondary"}
                className="text-sm"
              >
                {userRole === "admin" ? "مدير النظام" : "مستخدم عادي"}
              </Badge>
            </div>
          </div>

          {/* اختبار الصلاحيات */}
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h4 className="font-medium mb-2">اختبار الصلاحيات:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                {hasRole("admin") ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                )}
                صلاحيات المدير
              </div>
              <div className="flex items-center">
                {hasRole("user") ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                )}
                صلاحيات المستخدم
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* الإجراءات السريعة */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                  onClick={() => {
                    // في المستقبل: استخدام React Router
                    alert(`سيتم توجيهك إلى: ${action.href}`);
                  }}
                >
                  <Icon className="w-8 h-8 text-gray-600" />
                  <span className="text-sm font-medium text-center">
                    {action.title}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* اختبارات النظام */}
      <Card>
        <CardHeader>
          <CardTitle>اختبارات النظام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">اختبارات المصادقة:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  المستخدم مسجل الدخول: {isAuthenticated ? "نعم" : "لا"}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  صلاحيات المدير: {isAdmin ? "متاحة" : "غير متاحة"}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  الدور الحالي: {userRole || "غير محدد"}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">حالة الاتصالات:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  الواجهة الأمامية: متصلة
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  نظام المصادقة: يعمل
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  إدارة الحالة: نشطة
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDashboardPage;
