
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/authService';
import { Outlet, useLocation } from 'react-router-dom';
import UserSidebar from '@/components/dashboard/user/UserSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

const UserDashboard = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: 1,
    // Provide fallback dummy user data
    initialData: {
      success: true,
      data: {
        _id: 'dummy-user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        role: 'user',
        location: {
          city: 'New York',
          state: 'NY'
        }
      }
    },
    onError: () => {
      toast({
        title: "Connection Error",
        description: "Using demo data instead of live data.",
        variant: "default"
      });
      console.log("Using demo data - API connection failed");
    }
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

  // Continue with user data even if there's an error by using the initialData
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
