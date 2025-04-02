
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Home, Phone, Mail, Check, ArrowLeft } from 'lucide-react';

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
    isActive: true,
    views: 256
  }
];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProperty = mockProperties.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
        setMainImage(foundProperty.images[0]);
      }
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
            </div>
            <div className="col-span-1">
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-clickprop-text mb-4">Property Not Found</h2>
          <p className="text-clickprop-text-secondary mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button className="bg-clickprop-blue hover:bg-clickprop-blue-dark" asChild>
            <a href="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-clickprop-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Button variant="outline" className="mb-4" asChild>
            <a href="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </a>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-clickprop-text mb-2">
            {property.title}
          </h1>
          <p className="flex items-center text-clickprop-text-secondary mb-4">
            <MapPin size={16} className="mr-1" />
            {property.location.address}, {property.location.city}, {property.location.state}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-clickprop-text-secondary">
            <span className="text-2xl font-bold text-clickprop-blue">
              ₹{property.status === 'rent' 
                ? `${property.price?.toLocaleString()}/month` 
                : property.price?.toLocaleString()
              }
            </span>
            <span className="flex items-center">
              <Bed size={16} className="mr-1" />
              {property.bedrooms} Bedrooms
            </span>
            <span className="flex items-center">
              <Bath size={16} className="mr-1" />
              {property.bathrooms} Bathrooms
            </span>
            <span className="flex items-center">
              <Home size={16} className="mr-1" />
              {property.size} sqft
            </span>
          </div>
        </div>
        
        {/* Property Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
          <div className="lg:col-span-4">
            <div className="rounded-lg overflow-hidden h-[400px] bg-gray-100">
              <img 
                src={mainImage} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
              {property.images.slice(0, 4).map((image, index) => (
                <div 
                  key={index}
                  className={`rounded-lg overflow-hidden h-24 cursor-pointer border-2 ${mainImage === image ? 'border-clickprop-blue' : 'border-transparent'}`}
                  onClick={() => setMainImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${property.title} ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features & Amenities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Description</h2>
                  <p className="text-clickprop-text-secondary whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Property Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-clickprop-text-secondary text-sm">Type</p>
                      <p className="font-medium text-clickprop-text capitalize">{property.type}</p>
                    </div>
                    <div>
                      <p className="text-clickprop-text-secondary text-sm">Status</p>
                      <p className="font-medium text-clickprop-text capitalize">For {property.status}</p>
                    </div>
                    <div>
                      <p className="text-clickprop-text-secondary text-sm">Size</p>
                      <p className="font-medium text-clickprop-text">{property.size} sqft</p>
                    </div>
                    <div>
                      <p className="text-clickprop-text-secondary text-sm">Bedrooms</p>
                      <p className="font-medium text-clickprop-text">{property.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-clickprop-text-secondary text-sm">Bathrooms</p>
                      <p className="font-medium text-clickprop-text">{property.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-clickprop-text-secondary text-sm">City</p>
                      <p className="font-medium text-clickprop-text">{property.location.city}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="text-clickprop-green mr-2" />
                        <span className="text-clickprop-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="text-clickprop-green mr-2" />
                        <span className="text-clickprop-text-secondary">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Contact Owner</h2>
              {property.owner && (
                <div className="mb-4">
                  <p className="font-medium text-clickprop-text">{property.owner.name}</p>
                  <div className="flex items-center mt-2">
                    <Phone size={16} className="text-clickprop-blue mr-2" />
                    <a href={`tel:${property.owner.contact}`} className="text-clickprop-text-secondary hover:text-clickprop-blue">
                      {property.owner.contact}
                    </a>
                  </div>
                  <div className="flex items-center mt-2">
                    <Mail size={16} className="text-clickprop-blue mr-2" />
                    <a href={`mailto:${property.owner.email}`} className="text-clickprop-text-secondary hover:text-clickprop-blue">
                      {property.owner.email}
                    </a>
                  </div>
                </div>
              )}
              
              <form className="space-y-4 mt-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clickprop-blue"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clickprop-blue"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clickprop-blue"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clickprop-blue"
                    placeholder="I'm interested in this property. Please contact me."
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
