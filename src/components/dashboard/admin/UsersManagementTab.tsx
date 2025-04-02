import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, getUser, updateUser, deleteUser } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Search, UserPlus, User, UserCheck, UserX } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const dummyUsers = [
  {
    _id: 'user1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'admin',
    isActive: true,
    phone: '+91 9876543210',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'user2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'user',
    isActive: true,
    phone: '+91 9876543211',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'user3',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    role: 'user',
    isActive: false,
    phone: null,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'user4',
    name: 'Anjali Singh',
    email: 'anjali.singh@example.com',
    role: 'user',
    isActive: true,
    phone: '+91 9876543212',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const dummyUserDetails = {
  user: {
    _id: 'user1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'admin',
    isActive: true,
    phone: '+91 9876543210',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  preferences: {
    savedSearches: [
      { id: 'search1', name: 'Apartments in Mumbai' },
      { id: 'search2', name: 'Villas in Bangalore' }
    ]
  }
};

const UsersManagementTab = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editUser, setEditUser] = useState<any>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getUsers
  });

  const { data: selectedUserData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['adminUser', selectedUser],
    queryFn: () => getUser(selectedUser),
    enabled: !!selectedUser,
  });

  const updateMutation = useMutation({
    mutationFn: (userData: any) => updateUser(userData.id, {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      isActive: userData.isActive
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User updated successfully');
      setEditUser(null);
    },
    onError: () => {
      toast.error('Failed to update user');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    }
  });

  const handleDeleteUser = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is done client-side for simplicity
  };

  const handleEditUser = (user: any) => {
    setEditUser({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive
    });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(editUser);
  };

  const handleViewUser = (id: string) => {
    setSelectedUser(id);
  };

  const users = (error || !data?.data || data.data.length === 0) 
    ? dummyUsers 
    : data.data;

  let filteredUsers = users;
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredUsers = filteredUsers.filter((user: any) => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }

  if (roleFilter !== 'all') {
    filteredUsers = filteredUsers.filter((user: any) => user.role === roleFilter);
  }

  if (statusFilter !== 'all') {
    filteredUsers = filteredUsers.filter((user: any) => {
      if (statusFilter === 'active') return user.isActive;
      return !user.isActive;
    });
  }

  const userDetails = (!selectedUserData || error) 
    ? { data: dummyUserDetails } 
    : selectedUserData;

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading users</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users Management</CardTitle>
        <Button className="bg-clickprop-blue hover:bg-clickprop-blue-dark">
          <UserPlus className="h-4 w-4 mr-2" />
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
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters or add a new user.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: any) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-clickprop-blue rounded-full flex items-center justify-center text-white mr-2">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={user.role === 'admin' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                        }
                      >
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleViewUser(user._id)}>
                              <Search className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>
                                View detailed information about the user
                              </DialogDescription>
                            </DialogHeader>
                            {isLoadingUser ? (
                              <div className="py-6 text-center">Loading user details...</div>
                            ) : userDetails.data ? (
                              <div className="py-4">
                                <div className="flex justify-center mb-6">
                                  <div className="h-20 w-20 bg-clickprop-blue rounded-full flex items-center justify-center text-white text-2xl">
                                    {userDetails.data.user.name.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-xs text-gray-500">Name</Label>
                                    <div className="font-medium">{userDetails.data.user.name}</div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs text-gray-500">Email</Label>
                                    <div className="font-medium">{userDetails.data.user.email}</div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs text-gray-500">Phone</Label>
                                    <div className="font-medium">{userDetails.data.user.phone || '-'}</div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs text-gray-500">Role</Label>
                                    <div>
                                      <Badge 
                                        variant="outline" 
                                        className={userDetails.data.user.role === 'admin' 
                                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                          : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }
                                      >
                                        {userDetails.data.user.role === 'admin' ? 'Administrator' : 'User'}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs text-gray-500">Status</Label>
                                    <div className="flex items-center">
                                      <div className={`h-2 w-2 rounded-full mr-2 ${userDetails.data.user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                      <span>{userDetails.data.user.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs text-gray-500">Joined</Label>
                                    <div className="font-medium">
                                      {new Date(userDetails.data.user.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  
                                  {userDetails.data.preferences && (
                                    <div>
                                      <Label className="text-xs text-gray-500">Saved Searches</Label>
                                      <div className="font-medium">
                                        {userDetails.data.preferences.savedSearches.length}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="py-6 text-center text-red-500">Failed to load user details</div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>
                                Make changes to the user details
                              </DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleUpdateUser}>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="text-right">
                                    Name
                                  </Label>
                                  <Input
                                    id="name"
                                    value={editUser?.name || ''}
                                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                    className="col-span-3"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="email" className="text-right">
                                    Email
                                  </Label>
                                  <Input
                                    id="email"
                                    value={editUser?.email || ''}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    className="col-span-3"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="phone" className="text-right">
                                    Phone
                                  </Label>
                                  <Input
                                    id="phone"
                                    value={editUser?.phone || ''}
                                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                                    className="col-span-3"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="role" className="text-right">
                                    Role
                                  </Label>
                                  <Select 
                                    value={editUser?.role || 'user'} 
                                    onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                                  >
                                    <SelectTrigger id="role" className="col-span-3">
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="status" className="text-right">
                                    Status
                                  </Label>
                                  <div className="flex items-center space-x-2 col-span-3">
                                    <Switch 
                                      id="status" 
                                      checked={editUser?.isActive}
                                      onCheckedChange={(checked) => setEditUser({ ...editUser, isActive: checked })}
                                    />
                                    <Label htmlFor="status">
                                      {editUser?.isActive ? 'Active' : 'Inactive'}
                                    </Label>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  type="submit" 
                                  disabled={updateMutation.isPending}
                                  className="bg-clickprop-blue hover:bg-clickprop-blue-dark"
                                >
                                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        
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
                                This action cannot be undone. This will permanently delete the user and all associated data.
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
