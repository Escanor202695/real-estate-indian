
export interface City {
  id: string;
  name: string;
  state?: string;
  propertyCount: number;
  searchCount: number;
  isActive: boolean;
  image?: string;
  description?: string;
}
