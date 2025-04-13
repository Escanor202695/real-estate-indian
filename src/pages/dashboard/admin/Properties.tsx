
import React, { useState } from "react";
import PropertiesManagementTab from "@/components/dashboard/admin/PropertiesManagementTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { uploadPropertiesFile } from "@/services/propertyService";
import { useQueryClient } from "@tanstack/react-query";

const Properties = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/json") {
      toast({
        title: "Invalid file type",
        description: "Please upload a JSON file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    console.log("File selected:", file.name);

    try {
      // Use the new uploadPropertiesFile service
      const response = await uploadPropertiesFile(file);
      
      toast({
        title: "Upload successful",
        description: `${response.count || 0} properties imported successfully`,
      });
      
      // Refresh property list
      queryClient.invalidateQueries({ queryKey: ["adminProperties"] });
    } catch (error: any) {
      console.error("Upload error:", error);
      
      let errorMessage = "Failed to upload properties";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (event.target) {
        event.target.value = "";
      }
    }
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
