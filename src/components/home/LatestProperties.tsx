
import React, { useState } from 'react';
import PropertyList from '../properties/PropertyList';
import { Property } from '@/types/property';
// import { getLatestProperties } from '@/services/propertyService';
import { useToast } from '@/components/ui/use-toast';

// Dummy data for latest properties
const dummyLatestProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3BHK Apartment in Whitefield',
    description: 'Spacious apartment with modern amenities in a prime location.',
    type: 'flat',
    status: 'sale',
    price: 7500000,
    size: 1450,
    bedrooms: 3,
    bathrooms: 2,
    location: {
      address: 'Whitefield Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066'
    },
    amenities: ['Swimming Pool', 'Gym', 'Club House'],
    features: ['Spacious Balcony', 'Modular Kitchen', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
    externalLink: 'https://example.com/property/1',
    isActive: true,
    views: 120
  },
  {
    id: '2',
    title: 'Luxury Villa in Jubilee Hills',
    description: 'Premium villa with garden and modern architecture.',
    type: 'villa',
    status: 'sale',
    price: 25000000,
    size: 3200,
    bedrooms: 4,
    bathrooms: 4,
    location: {
      address: 'Road No. 10, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    amenities: ['Private Garden', 'Swimming Pool', 'Security'],
    features: ['Italian Marble', 'Smart Home', 'Home Theater'],
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6'],
    externalLink: 'https://example.com/property/2',
    isActive: true,
    views: 250
  },
  {
    id: '3',
    title: '2BHK Flat for Rent in Powai',
    description: 'Semi-furnished apartment in a well-maintained society.',
    type: 'flat',
    status: 'rent',
    price: 35000,
    size: 1050,
    bedrooms: 2,
    bathrooms: 2,
    location: {
      address: 'Powai Lake Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076'
    },
    amenities: ['Parking', 'Garden', 'Security'],
    features: ['Semi-furnished', 'Lake View', 'Near Metro'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
    externalLink: 'https://example.com/property/3',
    isActive: true,
    views: 180
  }
];

const LatestProperties = () => {
  const [properties] = useState<Property[]>(dummyLatestProperties);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /* Commented out API call
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getLatestProperties();
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching latest properties:', error);
        toast({
          title: 'Error',
          description: 'Failed to load latest properties',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);
  */

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-clickprop-text">
            Latest Properties
          </h2>
          <a href="/properties" className="text-clickprop-blue hover:underline">
            View All Properties
          </a>
        </div>
        
        <PropertyList properties={properties} loading={loading} />
      </div>
    </section>
  );
};

export default LatestProperties;
