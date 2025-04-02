
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserPreferences } from '@/services/userService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const PropertyAlertsTab = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: getUserPreferences
  });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading alerts</div>;
  }

  const notifications = data?.data?.notifications || [];
  const savedSearches = data?.data?.savedSearches || [];
  const hasActiveAlerts = savedSearches.some((search: any) => search.notifyByEmail);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Alerts</CardTitle>
          <CardDescription>
            Receive notifications for new properties matching your saved searches
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasActiveAlerts ? (
            <div className="text-center py-8">
              <BellOff className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No active alerts</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any active property alerts. Enable email notifications for your saved searches to receive alerts.
              </p>
              <div className="mt-6">
                <Button asChild className="bg-clickprop-blue hover:bg-clickprop-blue-dark">
                  <Link to="/dashboard/saved-searches">
                    Manage Saved Searches
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800">Email alerts are active</h3>
                  <p className="text-sm text-green-600 mt-1">
                    You will receive email notifications when new properties match your saved searches.
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-3">Active search alerts:</h3>
                <div className="space-y-3">
                  {savedSearches
                    .filter((search: any) => search.notifyByEmail)
                    .map((search: any) => (
                      <div key={search._id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 text-clickprop-blue mr-2" />
                            <span className="font-medium">{search.location || 'Any location'}</span>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {search.propertyType && search.propertyType !== 'all' 
                            ? `Property type: ${search.propertyType}` 
                            : 'All property types'
                          }
                          {search.status && search.status !== 'all' 
                            ? `, For: ${search.status === 'sale' ? 'Sale' : 'Rent'}` 
                            : ''
                          }
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>
            Recent notifications about new properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You will receive notifications here when new properties match your saved searches.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-4 border rounded-lg ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}
                >
                  <div className="flex items-start">
                    <AlertCircle className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${notification.read ? 'text-gray-400' : 'text-clickprop-blue'}`} />
                    <div className="flex-1">
                      <p className={`${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {!notification.read && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyAlertsTab;
