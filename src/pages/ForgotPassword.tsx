
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { requestPasswordReset, resetPassword } from '@/services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await requestPasswordReset(email);
      setStep('otp');
      
      toast({
        title: "OTP sent",
        description: "If the email exists in our system, you'll receive a code to reset your password.",
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
  
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword({
        email,
        otp,
        newPassword,
      });
      
      setStep('success');
      
      toast({
        title: "Password reset successful",
        description: "Your password has been successfully reset and you are now logged in.",
      });
      
      // Wait a bit before redirecting to give the toast time to be shown
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset failed",
        description: "Invalid code or the code has expired. Please try again.",
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
          {step === 'email' && (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
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
                  We'll send you a verification code to reset your password.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Sending code...' : 'Send reset code'}
              </Button>
            </form>
          )}
          
          {step === 'otp' && (
            <form className="space-y-6" onSubmit={handleResetSubmit}>
              <div className="space-y-1">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
                <p className="text-sm text-clickprop-text-secondary mt-1">
                  Enter the 6-digit code sent to your email.
                </p>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-sm font-medium text-clickprop-blue hover:underline"
                >
                  Didn't receive a code? Try again
                </button>
              </div>
            </form>
          )}
          
          {step === 'success' && (
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
              <h3 className="text-lg font-medium text-gray-900">Password reset successful</h3>
              <p className="text-sm text-gray-500">
                Your password has been reset successfully. You are now logged in.
              </p>
              <Button
                className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
