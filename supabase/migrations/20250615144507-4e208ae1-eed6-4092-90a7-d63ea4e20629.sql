
-- إضافة جدول سجلات النشاط والأحداث
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة جدول التنبيهات والإشعارات
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, error, success
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  recipient_id UUID REFERENCES auth.users(id),
  is_read BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- إضافة جدول قوالب التقارير
CREATE TABLE public.report_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL, -- sales, users, performance, custom
  config JSONB NOT NULL DEFAULT '{}',
  fields JSONB NOT NULL DEFAULT '[]',
  filters JSONB DEFAULT '{}',
  schedule JSONB, -- للتقارير المجدولة
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة جدول التقارير المُنشأة
CREATE TABLE public.generated_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.report_templates(id),
  title TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, generating, completed, failed
  file_url TEXT,
  file_type TEXT, -- pdf, excel, csv
  generated_by UUID REFERENCES auth.users(id),
  generated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة جدول إعدادات النظام المتقدمة
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  data_type TEXT NOT NULL DEFAULT 'string', -- string, number, boolean, json
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  requires_restart BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category, key)
);

-- إضافة جدول مراقبة الأداء والصحة
CREATE TABLE public.system_health_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  status TEXT NOT NULL DEFAULT 'normal', -- normal, warning, critical
  threshold_config JSONB,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة جدول قوانين الأتمتة
CREATE TABLE public.automation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- event, schedule, condition
  trigger_config JSONB NOT NULL,
  action_type TEXT NOT NULL, -- email, notification, webhook, update_status
  action_config JSONB NOT NULL,
  conditions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة جدول تنفيذ قوانين الأتمتة
CREATE TABLE public.automation_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID REFERENCES public.automation_rules(id),
  trigger_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  result JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل Row Level Security على الجداول الجديدة
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_executions ENABLE ROW LEVEL SECURITY;

-- إضافة سياسات الأمان (Admins only لمعظم الجداول)
CREATE POLICY "Admins can manage activity logs" 
  ON public.activity_logs 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view their notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (recipient_id = auth.uid() OR is_system = true OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update their notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (recipient_id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage report templates" 
  ON public.report_templates 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage generated reports" 
  ON public.generated_reports 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage system settings" 
  ON public.system_settings 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can view system health" 
  ON public.system_health_logs 
  FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage automation rules" 
  ON public.automation_rules 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can view automation executions" 
  ON public.automation_executions 
  FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- إضافة فهارس لتحسين الأداء
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX idx_activity_logs_action_type ON public.activity_logs(action_type);

CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

CREATE INDEX idx_system_health_logs_metric_name ON public.system_health_logs(metric_name);
CREATE INDEX idx_system_health_logs_recorded_at ON public.system_health_logs(recorded_at);
CREATE INDEX idx_system_health_logs_status ON public.system_health_logs(status);

CREATE INDEX idx_automation_rules_is_active ON public.automation_rules(is_active);
CREATE INDEX idx_automation_executions_rule_id ON public.automation_executions(rule_id);
CREATE INDEX idx_automation_executions_executed_at ON public.automation_executions(executed_at);

-- إضافة بعض البيانات الأولية لإعدادات النظام
INSERT INTO public.system_settings (category, key, value, data_type, description, is_public) VALUES
('dashboard', 'refresh_interval', '30', 'number', 'معدل تحديث لوحة التحكم بالثواني', false),
('notifications', 'max_per_user', '100', 'number', 'الحد الأقصى للإشعارات لكل مستخدم', false),
('reports', 'auto_cleanup_days', '30', 'number', 'عدد الأيام لحفظ التقارير المُنشأة', false),
('security', 'session_timeout', '3600', 'number', 'انتهاء صلاحية الجلسة بالثواني', false),
('performance', 'cache_duration', '300', 'number', 'مدة التخزين المؤقت بالثواني', false);

-- إضافة قوالب تقارير أساسية
INSERT INTO public.report_templates (name, description, report_type, config, fields) VALUES
('تقرير المستخدمين الشهري', 'تقرير شامل عن نشاط المستخدمين خلال الشهر', 'users', 
 '{"period": "monthly", "groupBy": "date"}', 
 '["user_count", "new_registrations", "active_users", "user_roles"]'),
('تقرير المبيعات اليومي', 'تقرير يومي للمعاملات والإيرادات', 'sales', 
 '{"period": "daily", "includeCharts": true}', 
 '["total_revenue", "transaction_count", "average_order", "payment_methods"]'),
('تقرير الأداء الأسبوعي', 'تقرير أسبوعي لمؤشرات أداء النظام', 'performance', 
 '{"period": "weekly", "metrics": ["response_time", "error_rate", "uptime"]}', 
 '["system_health", "response_times", "error_logs", "resource_usage"]');
