
-- 1. إضافة حقل البريد الإلكتروني لجدول المستخدمين إذا لم يكن موجوداً
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. تحديث بيانات المستخدمين الحاليين لجلب البريد الإلكتروني من نظام المصادقة
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.id = auth.users.id AND public.profiles.email IS NULL;

-- 3. التأكد من أن حقل الهوية هو مفتاح أساسي ويرتبط بجدول المصادقة لضمان تكامل البيانات
DO $$
BEGIN
   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint
       WHERE conname = 'profiles_pkey' AND conrelid = 'public.profiles'::regclass
   ) THEN
       ALTER TABLE public.profiles ADD PRIMARY KEY (id);
   END IF;
END $$;

DO $$
BEGIN
   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint
       WHERE conname = 'profiles_id_fkey' AND conrelid = 'public.profiles'::regclass
   ) THEN
       ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
   END IF;
END $$;

-- 4. إنشاء دالة (Function) لإضافة بيانات المستخدم الجديد تلقائياً إلى جدول profiles عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- التحقق مما إذا كان المستخدم موجودًا بالفعل لتجنب الأخطاء
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
    INSERT INTO public.profiles (id, full_name, avatar_url, email)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'avatar_url',
      new.email
    );
  END IF;
  RETURN new;
END;
$$;

-- 5. إنشاء مُحفِّز (Trigger) لتفعيل الدالة أعلاه تلقائياً عند تسجيل أي مستخدم جديد
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
