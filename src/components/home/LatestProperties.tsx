
import React, { useState, useEffect } from 'react';
import PropertyList from '../properties/PropertyList';
import { Property } from '@/types/property';
import { getLatestProperties } from '@/services/propertyService';
import { useToast } from '@/components/ui/use-toast';

const LatestProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
        setProperties([]);
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
