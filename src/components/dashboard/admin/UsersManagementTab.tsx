
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, updateUser } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Edit, Search, User, Plus, Mail, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const UsersManagementTab = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch users
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getUsers,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch users data",
        variant: "destructive"
      });
    }
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  });

  const handleDeleteUser = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side filtering is handled below
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(userId => userId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (users.length > 0 && selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
  };

  const handleSendEmails = () => {
    // This will be implemented in a future feature
    toast({
      title: "Information",
      description: `Email feature will be available in the next update`
    });
    setSelectedUsers([]);
  };

  // Get users from API response
  const allUsers = data?.data || [];
  
  // Apply filtering
  let filteredUsers = allUsers;
  
  if (searchQuery) {
    filteredUsers = filteredUsers.filter((user: any) => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (selectedRole !== 'all') {
    filteredUsers = filteredUsers.filter((user: any) => 
      user.role === selectedRole
    );
  }
  
  if (selectedStatus !== 'all') {
    filteredUsers = filteredUsers.filter((user: any) => 
      (selectedStatus === 'active' && user.isActive) ||
      (selectedStatus === 'inactive' && !user.isActive) ||
      (selectedStatus === 'pending' && user.status === 'pending')
    );
  }

  const users = filteredUsers;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users Management</CardTitle>
        <Button className="bg-clickprop-blue hover:bg-clickprop-blue-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="flex gap-2">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedUsers.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-blue-700">
                {selectedUsers.length} users selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={handleSendEmails}
              >
                <Mail className="h-4 w-4 mr-1" />
                Send Email
              </Button>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading users...</p>
          </div>
        ) : error || users.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <Checkbox 
                      checked={users.length > 0 && selectedUsers.length === users.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Saved Properties</TableHead>
                  <TableHead>Searches</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedUsers.includes(user._id)}
                        onCheckedChange={() => handleSelectUser(user._id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          user.isActive ? 'bg-green-50 text-green-700 border-green-200' : 
                          !user.isActive ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'N/A'}</TableCell>
                    <TableCell>{user.preferences?.savedProperties?.length || 0}</TableCell>
                    <TableCell>{user.preferences?.savedSearches?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                                This action cannot be undone. This will permanently delete the user account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteUser(user._id)}
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

export default UsersManagementTab;
