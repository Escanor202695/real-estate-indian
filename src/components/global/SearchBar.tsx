
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, BookmarkPlus } from "lucide-react";
import { addRecentSearch, addSavedSearch } from "@/services/userService";
import { isLoggedIn } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SearchBar = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [locationQuery, setLocationQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [status, setStatus] = useState("all");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  useEffect(() => {
    setIsLoggedInUser(isLoggedIn());

    if (location.pathname === "/properties") {
      const params = new URLSearchParams(location.search);
      const locationParam = params.get("location");
      const typeParam = params.get("type");
      const statusParam = params.get("status");

      if (locationParam) setLocationQuery(locationParam);
      if (typeParam) setPropertyType(typeParam);
      if (statusParam) setStatus(statusParam);
    } else {
      const savedLocation = localStorage.getItem("searchLocation");
      const savedType = localStorage.getItem("searchPropertyType");
      const savedStatus = localStorage.getItem("searchStatus");

      if (savedLocation) setLocationQuery(savedLocation);
      if (savedType) setPropertyType(savedType);
      if (savedStatus) setStatus(savedStatus);
    }
  }, [location.pathname, location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem("searchLocation", locationQuery);
    localStorage.setItem("searchPropertyType", propertyType);
    localStorage.setItem("searchStatus", status);

    const params = new URLSearchParams();

    if (locationQuery) params.append("location", locationQuery);
    if (propertyType !== "all") params.append("type", propertyType);
    if (status !== "all") params.append("status", status);

    // Track the search in our system if user is logged in
    if (locationQuery && isLoggedInUser) {
      try {
        // Add to recent searches for logged-in users
        const searchData = {
          query: locationQuery,
          params: {
            location: locationQuery,
            propertyType: propertyType !== "all" ? propertyType : undefined,
            status: status !== "all" ? status : undefined,
          },
          timestamp: new Date().toISOString(),
        };

        addRecentSearch(searchData).catch((err) =>
          console.log("Error saving recent search:", err)
        );
      } catch (error) {
        console.log("Error tracking search:", error);
      }
    }

    navigate(`/properties?${params.toString()}`);
  };

  const handleSaveSearch = async () => {
    if (!isLoggedInUser) {
      toast({
        title: "Login Required",
        description: "Please login to save searches.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setSaveDialogOpen(true);
  };

  const confirmSaveSearch = async () => {
    try {
      const searchData = {
        location: locationQuery,
        propertyType,
        status,
        notifyByEmail,
      };

      const response = await addSavedSearch(searchData);

      toast({
        title: "Search Saved",
        description: "Your search has been saved successfully.",
      });

      setSaveDialogOpen(false);
    } catch (error) {
      console.error("Error saving search:", error);
      toast({
        title: "Save Failed",
        description:
          "Failed to save your search. It might already be saved or there was a server error.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSearch}
        className={`bg-white p-4 rounded-lg shadow-md ${className}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <Input
              id="location"
              type="text"
              placeholder="City, Locality or Project"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full text-black"
            />
          </div>

          <div className="col-span-1">
            <label
              htmlFor="property-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property Type
            </label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger id="property-type" className="bg-white text-black">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="pg">PG/Co-living</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              For
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="bg-white text-black">
                <SelectValue placeholder="Buy or Rent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Buy or Rent</SelectItem>
                <SelectItem value="sale">Buy</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-3 mt-2">
            <Button
              type="submit"
              className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Properties
            </Button>
          </div>

          <div className="col-span-1 mt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full border-clickprop-blue text-clickprop-blue hover:bg-clickprop-blue hover:text-white"
              onClick={handleSaveSearch}
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </form>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search</DialogTitle>
            <DialogDescription>
              Save this search to quickly access it later and get notifications
              when new properties match your criteria.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Search Criteria</h4>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Location:</strong> {locationQuery || "Any location"}
                </p>
                <p>
                  <strong>Property Type:</strong>{" "}
                  {propertyType !== "all" ? propertyType : "Any type"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {status !== "all"
                    ? status === "sale"
                      ? "For Sale"
                      : "For Rent"
                    : "Buy or Rent"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notification"
                checked={notifyByEmail}
                onCheckedChange={(checked) =>
                  setNotifyByEmail(checked as boolean)
                }
              />
              <Label htmlFor="notification">
                Notify me by email when new matching properties are added
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-clickprop-blue hover:bg-clickprop-blue-dark"
              onClick={confirmSaveSearch}
            >
              Save Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;
