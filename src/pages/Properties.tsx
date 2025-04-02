
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyList from '@/components/properties/PropertyList';
import PropertiesPagination from '@/components/properties/PropertiesPagination';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Property } from '@/types/property';
import { Search, Filter, Grid, List } from 'lucide-react';

// Property data from external source
const propertiesData: Property[] = [
  {
    id: '75525233',
    title: '3BHK Multistorey Apartment for New Property in ASBL Springs at Pocharam, NH 2 2',
    description: 'This project is spread over 4.11 Acres and has 2 towers of G+14 floors each. There are 2 & 3 BHK flats (1210 sft & 1475 sft respectively), both east and west facing.',
    type: 'flat',
    status: 'sale',
    price: 8200000,
    size: 1475,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: 'Pocharam',
      city: 'Hyderabad',
      state: 'Andhra Pradesh',
      pincode: ''
    },
    amenities: ['Swimming Pool', 'Gym', 'Garden'],
    features: ['Modular Kitchen', 'Power Backup', 'Lift'],
    images: ['https://img.staticmb.com/mbimages/project/Photo_h310_w462/2022/12/05/Project-Photo-22-ASBL-Springs------Hyderabad-5367389_600_800_310_462.jpg'],
    externalLink: "https://www.magicbricks.com/3-BHK-1475-Sq-ft-Multistorey-Apartment-FOR-Sale-Pocharam-in-Hyderabad&id=4d423735353235323333",
    isActive: true,
    views: 120
  },
  {
    id: '78619241',
    title: '3BHK Multistorey Apartment for New Property in Manju Opus Blues at Kollur, Outer Ring Road',
    description: 'Elevate your living experience with High-Rise Apartments in Kollur-Financial District. Discover a lifestyle enriched with lush gardens, outdoor sports facilities, engaging kids\' play areas, and a luxurious clubhouse.',
    type: 'flat',
    status: 'sale',
    price: 9441480,
    size: 1640,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: 'Kollur, Outer Ring Road',
      city: 'Hyderabad',
      state: 'Andhra Pradesh',
      pincode: ''
    },
    amenities: ['Swimming Pool', 'Club House', 'Kids Play Area'],
    features: ['High-Rise', 'Outdoor Sports', 'Garden'],
    images: ['https://img.staticmb.com/mbimages/project/Photo_h310_w462/2025/03/27/Project-Photo-12-Opus-Blues-Hyderabad-5429691_1250_1600_310_462.jpg'],
    externalLink: "https://www.magicbricks.com/3-BHK-1640-Sq-ft-Multistorey-Apartment-FOR-Sale-Kollur-in-Hyderabad&id=4d423738363139323431",
    isActive: true,
    views: 95
  },
  {
    id: '78476499',
    title: '3BHK Multistorey Apartment for New Property in Bliss One at Ghatkesar, NH 2 2',
    description: 'Bliss One is located in the peaceful area of Pocharam, Ghatkesar. It brings you closer to your dream home. This project is a unique chance to live in a place that\'s both comfortable and luxurious, and in a great location.',
    type: 'flat',
    status: 'sale',
    price: 7272000,
    size: 1600,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: 'Ghatkesar, NH 2 2',
      city: 'Hyderabad',
      state: 'Andhra Pradesh',
      pincode: ''
    },
    amenities: ['Security', 'Power Backup', 'Lift'],
    features: ['Semi-furnished', 'Modern Design', 'Spacious'],
    images: ['https://img.staticmb.com/mbimages/project/Photo_h310_w462/2025/03/28/Project-Photo-11-Bliss-One-Hyderabad-5429035_576_1280_310_462.jpg'],
    externalLink: "https://www.magicbricks.com/3-BHK-1600-Sq-ft-Multistorey-Apartment-FOR-Sale-Ghatkesar-in-Hyderabad&id=4d423738343736343939",
    isActive: true,
    views: 87
  },
  {
    id: '77581477',
    title: '3BHK Multistorey Apartment for New Property in Vijaya Bheri Arcade at Adibatla',
    description: 'Vijaya Bheri Arcade is a new and upcoming residential project by Vijaya Bheri Realtors, a reputed real estate developer in Hyderabad. The project is located in Adibatla, a fast-growing suburb of Hyderabad.',
    type: 'flat',
    status: 'sale',
    price: 4366440,
    size: 1560,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: 'Adibatla',
      city: 'Hyderabad',
      state: 'Andhra Pradesh',
      pincode: ''
    },
    amenities: ['Parking', 'Security', 'Garden'],
    features: ['Semi-furnished', 'Near IT Companies', 'Educational Institutions Nearby'],
    images: ['https://img.staticmb.com/mbimages/project/Photo_h310_w462/2025/02/04/Project-Photo-13-Vijaya-Bheri-Arcade-Hyderabad-5425721_410_1440_310_462.jpg'],
    externalLink: "https://www.magicbricks.com/3-BHK-1560-Sq-ft-Multistorey-Apartment-FOR-Sale-Adibatla-in-Hyderabad&id=4d423737353831343737",
    isActive: true,
    views: 104
  },
  {
    id: '70639357',
    title: '3BHK Multistorey Apartment for New Property in NSL East Luxoria at Uppal, NH 2 2',
    description: 'NSL East Luxoria is a crescendo in the clouds, a symphony of class and luxury reserved for the privileged few who would love to Live it Uppal in the East. The two tallest twin towers in the Eastern Vector majestic slit+44 high rise with 80,000 sft of royal amenities.',
    type: 'flat',
    status: 'sale',
    price: 17700000,
    size: 2251,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: 'Uppal, NH 2 2',
      city: 'Hyderabad',
      state: 'Andhra Pradesh',
      pincode: ''
    },
    amenities: ['Swimming Pool', 'Clubhouse', 'Indoor Sports', 'Outdoor Sports', 'Landscaped Gardens'],
    features: ['High-rise', 'Luxury', 'Twin Towers', 'Green Spaces'],
    images: ['https://img.staticmb.com/mbimages/project/Photo_h310_w462/2023/12/22/Project-Photo-8-NSL-East-Luxoria-Hyderabad-5418209_961_1600_310_462.jpg'],
    externalLink: "https://www.magicbricks.com/3-BHK-2251-Sq-ft-Multistorey-Apartment-FOR-Sale-Uppal-in-Hyderabad&id=4d423730363339333537",
    isActive: true,
    views: 156
  },
  {
    id: '78594403',
    title: '3BHK Multistorey Apartment for New Property in EIPL CORNERSTONE at Puppalguda',
    description: 'Luxury meets affordability at Cornerstone, a landmark new gated community in the heart of Puppalguda. Located just minutes from the Outer Ring Road and near the city\'s thriving tech scene, Cornerstone is perfect for those looking for a convenient and connected lifestyle.',
    type: 'flat',
    status: 'sale',
    price: 20100000,
    size: 2190,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: 'Puppalguda',
      city: 'Hyderabad',
      state: 'Andhra Pradesh',
      pincode: ''
    },
    amenities: ['Gated Community', 'Near ORR', 'Security'],
    features: ['Luxury', 'Durable Construction', 'Near Tech Hub'],
    images: ['https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/11/22/Project-Photo-64-EIPL-CORNERSTONE-Hyderabad-5392181_1080_1440_310_462.jpg'],
    externalLink: "https://www.magicbricks.com/3-BHK-2190-Sq-ft-Multistorey-Apartment-FOR-Sale-Puppalaguda-in-Hyderabad&id=4d423738353934343033",
    isActive: true,
    views: 112
  }
];

const Properties = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>(propertiesData);
  const [loading, setLoading] = useState(false);
  
  // Load initial values from localStorage if available
  const [location, setLocation] = useState(() => localStorage.getItem('searchLocation') || "");
  const [propertyType, setPropertyType] = useState(() => localStorage.getItem('searchPropertyType') || "all");
  const [status, setStatus] = useState(() => localStorage.getItem('searchStatus') || "all");
  const [priceRange, setPriceRange] = useState([0, 25000000]);
  const [bedrooms, setBedrooms] = useState("any");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const applyFilters = () => {
    setLoading(true);
    
    // Save search params to localStorage
    localStorage.setItem('searchLocation', location);
    localStorage.setItem('searchPropertyType', propertyType);
    localStorage.setItem('searchStatus', status);
    
    setTimeout(() => {
      const filtered = propertiesData.filter((property) => {
        if (location) {
          const locationRegex = new RegExp(location, 'i');
          if (!locationRegex.test(property.location.city) && 
              !locationRegex.test(property.location.address) &&
              !locationRegex.test(property.title)) {
            return false;
          }
        }
        
        if (propertyType !== 'all' && property.type !== propertyType) {
          return false;
        }
        
        if (status !== 'all' && property.status !== status) {
          return false;
        }
        
        if (property.price < priceRange[0] || property.price > priceRange[1]) {
          return false;
        }
        
        if (bedrooms !== 'any' && property.bedrooms !== parseInt(bedrooms)) {
          return false;
        }
        
        return true;
      });
      
      setProperties(filtered);
      setCurrentPage(1); // Reset to first page when applying filters
      setLoading(false);
    }, 500);
  };

  // Function to navigate to search page with current filters
  const navigateToSearch = () => {
    const params = new URLSearchParams();
    
    if (location) params.append('location', location);
    if (propertyType !== 'all') params.append('type', propertyType);
    if (status !== 'all') params.append('status', status);
    
    // Save current values to localStorage
    localStorage.setItem('searchLocation', location);
    localStorage.setItem('searchPropertyType', propertyType);
    localStorage.setItem('searchStatus', status);
    
    navigate(`/search?${params.toString()}`);
  };

  // Get current properties based on pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="bg-white">
      <div className="bg-clickprop-blue py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Browse All Properties
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
              onClick={navigateToSearch}
            >
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
          </div>
          
          <div className="flex items-center">
            <span className="text-clickprop-text-secondary mr-2">
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                onClick={applyFilters}
              >
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
          
          <div className="lg:w-3/4">
            <PropertyList properties={currentProperties} loading={loading} />
            
            <div className="flex justify-center">
              <PropertiesPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
