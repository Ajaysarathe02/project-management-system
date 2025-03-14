import React, { use } from 'react';

const Profile = ({ user }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <p className="text-gray-400">Name: {user.name}</p>
      <p className="text-gray-400">Email: {user.email}</p>
      
      {/* Add more user details as needed */ }
    </div>
  );
};

export default Profile;