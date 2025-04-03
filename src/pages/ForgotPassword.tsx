
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { requestPasswordReset } from '@/services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
      
      toast({
        title: "Request submitted",
        description: "If the email exists in our system, you'll receive password reset instructions.",
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      toast({
        title: "Request failed",
        description: "Unable to process your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-clickprop-bg-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-clickprop-text">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-clickprop-text-secondary">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-clickprop-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSubmitted ? (
            <div className="text-center space-y-6">
              <div className="rounded-full bg-green-50 p-6 mx-auto w-fit">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-green-500"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
              <p className="text-sm text-gray-500">
                We've sent a password reset link to <span className="font-medium">{email}</span>.
                Please check your inbox.
              </p>
              <p className="text-sm text-gray-500">
                Didn't receive an email? Check your spam folder or{' '}
                <button 
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="font-medium text-clickprop-blue hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-sm text-clickprop-text-secondary mt-1">
                  We'll send you a link to reset your password.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Sending reset link...' : 'Reset password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
