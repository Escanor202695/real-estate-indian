
import React from 'react';
import SavedSearchesTab from '@/components/dashboard/user/SavedSearchesTab';

const SavedSearches = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Saved Searches</h1>
      <SavedSearchesTab />
    </div>
  );
};

export default SavedSearches;
