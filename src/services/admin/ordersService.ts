
import { supabase } from '@/integrations/supabase/client';

export interface ServiceOrder {
  id: string;
  user_id?: string;
  service_id: string;
  provider_service_id?: string;
  link: string;
  quantity: number;
  original_price: number;
  final_price: number;
  profit: number;
  status: 'pending' | 'processing' | 'completed' | 'partial' | 'cancelled' | 'failed';
  start_count?: number;
  remains?: number;
  provider_order_id?: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  // Relations
  service?: {
    title: string;
    price: string;
  };
  user?: {
    full_name?: string;
    email?: string;
  };
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  old_status?: string;
  new_status: string;
  reason?: string;
  changed_by?: string;
  changed_at: string;
  metadata?: Record<string, any>;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalProfit: number;
  avgOrderValue: number;
}

class OrdersService {
  async getOrders(filters?: {
    status?: string;
    userId?: string;
    serviceId?: string;
    limit?: number;
    offset?: number;
  }): Promise<ServiceOrder[]> {
    let query = supabase
      .from('service_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.serviceId) {
      query = query.eq('service_id', filters.serviceId);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return (data || []) as ServiceOrder[];
  }

  async getOrder(id: string): Promise<ServiceOrder | null> {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data as ServiceOrder;
  }

import { providerService } from '../providers/providerService'; // Import providerService
import { type Service } from '../serviceService'; // Import Service type for platform services

class OrdersService {
  async getOrders(filters?: {
    status?: string;
    userId?: string;
    serviceId?: string;
    limit?: number;
    offset?: number;
  }): Promise<ServiceOrder[]> {
    let query = supabase
      .from('service_orders')
      .select('*, service:services(title, price, linked_provider_service_id, source_provider_service_data), user:users(full_name, email)') // Added relations
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.serviceId) {
      query = query.eq('service_id', filters.serviceId);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return (data || []) as ServiceOrder[];
  }

  async getOrder(id: string): Promise<ServiceOrder | null> {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*, service:services(title, price, linked_provider_service_id, source_provider_service_data), user:users(full_name, email)') // Added relations
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data as ServiceOrder;
  }

  async createOrder(orderInput: Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at' | 'service' | 'user' | 'status' | 'provider_order_id' | 'metadata'>): Promise<ServiceOrder> {
    let finalOrderData: Partial<ServiceOrder> = { ...orderInput };
    finalOrderData.status = 'pending'; // Default status

    // 1. Fetch the platform service details
    const { data: platformService, error: serviceFetchError } = await supabase
      .from('services')
      .select('id, linked_provider_service_id, source_provider_service_data') // Fetch fields needed for provider logic
      .eq('id', orderInput.service_id)
      .single<Service>(); // Use Service type

    if (serviceFetchError || !platformService) {
      console.error(`Platform service with ID ${orderInput.service_id} not found or error fetching:`, serviceFetchError);
      // Create a failed order locally if service lookup fails catastrophically
      finalOrderData.status = 'failed';
      finalOrderData.metadata = { ...finalOrderData.metadata, error: `Platform service lookup failed: ${serviceFetchError?.message || 'Not found'}` };
      // Insert the order with failed status
      const { data, error: insertError } = await supabase
        .from('service_orders')
        .insert([finalOrderData  as Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at' | 'service' | 'user'>])
        .select()
        .single();
      if (insertError) throw insertError; // If even failed order insertion fails, throw
      return data as ServiceOrder;
    }

    // 2. Check if the platform service is linked to a provider service
    const linkedProviderServiceId = platformService.linked_provider_service_id;
    // The orderInput should ideally already have provider_service_id if it's a provider-backed service.
    // We use the one from the platformService definition for truth.
    finalOrderData.provider_service_id = linkedProviderServiceId;


    if (linkedProviderServiceId) {
      try {
        // 3a. Call providerService to place the actual order
        console.log(`Placing order to provider for linked_provider_service_id: ${linkedProviderServiceId}`);
        const providerResponse = await providerService.createActualOrderToProvider(
          linkedProviderServiceId,
          orderInput.link,
          orderInput.quantity
        );

        // 3b. If successful, update order details
        finalOrderData.provider_order_id = providerResponse.provider_order_id;
        finalOrderData.status = 'processing'; // Or 'sent_to_provider', 'pending_provider_confirmation'
        finalOrderData.metadata = { ...finalOrderData.metadata, provider_response: providerResponse };
        console.log(`Order placed successfully with provider. Provider Order ID: ${providerResponse.provider_order_id}`);

      } catch (providerError: any) {
        // 3c. If placing order with provider fails
        console.error(`Failed to place order with provider for linked_provider_service_id ${linkedProviderServiceId}:`, providerError);
        finalOrderData.status = 'failed'; // Or a specific status like 'provider_order_failed'
        finalOrderData.metadata = { ...finalOrderData.metadata, error: `Provider order placement failed: ${providerError.message}` };
      }
    } else {
      // 4. If not linked to a provider, it's a native platform service.
      // Current status is 'pending'. Additional logic for native services could go here.
      console.log(`Order for service ID ${orderInput.service_id} is a native platform service.`);
    }

    // 5. Insert the service_orders record (whether successful with provider or native)
    const { data, error } = await supabase
      .from('service_orders')
      .insert([finalOrderData as Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at' | 'service' | 'user'>])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating final service_orders record:', error);
      // This is a critical error, as we might have placed an order with a provider
      // but failed to record it locally. Needs robust handling/logging.
      throw error;
    }
    console.log("Final order data created:", data);
    return data as ServiceOrder;
  }

  async updateOrderStatus(
    orderId: string, 
    status: ServiceOrder['status'], 
    additionalData?: Partial<ServiceOrder>
  ): Promise<ServiceOrder> {
    const updates = {
      status,
      ...additionalData,
      ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {})
    };

    const { data, error } = await supabase
      .from('service_orders')
      .update(updates)
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return data as ServiceOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('service_orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  async getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
    const { data, error } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('changed_at', { ascending: false });

    if (error) {
      console.error('Error fetching order status history:', error);
      throw error;
    }

    return (data || []) as OrderStatusHistory[];
  }

  async getOrderStats(): Promise<OrderStats> {
    const { data: orders, error } = await supabase
      .from('service_orders')
      .select('status, final_price, profit');

    if (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }

    const stats: OrderStats = {
      totalOrders: orders?.length || 0,
      pendingOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
      totalProfit: 0,
      avgOrderValue: 0
    };

    orders?.forEach((order: any) => {
      switch (order.status) {
        case 'pending':
          stats.pendingOrders++;
          break;
        case 'processing':
          stats.processingOrders++;
          break;
        case 'completed':
          stats.completedOrders++;
          stats.totalRevenue += order.final_price;
          stats.totalProfit += order.profit;
          break;
        case 'cancelled':
        case 'failed':
          stats.cancelledOrders++;
          break;
      }
    });

    if (stats.completedOrders > 0) {
      stats.avgOrderValue = stats.totalRevenue / stats.completedOrders;
    }

    return stats;
  }

  async getUserOrders(userId: string): Promise<ServiceOrder[]> {
    return this.getOrders({ userId });
  }

  async getServiceOrders(serviceId: string): Promise<ServiceOrder[]> {
    return this.getOrders({ serviceId });
  }

  async searchOrders(searchTerm: string): Promise<ServiceOrder[]> {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*')
      .or(`link.ilike.%${searchTerm}%,provider_order_id.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching orders:', error);
      throw error;
    }

    return (data || []) as ServiceOrder[];
  }

  async bulkUpdateOrderStatus(orderIds: string[], status: ServiceOrder['status']): Promise<void> {
    const { error } = await supabase
      .from('service_orders')
      .update({ 
        status,
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {})
      })
      .in('id', orderIds);

    if (error) {
      console.error('Error bulk updating order status:', error);
      throw error;
    }
  }
}

export const ordersService = new OrdersService();
