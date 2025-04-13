
import React, { useState, useRef } from "react";
import PropertiesManagementTab from "@/components/dashboard/admin/PropertiesManagementTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { uploadPropertiesFile } from "@/services/propertyService";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const Properties = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setUploadError(null);
    setUploadProgress(0);

    // Validate file type
    if (file.type !== "application/json") {
      setUploadError("Please upload a JSON file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFileSelected(file);
    console.log("File selected:", file.name, "Size:", file.size);
  };

  const handleUpload = async () => {
    if (!fileSelected) {
      setUploadError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Upload the file
      const response = await uploadPropertiesFile(fileSelected);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
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
      
      setUploadError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFileSelected(null);
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  const resetFileUpload = () => {
    setFileSelected(null);
    setUploadError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
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
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <FileJson className="h-4 w-4 mr-2" />
                  Choose JSON
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!fileSelected || isUploading}
                  className="bg-clickprop-blue hover:bg-clickprop-blue-dark"
                >
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {fileSelected && (
              <div className="flex items-center justify-between bg-blue-50 rounded p-2">
                <div className="flex items-center">
                  <FileJson className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm">{fileSelected.name} ({(fileSelected.size / 1024).toFixed(1)} KB)</span>
                </div>
                {!isUploading && (
                  <Button variant="ghost" size="sm" onClick={resetFileUpload}>
                    Clear
                  </Button>
                )}
              </div>
            )}
            
            {uploadProgress > 0 && (
              <div className="w-full">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {uploadProgress === 100 ? 'Complete!' : `${uploadProgress}% - Processing...`}
                </p>
              </div>
            )}
            
            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <PropertiesManagementTab />
    </div>
  );
};

export default Properties;
