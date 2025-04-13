
import React, { useState } from "react";
import PropertiesManagementTab from "@/components/dashboard/admin/PropertiesManagementTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { importProperties } from "@/services/propertyService";
import { useQueryClient } from "@tanstack/react-query";

const Properties = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log("File selected:", file.name);

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        console.log("JSON parsed successfully");

        if (!Array.isArray(jsonData)) {
          toast({
            title: "Invalid JSON format",
            description: "The JSON file must contain an array of properties",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }

        // Only validate required fields according to the updated requirements
        const invalidProperties = jsonData.filter(
          (property) => 
            !property.title || 
            !property.description || 
            !property.type || 
            !property.status || 
            typeof property.price !== 'number' ||
            typeof property.size !== 'number'
        );

        if (invalidProperties.length > 0) {
          toast({
            title: `${invalidProperties.length} properties have missing required fields`,
            description: "Each property must have title, description, type, status, price, and size",
            variant: "destructive",
          });
          
          if (invalidProperties.length === jsonData.length) {
            setIsUploading(false);
            return;
          }
        }

        console.log("Properties to import:", jsonData.length);
        console.log("First property example:", JSON.stringify(jsonData[0]));

        toast({
          title: "Processing data",
          description: `Preparing ${jsonData.length - invalidProperties.length} properties for import...`,
        });

        try {
          // Send the data to the API
          const response = await importProperties(jsonData.filter(p => 
            p.title && 
            p.description && 
            p.type && 
            p.status && 
            typeof p.price === 'number' && 
            typeof p.size === 'number'
          ));
          
          console.log("Import response:", response);
          toast({
            title: "Upload successful",
            description: `${
              response.count || response.data?.length || "All"
            } properties imported successfully`,
          });
          queryClient.invalidateQueries({ queryKey: ["adminProperties"] });
        } catch (error: any) {
          console.error("Import API error:", error);
          let errorMessage = "Failed to import properties";

          if (error.response && error.response.data && error.response.data.message) {
            errorMessage += `: ${error.response.data.message}`;
          } else if (error.message) {
            errorMessage += `: ${error.message}`;
          }

          toast({
            title: "Upload failed",
            description: errorMessage,
            variant: "destructive",
          });
        }

        // Reset the file input
        if (event.target) {
          event.target.value = "";
        }
      } catch (error) {
        console.error("JSON parsing error:", error);
        toast({
          title: "Error parsing JSON",
          description: "Please check your file format and try again",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      console.error("FileReader error");
      toast({
        title: "Error reading file",
        description: "There was an error reading the file",
        variant: "destructive",
      });
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Properties Management</h1>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Import Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Upload a JSON file containing property data to import multiple
                properties at once.
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Required fields:</span> title, description, type, status, price, and size. All other fields are optional.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="relative"
                disabled={isUploading}
              >
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <FileJson className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Choose JSON"}
              </Button>
              {isUploading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <PropertiesManagementTab />
    </div>
  );
};

export default Properties;
