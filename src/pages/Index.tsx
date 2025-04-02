
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import PopularCities from '@/components/home/PopularCities';
import PropertyTypeSection from '@/components/home/PropertyTypeSection';
import LatestProperties from '@/components/home/LatestProperties';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PopularCities />
      <PropertyTypeSection />
      <LatestProperties />
      
      {/* Info Section */}
      <section className="py-16 bg-clickprop-bg-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-clickprop-text mb-4">
              Why Choose ClickProp?
            </h2>
            <p className="text-clickprop-text-secondary max-w-3xl mx-auto">
              ClickProp is your trusted partner in finding the perfect property across major Indian cities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center bg-clickprop-blue/10 text-clickprop-blue rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-clickprop-text">Extensive Property Listings</h3>
              <p className="text-clickprop-text-secondary">
                Access thousands of verified properties across all major Indian cities and towns.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center bg-clickprop-blue/10 text-clickprop-blue rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-clickprop-text">Verified Listings</h3>
              <p className="text-clickprop-text-secondary">
                Every property listing is verified to ensure you get accurate and reliable information.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center bg-clickprop-blue/10 text-clickprop-blue rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-clickprop-text">Property Alerts</h3>
              <p className="text-clickprop-text-secondary">
                Set up personalized alerts to get notified about new properties that match your criteria.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
