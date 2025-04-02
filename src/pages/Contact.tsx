
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MessageSquare, Mail, Send, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  isBugReport: z.boolean().default(false),
});

type ContactFormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      isBugReport: false,
    },
  });

  // Check if we're here to report a bug
  const isBugReport = window.location.search.includes('bug=true');
  
  React.useEffect(() => {
    if (isBugReport) {
      form.setValue('subject', 'Bug Report: ');
      form.setValue('isBugReport', true);
    }
  }, [isBugReport, form]);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // In a real app, we would send this data to an API
      console.log('Form submitted:', data);
      
      // For demo purposes, we'll just show a success message
      toast.success(
        data.isBugReport ? 'Bug report submitted successfully!' : 'Message sent successfully!'
      );
      
      // Reset the form
      form.reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex items-center mb-6">
          {isBugReport ? (
            <Bug className="mr-3 h-6 w-6 text-clickprop-blue" />
          ) : (
            <MessageSquare className="mr-3 h-6 w-6 text-clickprop-blue" />
          )}
          <h1 className="text-2xl font-bold">
            {isBugReport ? 'Report a Bug' : 'Contact Us'}
          </h1>
        </div>
        
        <p className="text-gray-600 mb-8">
          {isBugReport 
            ? 'Found a bug in the platform? Please describe it in detail below and we\'ll fix it as soon as possible.'
            : 'Have questions or feedback? We\'d love to hear from you. Fill out the form below and we\'ll get back to you shortly.'
          }
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Subject of your message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide details..." 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full md:w-auto">
              <Send className="mr-2 h-4 w-4" />
              {isBugReport ? 'Submit Report' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Contact;
