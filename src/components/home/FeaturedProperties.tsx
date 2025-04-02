
import React, { useState } from 'react';
import PropertyList from '../properties/PropertyList';
import { Property } from '@/types/property';
// import { getFeaturedProperties } from '@/services/propertyService';
import { useToast } from '@/components/ui/use-toast';

// Dummy data for featured properties
const dummyFeaturedProperties: Property[] = [
  {
    id: '4',
    title: 'Premium Office Space in Cyber City',
    description: 'Modern office space with all amenities for corporate setup.',
    type: 'commercial',
    status: 'rent',
    price: 150000,
    size: 2500,
    bedrooms: 0,
    bathrooms: 2,
    location: {
      address: 'Cyber City, DLF Phase 3',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122002'
    },
    amenities: ['24/7 Access', 'Conference Room', 'Parking'],
    features: ['High-speed Internet', 'Power Backup', 'Reception Area'],
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72'],
    isActive: true,
    views: 130,
    featured: true
  },
  {
    id: '5',
    title: 'Luxury 4BHK Penthouse in South Delhi',
    description: 'Exquisite penthouse with panoramic city views and premium interiors.',
    type: 'flat',
    status: 'sale',
    price: 45000000,
    size: 3800,
    bedrooms: 4,
    bathrooms: 4,
    location: {
      address: 'Greater Kailash II',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110048'
    },
    amenities: ['Terrace Garden', 'Private Elevator', 'Swimming Pool'],
    features: ['Italian Marble', 'Smart Home', 'Panoramic View'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
    isActive: true,
    views: 280,
    featured: true
  },
  {
    id: '6',
    title: 'Waterfront Villa in ECR',
    description: 'Beautiful villa with private beach access and stunning sea views.',
    type: 'villa',
    status: 'sale',
    price: 32000000,
    size: 4500,
    bedrooms: 5,
    bathrooms: 5,
    location: {
      address: 'East Coast Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600041'
    },
    amenities: ['Private Beach Access', 'Swimming Pool', 'Garden'],
    features: ['Sea View', 'Furnished', 'Party Area'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914'],
    isActive: true,
    views: 210,
    featured: true
  }
];

const FeaturedProperties = () => {
  const [properties] = useState<Property[]>(dummyFeaturedProperties);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /* Commented out API call
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedProperties();
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        toast({
          title: 'Error',
          description: 'Failed to load featured properties',
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
            Featured Properties
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

export default FeaturedProperties;
