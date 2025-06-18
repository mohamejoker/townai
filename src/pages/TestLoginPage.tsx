import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  LogIn,
  Eye,
  EyeOff,
  Crown,
  User,
  AlertCircle,
  ArrowRight,
  Home,
} from "lucide-react";

const TestLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // توجيه المستخدم حسب نوع الحساب
      if (email.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ في تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (userType: "admin" | "user") => {
    if (userType === "admin") {
      setEmail("admin@townmedia.sa");
      setPassword("admin123");
    } else {
      setEmail("user@townmedia.sa");
      setPassword("user123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* الشعار والعنوان */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Town Media</h1>
          <p className="text-gray-600">تسجيل الدخول لحسابك</p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">تسجيل الدخول</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* رسالة الخطأ */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* نموذج التسجيل */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </form>

            {/* أزرار التسجيل السريع للتطوير */}
            {import.meta.env.DEV && (
              <div className="space-y-3 pt-4 border-t">
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    وضع التطوير - تسجيل دخول سريع
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => quickLogin("admin")}
                    className="flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    مدير
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => quickLogin("user")}
                    className="flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <User className="w-4 h-4 mr-2" />
                    مستخدم
                  </Button>
                </div>

                <div className="text-xs text-center text-gray-500 bg-gray-50 p-2 rounded">
                  💡 أي كلمة مرور ستعمل في وضع التطوير
                </div>
              </div>
            )}

            {/* روابط إضافية */}
            <div className="text-center pt-4 border-t">
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                ليس لديك حساب؟ إنشاء حساب جديد
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* رابط العودة للصفحة الرئيسية */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm"
          >
            <Home className="w-4 h-4 mr-2" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestLoginPage;
