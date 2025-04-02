
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

const SearchBar = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [status, setStatus] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (location) params.append('location', location);
    if (propertyType !== 'all') params.append('type', propertyType);
    if (status !== 'all') params.append('status', status);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="location" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
            Location
          </label>
          <Input
            id="location"
            type="text"
            placeholder="City, Locality or Project"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="col-span-1">
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
        
        <div className="col-span-1">
          <label htmlFor="status" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
            For
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
        
        <div className="col-span-1 md:col-span-4 mt-2">
          <Button type="submit" className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark">
            <Search className="h-4 w-4 mr-2" />
            Search Properties
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
