
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/authService';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import UserSidebar from '@/components/dashboard/user/UserSidebar';
import { Skeleton } from '@/components/ui/skeleton';

const UserDashboard = () => {
  const location = useLocation();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
          <div className="md:col-span-3">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = data.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <UserSidebar />
        </div>
        <div className="md:col-span-3">
          <Outlet context={user} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
