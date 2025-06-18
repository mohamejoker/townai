
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from '@/components/Common/LoadingSpinner';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" text="جاري التحميل..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen w-full relative bg-gradient-to-b from-slate-100 to-slate-200">
        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <AdminHeader
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />
          <div className="flex flex-1 w-full">
            <AdminSidebar isCollapsed={sidebarCollapsed} />
            <main className={`flex-1 transition-all duration-300 ${
              isMobile 
                ? 'p-4 mt-16' 
                : `mt-16 ${sidebarCollapsed ? 'mr-16' : 'mr-60'} p-8`
            }`}>
              <div className="max-w-7xl mx-auto">
                <div className="rounded-3xl bg-white shadow-xl p-4 md:p-8 min-h-[65vh] border">
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
