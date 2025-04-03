
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import React from "react";
import { isLoggedIn, isAdmin } from "@/services/authService";

// Pages
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Cities from "./pages/Cities";
import CityDetail from "./pages/CityDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AuthCallback from './pages/AuthCallback';

// Dashboard Pages
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/dashboard/user/Profile";
import SavedSearches from "./pages/dashboard/user/SavedSearches";
import RecentSearches from "./pages/dashboard/user/RecentSearches";
import PropertyAlerts from "./pages/dashboard/user/PropertyAlerts";
import ChangePassword from "./pages/dashboard/user/ChangePassword";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardHome from "./pages/dashboard/admin/Dashboard";
import AdminProperties from "./pages/dashboard/admin/Properties";
import AdminUsers from "./pages/dashboard/admin/Users";
import AdminCities from "./pages/dashboard/admin/Cities";

const queryClient = new QueryClient();

// Protected route component for users
const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Protected route component for admins
const AdminRoute = ({ children }) => {
  if (!isLoggedIn() || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/cities" element={<Cities />} />
                  <Route path="/cities/:name" element={<CityDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth-callback" element={<AuthCallback />} />
                  
                  {/* Protected User Dashboard Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Profile />} />
                    <Route path="saved-searches" element={<SavedSearches />} />
                    <Route path="recent-searches" element={<RecentSearches />} />
                    <Route path="alerts" element={<PropertyAlerts />} />
                    <Route path="password" element={<ChangePassword />} />
                  </Route>
                  
                  {/* Protected Admin Dashboard Routes */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }>
                    <Route index element={<AdminDashboardHome />} />
                    <Route path="properties" element={<AdminProperties />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="cities" element={<AdminCities />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
