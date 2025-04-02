
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Mail } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyContactFormProps {
  owner?: {
    name: string;
    contact: string;
    email: string;
  };
}

const PropertyContactForm: React.FC<PropertyContactFormProps> = ({ owner }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-clickprop-text">Contact Owner</h2>
      {owner && (
        <div className="mb-4">
          <p className="font-medium text-clickprop-text">{owner.name}</p>
          <div className="flex items-center mt-2">
            <Phone size={16} className="text-clickprop-blue mr-2" />
            <a href={`tel:${owner.contact}`} className="text-clickprop-text-secondary hover:text-clickprop-blue">
              {owner.contact}
            </a>
          </div>
          <div className="flex items-center mt-2">
            <Mail size={16} className="text-clickprop-blue mr-2" />
            <a href={`mailto:${owner.email}`} className="text-clickprop-text-secondary hover:text-clickprop-blue">
              {owner.email}
            </a>
          </div>
        </div>
      )}
      
      <form className="space-y-4 mt-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clickprop-blue"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clickprop-blue"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
            Your Phone
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clickprop-blue"
            placeholder="Enter your phone number"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-clickprop-text-secondary mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clickprop-blue"
            placeholder="I'm interested in this property. Please contact me."
          ></textarea>
        </div>
        
        <Button type="submit" className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark">
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default PropertyContactForm;
