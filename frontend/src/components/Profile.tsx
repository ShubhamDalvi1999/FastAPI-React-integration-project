import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api';

interface UserProfile {
  username: string;
  email: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserProfile(token);
        setProfile(userData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  
  if (error) return <div>Error: {error}</div>;
  
  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
};

export default Profile; 