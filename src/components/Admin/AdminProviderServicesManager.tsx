
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { providerServicesService } from "@/services/admin/providerServicesService";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const AdminProviderServicesManager = ({provider, onClose}: {provider: any, onClose: ()=>void}) => {
  const { data: services = [], refetch } = useQuery({
    queryKey: ["provider_services", provider.id],
    queryFn: () => providerServicesService.getProviderServices(provider.id),
  });
  return (
    <div className="fixed inset-0 bg-black/10 z-50 flex justify-center items-start overflow-auto pt-12">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-5xl w-full overflow-auto">
        <div className="flex gap-4 items-center mb-2">
          <Button variant="outline" onClick={onClose}><ChevronLeft className="w-4 h-4"/>رجوع</Button>
          <h2 className="font-bold text-lg">خدمات المورد: {provider.name}</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>جميع الخدمات ({services.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>النوع</th>
                  <th>المنصة</th>
                  <th>السعر</th>
                  <th>تفعيل</th>
                </tr>
              </thead>
              <tbody>
                {services.map((srv: any) => (
                  <tr key={srv.id}>
                    <td>{srv.name}</td>
                    <td>{srv.type}</td>
                    <td>{srv.platform}</td>
                    <td>{srv.rate}</td>
                    <td>{srv.is_active ? "نعم" : "لا"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
};

export default AdminProviderServicesManager;
