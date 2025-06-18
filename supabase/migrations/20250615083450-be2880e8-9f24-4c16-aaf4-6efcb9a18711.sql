
-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  button_text TEXT NOT NULL DEFAULT 'اطلب الآن',
  gradient_class TEXT DEFAULT 'from-sky-400 to-blue-500',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading all active services publicly
CREATE POLICY "Anyone can view active services" 
  ON public.services 
  FOR SELECT 
  USING (is_active = true);

-- Create policy to allow admins to view all services
CREATE POLICY "Admins can view all services" 
  ON public.services 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create policy to allow admins to insert services
CREATE POLICY "Admins can create services" 
  ON public.services 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create policy to allow admins to update services
CREATE POLICY "Admins can update services" 
  ON public.services 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create policy to allow admins to delete services
CREATE POLICY "Admins can delete services" 
  ON public.services 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Insert some sample data
INSERT INTO public.services (title, price, features, button_text, gradient_class, is_popular, is_active) VALUES
('زيادة متابعين Instagram', '50 ريال', ARRAY['متابعين حقيقيين 100%', 'تسليم سريع خلال ساعات', 'ضمان عدم النقصان', 'دعم فني 24/7'], 'اطلب الآن', 'from-pink-500 to-purple-600', true, true),
('تفاعل حقيقي TikTok', '30 ريال', ARRAY['لايكات من حسابات نشطة', 'توزيع طبيعي', 'تسليم فوري', 'جودة عالية مضمونة'], 'احصل عليها', 'from-blue-500 to-indigo-600', false, true),
('نمو شامل YouTube', '100 ريال', ARRAY['مشتركين حقيقيين', 'مشاهدات عالية الجودة', 'تحسين SEO', 'استراتيجية نمو مخصصة'], 'ابدأ النمو', 'from-red-500 to-orange-600', false, true);
