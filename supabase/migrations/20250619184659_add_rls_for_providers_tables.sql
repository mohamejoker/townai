-- Enable RLS for the tables
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for providers table
CREATE POLICY "Allow admin full access on providers"
ON public.providers
FOR ALL
TO supabase_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users SELECT access for active providers"
ON public.providers
FOR SELECT
TO authenticated
USING (is_active = true);

-- RLS policies for provider_services table
CREATE POLICY "Allow admin full access on provider_services"
ON public.provider_services
FOR ALL
TO supabase_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users SELECT access for active provider_services"
ON public.provider_services
FOR SELECT
TO authenticated
USING (is_active = true);

-- RLS policies for provider_sync_logs table
CREATE POLICY "Allow admin full access on provider_sync_logs"
ON public.provider_sync_logs
FOR ALL
TO supabase_admin
USING (true)
WITH CHECK (true);
