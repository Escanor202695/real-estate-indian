
import api from './api';

// Types
export type BugReportFormData = {
  title: string;
  description: string;
  steps?: string;
  severity: 'low' | 'medium' | 'high';
  reporterName: string;
  reporterEmail: string;
};

export type BugReport = {
  _id: string;
  title: string;
  description: string;
  steps?: string;
  severity: 'low' | 'medium' | 'high';
  reporterName: string;
  reporterEmail: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  notes: string;
  createdAt: string;
  resolvedAt: string | null;
};

// Submit a bug report
export const submitBugReport = async (bugData: BugReportFormData): Promise<{ success: boolean; data?: BugReport }> => {
  try {
    const response = await api.post('/bug-reports', bugData);
    return response.data;
  } catch (error) {
    console.error('Error submitting bug report:', error);
    throw error;
  }
};

// Admin: Get all bug reports
export const getAllBugReports = async (): Promise<{ success: boolean; data: BugReport[] }> => {
  try {
    const response = await api.get('/bug-reports');
    return response.data;
  } catch (error) {
    console.error('Error fetching bug reports:', error);
    throw error;
  }
};

// Admin: Update bug status
export const updateBugStatus = async (bugId: string, status: string): Promise<{ success: boolean; data: BugReport }> => {
  try {
    const response = await api.put(`/bug-reports/${bugId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating bug status:', error);
    throw error;
  }
};

// Admin: Add a note to a bug
export const addBugNote = async (bugId: string, note: string): Promise<{ success: boolean; data: BugReport }> => {
  try {
    const response = await api.post(`/bug-reports/${bugId}/notes`, { note });
    return response.data;
  } catch (error) {
    console.error('Error adding note to bug:', error);
    throw error;
  }
};

// Admin: Respond to a bug report via email
export const respondToBugReport = async (
  bugId: string, 
  message: string, 
  markAsResolved: boolean = false
): Promise<{ success: boolean; data: BugReport }> => {
  try {
    const response = await api.post(`/bug-reports/${bugId}/respond`, { 
      message, 
      markAsResolved 
    });
    return response.data;
  } catch (error) {
    console.error('Error responding to bug report:', error);
    throw error;
  }
};
