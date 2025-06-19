// src/components/Orders/OrderDetails.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // For a close button in footer

// Expect the Order type from where it's defined, or redefine if necessary to match OrdersList's Order type
interface Order {
  id: string;
  service_id: string;
  link: string;
  quantity: number;
  original_price: number;
  final_price: number;
  profit: number;
  status: string;
  created_at: string;
  user_profile?: {
    full_name?: string;
    email?: string;
  };
  // Potentially other fields like 'profiles' if that was part of the data prop
}

interface OrderDetailsProps {
  order: Order | null; // Expect a single order object, can be null initially
  onClose?: () => void; // Optional close handler
}

// Helper to get status text - can be shared or duplicated if simple
const getStatusText = (status: string) => {
    switch (status) {
        case 'pending': return 'معلق';
        case 'processing': return 'قيد المعالجة';
        case 'completed': return 'مكتمل';
        case 'cancelled': return 'ملغي';
        default: return status;
    }
};
const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'completed': return 'default'; // Greenish in shadcn default
        case 'pending': return 'secondary'; // Yellowish/Greyish
        case 'processing': return 'default'; // Bluish
        case 'cancelled': return 'destructive'; // Reddish
        default: return 'outline';
    }
};


const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <p>الرجاء تحديد طلب لعرض تفاصيله.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>تفاصيل الطلب #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription>
              تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-SA')}
            </CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(order.status)}>
            {getStatusText(order.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">بيانات العميل</h3>
          <p><strong>الاسم:</strong> {order.user_profile?.full_name || 'غير متوفر'}</p>
          <p><strong>البريد الإلكتروني:</strong> {order.user_profile?.email || 'غير متوفر'}</p>
        </div>
        <hr/>
        <div>
          <h3 className="font-semibold mb-1">معلومات الخدمة</h3>
          <p><strong>معرف الخدمة:</strong> {order.service_id}</p>
          <p><strong>الرابط:</strong> <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{order.link}</a></p>
          <p><strong>الكمية:</strong> {order.quantity}</p>
        </div>
        <hr/>
        <div>
          <h3 className="font-semibold mb-1">التفاصيل المالية</h3>
          <p><strong>السعر الأصلي:</strong> {order.original_price} ر.س</p>
          <p><strong>السعر النهائي:</strong> {order.final_price} ر.س</p>
          <p><strong>الربح:</strong> {order.profit} ر.س</p>
        </div>
      </CardContent>
      {onClose && (
        <CardFooter>
          <Button variant="outline" onClick={onClose}>إغلاق</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderDetails;
