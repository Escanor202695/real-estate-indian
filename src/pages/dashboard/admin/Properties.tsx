import React, { useState } from 'react';
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
import { Trash2, Upload, AlertCircle, SquareCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getProperties, deleteProperty, importProperties } from '@/services/propertyService';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const PropertiesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProperty, setCurrentProperty] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const queryClient = useQueryClient();

  // Fetch properties with pagination
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminProperties', currentPage, itemsPerPage],
    queryFn: () => getProperties({
      page: currentPage,
      limit: itemsPerPage
    }),
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

  // Delete multiple properties mutation
  const deleteMultipleMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Delete properties one by one
      for (const id of ids) {
        await deleteProperty(id);
      }
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      toast.success(`${selectedProperties.length} properties deleted successfully`);
      setSelectedProperties([]);
    },
    onError: () => {
      toast.error('Failed to delete some properties');
    }
  });

  // Import properties mutation
  const importMutation = useMutation({
    mutationFn: (data: any[]) => importProperties(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      toast.success(`Successfully imported ${result.count} properties`);
      setShowImportDialog(false);
      setImportData('');
    },
    onError: (error: any) => {
      toast.error(`Import failed: ${error.response?.data?.message || 'Unknown error'}`);
    }
  });

  const handleDelete = (property: any) => {
    setCurrentProperty(property);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (currentProperty) {
      deleteMutation.mutate(currentProperty._id);
    }
  };

  const handleImportDialogOpen = () => {
    setShowImportDialog(true);
  };

  const handleImportSubmit = () => {
    try {
      const parsedData = JSON.parse(importData);
      
      if (!Array.isArray(parsedData)) {
        toast.error('Data must be an array of properties');
        return;
      }

      importMutation.mutate(parsedData);
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  };

  // Function to toggle selection of a property
  const togglePropertySelection = (property: any) => {
    setSelectedProperties(prevSelected => {
      if (prevSelected.includes(property._id)) {
        return prevSelected.filter(id => id !== property._id);
      } else {
        return [...prevSelected, property._id];
      }
    });
  };

  // Function to toggle selection of all properties
  const toggleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      // If all are selected, unselect all
      setSelectedProperties([]);
    } else {
      // Otherwise select all
      setSelectedProperties(filteredProperties.map((property: any) => property._id));
    }
  };

  // Function to delete selected properties
  const handleDeleteSelected = () => {
    if (selectedProperties.length > 0) {
      deleteMultipleMutation.mutate(selectedProperties);
    }
  };

  // Pagination functions
  const totalPages = data?.pages || 1;
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter properties based on search term
  const filteredProperties = data?.data ? data.data.filter((property: any) => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase())
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
            onClick={handleImportDialogOpen}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Properties JSON
          </Button>

          {selectedProperties.length > 0 && (
            <Button 
              onClick={handleDeleteSelected}
              variant="destructive"
              disabled={deleteMultipleMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedProperties.length})
            </Button>
          )}
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
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      No properties found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property: any) => (
                    <TableRow key={property._id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedProperties.includes(property._id)} 
                          onCheckedChange={() => togglePropertySelection(property)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>${property.price.toLocaleString()}</TableCell>
                      <TableCell>{property.city}, {property.state}</TableCell>
                      <TableCell>{property.propertyType}</TableCell>
                      <TableCell>{property.listingType}</TableCell>
                      <TableCell className="text-right">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="py-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* Previous page button */}
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* Next page button */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages} 
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}

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

      {/* Import JSON Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Properties from JSON</DialogTitle>
            <DialogDescription>
              Paste your JSON array of properties below. Each property should include title, type, status, price, and location fields.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea 
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder='[{"title": "Example Property", "type": "flat", "status": "sale", "price": 100000, "location": {"address": "123 Main St", "city": "Example City", "state": "Example State"}}]'
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="mt-2 text-sm text-gray-500">
              <p>Required fields: title, type, status, price, location (with address, city, state).</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowImportDialog(false)}
              disabled={importMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleImportSubmit}
              disabled={importMutation.isPending || !importData.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {importMutation.isPending ? 'Importing...' : 'Import Properties'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertiesManagement;
