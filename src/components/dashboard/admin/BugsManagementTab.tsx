
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AlertCircle, Bug, Check, Mail, MessageCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { sendEmail } from '@/services/emailService';

// Mock API functions - replace these with actual API calls
const getBugs = async () => {
  // Simulate API call
  return {
    success: true,
    data: [
      {
        _id: '1',
        title: 'Search not working properly',
        description: 'When I search for properties in Delhi, no results are shown even though there should be some.',
        steps: '1. Go to homepage\n2. Enter "Delhi" in search\n3. Click search button',
        severity: 'high',
        reporterName: 'John Doe',
        reporterEmail: 'john@example.com',
        status: 'open',
        createdAt: new Date().toISOString(),
        resolvedAt: null,
        notes: ''
      },
      {
        _id: '2',
        title: 'Images not loading',
        description: 'Property images are not loading on the property details page.',
        steps: 'Click on any property to view details',
        severity: 'medium',
        reporterName: 'Jane Smith',
        reporterEmail: 'jane@example.com',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: null,
        notes: 'Working on a fix for the image loading issue'
      },
      {
        _id: '3',
        title: 'Login button not responding',
        description: 'Sometimes the login button does not respond when clicked.',
        steps: 'Try to log in multiple times',
        severity: 'low',
        reporterName: 'Bob Johnson',
        reporterEmail: 'bob@example.com',
        status: 'resolved',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Fixed in latest update'
      }
    ]
  };
};

const updateBugStatus = async (id: string, status: string) => {
  // Simulate API call
  console.log(`Updating bug ${id} to status: ${status}`);
  return { success: true };
};

const addBugNote = async (id: string, note: string) => {
  // Simulate API call
  console.log(`Adding note to bug ${id}: ${note}`);
  return { success: true };
};

type Bug = {
  _id: string;
  title: string;
  description: string;
  steps?: string;
  severity: 'low' | 'medium' | 'high';
  reporterName: string;
  reporterEmail: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  resolvedAt: string | null;
  notes: string;
};

const BugsManagementTab = () => {
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRespondOpen, setIsRespondOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [sendCopy, setSendCopy] = useState(false);
  const [notifyResolution, setNotifyResolution] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Fetch bugs data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['bugs'],
    queryFn: getBugs
  });

  const bugs = data?.data || [];

  const handleViewBug = (bug: Bug) => {
    setSelectedBug(bug);
    setIsViewOpen(true);
  };

  const handleRespondToBug = (bug: Bug) => {
    setSelectedBug(bug);
    setIsRespondOpen(true);
    // Pre-populate a response template
    setResponseMessage(`Dear ${bug.reporterName},\n\nThank you for reporting this issue. We're looking into it and will keep you updated on our progress.\n\nBest regards,\nClickProp Support Team`);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateBugStatus(id, newStatus);
      refetch();
      toast({
        title: 'Status Updated',
        description: `Bug status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update bug status',
        variant: 'destructive',
      });
    }
  };

  const handleAddNote = async () => {
    if (!selectedBug || !newNote.trim()) return;
    
    try {
      await addBugNote(selectedBug._id, newNote);
      refetch();
      setNewNote('');
      toast({
        title: 'Note Added',
        description: 'Bug note added successfully',
      });
    } catch (error) {
      toast({
        title: 'Failed to Add Note',
        description: 'An error occurred while adding the note',
        variant: 'destructive',
      });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedBug || !responseMessage.trim()) return;
    
    try {
      // Send email to the reporter
      await sendEmail({
        to: selectedBug.reporterEmail,
        subject: `Re: Bug Report - ${selectedBug.title}`,
        body: responseMessage,
        isHtml: false
      });
      
      // Send a copy to admin if checked
      if (sendCopy) {
        // This would typically use the logged-in admin's email
        await sendEmail({
          to: 'admin@clickprop.com',
          subject: `Copy: Response to Bug Report - ${selectedBug.title}`,
          body: `Response sent to ${selectedBug.reporterName} (${selectedBug.reporterEmail}):\n\n${responseMessage}`,
          isHtml: false
        });
      }
      
      toast({
        title: 'Response Sent',
        description: `Response sent to ${selectedBug.reporterEmail}`,
      });
      
      setIsRespondOpen(false);
      
      // If notification for resolution is requested
      if (notifyResolution) {
        await updateBugStatus(selectedBug._id, 'resolved');
        refetch();
      }
    } catch (error) {
      toast({
        title: 'Failed to Send',
        description: 'An error occurred while sending the response',
        variant: 'destructive',
      });
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-300">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300">Open</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-300">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" /> 
              Bug Reports Management
            </CardTitle>
            <CardDescription>
              View and manage user-reported bugs and issues
            </CardDescription>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-clickprop-blue rounded-full border-t-transparent"></div>
          </div>
        ) : bugs.length === 0 ? (
          <div className="text-center py-8">
            <Bug className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No bug reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no reported bugs in the system.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>List of reported bugs and issues</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead className="text-center">Severity</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Reported On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bugs.map((bug: Bug) => (
                  <TableRow key={bug._id}>
                    <TableCell className="font-medium">{bug.title}</TableCell>
                    <TableCell>{bug.reporterName}</TableCell>
                    <TableCell className="text-center">{getSeverityBadge(bug.severity)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(bug.status)}</TableCell>
                    <TableCell>{format(new Date(bug.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewBug(bug)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                          onClick={() => handleRespondToBug(bug)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Respond
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* View Bug Details Dialog */}
        {selectedBug && (
          <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Bug Report Details
                </DialogTitle>
                <DialogDescription>
                  Reported by {selectedBug.reporterName} on {format(new Date(selectedBug.createdAt), 'PPP')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{selectedBug.title}</h3>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(selectedBug.severity)}
                      {getStatusBadge(selectedBug.status)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="whitespace-pre-wrap">{selectedBug.description}</p>
                  </div>
                </div>
                
                {selectedBug.steps && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Steps to Reproduce</h4>
                    <p className="whitespace-pre-wrap">{selectedBug.steps}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <p><strong>Name:</strong> {selectedBug.reporterName}</p>
                  <p><strong>Email:</strong> {selectedBug.reporterEmail}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant={selectedBug.status === 'open' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(selectedBug._id, 'open')}
                    >
                      Open
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedBug.status === 'in-progress' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(selectedBug._id, 'in-progress')}
                    >
                      In Progress
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedBug.status === 'resolved' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(selectedBug._id, 'resolved')}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Resolved
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedBug.status === 'closed' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(selectedBug._id, 'closed')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Closed
                    </Button>
                  </div>
                </div>
                
                {selectedBug.notes && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="whitespace-pre-wrap">{selectedBug.notes}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Add Note</h4>
                  <Textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add internal notes about this bug..."
                    className="mb-2"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setIsViewOpen(false);
                    handleRespondToBug(selectedBug);
                  }}
                  className="bg-clickprop-blue hover:bg-clickprop-blue-dark"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Respond
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Respond to Bug Dialog */}
        {selectedBug && (
          <Dialog open={isRespondOpen} onOpenChange={setIsRespondOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Respond to Bug Report
                </DialogTitle>
                <DialogDescription>
                  Send an email to {selectedBug.reporterName} regarding their bug report
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium mb-2">Bug: {selectedBug.title}</h4>
                  <p className="text-sm text-gray-600">{selectedBug.description.substring(0, 100)}...</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      value={`To: ${selectedBug.reporterEmail}`} 
                      disabled 
                      className="bg-gray-50"
                    />
                    <Input 
                      value={`Subject: Re: Bug Report - ${selectedBug.title}`} 
                      disabled 
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <Textarea 
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Write your response..."
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="send-copy" 
                      checked={sendCopy}
                      onCheckedChange={(checked) => setSendCopy(!!checked)}
                    />
                    <Label htmlFor="send-copy">
                      Send a copy to myself
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="mark-resolved" 
                      checked={notifyResolution}
                      onCheckedChange={(checked) => setNotifyResolution(!!checked)}
                    />
                    <Label htmlFor="mark-resolved" className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-green-600" />
                      Mark bug as resolved after sending
                    </Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRespondOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendResponse}
                  className="bg-clickprop-blue hover:bg-clickprop-blue-dark"
                  disabled={!responseMessage.trim()}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Send Response
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default BugsManagementTab;
