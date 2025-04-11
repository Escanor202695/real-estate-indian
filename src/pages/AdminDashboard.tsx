
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/authService';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const location = useLocation();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: 1,
    meta: {
      onSettled: (_data: any, error: Error | null) => {
        if (error) {
          toast.error("Authentication Error", {
            description: "Please log in to access the admin dashboard."
          });
        }
      }
    }
  });

  if (isLoading) {
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

  // Enforce authentication check
  if (error || !data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Enforce admin role check
  if (data && data.data.role !== 'admin') {
    toast.error("Access Denied", {
      description: "You do not have permission to access the admin dashboard."
    });
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-1">
          <AdminSidebar />
        </div>
        <div className="md:col-span-4">
          <Outlet context={data?.data} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
