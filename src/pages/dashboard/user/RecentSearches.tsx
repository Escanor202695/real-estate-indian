
import React from 'react';
import RecentSearchesTab from '@/components/dashboard/user/RecentSearchesTab';

const RecentSearches = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recent Searches</h1>
      <RecentSearchesTab />
    </div>
  );
};

export default RecentSearches;
