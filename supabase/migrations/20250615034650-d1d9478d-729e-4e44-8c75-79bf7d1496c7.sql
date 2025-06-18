
-- إنشاء جداول نظام المدفوعات

-- جدول طرق الدفع
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'card', 'wallet', 'bank', 'crypto'
  icon TEXT,
  fees_percentage DECIMAL(5,4) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT true,
  processing_time TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول المعاملات المالية
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_email TEXT,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded', 'cancelled'
  payment_method_id UUID REFERENCES public.payment_methods(id),
  payment_method_name TEXT,
  service_name TEXT,
  description TEXT,
  reference_id TEXT UNIQUE,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  fees DECIMAL(12,2) DEFAULT 0.0,
  net_amount DECIMAL(12,2),
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الكوبونات
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'percentage', 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول استخدام الكوبونات
CREATE TABLE public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10,2),
  used_at TIMESTAMPTZ DEFAULT now()
);

-- جدول إعدادات الدفع
CREATE TABLE public.payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_encrypted BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول المرتجعات والاستردادات
CREATE TABLE public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'processed', 'failed'
  stripe_refund_id TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_transactions_reference_id ON public.transactions(reference_id);
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active ON public.coupons(is_active);
CREATE INDEX idx_coupon_usages_coupon_id ON public.coupon_usages(coupon_id);

-- تفعيل RLS على جميع الجداول
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان لطرق الدفع
CREATE POLICY "payment_methods_public_read" ON public.payment_methods
  FOR SELECT USING (is_active = true);

CREATE POLICY "payment_methods_admin_all" ON public.payment_methods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للمعاملات
CREATE POLICY "transactions_user_read" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "transactions_admin_all" ON public.transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "transactions_insert" ON public.transactions
  FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.uid() IS NULL);

-- سياسات الأمان للكوبونات
CREATE POLICY "coupons_public_read" ON public.coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "coupons_admin_all" ON public.coupons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان لاستخدام الكوبونات
CREATE POLICY "coupon_usages_user_read" ON public.coupon_usages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "coupon_usages_admin_all" ON public.coupon_usages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "coupon_usages_insert" ON public.coupon_usages
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- سياسات الأمان لإعدادات الدفع
CREATE POLICY "payment_settings_admin_all" ON public.payment_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للمرتجعات
CREATE POLICY "refunds_user_read" ON public.refunds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.transactions 
      WHERE id = refunds.transaction_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "refunds_admin_all" ON public.refunds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- إدراج بيانات طرق الدفع الافتراضية
INSERT INTO public.payment_methods (name, type, icon, fees_percentage, processing_time) VALUES
('فيزا/ماستركارد', 'card', 'CreditCard', 0.029, 'فوري'),
('فودافون كاش', 'wallet', 'Smartphone', 0.015, 'خلال دقائق'),
('أورانج موني', 'wallet', 'Wallet', 0.015, 'خلال دقائق'),
('InstaPay', 'bank', 'QrCode', 0.000, 'فوري'),
('PayPal', 'wallet', 'DollarSign', 0.035, 'فوري');

-- إدراج إعدادات الدفع الافتراضية
INSERT INTO public.payment_settings (key, value, description, category) VALUES
('payment_enabled', 'false', 'تفعيل نظام الدفع', 'general'),
('default_currency', 'SAR', 'العملة الافتراضية', 'general'),
('stripe_public_key', '', 'مفتاح Stripe العام', 'stripe'),
('max_refund_days', '30', 'أقصى عدد أيام للاسترداد', 'refunds'),
('auto_refund_enabled', 'false', 'تفعيل الاسترداد التلقائي', 'refunds');

-- إدراج كوبونات تجريبية
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_amount, max_uses, category, expires_at) VALUES
('WELCOME20', 'خصم ترحيبي للعملاء الجدد', 'percentage', 20, 50, 1000, 'عملاء جدد', '2024-12-31 23:59:59'),
('SAVE50', 'خصم ثابت 50 ريال', 'fixed', 50, 200, 500, 'عروض خاصة', '2024-11-30 23:59:59'),
('NEWUSER', 'خصم للمستخدمين الجدد', 'percentage', 15, 100, 200, 'عملاء جدد', '2024-12-31 23:59:59');
