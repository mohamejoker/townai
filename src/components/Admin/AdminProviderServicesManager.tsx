
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { providerServicesService } from "@/services/admin/providerServicesService";
import type { ProviderServiceItem } from "@/services/providers/providerService"; // For ProviderServiceItem type
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ImportIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import ServiceForm from "@/components/Admin/ServiceForm"; // Platform Service Form
import { toast } from "sonner";

// Define a type for the data expected by Platform ServiceForm's initialData
// This should align with ServiceFormValues in serviceService.ts or lib/validators.ts
type PlatformServiceFormData = {
  title: string;
  price: string; // Or number, depending on ServiceForm
  features: string[];
  gradient_class?: string;
  button_text?: string;
  is_active?: boolean;
  is_popular?: boolean;
  linked_provider_service_id?: string;
  source_provider_service_data?: Record<string, any>;
  // Add other fields that ServiceForm expects like category, type, platform if needed
  // For now, focusing on core fields and linkage.
  description?: string;
  category?: string;
  type?: string;
  platform?: string;
};


const AdminProviderServicesManager = ({provider, onClose}: {provider: any, onClose: ()=>void}) => {
  const [isPlatformServiceFormOpen, setIsPlatformServiceFormOpen] = useState(false);
  const [selectedProviderService, setSelectedProviderService] = useState<ProviderServiceItem | null>(null);

  const queryClient = useQueryClient();

  const { data: providerServices = [], isLoading: isLoadingServices, refetch } = useQuery<ProviderServiceItem[], Error>({
    queryKey: ["provider_services", provider.id],
    queryFn: () => providerServicesService.getProviderServices(provider.id),
  });

  const handleOpenImportForm = (service: ProviderServiceItem) => {
    setSelectedProviderService(service);
    setIsPlatformServiceFormOpen(true);
  };

  const handlePlatformServiceFormClose = () => {
    setIsPlatformServiceFormOpen(false);
    setSelectedProviderService(null);
    // Optionally, refetch platform services if a new one might have been added
    // queryClient.invalidateQueries({ queryKey: ['admin-services'] });
  };

  // This mutation is handled by ServiceForm.tsx itself.
  // We just need to ensure ServiceForm.tsx calls its onClose prop.

  const mapProviderServiceToPlatformFormData = (providerService: ProviderServiceItem): PlatformServiceFormData => {
    // Basic mapping, adjust as needed
    // Suggest a price with a 20% markup, for example
    const suggestedPrice = providerService.rate ? (parseFloat(providerService.rate.toString()) * 1.20).toFixed(2) : '';

    return {
      title: providerService.name || '',
      price: suggestedPrice, // Admin can adjust this
      features: [], // Admin can add features
      description: providerService.description || '',
      category: providerService.category || '',
      type: providerService.type || '', // This might need mapping if enums differ
      platform: providerService.platform || '', // This might need mapping
      is_active: true, // Default to active
      is_popular: false, // Default
      linked_provider_service_id: providerService.id, // Link to the original provider service ID
      source_provider_service_data: providerService, // Store the full original service data
    };
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-start overflow-auto pt-10 pb-10">
        <Card className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
          <CardHeader className="pb-4">
            <div className="flex gap-4 items-center mb-2">
              <Button variant="outline" size="icon" onClick={onClose}><ChevronLeft className="w-5 h-5"/></Button>
              <CardTitle className="text-xl md:text-2xl">Services for: {provider.name}</CardTitle>
            </div>
             <p className="text-sm text-muted-foreground">
              Found {providerServices.length} services for this provider. You can import them as new platform services.
            </p>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            {isLoadingServices && <p>Loading services...</p>}
            {!isLoadingServices && providerServices.length === 0 && <p>No services found for this provider.</p>}
            {!isLoadingServices && providerServices.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Category</th>
                      <th className="text-left p-3 font-medium hidden sm:table-cell">Rate</th>
                      <th className="text-left p-3 font-medium">Active</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerServices.map((srv) => (
                      <tr key={srv.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3 align-top">
                          <div className="font-semibold">{srv.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">{srv.category}</div>
                        </td>
                        <td className="p-3 align-top hidden md:table-cell">{srv.category}</td>
                        <td className="p-3 align-top hidden sm:table-cell">{srv.rate}</td>
                        <td className="p-3 align-top">{srv.is_active ? "Yes" : "No"}</td>
                        <td className="p-3 align-top">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenImportForm(srv)}
                            className="flex items-center gap-1.5"
                          >
                            <ImportIcon className="w-3.5 h-3.5"/>
                            Import
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
           <CardFooter className="pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="ml-auto">Close</Button>
          </CardFooter>
        </Card>
      </div>

      {isPlatformServiceFormOpen && selectedProviderService && (
        // Using Dialog for the platform ServiceForm
        <Dialog open={isPlatformServiceFormOpen} onOpenChange={(isOpen) => { if (!isOpen) handlePlatformServiceFormClose(); }}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Import Provider Service as Platform Service</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Creating a new platform service based on: <strong>{selectedProviderService.name}</strong>.
                Adjust details as needed. The provider's rate was {selectedProviderService.rate}.
              </p>
            </DialogHeader>
            <ServiceForm
              onClose={handlePlatformServiceFormClose}
              initialData={mapProviderServiceToPlatformFormData(selectedProviderService)}
              // isLoading prop can be connected if ServiceForm has its own internal loading state for submission
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
};

export default AdminProviderServicesManager;
