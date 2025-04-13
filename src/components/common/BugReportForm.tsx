
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BugIcon } from 'lucide-react';
import { toast } from 'sonner';
import { isLoggedIn } from '@/services/authService';
import { submitBugReport, BugReportFormData } from '@/services/bugReportService';
import { useNavigate } from 'react-router-dom';

// Define the schema for bug report form
const bugReportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  steps: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high']),
  reporterName: z.string().min(2, 'Please provide your name'),
  reporterEmail: z.string().email('Please provide a valid email address'),
});

type BugReportFormValues = z.infer<typeof bugReportSchema>;

const BugReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isUserLoggedIn = isLoggedIn();
  const navigate = useNavigate();

  const form = useForm<BugReportFormValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      title: '',
      description: '',
      steps: '',
      severity: 'medium',
      reporterName: '',
      reporterEmail: '',
    },
  });

  const onSubmit = async (data: BugReportFormValues) => {
    try {
      setIsSubmitting(true);
      // Cast the data to BugReportFormData to ensure it matches the required type
      // This is safe because our schema validation already ensures all required fields are present
      const bugReportData: BugReportFormData = {
        title: data.title,
        description: data.description,
        steps: data.steps || '',
        severity: data.severity as 'low' | 'medium' | 'high',
        reporterName: data.reporterName,
        reporterEmail: data.reporterEmail,
      };
      
      await submitBugReport(bugReportData);
      form.reset();
      toast.success('Bug report submitted', {
        description: 'Thank you for helping us improve ClickProp.'
      });
      // Redirect to home page after successful submission
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error submitting bug report:', error);
      toast.error('Error submitting report', {
        description: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BugIcon className="h-5 w-5 text-red-500" />
          <CardTitle>Report a Bug</CardTitle>
        </div>
        <CardDescription>
          Help us improve ClickProp by reporting any issues you encounter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bug Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Search not working'" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short title describing the issue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bug Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what happened and what you expected to happen..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Steps to Reproduce (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="1. Go to the properties page
2. Enter a search term
3. Click search..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Steps to help us reproduce the issue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                      <SelectItem value="medium">Medium - Affects functionality</SelectItem>
                      <SelectItem value="high">High - Critical issue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How much does this issue impact your experience?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reporterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reporterEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      So we can follow up if necessary
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-clickprop-blue hover:bg-clickprop-blue-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BugReportForm;
