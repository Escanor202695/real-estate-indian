
import React from 'react';
import BugsManagementTab from '@/components/dashboard/admin/BugsManagementTab';

const Bugs = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bug Reports</h1>
      <BugsManagementTab />
    </div>
  );
};

export default Bugs;
