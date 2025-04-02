
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropertyList from '@/components/properties/PropertyList';
import PropertiesPagination from '@/components/properties/PropertiesPagination';
import SearchBar from '@/components/global/SearchBar';
import { Property } from '@/types/property';
import { Button } from "@/components/ui/button";
import { MapPin, BookmarkPlus } from 'lucide-react';

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

const Search = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchParams(params);
    
    // Simulate API call with search parameters
    setLoading(true);
    
    setTimeout(() => {
      // Filter properties based on search params
      const filteredProperties = propertiesData.filter(property => {
        const locationParam = params.get('location');
        const typeParam = params.get('type');
        const statusParam = params.get('status');
        
        // Check location (city or address)
        if (locationParam && !property.location.city.toLowerCase().includes(locationParam.toLowerCase()) && 
            !property.location.address.toLowerCase().includes(locationParam.toLowerCase())) {
          return false;
        }
        
        // Check property type
        if (typeParam && typeParam !== 'all' && property.type !== typeParam) {
          return false;
        }
        
        // Check status (sale/rent)
        if (statusParam && statusParam !== 'all' && property.status !== statusParam) {
          return false;
        }
        
        return true;
      });
      
      setProperties(filteredProperties);
      setCurrentPage(1); // Reset to first page when search params change
      setLoading(false);
    }, 1000);
  }, [location.search]);
  
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
  
  // Helper function to construct the search summary
  const getSearchSummary = () => {
    if (!searchParams) return 'Properties';
    
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    
    let summary = '';
    
    if (type && type !== 'all') {
      summary += type.charAt(0).toUpperCase() + type.slice(1) + 's ';
    } else {
      summary += 'Properties ';
    }
    
    if (status && status !== 'all') {
      summary += `for ${status === 'sale' ? 'sale' : 'rent'} `;
    }
    
    if (location) {
      summary += `in ${location}`;
    }
    
    return summary || 'All Properties';
  };
  
  return (
    <div className="bg-clickprop-bg-light min-h-screen">
      <div className="bg-clickprop-blue py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Search Results
          </h1>
          <SearchBar className="lg:w-3/4 mx-auto" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-clickprop-text mb-2">
              {getSearchSummary()}
            </h2>
            <p className="text-clickprop-text-secondary">
              Found {properties.length} properties matching your search
            </p>
          </div>
          
          <Button variant="outline" className="mt-4 md:mt-0 flex items-center">
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save Search
          </Button>
        </div>
        
        {searchParams?.get('location') && (
          <div className="p-4 bg-clickprop-bg-gray rounded-lg flex items-center mb-6">
            <MapPin className="h-5 w-5 text-clickprop-blue mr-2" />
            <span className="text-clickprop-text-secondary">
              Showing properties in <span className="font-medium text-clickprop-text">{searchParams.get('location')}</span>
            </span>
          </div>
        )}
        
        <PropertyList properties={currentProperties} loading={loading} />
        
        {/* Improved pagination container with clear visual boundaries */}
        {properties.length > 0 && (
          <div className="flex justify-center mt-10 pt-6 border-t border-clickprop-border">
            <PropertiesPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
