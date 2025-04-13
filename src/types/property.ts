
export interface Property {
  id: string;
  title: string;
  description: string;
  type: string; // flat, villa, house, plot, commercial, pg
  status: string; // sale or rent
  price: number;
  size: number; // in sq ft
  bedrooms?: number;
  bathrooms?: number;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  amenities?: string[];
  features?: string[];
  images?: string[]; // URLs
  externalLink?: string; // URL to external property listing
  owner?: {
    name: string;
    contact: string;
    email: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  views?: number;
  
  // Additional fields to match the imported JSON
  url?: string;
  name?: string;
  posted_date?: string;
  price_per_sq_ft?: number;
  currency?: string;
  seo_description?: string;
  landmark_details?: string[];
  landmark?: string;
  owner_name?: string;
  company_name?: string;
  carpet_area?: number;
  land_area_unit?: string;
  balconies?: number;
  facing?: string;
  floors?: number;
  city_name?: string;
  address?: string;
  covered_area?: number;
  carp_area_unit?: string;
  cov_area_unit?: string;
  operating_since?: string;
  image_url?: string;
  from_url?: string;
}
