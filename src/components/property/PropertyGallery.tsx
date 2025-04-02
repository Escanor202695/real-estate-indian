
import React, { useState } from 'react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [mainImage, setMainImage] = useState(images[0] || '');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
      <div className="lg:col-span-4">
        <div className="rounded-lg overflow-hidden h-[400px] bg-gray-100">
          <img 
            src={mainImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
          {images.slice(0, 4).map((image, index) => (
            <div 
              key={index}
              className={`rounded-lg overflow-hidden h-24 cursor-pointer border-2 ${mainImage === image ? 'border-clickprop-blue' : 'border-transparent'}`}
              onClick={() => setMainImage(image)}
            >
              <img 
                src={image} 
                alt={`${title} ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyGallery;
