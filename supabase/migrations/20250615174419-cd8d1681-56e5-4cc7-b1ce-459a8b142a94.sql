
-- Create service_orders table for order management
CREATE TABLE public.service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id TEXT NOT NULL,
  provider_service_id TEXT,
  link TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  original_price DECIMAL(12,2) NOT NULL,
  final_price DECIMAL(12,2) NOT NULL,
  profit DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'partial', 'cancelled', 'failed')),
  start_count INTEGER,
  remains INTEGER,
  provider_order_id TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create order_status_history table for tracking order status changes
CREATE TABLE public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create egyptian_payment_config table for Egyptian payment methods
CREATE TABLE public.egyptian_payment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  prefixes TEXT[] NOT NULL DEFAULT '{}',
  fees_percentage DECIMAL(5,4) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  manual_mode BOOLEAN DEFAULT true,
  auto_mode BOOLEAN DEFAULT false,
  confirmation_timeout INTEGER DEFAULT 300,
  color_class TEXT DEFAULT 'bg-blue-500',
  icon_name TEXT DEFAULT 'CreditCard',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_service_orders_user_id ON public.service_orders(user_id);
CREATE INDEX idx_service_orders_status ON public.service_orders(status);
CREATE INDEX idx_service_orders_created_at ON public.service_orders(created_at);
CREATE INDEX idx_order_status_history_order_id ON public.order_status_history(order_id);
CREATE INDEX idx_egyptian_payment_config_provider_name ON public.egyptian_payment_config(provider_name);

-- Enable RLS on all new tables
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.egyptian_payment_config ENABLE ROW LEVEL SECURITY;

-- RLS policies for service_orders
CREATE POLICY "service_orders_user_read" ON public.service_orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "service_orders_admin_all" ON public.service_orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "service_orders_insert" ON public.service_orders
  FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.uid() IS NULL);

-- RLS policies for order_status_history
CREATE POLICY "order_status_history_user_read" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.service_orders 
      WHERE id = order_status_history.order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "order_status_history_admin_all" ON public.order_status_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for egyptian_payment_config
CREATE POLICY "egyptian_payment_config_public_read" ON public.egyptian_payment_config
  FOR SELECT USING (is_active = true);

CREATE POLICY "egyptian_payment_config_admin_all" ON public.egyptian_payment_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default Egyptian payment methods
INSERT INTO public.egyptian_payment_config (provider_name, display_name, prefixes, fees_percentage, manual_mode, auto_mode, color_class, icon_name) VALUES
('vodafone_cash', 'فودافون كاش', ARRAY['010', '011'], 0.015, true, true, 'bg-red-500', 'Smartphone'),
('orange_money', 'أورانج موني', ARRAY['012'], 0.015, true, false, 'bg-orange-500', 'Wallet'),
('etisalat_cash', 'اتصالات كاش', ARRAY['014'], 0.020, true, false, 'bg-green-500', 'CreditCard'),
('we_pay', 'WE Pay', ARRAY['015'], 0.015, true, false, 'bg-purple-500', 'Smartphone'),
('instapay', 'InstaPay', ARRAY['010', '011', '012', '014', '015'], 0.000, false, true, 'bg-blue-500', 'QrCode');
