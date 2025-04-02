
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, Lock } from 'lucide-react';
import { toast } from 'sonner';

const ChangePasswordTab = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      toast.success('Password updated successfully');
    },
    onError: (error: any) => {
      setSuccess(false);
      setPasswordError(error.response?.data?.message || 'Failed to update password');
      toast.error('Failed to update password');
    }
  });

  const validatePassword = () => {
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    if (!validatePassword()) {
      return;
    }
    
    passwordMutation.mutate({
      currentPassword,
      newPassword
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
            <Check className="h-4 w-4 mr-2 text-green-600" />
            <AlertDescription>
              Your password has been updated successfully.
            </AlertDescription>
          </Alert>
        )}
        
        {passwordError && (
          <Alert className="mb-6 bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
            <AlertDescription>
              {passwordError}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-clickprop-blue hover:bg-clickprop-blue-dark w-full"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordTab;
