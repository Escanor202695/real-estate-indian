
import React from 'react';
import BugReportForm from '@/components/common/BugReportForm';

const ReportBug = () => {
  return (
    <div className="bg-white py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Report a Bug</h1>
        <BugReportForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Thank you for helping us improve ClickProp. Your feedback is valuable to us!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportBug;
