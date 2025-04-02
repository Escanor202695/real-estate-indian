
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserPreferences, clearRecentSearches } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const RecentSearchesTab = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: getUserPreferences
  });

  const clearMutation = useMutation({
    mutationFn: clearRecentSearches,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
      toast.success('Recent searches cleared');
    },
    onError: () => {
      toast.error('Failed to clear recent searches');
    }
  });

  const handleClearAll = () => {
    clearMutation.mutate();
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading recent searches</div>;
  }

  const recentSearches = data?.data?.recentSearches || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Searches</CardTitle>
        <CardDescription>
          View your recent property searches
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentSearches.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No recent searches</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't searched for any properties yet.
            </p>
            <div className="mt-6">
              <Button asChild className="bg-clickprop-blue hover:bg-clickprop-blue-dark">
                <Link to="/properties">
                  Start Searching
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Search Query</TableHead>
                <TableHead>Filters</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSearches.map((search: any, index: number) => {
                const params = search.params || {};
                const filterText = Object.entries(params)
                  .filter(([key, value]) => value && key !== 'location')
                  .map(([key, value]) => {
                    if (key === 'type') return `Type: ${value}`;
                    if (key === 'status') return `Status: ${value === 'sale' ? 'Buy' : 'Rent'}`;
                    if (key === 'minPrice') return `Min Price: ₹${value}`;
                    if (key === 'maxPrice') return `Max Price: ₹${value}`;
                    if (key === 'bedrooms') return `Bedrooms: ${value}+`;
                    return `${key}: ${value}`;
                  })
                  .join(', ');
                
                // Build the search URL
                const searchParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                  if (value) searchParams.append(key, value as string);
                });
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {search.query || 'All Properties'}
                    </TableCell>
                    <TableCell>
                      {filterText || 'No filters'}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(search.timestamp), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/properties?${searchParams.toString()}`}>
                          <Search className="h-3.5 w-3.5 mr-1" />
                          Search
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {recentSearches.length > 0 && (
        <CardFooter className="justify-between">
          <span className="text-sm text-gray-500">
            Showing {recentSearches.length} recent searches
          </span>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={handleClearAll}
            disabled={clearMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RecentSearchesTab;
