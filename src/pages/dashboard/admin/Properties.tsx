
import React, { useState } from 'react';
import PropertiesManagementTab from '@/components/dashboard/admin/PropertiesManagementTab';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileJson, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Properties = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        if (!Array.isArray(jsonData)) {
          toast({
            title: "Invalid JSON format",
            description: "The JSON file must contain an array of properties",
            variant: "destructive"
          });
          setIsUploading(false);
          return;
        }
        
        // Simulate API call with a timeout
        setTimeout(() => {
          toast({
            title: "Upload successful",
            description: `${jsonData.length} properties imported successfully`,
          });
          setIsUploading(false);
          
          // Reset the file input
          if (event.target) {
            event.target.value = '';
          }
        }, 1500);
        
        // In a real application, you would call the importProperties API here
        // importProperties(jsonData)
        //   .then(() => {
        //     toast.success(`${jsonData.length} properties imported successfully`);
        //     queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
        //   })
        //   .catch((error) => {
        //     toast.error(`Failed to import properties: ${error.message}`);
        //   })
        //   .finally(() => {
        //     setIsUploading(false);
        //   });
      } catch (error) {
        toast({
          title: "Error parsing JSON",
          description: "Please check your file format and try again",
          variant: "destructive"
        });
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "There was an error reading the file",
        variant: "destructive"
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
                Upload a JSON file containing property data to import multiple properties at once.
              </p>
              <p className="text-xs text-muted-foreground">
                The JSON file should contain an array of property objects.
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
