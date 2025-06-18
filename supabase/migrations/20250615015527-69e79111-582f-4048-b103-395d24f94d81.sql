
-- إنشاء جدول البروفايل للمستخدمين المرتبط بمعرف المستخدم في auth
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء نوع للأدوار
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- جدول الأدوار: كل مستخدم يمكن أن يكون له أكثر من دور لو أردت
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- تمكين RLS على الجداول
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- سياسة: يمكن لكل مستخدم مشاهدة/تعديل بروفايله فقط
CREATE POLICY "Self can view own profile"
  ON public.profiles
  USING (auth.uid() = id);

CREATE POLICY "Self can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- سياسة: يمكن لكل مستخدم رؤية أدواره فقط
CREATE POLICY "Self can select own roles"
  ON public.user_roles
  USING (auth.uid() = user_id);

-- سياسة: فقط admins يمكنهم إضافة/تعديل/حذف الأدوار للآخرين (يمكنك تعديل هذا لاحقاً)
-- سننشئ لاحقاً دالة has_role 
-- حالياً كل مستخدم يمكنه فقط رؤية أدواره

