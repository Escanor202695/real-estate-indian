
import React from 'react';
import { Link } from 'react-router-dom';
import { City } from '@/types/city';
import { Building } from 'lucide-react';

// Mock data for cities - expanded with more Indian cities
const allCities: City[] = [
  // Major cities - initial set for display in the grid
  {
    id: '1',
    name: 'Mumbai',
    state: 'Maharashtra',
    propertyCount: 2356,
    searchCount: 5420,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Delhi',
    state: 'Delhi',
    propertyCount: 1897,
    searchCount: 4980,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Bangalore',
    state: 'Karnataka',
    propertyCount: 2145,
    searchCount: 5120,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Hyderabad',
    state: 'Telangana',
    propertyCount: 1756,
    searchCount: 3890,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1572920629925-9e1cc7517fb7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Chennai',
    state: 'Tamil Nadu',
    propertyCount: 1623,
    searchCount: 3750,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Kolkata',
    state: 'West Bengal',
    propertyCount: 1456,
    searchCount: 3210,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Pune',
    state: 'Maharashtra',
    propertyCount: 1845,
    searchCount: 4120,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1564763444435-380d5aecdebf?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Ahmedabad',
    state: 'Gujarat',
    propertyCount: 1378,
    searchCount: 2980,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1595658658481-d53d628f8f86?q=80&w=800&auto=format&fit=crop'
  },
  
  // Additional cities for comprehensive listings by state
  // Maharashtra
  { id: '9', name: 'Nagpur', state: 'Maharashtra', propertyCount: 986, searchCount: 2210, isActive: true },
  { id: '10', name: 'Thane', state: 'Maharashtra', propertyCount: 1240, searchCount: 2780, isActive: true },
  { id: '11', name: 'Nashik', state: 'Maharashtra', propertyCount: 765, searchCount: 1830, isActive: true },
  { id: '12', name: 'Aurangabad', state: 'Maharashtra', propertyCount: 540, searchCount: 1420, isActive: true },
  { id: '13', name: 'Solapur', state: 'Maharashtra', propertyCount: 320, searchCount: 980, isActive: true },
  { id: '14', name: 'Amravati', state: 'Maharashtra', propertyCount: 280, searchCount: 720, isActive: true },
  
  // Delhi NCR
  { id: '15', name: 'New Delhi', state: 'Delhi', propertyCount: 1760, searchCount: 4320, isActive: true },
  { id: '16', name: 'Gurgaon', state: 'Haryana', propertyCount: 1450, searchCount: 3650, isActive: true },
  { id: '17', name: 'Noida', state: 'Uttar Pradesh', propertyCount: 1380, searchCount: 3280, isActive: true },
  { id: '18', name: 'Ghaziabad', state: 'Uttar Pradesh', propertyCount: 920, searchCount: 2140, isActive: true },
  { id: '19', name: 'Faridabad', state: 'Haryana', propertyCount: 780, searchCount: 1860, isActive: true },
  
  // Karnataka
  { id: '20', name: 'Mysore', state: 'Karnataka', propertyCount: 645, searchCount: 1520, isActive: true },
  { id: '21', name: 'Mangalore', state: 'Karnataka', propertyCount: 520, searchCount: 1240, isActive: true },
  { id: '22', name: 'Hubli-Dharwad', state: 'Karnataka', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '23', name: 'Belgaum', state: 'Karnataka', propertyCount: 310, searchCount: 780, isActive: true },
  
  // Telangana
  { id: '24', name: 'Warangal', state: 'Telangana', propertyCount: 410, searchCount: 980, isActive: true },
  { id: '25', name: 'Nizamabad', state: 'Telangana', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '26', name: 'Karimnagar', state: 'Telangana', propertyCount: 240, searchCount: 620, isActive: true },
  
  // Tamil Nadu
  { id: '27', name: 'Coimbatore', state: 'Tamil Nadu', propertyCount: 780, searchCount: 1920, isActive: true },
  { id: '28', name: 'Madurai', state: 'Tamil Nadu', propertyCount: 650, searchCount: 1560, isActive: true },
  { id: '29', name: 'Trichy', state: 'Tamil Nadu', propertyCount: 480, searchCount: 1140, isActive: true },
  { id: '30', name: 'Salem', state: 'Tamil Nadu', propertyCount: 390, searchCount: 940, isActive: true },
  { id: '31', name: 'Tirunelveli', state: 'Tamil Nadu', propertyCount: 280, searchCount: 720, isActive: true },
  
  // West Bengal
  { id: '32', name: 'Howrah', state: 'West Bengal', propertyCount: 620, searchCount: 1480, isActive: true },
  { id: '33', name: 'Durgapur', state: 'West Bengal', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '34', name: 'Asansol', state: 'West Bengal', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '35', name: 'Siliguri', state: 'West Bengal', propertyCount: 340, searchCount: 820, isActive: true },
  
  // Gujarat
  { id: '36', name: 'Surat', state: 'Gujarat', propertyCount: 980, searchCount: 2140, isActive: true },
  { id: '37', name: 'Vadodara', state: 'Gujarat', propertyCount: 760, searchCount: 1780, isActive: true },
  { id: '38', name: 'Rajkot', state: 'Gujarat', propertyCount: 580, searchCount: 1380, isActive: true },
  { id: '39', name: 'Gandhinagar', state: 'Gujarat', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '40', name: 'Bhavnagar', state: 'Gujarat', propertyCount: 320, searchCount: 780, isActive: true },
  
  // Rajasthan
  { id: '41', name: 'Jaipur', state: 'Rajasthan', propertyCount: 860, searchCount: 1980, isActive: true },
  { id: '42', name: 'Jodhpur', state: 'Rajasthan', propertyCount: 540, searchCount: 1280, isActive: true },
  { id: '43', name: 'Udaipur', state: 'Rajasthan', propertyCount: 480, searchCount: 1140, isActive: true },
  { id: '44', name: 'Kota', state: 'Rajasthan', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '45', name: 'Bikaner', state: 'Rajasthan', propertyCount: 320, searchCount: 780, isActive: true },
  
  // Uttar Pradesh
  { id: '46', name: 'Lucknow', state: 'Uttar Pradesh', propertyCount: 780, searchCount: 1840, isActive: true },
  { id: '47', name: 'Kanpur', state: 'Uttar Pradesh', propertyCount: 620, searchCount: 1480, isActive: true },
  { id: '48', name: 'Agra', state: 'Uttar Pradesh', propertyCount: 580, searchCount: 1340, isActive: true },
  { id: '49', name: 'Varanasi', state: 'Uttar Pradesh', propertyCount: 520, searchCount: 1240, isActive: true },
  { id: '50', name: 'Allahabad', state: 'Uttar Pradesh', propertyCount: 480, searchCount: 1120, isActive: true },
  { id: '51', name: 'Meerut', state: 'Uttar Pradesh', propertyCount: 410, searchCount: 980, isActive: true },
  
  // Kerala
  { id: '52', name: 'Kochi', state: 'Kerala', propertyCount: 720, searchCount: 1680, isActive: true },
  { id: '53', name: 'Thiruvananthapuram', state: 'Kerala', propertyCount: 650, searchCount: 1520, isActive: true },
  { id: '54', name: 'Kozhikode', state: 'Kerala', propertyCount: 480, searchCount: 1140, isActive: true },
  { id: '55', name: 'Thrissur', state: 'Kerala', propertyCount: 420, searchCount: 980, isActive: true },
  
  // Madhya Pradesh
  { id: '56', name: 'Indore', state: 'Madhya Pradesh', propertyCount: 680, searchCount: 1580, isActive: true },
  { id: '57', name: 'Bhopal', state: 'Madhya Pradesh', propertyCount: 620, searchCount: 1440, isActive: true },
  { id: '58', name: 'Jabalpur', state: 'Madhya Pradesh', propertyCount: 450, searchCount: 1080, isActive: true },
  { id: '59', name: 'Gwalior', state: 'Madhya Pradesh', propertyCount: 380, searchCount: 920, isActive: true },
  
  // Punjab
  { id: '60', name: 'Ludhiana', state: 'Punjab', propertyCount: 580, searchCount: 1340, isActive: true },
  { id: '61', name: 'Amritsar', state: 'Punjab', propertyCount: 520, searchCount: 1240, isActive: true },
  { id: '62', name: 'Jalandhar', state: 'Punjab', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '63', name: 'Patiala', state: 'Punjab', propertyCount: 340, searchCount: 820, isActive: true },
  
  // Andhra Pradesh
  { id: '64', name: 'Visakhapatnam', state: 'Andhra Pradesh', propertyCount: 620, searchCount: 1480, isActive: true },
  { id: '65', name: 'Vijayawada', state: 'Andhra Pradesh', propertyCount: 540, searchCount: 1280, isActive: true },
  { id: '66', name: 'Guntur', state: 'Andhra Pradesh', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '67', name: 'Nellore', state: 'Andhra Pradesh', propertyCount: 320, searchCount: 780, isActive: true },
  
  // Other states
  { id: '68', name: 'Chandigarh', state: 'Chandigarh', propertyCount: 580, searchCount: 1340, isActive: true },
  { id: '69', name: 'Dehradun', state: 'Uttarakhand', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '70', name: 'Raipur', state: 'Chhattisgarh', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '71', name: 'Ranchi', state: 'Jharkhand', propertyCount: 360, searchCount: 880, isActive: true },
  { id: '72', name: 'Patna', state: 'Bihar', propertyCount: 450, searchCount: 1080, isActive: true },
  { id: '73', name: 'Bhubaneswar', state: 'Odisha', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '74', name: 'Guwahati', state: 'Assam', propertyCount: 380, searchCount: 920, isActive: true },
];

const Cities = () => {
  // Group cities by state
  const citiesByState: { [key: string]: City[] } = {};
  
  allCities.forEach(city => {
    if (!citiesByState[city.state]) {
      citiesByState[city.state] = [];
    }
    citiesByState[city.state].push(city);
  });
  
  // Create an array of state entries sorted alphabetically
  const sortedStateEntries = Object.entries(citiesByState)
    .sort(([stateA], [stateB]) => stateA.localeCompare(stateB));
  
  // Calculate the total number of cities
  const totalCities = sortedStateEntries.reduce((total, [_, cities]) => total + cities.length, 0);
  
  // Calculate cities per column (roughly equal distribution)
  const citiesPerColumn = Math.ceil(totalCities / 3);
  
  // Create columns based on city count
  const columns: Array<Array<[string, City[]]>> = [[], [], []];
  let currentColumn = 0;
  let currentColumnCityCount = 0;
  
  sortedStateEntries.forEach(stateEntry => {
    const stateCityCount = stateEntry[1].length;
    
    // If adding this state would exceed the target count and we're not on the last column,
    // move to the next column
    if (currentColumnCityCount + stateCityCount > citiesPerColumn && currentColumn < 2) {
      currentColumn++;
      currentColumnCityCount = 0;
    }
    
    columns[currentColumn].push(stateEntry);
    currentColumnCityCount += stateCityCount;
  });
  
  return (
    <div className="bg-clickprop-bg-light min-h-screen">
      <div className="bg-clickprop-blue py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Browse Properties by City
          </h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {allCities.slice(0, 8).map(city => (
            <Link
              key={city.id}
              to={`/cities/${city.name}`}
              className="city-card block"
            >
              <img 
                src={city.image || '/placeholder.svg'} 
                alt={city.name} 
                className="w-full h-48 object-cover"
              />
              <div className="city-card-overlay">
                <h3 className="text-xl font-semibold">{city.name}</h3>
                <p className="flex items-center text-sm mt-1">
                  <Building size={14} className="mr-1" />
                  {city.propertyCount} Properties
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-clickprop-text mb-6">
            All Cities by State
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((columnStates, columnIndex) => (
              <div key={columnIndex} className="space-y-8">
                {columnStates.map(([state, cities]) => (
                  <div key={state}>
                    <h3 className="text-xl font-semibold text-clickprop-blue mb-4">{state}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {cities.map(city => (
                        <Link 
                          key={city.id}
                          to={`/cities/${city.name}`}
                          className="flex items-center space-x-2 p-2 hover:bg-clickprop-bg-gray rounded"
                        >
                          <Building size={16} className="text-clickprop-blue" />
                          <div>
                            <span className="text-clickprop-text">{city.name}</span>
                            <span className="text-xs text-clickprop-text-secondary ml-2">
                              ({city.propertyCount})
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
