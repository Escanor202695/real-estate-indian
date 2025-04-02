
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/authService';
import { Outlet, useLocation } from 'react-router-dom';
import UserSidebar from '@/components/dashboard/user/UserSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { sendNotificationEmail } from '@/services/emailService';

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
    }
  });

  // Handle query error
  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: "Using demo data instead of live data.",
        variant: "default"
      });
      console.log("Using demo data - API connection failed");
    }
  }, [error, toast]);

  // Add effect to check for new notifications
  useEffect(() => {
    // This would normally be implemented with websockets or periodic polling
    // For demo purposes, we'll simulate a new notification after 5 seconds on dashboard load
    if (!isLoading && data?.data && location.pathname === '/dashboard') {
      const timer = setTimeout(() => {
        const newNotification = {
          message: "New property matching your search criteria is now available!",
          type: "property_alert"
        };
        
        // Send email notification
        sendNotificationEmail(data.data._id, newNotification)
          .then(() => {
            toast({
              title: "Email Notification Sent",
              description: "An email notification has been sent to your registered email address.",
              variant: "default"
            });
          })
          .catch((err) => {
            console.error("Failed to send email notification:", err);
          });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, data?.data, location.pathname, toast]);

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
