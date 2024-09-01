import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Not authenticated');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });

        const result = await response.json();

        if (response.ok) {
          setUser(result);
        } else {
          setError(result.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h1>Welcome, {user.name}</h1>
        <p>Email: {user.email}</p>
        <p>Company: {user.company}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
