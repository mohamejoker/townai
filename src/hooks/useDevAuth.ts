import { useState, useEffect } from "react";

// نظام مصادقة مؤقت للتطوير
interface DevUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  created_at: string;
}

// المستخدمين المؤقتين للتطوير
const DEV_USERS: DevUser[] = [
  {
    id: "admin-1",
    email: "admin@townmedia.sa",
    name: "محمد سليم",
    role: "admin",
    created_at: new Date().toISOString(),
  },
  {
    id: "user-1",
    email: "user@townmedia.sa",
    name: "مستخدم تجريبي",
    role: "user",
    created_at: new Date().toISOString(),
  },
];

export const useDevAuth = () => {
  const [user, setUser] = useState<DevUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تحقق من LocalStorage للمستخدم المحفوظ
    const savedUser = localStorage.getItem("dev_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("dev_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // العثور على المستخدم
    const foundUser = DEV_USERS.find((u) => u.email === email);

    if (!foundUser) {
      setIsLoading(false);
      throw new Error("المستخدم غير موجود");
    }

    // في التطوير، أي كلمة مرور تعمل
    if (password.length < 3) {
      setIsLoading(false);
      throw new Error("كلمة المرور قصيرة جداً");
    }

    setUser(foundUser);
    localStorage.setItem("dev_user", JSON.stringify(foundUser));
    setIsLoading(false);
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem("dev_user");
  };

  const register = async (
    email: string,
    password: string,
    name?: string,
  ): Promise<void> => {
    setIsLoading(true);

    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // التحقق من وجود المستخدم
    const existingUser = DEV_USERS.find((u) => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error("المستخدم موجود بالفعل");
    }

    // إنشاء مستخدم جديد
    const newUser: DevUser = {
      id: `user-${Date.now()}`,
      email,
      name: name || "مستخدم جديد",
      role: "user",
      created_at: new Date().toISOString(),
    };

    // إضافة للقائمة المؤقتة
    DEV_USERS.push(newUser);

    setUser(newUser);
    localStorage.setItem("dev_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const switchToAdmin = () => {
    const adminUser = DEV_USERS.find((u) => u.role === "admin");
    if (adminUser) {
      setUser(adminUser);
      localStorage.setItem("dev_user", JSON.stringify(adminUser));
    }
  };

  const switchToUser = () => {
    const regularUser = DEV_USERS.find((u) => u.role === "user");
    if (regularUser) {
      setUser(regularUser);
      localStorage.setItem("dev_user", JSON.stringify(regularUser));
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    switchToAdmin,
    switchToUser,
  };
};

// Hook للتحقق من الأدوار في وضع التطوير
export const useDevRoleAuth = () => {
  const { user } = useDevAuth();

  return {
    userRole: user?.role || null,
    hasRole: (role: "admin" | "user") => {
      if (!user) return false;
      if (user.role === "admin") return true; // Admin له جميع الصلاحيات
      return user.role === role;
    },
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
    isLoading: false,
  };
};
