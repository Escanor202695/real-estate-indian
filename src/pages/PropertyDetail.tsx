
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from '@/types/property';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyDetailsTab from '@/components/property/PropertyDetailsTab';
import PropertyFeaturesTab from '@/components/property/PropertyFeaturesTab';
import PropertyContactForm from '@/components/property/PropertyContactForm';
import PropertySkeleton from '@/components/property/PropertySkeleton';
import PropertyNotFound from '@/components/property/PropertyNotFound';

// Mock data
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxurious 3BHK Apartment in Bandra',
    description: 'Spacious apartment with modern amenities and great sea view. This beautiful apartment features large windows with abundant natural light, premium flooring, and high-quality fixtures. The property includes a master bedroom with an en-suite bathroom, two additional bedrooms, a modern kitchen with built-in appliances, and a spacious living and dining area. Residents can enjoy amenities such as a swimming pool, gym, 24/7 security, and designated parking space.',
    type: 'flat',
    status: 'sale',
    price: 9500000,
    size: 1450,
    bedrooms: 3,
    bathrooms: 2,
    location: {
      address: 'Palm Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      coordinates: {
        lat: 19.0596,
        lng: 72.8295
      }
    },
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Lift', 'Club House', 'Children\'s Play Area'],
    features: ['Modular Kitchen', 'Furnished', 'Air Conditioner', 'Power Backup', 'Gas Pipeline', 'Intercom', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585128792020-803d29415281?q=80&w=800&auto=format&fit=crop'
    ],
    externalLink: "https://example.com/property/1",
    owner: {
      name: 'Rahul Sharma',
      contact: '+91 98765 43210',
      email: 'rahul.sharma@example.com'
    },
    isActive: true,
    views: 342
  },
  {
    id: '2',
    title: 'Modern 2BHK Apartment for Rent',
    description: 'Well-maintained apartment in a prime location with all amenities.',
    type: 'flat',
    status: 'rent',
    price: 35000,
    size: 1050,
    bedrooms: 2,
    bathrooms: 2,
    location: {
      address: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    amenities: ['Parking', 'Security', 'Power Backup'],
    features: ['Air Conditioner', 'Furnished'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'],
    externalLink: "https://example.com/property/2",
    isActive: true,
    views: 256
  }
];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProperty = mockProperties.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
      }
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return <PropertySkeleton />;
  }
  
  if (!property) {
    return <PropertyNotFound />;
  }
  
  return (
    <div className="bg-clickprop-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PropertyHeader property={property} />
        <PropertyGallery images={property.images} title={property.title} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features & Amenities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <PropertyDetailsTab property={property} />
              </TabsContent>
              
              <TabsContent value="features">
                <PropertyFeaturesTab property={property} />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <PropertyContactForm owner={property.owner} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
