
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Building2,
  MapPin,
  Settings,
  LogOut,
  Bug,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: Home,
      tooltip: "Admin Dashboard"
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
      tooltip: "Manage Users"
    },
    {
      name: "Properties",
      path: "/admin/properties",
      icon: Building2,
      tooltip: "Manage Properties"
    },
    {
      name: "Bug Reports",
      path: "/admin/bugs",
      icon: Bug,
      tooltip: "Manage Bug Reports"
    },
  ];

  return (
    <TooltipProvider>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-clickprop-blue text-white">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm opacity-75">Manage your website</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive(item.path)
                          ? "bg-clickprop-blue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link
              to="/logout"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Link>
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
};

export default AdminSidebar;
