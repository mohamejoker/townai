
-- جدول الموردين الأساسي
CREATE TABLE public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  api_url text NOT NULL,
  api_key text NOT NULL,
  is_active boolean DEFAULT true,
  logo_url text,
  settings jsonb DEFAULT '{}'::jsonb,
  added_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- جدول خدمات كل مورد
CREATE TABLE public.provider_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  external_service_id text NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  platform text NOT NULL,
  category text,
  description text,
  rate numeric,
  min_order integer,
  max_order integer,
  is_active boolean DEFAULT true,
  quality text,
  refill_enabled boolean DEFAULT false,
  cancel_enabled boolean DEFAULT false,
  average_time text,
  meta jsonb DEFAULT '{}'::jsonb,
  synced_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- جدول سجل مزامنة الخدمات مع الموردين
CREATE TABLE public.provider_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  status text NOT NULL,
  message text,
  synced_at timestamp with time zone DEFAULT now(),
  details jsonb DEFAULT '{}'::jsonb
);

-- تفعيل RLS لحماية البيانات: يمكن فقط للمسؤولين التعديل (سأكمل سياسة RLS عندما نضع نظام الأدوار المتقدم لاحقًا)
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_sync_logs ENABLE ROW LEVEL SECURITY;
