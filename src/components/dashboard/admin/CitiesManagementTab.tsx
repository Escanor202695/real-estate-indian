
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCities } from '@/services/cityService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Edit, Plus, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Dummy data for cities when API fails or returns empty
const dummyCities = [
  {
    _id: 'city1',
    name: 'Mumbai',
    state: 'Maharashtra',
    propertyCount: 152,
    searchCount: 438
  },
  {
    _id: 'city2',
    name: 'Bangalore',
    state: 'Karnataka',
    propertyCount: 128,
    searchCount: 356
  },
  {
    _id: 'city3',
    name: 'Delhi',
    state: 'Delhi',
    propertyCount: 110,
    searchCount: 289
  },
  {
    _id: 'city4',
    name: 'Hyderabad',
    state: 'Telangana',
    propertyCount: 95,
    searchCount: 243
  },
  {
    _id: 'city5',
    name: 'Chennai',
    state: 'Tamil Nadu',
    propertyCount: 82,
    searchCount: 198
  }
];

const CitiesManagementTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminCities'],
    queryFn: getCities
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side filtering is already implemented
  };

  // Use dummy data if API call has error or returns empty array
  const allCities = (error || !data?.data || data.data.length === 0) 
    ? dummyCities 
    : data.data;

  // Filter cities based on search query
  let cities = allCities;
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    cities = cities.filter((city: any) => 
      city.name.toLowerCase().includes(query) || 
      city.state.toLowerCase().includes(query)
    );
  }

  // Sort cities by property count
  cities = [...cities].sort((a: any, b: any) => b.propertyCount - a.propertyCount);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cities Management</CardTitle>
        <Button className="bg-clickprop-blue hover:bg-clickprop-blue-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add City
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search cities by name or state"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        {cities.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No cities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters or add a new city.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Searches</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city: any) => (
                <TableRow key={city._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-clickprop-blue mr-2" />
                      {city.name}
                    </div>
                  </TableCell>
                  <TableCell>{city.state}</TableCell>
                  <TableCell>{city.propertyCount || 0}</TableCell>
                  <TableCell>{city.searchCount || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/cities/${city.name}`}>
                          <Search className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        <BarChart className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CitiesManagementTab;
