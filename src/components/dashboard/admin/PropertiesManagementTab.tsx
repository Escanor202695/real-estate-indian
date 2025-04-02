
import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getProperties, deleteProperty } from '@/services/propertyService';
// import { notifyUsers } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Edit, Search, Home, Bell, Plus, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const dummyProperties = [
  {
    _id: 'prop1',
    title: 'Modern Apartment in City Center',
    type: 'flat',
    status: 'rent',
    price: 25000,
    location: { city: 'Mumbai' },
    createdAt: new Date().toISOString(),
    views: 145,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']
  },
  {
    _id: 'prop2',
    title: 'Luxury Villa with Garden',
    type: 'villa',
    status: 'sale',
    price: 9500000,
    location: { city: 'Bangalore' },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    views: 324,
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914']
  },
  {
    _id: 'prop3',
    title: 'Commercial Space in Tech Park',
    type: 'commercial',
    status: 'rent',
    price: 150000,
    location: { city: 'Hyderabad' },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    views: 78,
    images: []
  },
  {
    _id: 'prop4',
    title: '3BHK Independent House',
    type: 'house',
    status: 'sale',
    price: 4500000,
    location: { city: 'Delhi' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    views: 256,
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994']
  },
  {
    _id: 'prop5',
    title: 'Premium Office Space',
    type: 'commercial',
    status: 'rent',
    price: 180000,
    location: { city: 'Gurgaon' },
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    views: 112,
    images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2']
  },
  {
    _id: 'prop6',
    title: '2BHK Flat in Suburban Area',
    type: 'flat',
    status: 'rent',
    price: 18000,
    location: { city: 'Pune' },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    views: 198,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb']
  }
];

const PropertiesManagementTab = () => {
  // const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Commented out API calls
  /*
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminProperties', searchQuery, selectedType, selectedStatus],
    queryFn: () => {
      const params: any = {};
      if (searchQuery) params.location = searchQuery;
      if (selectedType !== 'all') params.type = selectedType;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      return getProperties(params);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      toast.success('Property deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete property');
    }
  });

  const notifyMutation = useMutation({
    mutationFn: (ids: string[]) => notifyUsers(ids),
    onSuccess: (data) => {
      toast.success(`Notified ${data.data.notifiedUsers.length} users about new properties`);
      setSelectedProperties([]);
    },
    onError: () => {
      toast.error('Failed to send notifications');
    }
  });
  */

  const handleDeleteProperty = (id: string) => {
    // Simulate delete operation
    toast.success('Property deleted successfully');
    // deleteMutation.mutate(id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate search
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    // queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
  };

  const handleSelectProperty = (id: string) => {
    setSelectedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(propId => propId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (properties.length > 0 && selectedProperties.length === properties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map(property => property._id));
    }
  };

  const handleNotifyUsers = () => {
    // Simulate notification
    toast.success(`Notified users about ${selectedProperties.length} properties`);
    setSelectedProperties([]);
    /*
    if (selectedProperties.length > 0) {
      notifyMutation.mutate(selectedProperties);
    }
    */
  };

  // Apply filtering to dummy data
  let filteredProperties = dummyProperties;
  
  if (searchQuery) {
    filteredProperties = filteredProperties.filter(property => 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (selectedType !== 'all') {
    filteredProperties = filteredProperties.filter(property => 
      property.type === selectedType
    );
  }
  
  if (selectedStatus !== 'all') {
    filteredProperties = filteredProperties.filter(property => 
      property.status === selectedStatus
    );
  }

  const properties = filteredProperties;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Properties Management</CardTitle>
        <Button className="bg-clickprop-blue hover:bg-clickprop-blue-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              placeholder="Search by location or title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="pg">PG/Co-living</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedProperties.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-blue-700">
                {selectedProperties.length} properties selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={handleNotifyUsers}
              >
                <Bell className="h-4 w-4 mr-1" />
                Notify Users
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={() => setSelectedProperties([])}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters or add a new property.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <Checkbox 
                      checked={properties.length > 0 && selectedProperties.length === properties.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property: any) => (
                  <TableRow key={property._id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedProperties.includes(property._id)}
                        onCheckedChange={() => handleSelectProperty(property._id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded mr-2">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.title} 
                              className="h-10 w-10 object-cover rounded"
                            />
                          ) : (
                            <Home className="h-6 w-6 m-2 text-gray-400" />
                          )}
                        </div>
                        <div className="truncate max-w-[150px]" title={property.title}>
                          {property.title}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {property.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={property.status === 'sale' 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-green-50 text-green-700 border-green-200'
                        }
                      >
                        {property.status === 'sale' ? 'For Sale' : 'For Rent'}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{property.price.toLocaleString()}</TableCell>
                    <TableCell>{property.location.city}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(property.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell>{property.views}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/properties/${property._id}`}>
                            <Search className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the property.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteProperty(property._id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertiesManagementTab;
