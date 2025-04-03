
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Home, Building, UserCircle, Settings, LayoutDashboard } from 'lucide-react';
import { isLoggedIn, isAdmin, logout, getCurrentUser } from '@/services/authService';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = isLoggedIn();
      setUserLoggedIn(loggedIn);

      if (loggedIn) {
        setUserIsAdmin(isAdmin());
        
        try {
          // Fetch current user data to get name
          const response = await getCurrentUser();
          if (response && response.data) {
            setUserName(response.data.name || 'User');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    checkLoginStatus();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setUserLoggedIn(false);
    setUserIsAdmin(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-clickprop-blue">Click<span className="text-clickprop-green">Prop</span></span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 text-clickprop-text-secondary hover:text-clickprop-blue flex items-center space-x-1">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/properties" className="px-3 py-2 text-clickprop-text-secondary hover:text-clickprop-blue flex items-center space-x-1">
              <Building size={18} />
              <span>Properties</span>
            </Link>
            
            {userIsAdmin && (
              <Link to="/admin" className="px-3 py-2 text-clickprop-text-secondary hover:text-clickprop-blue flex items-center space-x-1">
                <LayoutDashboard size={18} />
                <span>Admin Dashboard</span>
              </Link>
            )}
            
            {userLoggedIn ? (
              <div className="ml-4 flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <UserCircle size={18} />
                      <span>{userName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <UserCircle className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    
                    {userIsAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" className="bg-clickprop-blue hover:bg-clickprop-blue-dark" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-clickprop-text-secondary hover:text-clickprop-blue focus:outline-none"
              onClick={toggleMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          <Link to="/" className="block px-3 py-2 text-clickprop-text-secondary hover:text-clickprop-blue flex items-center space-x-2">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/properties" className="block px-3 py-2 text-clickprop-text-secondary hover:text-clickprop-blue flex items-center space-x-2">
            <Building size={18} />
            <span>Properties</span>
          </Link>
          
          {userIsAdmin && (
            <Link to="/admin" className="block px-3 py-2 text-clickprop-text-secondary hover:text-clickprop-blue flex items-center space-x-2">
              <LayoutDashboard size={18} />
              <span>Admin Dashboard</span>
            </Link>
          )}
          
          {userLoggedIn ? (
            <>
              <Link to="/dashboard" className="block px-3 py-2 text-clickprop-text-secondary hover:text-clickprop-blue flex items-center space-x-2">
                <UserCircle size={18} />
                <span>Dashboard</span>
              </Link>
              
              {userIsAdmin && (
                <Link to="/admin" className="block px-3 py-2 text-clickprop-text-secondary hover:text-clickprop-blue flex items-center space-x-2">
                  <Settings size={18} />
                  <span>Admin Panel</span>
                </Link>
              )}
              
              <Button 
                variant="outline" 
                className="w-full justify-center mt-2" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 mt-3 px-3">
              <Button variant="outline" className="w-full justify-center" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="w-full justify-center bg-clickprop-blue hover:bg-clickprop-blue-dark" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
