
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Pencil, Trash2, Plus, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getProperties, deleteProperty } from '@/services/propertyService';
import PropertyForm from '@/components/properties/PropertyForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const PropertiesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProperty, setCurrentProperty] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch properties
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminProperties'],
    queryFn: () => getProperties(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      toast.success('Property deleted successfully');
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast.error('Failed to delete property');
    }
  });

  const handleAddNew = () => {
    setCurrentProperty(null);
    setShowForm(true);
  };

  const handleEdit = (property: any) => {
    setCurrentProperty(property);
    setShowForm(true);
  };

  const handleDelete = (property: any) => {
    setCurrentProperty(property);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (currentProperty) {
      deleteMutation.mutate(currentProperty._id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
  };

  // Filter properties based on search term
  const filteredProperties = data?.data ? data.data.filter((property: any) => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Property Management</h1>

      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load properties. Please try again.</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <Input
          placeholder="Search properties..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleAddNew}
            className="bg-clickprop-blue hover:bg-clickprop-blue-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No properties found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property: any) => (
                    <TableRow key={property._id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>${property.price.toLocaleString()}</TableCell>
                      <TableCell>{property.city}, {property.state}</TableCell>
                      <TableCell>{property.propertyType}</TableCell>
                      <TableCell>{property.listingType}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(property)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(property)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Property form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentProperty ? 'Edit Property' : 'Add New Property'}
            </DialogTitle>
            <DialogDescription>
              {currentProperty 
                ? 'Update the property details below'
                : 'Fill in the property details below'
              }
            </DialogDescription>
          </DialogHeader>
          <PropertyForm
            property={currentProperty}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the property "{currentProperty?.title}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertiesManagement;
