
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ProfileTab from '@/components/dashboard/user/ProfileTab';

const Profile = () => {
  const user = useOutletContext<any>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <ProfileTab user={user} />
    </div>
  );
};

export default Profile;
