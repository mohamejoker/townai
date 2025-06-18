
-- إضافة دور المدير للمستخدم الجديد
-- سنحتاج إلى معرف المستخدم من جدول auth.users
-- يمكنك الحصول على المعرف من لوحة Supabase Auth Users

-- أولاً، دعنا نضيف دور admin للمستخدم الجديد
-- استبدل 'USER_ID_HERE' بالمعرف الفعلي للمستخدم من لوحة Supabase
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role 
FROM auth.users 
WHERE email = 'anamedo1994@gmail.com';

-- إضافة ملف شخصي للمستخدم في جدول profiles
INSERT INTO public.profiles (id, full_name)
SELECT id, 'Admin User'
FROM auth.users 
WHERE email = 'anamedo1994@gmail.com'
ON CONFLICT (id) DO NOTHING;
