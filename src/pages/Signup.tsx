
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { register as registerUser } from '@/services/authService';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Define validation schema using Zod
const signupSchema = z.object({
  firstName: z.string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name cannot exceed 50 characters" }),
  lastName: z.string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name cannot exceed 50 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[0-9+-\s()]+$/, { message: "Please enter a valid phone number" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms of Service and Privacy Policy" })
  })
});

type SignupFormValues = z.infer<typeof signupSchema>;

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" })
});

type OtpFormValues = z.infer<typeof otpSchema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [userData, setUserData] = useState<SignupFormValues | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Initialize react-hook-form with zod validation
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      agreeTerms: undefined as unknown as true
    }
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      const signupData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        phone: data.phone
      };
      
      // Store user data for later use with OTP
      setUserData(data);
      
      // Send registration data to get OTP
      await registerUser({ ...signupData, sendOtp: true });
      
      setShowOtpForm(true);
      
      toast({
        description: "Please check your email for the verification code.",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyOtp = async () => {
    if (!userData) return;
    
    setIsLoading(true);
    
    try {
      const signupData = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        otp: otpValue
      };
      
      // Complete registration with OTP
      const response = await registerUser(signupData);
      
      toast({
        title: "Account created!",
        description: "Welcome to ClickProp! Your account has been created successfully.",
      });
      
      // Redirect to the page they came from or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification failed",
        description: "Invalid verification code. Please try again.",
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-clickprop-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-clickprop-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!showOtpForm ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Choose a strong password" {...field} />
                      </FormControl>
                      <p className="text-xs text-clickprop-text-secondary mt-1">
                        Password must be at least 8 characters and contain a number and a special character.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to the{' '}
                          <a href="#" className="text-clickprop-blue hover:underline">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-clickprop-blue hover:underline">
                            Privacy Policy
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Create Account'}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-clickprop-text">Verify your email</h3>
                <p className="mt-1 text-sm text-clickprop-text-secondary">
                  We've sent a 6-digit verification code to your email.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-clickprop-text">
                    Enter verification code
                  </label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <div className="text-sm text-center">
                  <span className="text-clickprop-text-secondary">Didn't receive it?</span>{' '}
                  <button type="button" className="text-clickprop-blue hover:underline" onClick={() => onSubmit(userData!)}>
                    Resend code
                  </button>
                </div>
                
                <Button
                  type="button"
                  className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
                  onClick={verifyOtp}
                  disabled={isLoading || otpValue.length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify and Continue'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowOtpForm(false)}
                  disabled={isLoading}
                >
                  Back to Sign Up
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
