
export interface Property {
  id: string;
  title: string;
  description: string;
  type: string; // flat, villa, house, plot, commercial, pg
  status: string; // sale or rent
  price: number;
  size: number; // in sq ft
  bedrooms: number;
  bathrooms: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  amenities: string[];
  features: string[];
  images: string[]; // URLs
  owner?: {
    name: string;
    contact: string;
    email: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
  views: number;
}
