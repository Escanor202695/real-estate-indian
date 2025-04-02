
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/authService';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const location = useLocation();
  
  // Temporarily bypass authentication check for admin dashboard
  // This should be removed in production
  const bypassAuth = true;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    // Skip the query entirely if we're bypassing auth
    enabled: !bypassAuth
  });

  if (isLoading && !bypassAuth) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
          <div className="md:col-span-4">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Skip auth check if we're bypassing
  if (!bypassAuth && (error || !data)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Skip role check if we're bypassing
  if (!bypassAuth && data && data.data.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-1">
          <AdminSidebar />
        </div>
        <div className="md:col-span-4">
          <Outlet context={data?.data || { role: 'admin' }} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
