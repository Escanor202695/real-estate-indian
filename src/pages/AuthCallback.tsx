
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const error = params.get('error');

    if (error) {
      toast({
        title: "Authentication failed",
        description: "Could not authenticate with Google. Please try again.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (token && userStr) {
      try {
        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', userStr);
        
        toast({
          title: "Authentication successful",
          description: "Welcome to ClickProp!",
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication failed",
          description: "Could not process authentication data. Please try again.",
          variant: "destructive",
        });
        navigate('/login');
      }
    } else {
      toast({
        title: "Authentication failed",
        description: "Missing authentication data. Please try again.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-clickprop-bg-gray flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-clickprop-text">
          Processing authentication...
        </h2>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clickprop-blue"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
