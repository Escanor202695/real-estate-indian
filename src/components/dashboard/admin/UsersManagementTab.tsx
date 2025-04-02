
import React, { useState } from 'react';
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

// Dummy data for users
const dummyUsers = [
  {
    _id: 'user1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    savedProperties: 12,
    searches: 45
  },
  {
    _id: 'user2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    savedProperties: 5,
    searches: 27
  },
  {
    _id: 'user3',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    savedProperties: 3,
    searches: 15
  },
  {
    _id: 'user4',
    name: 'Ananya Desai',
    email: 'ananya.desai@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    savedProperties: 0,
    searches: 8
  },
  {
    _id: 'user5',
    name: 'Arjun Nair',
    email: 'arjun.nair@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    savedProperties: 7,
    searches: 32
  },
  {
    _id: 'user6',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    role: 'user',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    savedProperties: 0,
    searches: 3
  }
];

const UsersManagementTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteUser = (id: string) => {
    // Simulate delete operation
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate search
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
    // Simulate email sending
    toast({
      title: "Success",
      description: `Emails sent to ${selectedUsers.length} users`,
    });
    setSelectedUsers([]);
  };

  // Apply filtering to dummy data
  let filteredUsers = dummyUsers;
  
  if (searchQuery) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (selectedRole !== 'all') {
    filteredUsers = filteredUsers.filter(user => 
      user.role === selectedRole
    );
  }
  
  if (selectedStatus !== 'all') {
    filteredUsers = filteredUsers.filter(user => 
      user.status === selectedStatus
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
        ) : users.length === 0 ? (
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
                {users.map((user) => (
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
                          user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
                          user.status === 'inactive' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell>{user.savedProperties}</TableCell>
                    <TableCell>{user.searches}</TableCell>
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
