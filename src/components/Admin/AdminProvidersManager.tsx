
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Globe, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
// ProviderFormValues might not be needed if ProviderForm handles its own validation/typing
// import { ProviderFormValues } from '@/lib/validators';
import ProviderForm from './ProviderForm'; // Use the newly created ProviderForm
import ProvidersTable from './Providers/ProvidersTable'; // Assuming this table can be adapted
import ProviderStats from './Providers/ProviderStats'; // Assuming this can be adapted
import { providerService } from '@/services/providers/providerService'; // Correct service
import type { Provider } from '@/services/providers/providerService'; // Correct type import

const AdminProvidersManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const { data: providers = [], isLoading, error: providersError } = useQuery<Provider[], Error>({
    queryKey: ['providers'],
    queryFn: () => providerService.getProviders(),
  });

  // Stats will be derived from the providers query result directly
  // const { data: stats } = useQuery({
  //   queryKey: ['providerStats'],
  //   queryFn: realProvidersService.getProviderStats,
  // });

  const createMutation = useMutation<Provider, Error, Omit<Provider, 'id' | 'added_at' | 'updated_at' | 'lastSync'>>({
    mutationFn: (providerData) => providerService.addProvider(providerData),
    onSuccess: () => {
      toast.success('تم إنشاء المورد بنجاح!');
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providerStats'] });
      setIsFormOpen(false);
      setSelectedProvider(null);
    },
    onError: (error: Error) => {
      toast.error(`حدث خطأ أثناء إنشاء المورد: ${error.message}`);
    },
  });

  const updateMutation = useMutation<Provider | null, Error, { id: string; data: Partial<Omit<Provider, 'id' | 'added_at' | 'updated_at'>> }>({
    mutationFn: ({ id, data }) => providerService.updateProvider(id, data),
    onSuccess: () => {
      toast.success('تم تحديث المورد بنجاح!');
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providerStats'] });
      setIsFormOpen(false);
      setSelectedProvider(null);
    },
    onError: (error: Error) => {
      toast.error(`حدث خطأ أثناء تحديث المورد: ${error.message}`);
    },
  });

  const deleteMutation = useMutation<boolean, Error, string>({
    mutationFn: (id) => providerService.deleteProvider(id),
    onSuccess: () => {
      toast.success('تم حذف المورد بنجاح!');
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providerStats'] });
    },
    onError: (error: Error) => {
      toast.error(`حدث خطأ أثناء حذف المورد: ${error.message}`);
    },
  });

  // Assuming ProviderServiceItem is the return type of syncProviderServices
  // and it's an array of synced services.
  const syncMutation = useMutation<any[], Error, string>({
    mutationFn: (providerId) => providerService.syncProviderServices(providerId),
    onSuccess: (data, providerId) => {
      // data here is an array of synced services from providerService
      toast.success(`Provider ${providerId} services synced successfully. ${data.length} services processed.`);
      // We might want to invalidate queries related to provider_services if they are displayed elsewhere.
      // queryClient.invalidateQueries({ queryKey: ['providerServices', providerId] });
      queryClient.invalidateQueries({ queryKey: ['providers'] }); // To update lastSync on provider
      setSyncingProvider(null);
    },
    onError: (error: Error, providerId) => {
      toast.error(`Failed to sync services for provider ${providerId}: ${error.message}`);
      setSyncingProvider(null);
    },
  });

  const handleFormSubmit = (formData: Partial<Provider>) => {
    // Remove api_key from formData if it's empty (user doesn't want to change it during edit)
    const submissionData = { ...formData };
    if (selectedProvider && (!submissionData.api_key || submissionData.api_key === '')) {
      delete submissionData.api_key;
    }

    // Convert settings string back to object if it's a string
    if (typeof submissionData.settings === 'string') {
        try {
            submissionData.settings = JSON.parse(submissionData.settings);
        } catch (e) {
            toast.error("Invalid JSON format in settings.");
            return;
        }
    }


    if (selectedProvider?.id) {
      // Ensure we don't pass id, added_at, updated_at in the data payload for update
      const { id, added_at, updated_at, lastSync, ...updateData } = submissionData as Provider;
      updateMutation.mutate({ id: selectedProvider.id, data: updateData });
    } else {
      // For creation, ensure required fields are present (handled by form/validation ideally)
      // The type Omit<Provider, 'id' | 'added_at' | 'updated_at' | 'lastSync'> guides what to send
      const { id, added_at, updated_at, lastSync, ...createData } = submissionData as Provider;
      createMutation.mutate(createData);
    }
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المورد؟ سيؤدي هذا إلى حذف جميع خدماته أيضاً.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (provider: Provider) => {
    updateMutation.mutate({ 
      id: provider.id, 
      data: { is_active: !provider.is_active }
    });
  };

  const handleSync = (providerId: string) => {
    if (confirm('Are you sure you want to sync services for this provider? This will delete existing services and fetch new ones.')) {
      setSyncingProvider(providerId);
      syncMutation.mutate(providerId);
    }
  };

  const handleOpenForm = (provider: Provider | null = null) => {
    setSelectedProvider(provider);
    setIsFormOpen(true);
  };

  const activeProvidersCount = providers.filter(p => p.is_active).length;
  const providerStatsData = {
    totalProviders: providers.length,
    activeProviders: activeProvidersCount,
    // Other stats like totalServices, totalBalance are not directly available here
    // and would require more complex aggregation or separate queries.
    // For now, we'll focus on provider counts.
    totalServices: 0, // Placeholder
    totalBalance: 0, // Placeholder
  };


  // No need for special formatting for ProvidersTable if it directly uses Provider[]
  // const formattedProviders = providers.map(provider => ({ ... }));

  if (isLoading) return <div>Loading providers...</div>;
  if (providersError) return <div>Error fetching providers: {providersError.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
              <Globe className="h-6 w-6 text-white" />
            </div>
            Provider Management
          </h1>
          <p className="text-gray-600 mt-2">Add, edit, and manage service providers.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['providers'] })}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || syncMutation.isPending}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {/* DialogTrigger for ProviderForm */}
          <Button onClick={() => handleOpenForm()} className="bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Provider
          </Button>
        </div>
      </div>

      {/* ProviderForm is now triggered by handleOpenForm and managed by isFormOpen state */}
      <ProviderForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProvider(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedProvider}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ProviderStats stats={providerStatsData} /> {/* Pass derived stats */}

      <ProvidersTable
        providers={providers} {/* Pass raw providers data */}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onSync={handleSync}
        isMobile={isMobile}
        syncingProvider={syncingProvider}
        isLoading={isLoading || deleteMutation.isPending || syncMutation.isPending}
      />
    </div>
  );
};

export default AdminProvidersManager;
