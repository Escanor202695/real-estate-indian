
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [locationQuery, setLocationQuery] = React.useState("");
  const [propertyType, setPropertyType] = React.useState("all");
  const [status, setStatus] = React.useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (locationQuery) params.append("location", locationQuery);
    if (propertyType !== "all") params.append("type", propertyType);
    if (status !== "all") params.append("status", status);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Find Your Perfect Property in India
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/90">
            Search properties for sale and rent across major Indian cities
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, Locality or Project"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full text-black"
                />
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="property-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger id="property-type" className="bg-white text-black">
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
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  For
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="bg-white text-black">
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
                <Button
                  type="submit"
                  className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
