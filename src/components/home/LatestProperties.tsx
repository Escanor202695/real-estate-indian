
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getLatestProperties } from '@/services/propertyService';
import PropertyCard from '@/components/properties/PropertyCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LatestProperties = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  const { data, isLoading } = useQuery({
    queryKey: ['latestProperties'],
    queryFn: getLatestProperties
  });

  const properties = data?.data || [];
  
  // Calculate total pages
  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  
  // Calculate properties to display for current page
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  
  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to the top of the section
      document.getElementById('latest-properties')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to the top of the section
      document.getElementById('latest-properties')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="latest-properties" className="py-12 bg-clickprop-bg-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-clickprop-text">
            Latest Properties
          </h2>
          <Link to="/properties" className="text-clickprop-blue hover:underline">
            View All Properties
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProperties.map((property: any) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center px-4">
                  <span className="text-sm text-clickprop-text-secondary">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default LatestProperties;
