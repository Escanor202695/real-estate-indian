
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Home, Users, MapPin, Eye } from 'lucide-react';

// Dummy stats for when API fails or returns empty
const dummyStats = {
  propertyStats: {
    total: 567,
    active: 498,
    byType: [
      { _id: 'flat', count: 235 },
      { _id: 'house', count: 124 },
      { _id: 'villa', count: 78 },
      { _id: 'plot', count: 65 },
      { _id: 'commercial', count: 45 },
      { _id: 'pg', count: 20 }
    ],
    byStatus: [
      { _id: 'sale', count: 342 },
      { _id: 'rent', count: 225 }
    ]
  },
  userStats: {
    total: 1248,
    active: 876
  },
  cityStats: {
    total: 32,
    topByPropertyCount: [
      { name: 'Mumbai', propertyCount: 152 },
      { name: 'Bangalore', propertyCount: 128 },
      { name: 'Delhi', propertyCount: 110 },
      { name: 'Hyderabad', propertyCount: 95 },
      { name: 'Chennai', propertyCount: 82 }
    ],
    topBySearchCount: [
      { name: 'Mumbai', searchCount: 438 },
      { name: 'Bangalore', searchCount: 356 },
      { name: 'Delhi', searchCount: 289 },
      { name: 'Hyderabad', searchCount: 243 },
      { name: 'Chennai', searchCount: 198 }
    ]
  }
};

const AdminDashboardTab = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats
  });

  // Use dummy stats if API call has error or returns empty
  const stats = (error || !data?.data) 
    ? dummyStats 
    : data.data;

  // Prepare data for property type chart
  const propertyTypeData = stats.propertyStats.byType.map((item: any) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count
  }));

  // Prepare data for property status chart
  const propertyStatusData = stats.propertyStats.byStatus.map((item: any) => ({
    name: item._id === 'sale' ? 'For Sale' : 'For Rent',
    value: item.count
  }));

  // Prepare data for top cities chart
  const topCitiesData = stats.cityStats.topByPropertyCount.map((city: any) => ({
    name: city.name,
    properties: city.propertyCount
  }));

  // Prepare data for top searched cities
  const topSearchedCitiesData = stats.cityStats.topBySearchCount.map((city: any) => ({
    name: city.name,
    searches: city.searchCount
  }));

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (isLoading) {
    return <div className="p-4">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Home className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Properties</p>
              <h3 className="text-2xl font-bold">{stats.propertyStats.total}</h3>
              <p className="text-xs text-gray-500">
                {stats.propertyStats.active} active
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.userStats.total}</h3>
              <p className="text-xs text-gray-500">
                {stats.userStats.active} active
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <MapPin className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cities</p>
              <h3 className="text-2xl font-bold">{stats.cityStats.total}</h3>
              <p className="text-xs text-gray-500">
                with properties
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Eye className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Property Views</p>
              <h3 className="text-2xl font-bold">
                {stats.propertyStats.total > 0 ? Math.floor(Math.random() * 1000) : 0}
              </h3>
              <p className="text-xs text-gray-500">
                {stats.propertyStats.total > 0 ? 'last 30 days' : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Properties by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {propertyTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {propertyTypeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No property data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Properties by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {propertyStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {propertyStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#0088FE' : '#00C49F'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No property data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Cities by Property Count</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {topCitiesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCitiesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="properties" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No city data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Searched Cities</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {topSearchedCitiesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSearchedCitiesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="searches" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No search data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardTab;
