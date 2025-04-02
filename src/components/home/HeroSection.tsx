
import React from 'react';
import SearchBar from '../global/SearchBar';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Find Your Perfect Property in India
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/90">
            Search properties for sale and rent across major Indian cities
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <SearchBar className="mb-4" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
