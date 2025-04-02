
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const PropertyNotFound: React.FC = () => {
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
};

export default PropertyNotFound;
