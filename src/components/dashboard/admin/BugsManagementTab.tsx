
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import {
  AlertCircle,
  Bug,
  Check,
  Mail,
  MessageCircle,
  X,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  getAllBugReports, 
  updateBugStatus, 
  addBugNote, 
  respondToBugReport,
  type BugReport 
} from '@/services/bugReportService';

const BugsManagementTab = () => {
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRespondOpen, setIsRespondOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [sendCopy, setSendCopy] = useState(false);
  const [notifyResolution, setNotifyResolution] = useState(false);
  const [newNote, setNewNote] = useState('');
  const queryClient = useQueryClient();

  // Fetch bugs data
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['bugReports'],
    queryFn: getAllBugReports
  });

  // Setup mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({id, status}: {id: string, status: string}) => 
      updateBugStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugReports'] });
      toast.success('Status Updated', {
        description: 'Bug status has been updated successfully'
      });
    },
    onError: (error) => {
      console.error('Error updating bug status:', error);
      toast.error('Update Failed', {
        description: 'Could not update bug status'
      });
    }
  });

  const addNoteMutation = useMutation({
    mutationFn: ({id, note}: {id: string, note: string}) => 
      addBugNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugReports'] });
      setNewNote('');
      toast.success('Note Added', {
        description: 'Bug note added successfully'
      });
    },
    onError: (error) => {
      console.error('Error adding bug note:', error);
      toast.error('Failed to Add Note', {
        description: 'An error occurred while adding the note'
      });
    }
  });

  const respondMutation = useMutation({
    mutationFn: ({id, message, markAsResolved}: {id: string, message: string, markAsResolved: boolean}) => 
      respondToBugReport(id, message, markAsResolved),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bugReports'] });
      setIsRespondOpen(false);
      toast.success('Response Sent', {
        description: `Response sent to the reporter successfully`
      });
    },
    onError: (error) => {
      console.error('Error responding to bug:', error);
      toast.error('Response Failed', {
        description: 'Could not send response email. Please check SMTP settings.'
      });
    }
  });

  const bugs = data?.data || [];

  const handleViewBug = (bug: BugReport) => {
    setSelectedBug(bug);
    setIsViewOpen(true);
  };

  const handleRespondToBug = (bug: BugReport) => {
    setSelectedBug(bug);
    setIsRespondOpen(true);
    // Pre-populate a response template
    setResponseMessage(`Dear ${bug.reporterName},\n\nThank you for reporting this issue. We're looking into it and will keep you updated on our progress.\n\nBest regards,\nClickProp Support Team`);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleAddNote = () => {
    if (!selectedBug || !newNote.trim()) return;
    addNoteMutation.mutate({ id: selectedBug._id, note: newNote });
  };

  const handleSendResponse = () => {
    if (!selectedBug || !responseMessage.trim()) return;
    
    respondMutation.mutate({
      id: selectedBug._id,
      message: responseMessage,
      markAsResolved: notifyResolution
    });
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> 
            Error Loading Bug Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">
              There was an error loading the bug reports. Please check your connection and try again.
            </p>
            <Button 
              onClick={() => refetch()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                {bugs.map((bug: BugReport) => (
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
                      disabled={updateStatusMutation.isPending}
                    >
                      Open
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedBug.status === 'in-progress' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(selectedBug._id, 'in-progress')}
                      disabled={updateStatusMutation.isPending}
                    >
                      In Progress
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedBug.status === 'resolved' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(selectedBug._id, 'resolved')}
                      className="bg-green-600 text-white hover:bg-green-700"
                      disabled={updateStatusMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Resolved
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedBug.status === 'closed' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(selectedBug._id, 'closed')}
                      disabled={updateStatusMutation.isPending}
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
                    disabled={!newNote.trim() || addNoteMutation.isPending}
                  >
                    {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
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
                  <p className="text-sm text-gray-600">
                    {selectedBug.description.length > 100 
                      ? `${selectedBug.description.substring(0, 100)}...` 
                      : selectedBug.description
                    }
                  </p>
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
                  disabled={!responseMessage.trim() || respondMutation.isPending}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  {respondMutation.isPending ? 'Sending...' : 'Send Response'}
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
