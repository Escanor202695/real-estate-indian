import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProperties, deleteProperty } from "@/services/propertyService";
import { notifyUsers } from "@/services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit, Search, Home, Bell, Plus, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import PropertiesPagination from "@/components/properties/PropertiesPagination";

const PropertiesManagementTab = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  // Build query params for API call
  const buildQueryParams = () => {
    const params: any = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedType !== "all") params.type = selectedType;
    if (selectedStatus !== "all") params.status = selectedStatus;
    params.page = currentPage;
    params.limit = itemsPerPage;
    return params;
  };

  // Fetch properties data
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "adminProperties",
      searchQuery,
      selectedType,
      selectedStatus,
      currentPage,
      itemsPerPage,
    ],
    queryFn: () => getProperties(buildQueryParams()),
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch properties data",
        variant: "destructive",
      });
    },
  });

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProperties"] });
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    },
  });

  // Notify users mutation
  const notifyMutation = useMutation({
    mutationFn: (ids: string[]) => notifyUsers(ids),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Notified ${data.data.notifiedUsers.length} users about new properties`,
      });
      setSelectedProperties([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive",
      });
    },
  });

  const handleDeleteProperty = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    queryClient.invalidateQueries({ queryKey: ["adminProperties"] });
  };

  const handleSelectProperty = (id: string) => {
    setSelectedProperties((prev) =>
      prev.includes(id) ? prev.filter((propId) => propId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (
      properties.length > 0 &&
      selectedProperties.length === properties.length
    ) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map((property) => property._id));
    }
  };

  const handleNotifyUsers = () => {
    if (selectedProperties.length > 0) {
      notifyMutation.mutate(selectedProperties);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Get properties from API response
  const properties = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Properties Management</CardTitle>
        <Button
          className="bg-clickprop-blue hover:bg-clickprop-blue-dark"
          asChild
        >
          <Link to="/admin/properties/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
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
        ) : error || properties.length === 0 ? (
          <div className="text-center py-8">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No properties found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters or add a new property.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="whitespace-nowrap">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]">
                      <Checkbox
                        checked={
                          properties.length > 0 &&
                          selectedProperties.length === properties.length
                        }
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
                          onCheckedChange={() =>
                            handleSelectProperty(property._id)
                          }
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
                          <div
                            className="truncate max-w-[150px]"
                            title={property.title}
                          >
                            {property.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{property.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            property.status === "sale"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {property.status === "sale" ? "For Sale" : "For Rent"}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{property.price.toLocaleString()}</TableCell>
                      <TableCell>{property.location?.city || "N/A"}</TableCell>
                      <TableCell>
                        {property.createdAt
                          ? formatDistanceToNow(new Date(property.createdAt), {
                              addSuffix: true,
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell>{property.views || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/properties/${property._id}`}>
                              <Search className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/admin/properties/edit/${property._id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
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
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the property.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteProperty(property._id)
                                  }
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

            {totalPages > 1 && (
              <div className="mt-6">
                <PropertiesPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                <div className="text-sm text-center text-gray-500 mt-2">
                  Showing{" "}
                  {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}{" "}
                  to {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                  {totalCount} properties
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertiesManagementTab;
