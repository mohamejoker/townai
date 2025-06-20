
import { supabase } from '@/integrations/supabase/client';
import { ServiceFormValues } from '@/lib/validators';

export type Service = {
    id: string;
    created_at: string;
    updated_at: string;
    // Potentially add these if they need to be part of the main Service type
    linked_provider_service_id?: string | null;
    source_provider_service_data?: Record<string, any> | null; // Or string for JSON
} & ServiceFormValues;

export const serviceService = {
  async getServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.log('Error getting services:', error);
        throw error;
      }
      return data as Service[];
    } catch (error) {
      console.log('Error getting services:', error);
      return [];
    }
  },
  
  async getActiveServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.log('Error getting active services:', error);
        throw error;
      }
      return data as Service[];
    } catch (error) {
      console.log('Error getting active services:', error);
      return [];
    }
  },

  async createService(service: ServiceFormValues) {
    try {
      // Ensure all required fields are present
      const serviceData = {
        title: service.title,
        price: service.price,
        features: service.features.filter(f => f.trim() !== ''), // Remove empty features
        button_text: service.button_text || 'اطلب الآن',
        gradient_class: service.gradient_class || 'from-sky-400 to-blue-500',
        is_popular: service.is_popular || false,
        is_active: service.is_active !== undefined ? service.is_active : true,
        // Include new optional fields if they are present in ServiceFormValues
        linked_provider_service_id: service.linked_provider_service_id,
        source_provider_service_data: service.source_provider_service_data,
      };

      // Filter out undefined new fields to avoid sending them to Supabase if not provided
      Object.keys(serviceData).forEach(key => {
        const K = key as keyof typeof serviceData;
        if (serviceData[K] === undefined) {
          delete serviceData[K];
        }
      });

      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();
      
      if (error) {
        console.log('Error creating service:', error);
        throw error;
      }
      return data as Service;
    } catch (error) {
      console.log('Error creating service:', error);
      throw error;
    }
  },

  async updateService(id: string, service: Partial<ServiceFormValues>) {
    try {
      // Filter out empty features if updating features
      if (service.features) {
        service.features = service.features.filter(f => f.trim() !== '');
      }

      const updateData: Partial<ServiceFormValues & { linked_provider_service_id?: string; source_provider_service_data?: Record<string, any> }> = { ...service };

      // Filter out undefined new fields to avoid sending them to Supabase if not provided explicitly for update
      if (updateData.linked_provider_service_id === undefined) delete updateData.linked_provider_service_id;
      if (updateData.source_provider_service_data === undefined) delete updateData.source_provider_service_data;


      const { data, error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.log('Error updating service:', error);
        throw error;
      }
      return data as Service;
    } catch (error) {
      console.log('Error updating service:', error);
      throw error;
    }
  },

  async deleteService(id: string) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.log('Error deleting service:', error);
        throw error;
      }
    } catch (error) {
      console.log('Error deleting service:', error);
      throw error;
    }
  },

  async getServiceStats() {
    try {
      const { data: services } = await supabase
        .from('services')
        .select('is_active, is_popular');
      
      if (!services) return { total: 0, active: 0, popular: 0 };

      return {
        total: services.length,
        active: services.filter(s => s.is_active).length,
        popular: services.filter(s => s.is_popular).length
      };
    } catch (error) {
      console.log('Error getting service stats:', error);
      return { total: 0, active: 0, popular: 0 };
    }
  }
};
