
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, Users, Map, Settings, LogOut } from 'lucide-react';
import { logout } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-full">
      <div className="flex items-center mb-6">
        <div className="bg-clickprop-blue rounded-md p-2 mr-3">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-clickprop-blue">Admin Panel</h2>
      </div>
      
      <nav className="space-y-2">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/admin/properties" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Home size={18} />
          <span>Properties</span>
        </NavLink>
        
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Users size={18} />
          <span>Users</span>
        </NavLink>
        
        <NavLink 
          to="/admin/cities" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-clickprop-blue text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Map size={18} />
          <span>Cities</span>
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

export default AdminSidebar;
