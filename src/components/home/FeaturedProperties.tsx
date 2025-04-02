
import React, { useEffect, useState } from 'react';
import PropertyList from '../properties/PropertyList';
import { Property } from '@/types/property';
import { getFeaturedProperties } from '@/services/propertyService';
import { useToast } from '@/components/ui/use-toast';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <PropertyList properties={properties} />
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
