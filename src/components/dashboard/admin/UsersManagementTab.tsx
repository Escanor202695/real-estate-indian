
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/adminService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Edit, Trash2, UserPlus, Search, UserCheck } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import UserFormModal from './UserFormModal';

const UsersManagementTab = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userFormOpen, setUserFormOpen] = useState(false);
  
  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    }
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: { id: string; userData: any }) => 
      updateUser(data.id, data.userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    }
  });
  
  const users = data?.data || [];
  
  // Filter users based on search term
  const filteredUsers = users.filter((user: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.includes(searchTerm))
    );
  });
  
  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setUserFormOpen(true);
  };
  
  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUserMutation.mutateAsync(selectedUser._id);
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };
  
  const handleAddUser = () => {
    setSelectedUser(null);
    setUserFormOpen(true);
  };
  
  const handleUserFormSubmit = async (formData: any) => {
    if (selectedUser) {
      // Update existing user
      await updateUserMutation.mutateAsync({
        id: selectedUser._id,
        userData: formData,
      });
    } else {
      // Create new user
      await createUserMutation.mutateAsync(formData);
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500">Admin</Badge>;
      case 'agent':
        return <Badge className="bg-blue-500">Agent</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </div>
            <Button onClick={handleAddUser} className="bg-clickprop-blue hover:bg-clickprop-blue-dark">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-clickprop-blue rounded-full border-t-transparent"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No users found</h3>
              {searchTerm ? (
                <p className="mt-1 text-sm text-gray-500">
                  No users match your search criteria.
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  You haven't added any users yet.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
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
      
      {/* User Form Modal for adding/editing */}
      <UserFormModal
        isOpen={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        user={selectedUser}
        onSubmit={handleUserFormSubmit}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersManagementTab;
