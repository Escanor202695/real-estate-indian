
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, Users, ArrowUp, TrendingDown, TrendingUp, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/services/adminService';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboardTab = () => {
  const { toast } = useToast();
  
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    }
  });

  // Format data for charts
  const popularCities = statsData?.data?.cityStats?.topByPropertyCount?.map(city => ({
    name: city.name,
    count: city.propertyCount || 0
  })) || [];

  // We'll use property views data from the API in the future
  // For now, create a placeholder with months
  const propertyViewsData = [
    { date: 'Jan', count: 0 },
    { date: 'Feb', count: 0 },
    { date: 'Mar', count: 0 },
    { date: 'Apr', count: 0 },
    { date: 'May', count: 0 },
    { date: 'Jun', count: 0 },
    { date: 'Jul', count: 0 },
    { date: 'Aug', count: 0 },
    { date: 'Sep', count: 0 },
    { date: 'Oct', count: 0 },
    { date: 'Nov', count: 0 },
    { date: 'Dec', count: 0 },
  ].map((item, index) => {
    const views = statsData?.data?.propertyStats?.viewsByMonth?.[index]?.count || 0;
    return {
      ...item,
      count: views
    };
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium">Failed to load dashboard data</h3>
        <p className="text-gray-500 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  const stats = statsData.data;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.propertyStats?.total || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.propertyStats?.active || 0} active
            </p>
          </CardContent>
        </Card>
        
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.userStats?.total || 0}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>{stats?.userStats?.newThisMonth || 0} new this month</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Cities Coverage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cities Coverage</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.cityStats?.total || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              Cities with active properties
            </p>
          </CardContent>
        </Card>
        
        {/* Property Views */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Property Views</CardTitle>
            <Eye className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.propertyStats?.totalViews || 0}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>{stats?.propertyStats?.viewsChangePercent || 0}% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Views Trend</CardTitle>
            <CardDescription>Monthly property views over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertyViewsData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Cities</CardTitle>
            <CardDescription>Cities with the most properties</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularCities} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>Comparison with last month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm">This Month</p>
                  <p className="font-medium">{stats?.userStats?.newThisMonth || 0}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Last Month</p>
                  <p className="font-medium">{stats?.userStats?.newLastMonth || 0}</p>
                </div>
                <div className="flex items-center justify-between text-green-500">
                  <p className="text-sm flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Change
                  </p>
                  <p className="font-medium">+{stats?.userStats?.newUsersChangePercent || 0}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Property Views</CardTitle>
            <CardDescription>Comparison with last month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm">This Month</p>
                  <p className="font-medium">{stats?.propertyStats?.viewsThisMonth || 0}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Last Month</p>
                  <p className="font-medium">{stats?.propertyStats?.viewsLastMonth || 0}</p>
                </div>
                <div className="flex items-center justify-between text-green-500">
                  <p className="text-sm flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Change
                  </p>
                  <p className="font-medium">+{stats?.propertyStats?.viewsChangePercent || 0}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardTab;
