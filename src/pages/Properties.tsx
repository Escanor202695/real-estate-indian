import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropertyList from '@/components/properties/PropertyList';
import PropertiesPagination from '@/components/properties/PropertiesPagination';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, BookmarkPlus } from 'lucide-react';
import { toast } from 'sonner';
import { getProperties } from '@/services/propertyService';
import { useQuery } from '@tanstack/react-query';
import { isLoggedIn } from '@/services/authService';
import { addRecentSearch, addSavedSearch } from '@/services/userService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Properties = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  
  const [locationQuery, setLocationQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [status, setStatus] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 25000000]);
  const [bedrooms, setBedrooms] = useState("any");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);
  
  const buildQueryParams = () => {
    const params: any = {};
    if (locationQuery) params.location = locationQuery;
    if (propertyType !== 'all') params.type = propertyType;
    if (status !== 'all') params.status = status;
    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 25000000) params.maxPrice = priceRange[1];
    if (bedrooms !== 'any') params.bedrooms = parseInt(bedrooms);
    params.page = currentPage;
    params.limit = propertiesPerPage;
    return params;
  };
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', locationQuery, propertyType, status, priceRange, bedrooms, currentPage],
    queryFn: () => getProperties(buildQueryParams()),
    enabled: !loading
  });
  
  const properties = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / propertiesPerPage);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get('location');
    const typeParam = params.get('type');
    const statusParam = params.get('status');
    const pageParam = params.get('page');
    const minPriceParam = params.get('minPrice');
    const maxPriceParam = params.get('maxPrice');
    const bedroomsParam = params.get('bedrooms');
    
    if (locationParam) {
      setLocationQuery(locationParam);
    }
    
    if (typeParam) {
      setPropertyType(typeParam);
    }
    
    if (statusParam) {
      setStatus(statusParam);
    }

    if (minPriceParam || maxPriceParam) {
      setPriceRange([
        minPriceParam ? parseInt(minPriceParam) : 0,
        maxPriceParam ? parseInt(maxPriceParam) : 25000000
      ]);
    }

    if (bedroomsParam) {
      setBedrooms(bedroomsParam);
    }
    
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10));
    }

    if (isLoggedIn() && (locationParam || typeParam || statusParam)) {
      const searchData = {
        query: locationParam || 'All Properties',
        params: {
          location: locationParam,
          propertyType: typeParam !== 'all' ? typeParam : undefined,
          status: statusParam !== 'all' ? statusParam : undefined,
          minPrice: minPriceParam ? parseInt(minPriceParam) : undefined,
          maxPrice: maxPriceParam ? parseInt(maxPriceParam) : undefined,
          bedrooms: bedroomsParam ? parseInt(bedroomsParam) : undefined,
        },
        timestamp: new Date().toISOString(),
      };

      addRecentSearch(searchData).catch(err => 
        console.log("Error saving recent search:", err)
      );
    }
  }, [location.search]);
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const applyFilters = () => {
    setLoading(true);
    
    setCurrentPage(1);
    
    updateUrl();
    
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const updateUrl = () => {
    const params = new URLSearchParams();
    
    if (locationQuery) params.append('location', locationQuery);
    if (propertyType !== 'all') params.append('type', propertyType);
    if (status !== 'all') params.append('status', status);
    if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] < 25000000) params.append('maxPrice', priceRange[1].toString());
    if (bedrooms !== 'any') params.append('bedrooms', bedrooms);
    if (currentPage > 1) params.append('page', currentPage.toString());
    
    const newUrl = `/properties?${params.toString()}`;
    navigate(newUrl, { replace: true });
  };

  const handleSaveSearch = () => {
    if (!isLoggedIn()) {
      toast.error("Login Required");
      navigate("/login", { state: { from: location } });
      return;
    }
    
    setSaveDialogOpen(true);
  };

  const confirmSaveSearch = async () => {
    try {
      const searchData = {
        location: locationQuery,
        propertyType,
        status,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 25000000 ? priceRange[1] : undefined,
        bedrooms: bedrooms !== 'any' ? parseInt(bedrooms) : undefined,
        notifyByEmail,
      };

      await addSavedSearch(searchData);
      
      toast.success("Search saved successfully");
      
      setSaveDialogOpen(false);
    } catch (error) {
      toast.error("Save Failed");
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const params = new URLSearchParams(location.search);
    if (pageNumber > 1) {
      params.set('page', pageNumber.toString());
    } else {
      params.delete('page');
    }
    navigate(`/properties?${params.toString()}`, { replace: true });
    window.scrollTo(0, 0);
  };

  const getSearchSummary = () => {
    let summary = '';
    
    if (propertyType && propertyType !== 'all') {
      summary += propertyType.charAt(0).toUpperCase() + propertyType.slice(1) + 's ';
    } else {
      summary += 'Properties ';
    }
    
    if (status && status !== 'all') {
      summary += `for ${status === 'sale' ? 'sale' : 'rent'} `;
    }
    
    if (locationQuery) {
      summary += `in ${locationQuery}`;
    }
    
    return summary || 'All Properties';
  };
  
  return (
    <div className="bg-white">
      <div className="bg-clickprop-blue py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            {locationQuery ? `Properties in ${locationQuery}` : 'Browse All Properties'}
          </h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              className="flex items-center mr-4"
              onClick={toggleFilter}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Button
              variant="default"
              className="bg-clickprop-blue hover:bg-clickprop-blue-dark"
              onClick={() => applyFilters()}
            >
              <Search className="h-4 w-4 mr-2" />
              Search Properties
            </Button>
          </div>
          
          <div className="flex items-center">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleSaveSearch}
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Save Search
            </Button>
            <span className="text-clickprop-text-secondary ml-4">
              {properties.length} properties
            </span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-1/4 bg-white p-6 rounded-lg shadow-sm ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Filters</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City or locality"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="property-type" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger id="property-type">
                    <SelectValue placeholder="All Types" />
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
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Buy or Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Buy or Rent</SelectItem>
                    <SelectItem value="sale">Buy</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-clickprop-text-secondary mb-3">
                  Price Range (₹)
                </label>
                <Slider
                  defaultValue={[0, 25000000]}
                  max={25000000}
                  step={500000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-clickprop-text-secondary">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                  Bedrooms
                </label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger id="bedrooms">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
                onClick={() => applyFilters()}
              >
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
          
          <div className="lg:w-3/4">
            {locationQuery && (
              <div className="p-4 bg-clickprop-bg-gray rounded-lg flex items-center mb-6">
                <Search className="h-5 w-5 text-clickprop-blue mr-2" />
                <span className="text-clickprop-text-secondary">
                  Showing <span className="font-medium text-clickprop-text">{getSearchSummary()}</span>
                </span>
                {totalCount > 0 && (
                  <span className="ml-1 text-clickprop-text-secondary">
                    - {totalCount} {totalCount === 1 ? 'property' : 'properties'} found
                  </span>
                )}
              </div>
            )}
            
            <PropertyList properties={properties} loading={isLoading || loading} />
            
            {totalPages > 1 && (
              <PropertiesPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search</DialogTitle>
            <DialogDescription>
              Save this search to quickly access it later and get notifications
              when new properties match your criteria.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Search Criteria</h4>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Location:</strong> {locationQuery || "Any location"}
                </p>
                <p>
                  <strong>Property Type:</strong>{" "}
                  {propertyType !== "all" ? propertyType : "Any type"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {status !== "all"
                    ? status === "sale"
                      ? "For Sale"
                      : "For Rent"
                    : "Buy or Rent"}
                </p>
                {bedrooms !== 'any' && (
                  <p><strong>Bedrooms:</strong> {bedrooms}+</p>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 25000000) && (
                  <p>
                    <strong>Price Range:</strong> ₹{priceRange[0].toLocaleString()} - 
                    ₹{priceRange[1].toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notification"
                checked={notifyByEmail}
                onCheckedChange={(checked) =>
                  setNotifyByEmail(checked as boolean)
                }
              />
              <Label htmlFor="notification">
                Notify me by email when new matching properties are added
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-clickprop-blue hover:bg-clickprop-blue-dark"
              onClick={confirmSaveSearch}
            >
              Save Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Properties;
