import React from 'react';
import { Link } from 'react-router-dom';
import { City } from '@/types/city';
import { Building } from 'lucide-react';

// Comprehensive list of Indian cities organized by state
const allCities: City[] = [
  // Major cities for display in the grid
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
  
  // Maharashtra
  { id: '9', name: 'Nagpur', state: 'Maharashtra', propertyCount: 986, searchCount: 2210, isActive: true },
  { id: '10', name: 'Thane', state: 'Maharashtra', propertyCount: 1240, searchCount: 2780, isActive: true },
  { id: '11', name: 'Nashik', state: 'Maharashtra', propertyCount: 765, searchCount: 1830, isActive: true },
  { id: '12', name: 'Aurangabad', state: 'Maharashtra', propertyCount: 540, searchCount: 1420, isActive: true },
  { id: '13', name: 'Solapur', state: 'Maharashtra', propertyCount: 320, searchCount: 980, isActive: true },
  { id: '14', name: 'Amravati', state: 'Maharashtra', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '15', name: 'Kolhapur', state: 'Maharashtra', propertyCount: 310, searchCount: 840, isActive: true },
  { id: '16', name: 'Ulhasnagar', state: 'Maharashtra', propertyCount: 210, searchCount: 590, isActive: true },
  { id: '17', name: 'Sangli', state: 'Maharashtra', propertyCount: 180, searchCount: 520, isActive: true },
  { id: '18', name: 'Jalgaon', state: 'Maharashtra', propertyCount: 165, searchCount: 480, isActive: true },
  { id: '19', name: 'Akola', state: 'Maharashtra', propertyCount: 150, searchCount: 420, isActive: true },
  
  // Delhi NCR
  { id: '20', name: 'New Delhi', state: 'Delhi', propertyCount: 1760, searchCount: 4320, isActive: true },
  { id: '21', name: 'East Delhi', state: 'Delhi', propertyCount: 980, searchCount: 2350, isActive: true },
  { id: '22', name: 'West Delhi', state: 'Delhi', propertyCount: 1050, searchCount: 2480, isActive: true },
  { id: '23', name: 'North Delhi', state: 'Delhi', propertyCount: 920, searchCount: 2180, isActive: true },
  { id: '24', name: 'South Delhi', state: 'Delhi', propertyCount: 1420, searchCount: 3380, isActive: true },
  
  // Haryana
  { id: '25', name: 'Gurgaon', state: 'Haryana', propertyCount: 1450, searchCount: 3650, isActive: true },
  { id: '26', name: 'Faridabad', state: 'Haryana', propertyCount: 780, searchCount: 1860, isActive: true },
  { id: '27', name: 'Ambala', state: 'Haryana', propertyCount: 340, searchCount: 920, isActive: true },
  { id: '28', name: 'Panipat', state: 'Haryana', propertyCount: 310, searchCount: 780, isActive: true },
  { id: '29', name: 'Yamunanagar', state: 'Haryana', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '30', name: 'Rohtak', state: 'Haryana', propertyCount: 320, searchCount: 840, isActive: true },
  { id: '31', name: 'Hisar', state: 'Haryana', propertyCount: 290, searchCount: 720, isActive: true },
  { id: '32', name: 'Karnal', state: 'Haryana', propertyCount: 270, searchCount: 680, isActive: true },
  { id: '33', name: 'Sonipat', state: 'Haryana', propertyCount: 280, searchCount: 710, isActive: true },
  { id: '34', name: 'Panchkula', state: 'Haryana', propertyCount: 310, searchCount: 780, isActive: true },
  
  // Uttar Pradesh
  { id: '35', name: 'Noida', state: 'Uttar Pradesh', propertyCount: 1380, searchCount: 3280, isActive: true },
  { id: '36', name: 'Ghaziabad', state: 'Uttar Pradesh', propertyCount: 920, searchCount: 2140, isActive: true },
  { id: '37', name: 'Lucknow', state: 'Uttar Pradesh', propertyCount: 780, searchCount: 1840, isActive: true },
  { id: '38', name: 'Kanpur', state: 'Uttar Pradesh', propertyCount: 620, searchCount: 1480, isActive: true },
  { id: '39', name: 'Agra', state: 'Uttar Pradesh', propertyCount: 580, searchCount: 1340, isActive: true },
  { id: '40', name: 'Varanasi', state: 'Uttar Pradesh', propertyCount: 520, searchCount: 1240, isActive: true },
  { id: '41', name: 'Prayagraj', state: 'Uttar Pradesh', propertyCount: 480, searchCount: 1120, isActive: true },
  { id: '42', name: 'Meerut', state: 'Uttar Pradesh', propertyCount: 410, searchCount: 980, isActive: true },
  { id: '43', name: 'Gorakhpur', state: 'Uttar Pradesh', propertyCount: 350, searchCount: 840, isActive: true },
  { id: '44', name: 'Bareilly', state: 'Uttar Pradesh', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '45', name: 'Aligarh', state: 'Uttar Pradesh', propertyCount: 290, searchCount: 720, isActive: true },
  { id: '46', name: 'Moradabad', state: 'Uttar Pradesh', propertyCount: 270, searchCount: 680, isActive: true },
  { id: '47', name: 'Saharanpur', state: 'Uttar Pradesh', propertyCount: 240, searchCount: 610, isActive: true },
  { id: '48', name: 'Jhansi', state: 'Uttar Pradesh', propertyCount: 220, searchCount: 580, isActive: true },
  
  // Karnataka
  { id: '49', name: 'Mysore', state: 'Karnataka', propertyCount: 645, searchCount: 1520, isActive: true },
  { id: '50', name: 'Mangalore', state: 'Karnataka', propertyCount: 520, searchCount: 1240, isActive: true },
  { id: '51', name: 'Hubli-Dharwad', state: 'Karnataka', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '52', name: 'Belgaum', state: 'Karnataka', propertyCount: 310, searchCount: 780, isActive: true },
  { id: '53', name: 'Gulbarga', state: 'Karnataka', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '54', name: 'Davanagere', state: 'Karnataka', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '55', name: 'Bellary', state: 'Karnataka', propertyCount: 220, searchCount: 580, isActive: true },
  { id: '56', name: 'Shimoga', state: 'Karnataka', propertyCount: 210, searchCount: 560, isActive: true },
  { id: '57', name: 'Tumkur', state: 'Karnataka', propertyCount: 195, searchCount: 530, isActive: true },
  
  // Telangana
  { id: '58', name: 'Warangal', state: 'Telangana', propertyCount: 410, searchCount: 980, isActive: true },
  { id: '59', name: 'Nizamabad', state: 'Telangana', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '60', name: 'Karimnagar', state: 'Telangana', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '61', name: 'Khammam', state: 'Telangana', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '62', name: 'Ramagundam', state: 'Telangana', propertyCount: 180, searchCount: 520, isActive: true },
  { id: '63', name: 'Mahbubnagar', state: 'Telangana', propertyCount: 160, searchCount: 480, isActive: true },
  
  // Tamil Nadu
  { id: '64', name: 'Coimbatore', state: 'Tamil Nadu', propertyCount: 780, searchCount: 1920, isActive: true },
  { id: '65', name: 'Madurai', state: 'Tamil Nadu', propertyCount: 650, searchCount: 1560, isActive: true },
  { id: '66', name: 'Trichy', state: 'Tamil Nadu', propertyCount: 480, searchCount: 1140, isActive: true },
  { id: '67', name: 'Salem', state: 'Tamil Nadu', propertyCount: 390, searchCount: 940, isActive: true },
  { id: '68', name: 'Tirunelveli', state: 'Tamil Nadu', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '69', name: 'Tiruppur', state: 'Tamil Nadu', propertyCount: 340, searchCount: 820, isActive: true },
  { id: '70', name: 'Erode', state: 'Tamil Nadu', propertyCount: 310, searchCount: 780, isActive: true },
  { id: '71', name: 'Vellore', state: 'Tamil Nadu', propertyCount: 290, searchCount: 720, isActive: true },
  { id: '72', name: 'Thoothukkudi', state: 'Tamil Nadu', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '73', name: 'Dindigul', state: 'Tamil Nadu', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '74', name: 'Thanjavur', state: 'Tamil Nadu', propertyCount: 230, searchCount: 600, isActive: true },
  
  // West Bengal
  { id: '75', name: 'Howrah', state: 'West Bengal', propertyCount: 620, searchCount: 1480, isActive: true },
  { id: '76', name: 'Durgapur', state: 'West Bengal', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '77', name: 'Asansol', state: 'West Bengal', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '78', name: 'Siliguri', state: 'West Bengal', propertyCount: 340, searchCount: 820, isActive: true },
  { id: '79', name: 'Bardhaman', state: 'West Bengal', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '80', name: 'Malda', state: 'West Bengal', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '81', name: 'Kharagpur', state: 'West Bengal', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '82', name: 'Jalpaiguri', state: 'West Bengal', propertyCount: 190, searchCount: 540, isActive: true },
  
  // Gujarat
  { id: '83', name: 'Surat', state: 'Gujarat', propertyCount: 980, searchCount: 2140, isActive: true },
  { id: '84', name: 'Vadodara', state: 'Gujarat', propertyCount: 760, searchCount: 1780, isActive: true },
  { id: '85', name: 'Rajkot', state: 'Gujarat', propertyCount: 580, searchCount: 1380, isActive: true },
  { id: '86', name: 'Gandhinagar', state: 'Gujarat', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '87', name: 'Bhavnagar', state: 'Gujarat', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '88', name: 'Jamnagar', state: 'Gujarat', propertyCount: 290, searchCount: 720, isActive: true },
  { id: '89', name: 'Junagadh', state: 'Gujarat', propertyCount: 260, searchCount: 680, isActive: true },
  { id: '90', name: 'Anand', state: 'Gujarat', propertyCount: 230, searchCount: 620, isActive: true },
  { id: '91', name: 'Navsari', state: 'Gujarat', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '92', name: 'Morbi', state: 'Gujarat', propertyCount: 190, searchCount: 540, isActive: true },
  
  // Rajasthan
  { id: '93', name: 'Jaipur', state: 'Rajasthan', propertyCount: 860, searchCount: 1980, isActive: true },
  { id: '94', name: 'Jodhpur', state: 'Rajasthan', propertyCount: 540, searchCount: 1280, isActive: true },
  { id: '95', name: 'Udaipur', state: 'Rajasthan', propertyCount: 480, searchCount: 1140, isActive: true },
  { id: '96', name: 'Kota', state: 'Rajasthan', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '97', name: 'Bikaner', state: 'Rajasthan', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '98', name: 'Ajmer', state: 'Rajasthan', propertyCount: 310, searchCount: 760, isActive: true },
  { id: '99', name: 'Sikar', state: 'Rajasthan', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '100', name: 'Bhilwara', state: 'Rajasthan', propertyCount: 230, searchCount: 600, isActive: true },
  { id: '101', name: 'Alwar', state: 'Rajasthan', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '102', name: 'Sri Ganganagar', state: 'Rajasthan', propertyCount: 190, searchCount: 540, isActive: true },
  
  // Kerala
  { id: '103', name: 'Kochi', state: 'Kerala', propertyCount: 720, searchCount: 1680, isActive: true },
  { id: '104', name: 'Thiruvananthapuram', state: 'Kerala', propertyCount: 650, searchCount: 1520, isActive: true },
  { id: '105', name: 'Kozhikode', state: 'Kerala', propertyCount: 480, searchCount: 1140, isActive: true },
  { id: '106', name: 'Thrissur', state: 'Kerala', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '107', name: 'Kollam', state: 'Kerala', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '108', name: 'Palakkad', state: 'Kerala', propertyCount: 340, searchCount: 820, isActive: true },
  { id: '109', name: 'Alappuzha', state: 'Kerala', propertyCount: 310, searchCount: 780, isActive: true },
  { id: '110', name: 'Kannur', state: 'Kerala', propertyCount: 290, searchCount: 720, isActive: true },
  { id: '111', name: 'Kottayam', state: 'Kerala', propertyCount: 280, searchCount: 700, isActive: true },
  
  // Madhya Pradesh
  { id: '112', name: 'Indore', state: 'Madhya Pradesh', propertyCount: 680, searchCount: 1580, isActive: true },
  { id: '113', name: 'Bhopal', state: 'Madhya Pradesh', propertyCount: 620, searchCount: 1440, isActive: true },
  { id: '114', name: 'Jabalpur', state: 'Madhya Pradesh', propertyCount: 450, searchCount: 1080, isActive: true },
  { id: '115', name: 'Gwalior', state: 'Madhya Pradesh', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '116', name: 'Ujjain', state: 'Madhya Pradesh', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '117', name: 'Sagar', state: 'Madhya Pradesh', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '118', name: 'Dewas', state: 'Madhya Pradesh', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '119', name: 'Satna', state: 'Madhya Pradesh', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '120', name: 'Ratlam', state: 'Madhya Pradesh', propertyCount: 190, searchCount: 540, isActive: true },
  
  // Punjab
  { id: '121', name: 'Ludhiana', state: 'Punjab', propertyCount: 580, searchCount: 1340, isActive: true },
  { id: '122', name: 'Amritsar', state: 'Punjab', propertyCount: 520, searchCount: 1240, isActive: true },
  { id: '123', name: 'Jalandhar', state: 'Punjab', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '124', name: 'Patiala', state: 'Punjab', propertyCount: 340, searchCount: 820, isActive: true },
  { id: '125', name: 'Bathinda', state: 'Punjab', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '126', name: 'Mohali', state: 'Punjab', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '127', name: 'Pathankot', state: 'Punjab', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '128', name: 'Hoshiarpur', state: 'Punjab', propertyCount: 190, searchCount: 540, isActive: true },
  
  // Andhra Pradesh
  { id: '129', name: 'Visakhapatnam', state: 'Andhra Pradesh', propertyCount: 620, searchCount: 1480, isActive: true },
  { id: '130', name: 'Vijayawada', state: 'Andhra Pradesh', propertyCount: 540, searchCount: 1280, isActive: true },
  { id: '131', name: 'Guntur', state: 'Andhra Pradesh', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '132', name: 'Nellore', state: 'Andhra Pradesh', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '133', name: 'Kurnool', state: 'Andhra Pradesh', propertyCount: 290, searchCount: 720, isActive: true },
  { id: '134', name: 'Rajahmundry', state: 'Andhra Pradesh', propertyCount: 270, searchCount: 680, isActive: true },
  { id: '135', name: 'Tirupati', state: 'Andhra Pradesh', propertyCount: 310, searchCount: 780, isActive: true },
  { id: '136', name: 'Kakinada', state: 'Andhra Pradesh', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '137', name: 'Kadapa', state: 'Andhra Pradesh', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '138', name: 'Anantapur', state: 'Andhra Pradesh', propertyCount: 195, searchCount: 550, isActive: true },
  
  // Bihar
  { id: '139', name: 'Patna', state: 'Bihar', propertyCount: 450, searchCount: 1080, isActive: true },
  { id: '140', name: 'Gaya', state: 'Bihar', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '141', name: 'Muzaffarpur', state: 'Bihar', propertyCount: 290, searchCount: 720, isActive: true },
  { id: '142', name: 'Bhagalpur', state: 'Bihar', propertyCount: 270, searchCount: 680, isActive: true },
  { id: '143', name: 'Darbhanga', state: 'Bihar', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '144', name: 'Purnia', state: 'Bihar', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '145', name: 'Arrah', state: 'Bihar', propertyCount: 190, searchCount: 540, isActive: true },
  
  // Odisha
  { id: '146', name: 'Bhubaneswar', state: 'Odisha', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '147', name: 'Cuttack', state: 'Odisha', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '148', name: 'Rourkela', state: 'Odisha', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '149', name: 'Berhampur', state: 'Odisha', propertyCount: 270, searchCount: 680, isActive: true },
  { id: '150', name: 'Sambalpur', state: 'Odisha', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '151', name: 'Puri', state: 'Odisha', propertyCount: 210, searchCount: 580, isActive: true },
  
  // Jharkhand
  { id: '152', name: 'Ranchi', state: 'Jharkhand', propertyCount: 360, searchCount: 880, isActive: true },
  { id: '153', name: 'Jamshedpur', state: 'Jharkhand', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '154', name: 'Dhanbad', state: 'Jharkhand', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '155', name: 'Bokaro', state: 'Jharkhand', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '156', name: 'Hazaribagh', state: 'Jharkhand', propertyCount: 190, searchCount: 540, isActive: true },
  
  // Chhattisgarh
  { id: '157', name: 'Raipur', state: 'Chhattisgarh', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '158', name: 'Bhilai', state: 'Chhattisgarh', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '159', name: 'Bilaspur', state: 'Chhattisgarh', propertyCount: 270, searchCount: 680, isActive: true },
  { id: '160', name: 'Korba', state: 'Chhattisgarh', propertyCount: 210, searchCount: 580, isActive: true },
  
  // Assam
  { id: '161', name: 'Guwahati', state: 'Assam', propertyCount: 380, searchCount: 920, isActive: true },
  { id: '162', name: 'Silchar', state: 'Assam', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '163', name: 'Dibrugarh', state: 'Assam', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '164', name: 'Jorhat', state: 'Assam', propertyCount: 210, searchCount: 580, isActive: true },
  { id: '165', name: 'Nagaon', state: 'Assam', propertyCount: 180, searchCount: 520, isActive: true },
  
  // Uttarakhand
  { id: '166', name: 'Dehradun', state: 'Uttarakhand', propertyCount: 420, searchCount: 980, isActive: true },
  { id: '167', name: 'Haridwar', state: 'Uttarakhand', propertyCount: 340, searchCount: 820, isActive: true },
  { id: '168', name: 'Roorkee', state: 'Uttarakhand', propertyCount: 270, searchCount: 680, isActive: true },
  { id: '169', name: 'Nainital', state: 'Uttarakhand', propertyCount: 220, searchCount: 580, isActive: true },
  { id: '170', name: 'Haldwani', state: 'Uttarakhand', propertyCount: 210, searchCount: 560, isActive: true },
  
  // Himachal Pradesh
  { id: '171', name: 'Shimla', state: 'Himachal Pradesh', propertyCount: 310, searchCount: 780, isActive: true },
  { id: '172', name: 'Dharamshala', state: 'Himachal Pradesh', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '173', name: 'Solan', state: 'Himachal Pradesh', propertyCount: 180, searchCount: 520, isActive: true },
  { id: '174', name: 'Kullu', state: 'Himachal Pradesh', propertyCount: 160, searchCount: 480, isActive: true },
  
  // Goa
  { id: '175', name: 'Panaji', state: 'Goa', propertyCount: 280, searchCount: 720, isActive: true },
  { id: '176', name: 'Margao', state: 'Goa', propertyCount: 240, searchCount: 620, isActive: true },
  { id: '177', name: 'Vasco da Gama', state: 'Goa', propertyCount: 220, searchCount: 580, isActive: true },
  { id: '178', name: 'Ponda', state: 'Goa', propertyCount: 180, searchCount: 520, isActive: true },
  
  // Union Territories
  { id: '179', name: 'Chandigarh', state: 'Chandigarh', propertyCount: 580, searchCount: 1340, isActive: true },
  { id: '180', name: 'Puducherry', state: 'Puducherry', propertyCount: 340, searchCount: 820, isActive: true },
  { id: '181', name: 'Port Blair', state: 'Andaman & Nicobar Islands', propertyCount: 160, searchCount: 480, isActive: true },
  { id: '182', name: 'Silvassa', state: 'Dadra & Nagar Haveli', propertyCount: 140, searchCount: 420, isActive: true },
  { id: '183', name: 'Daman', state: 'Daman & Diu', propertyCount: 120, searchCount: 380, isActive: true },
  { id: '184', name: 'Kavaratti', state: 'Lakshadweep', propertyCount: 90, searchCount: 280, isActive: true },
  
  // Jammu & Kashmir
  { id: '185', name: 'Srinagar', state: 'Jammu & Kashmir', propertyCount: 320, searchCount: 780, isActive: true },
  { id: '186', name: 'Jammu', state: 'Jammu & Kashmir', propertyCount: 290, searchCount: 720, isActive: true },
  { id: '187', name: 'Anantnag', state: 'Jammu & Kashmir', propertyCount: 180, searchCount: 520, isActive: true },
  
  // Ladakh
  { id: '188', name: 'Leh', state: 'Ladakh', propertyCount: 140, searchCount: 420, isActive: true },
  { id: '189', name: 'Kargil', state: 'Ladakh', propertyCount: 110, searchCount: 340, isActive: true },
  
  // Sikkim
  { id: '190', name: 'Gangtok', state: 'Sikkim', propertyCount: 180, searchCount: 520, isActive: true },
  { id: '191', name: 'Namchi', state: 'Sikkim', propertyCount: 90, searchCount: 280, isActive: true },
  
  // Tripura
  { id: '192', name: 'Agartala', state: 'Tripura', propertyCount: 180, searchCount: 520, isActive: true },
  { id: '193', name: 'Udaipur', state: 'Tripura', propertyCount: 110, searchCount: 340, isActive: true },
  
  // Manipur
  { id: '194', name: 'Imphal', state: 'Manipur', propertyCount: 150, searchCount: 420, isActive: true },
  { id: '195', name: 'Thoubal', state: 'Manipur', propertyCount: 90, searchCount: 280, isActive: true },
  
  // Meghalaya
  { id: '196', name: 'Shillong', state: 'Meghalaya', propertyCount: 170, searchCount: 480, isActive: true },
  { id: '197', name: 'Tura', state: 'Meghalaya', propertyCount: 100, searchCount: 310, isActive: true },
  
  // Nagaland
  { id: '198', name: 'Kohima', state: 'Nagaland', propertyCount: 130, searchCount: 380, isActive: true },
  { id: '199', name: 'Dimapur', state: 'Nagaland', propertyCount: 120, searchCount: 360, isActive: true },
  
  // Arunachal Pradesh
  { id: '200', name: 'Itanagar', state: 'Arunachal Pradesh', propertyCount: 110, searchCount: 340, isActive: true },
  { id: '201', name: 'Naharlagun', state: 'Arunachal Pradesh', propertyCount: 90, searchCount: 280, isActive: true },
  
  // Mizoram
  { id: '202', name: 'Aizawl', state: 'Mizoram', propertyCount: 120, searchCount: 360, isActive: true },
  { id: '203', name: 'Lunglei', state: 'Mizoram', propertyCount: 80, searchCount: 240, isActive: true }
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
  
  // Calculate the total count (states + cities)
  const totalCount = sortedStateEntries.reduce(
    (total, [cities]) => total + 1 + cities.length, 0
  );
  
  // Calculate items per column (roughly equal distribution)
  const itemsPerColumn = Math.ceil(totalCount / 3);
  
  // Create columns based on combined count of states + cities
  const columns: Array<Array<[string, City[]]>> = [[], [], []];
  let currentColumn = 0;
  let currentColumnCount = 0;
  
  sortedStateEntries.forEach(stateEntry => {
    const stateAndCitiesCount = 1 + stateEntry[1].length; // Count state itself (1) plus its cities
    
    // If adding this state would exceed the target count and we're not on the last column,
    // move to the next column
    if (currentColumnCount + stateAndCitiesCount > itemsPerColumn && currentColumn < 2) {
      currentColumn++;
      currentColumnCount = 0;
    }
    
    columns[currentColumn].push(stateEntry);
    currentColumnCount += stateAndCitiesCount;
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
