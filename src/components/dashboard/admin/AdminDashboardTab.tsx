
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, Users, ArrowUp, TrendingDown, TrendingUp, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data for dashboard stats
const dashboardStats = {
  totalProperties: 235,
  activeProperties: 187,
  totalUsers: 423,
  totalCities: 12,
  propertiesViewsTotal: 12453,
  propertiesViewsLastMonth: 1876,
  propertyViewsChange: 12.4, // percentage
  newUsersThisMonth: 42,
  newUsersLastMonth: 38,
  newUsersChange: 10.5, // percentage
  popularCities: [
    { name: 'Mumbai', count: 78 },
    { name: 'Bangalore', count: 65 },
    { name: 'Delhi', count: 54 },
    { name: 'Hyderabad', count: 43 },
    { name: 'Chennai', count: 36 },
    { name: 'Pune', count: 29 },
  ],
  recentPropertyViews: [
    { date: 'Jan', count: 345 },
    { date: 'Feb', count: 421 },
    { date: 'Mar', count: 384 },
    { date: 'Apr', count: 507 },
    { date: 'May', count: 578 },
    { date: 'Jun', count: 624 },
    { date: 'Jul', count: 687 },
    { date: 'Aug', count: 752 },
    { date: 'Sep', count: 798 },
    { date: 'Oct', count: 845 },
    { date: 'Nov', count: 934 },
    { date: 'Dec', count: 1020 },
  ],
};

const AdminDashboardTab = () => {
  // Using dummy data instead of API calls
  const stats = dashboardStats;
  
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
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.activeProperties} active
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
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>{stats.newUsersChange}% from last month</span>
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
            <div className="text-2xl font-bold">{stats.totalCities}</div>
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
            <div className="text-2xl font-bold">{stats.propertiesViewsTotal}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>{stats.propertyViewsChange}% from last month</span>
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
              <BarChart data={stats.recentPropertyViews}>
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
              <BarChart data={stats.popularCities} layout="vertical">
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
                  <p className="font-medium">{stats.newUsersThisMonth}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Last Month</p>
                  <p className="font-medium">{stats.newUsersLastMonth}</p>
                </div>
                <div className="flex items-center justify-between text-green-500">
                  <p className="text-sm flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Change
                  </p>
                  <p className="font-medium">+{stats.newUsersChange}%</p>
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
                  <p className="font-medium">{stats.propertiesViewsLastMonth}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Last Month</p>
                  <p className="font-medium">
                    {Math.round(stats.propertiesViewsLastMonth / (1 + stats.propertyViewsChange / 100))}
                  </p>
                </div>
                <div className="flex items-center justify-between text-green-500">
                  <p className="text-sm flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Change
                  </p>
                  <p className="font-medium">+{stats.propertyViewsChange}%</p>
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
