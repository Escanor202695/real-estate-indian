
import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Bell, Heart, History, Lock, LogOut, Bug } from 'lucide-react';
import { logout } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UserSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-full">
      <h2 className="text-xl font-semibold mb-6 text-clickprop-blue">Dashboard</h2>
      
      <nav className="space-y-2">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>
        
        <NavLink 
          to="/dashboard/saved-searches" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Heart size={18} />
          <span>Saved Searches</span>
        </NavLink>
        
        <NavLink 
          to="/dashboard/recent-searches" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <History size={18} />
          <span>Recent Searches</span>
        </NavLink>
        
        <NavLink 
          to="/dashboard/alerts" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Bell size={18} />
          <span>Property Alerts</span>
        </NavLink>
        
        <NavLink 
          to="/dashboard/password" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Lock size={18} />
          <span>Change Password</span>
        </NavLink>
        
        <NavLink 
          to="/contact" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Bug size={18} />
          <span>Report Bug</span>
        </NavLink>
      </nav>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserSidebar;
