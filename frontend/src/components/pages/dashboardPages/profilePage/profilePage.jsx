import React, { useState, useEffect } from 'react';
import Request from '../../../utils/request';


import './style.css';
import { useNotifications } from '../../../../context/notificationsContext';
import { useAuth } from '../../../../context/authContext';

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" className="profile-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" className="profile-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 2.00004C11.5085 1.82492 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4194 1.44775 12.6667 1.44775C12.9139 1.44775 13.1595 1.49653 13.3883 1.59129C13.617 1.68605 13.8249 1.82492 14 2.00004C14.1751 2.17516 14.314 2.38297 14.4087 2.61175C14.5035 2.84053 14.5523 3.08612 14.5523 3.33337C14.5523 3.58063 14.5035 3.82621 14.4087 4.055C14.314 4.28378 14.1751 4.49159 14 4.66671L5 13.6667L2 14.6667L3 11.6667L12 2.66671L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 1.66669C11.7144 1.66669 10.9613 1.97399 10.4049 2.53035C9.84857 3.08669 9.54126 3.8398 9.54126 4.62536C9.54126 5.89669 10.2413 7.01936 11.2913 7.58336L9.375 12.5H5.41667C4.86413 12.5 4.33424 12.7195 3.94542 13.1083C3.5566 13.4971 3.33709 14.027 3.33709 14.5795C3.33709 15.132 3.5566 15.6619 3.94542 16.0508C4.33424 16.4396 4.86413 16.6591 5.41667 16.6591H16.6667V1.66669H12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.5833 5.41669C15.1356 5.41669 15.5833 4.96897 15.5833 4.41669C15.5833 3.86441 15.1356 3.41669 14.5833 3.41669C14.031 3.41669 13.5833 3.86441 13.5833 4.41669C13.5833 4.96897 14.031 5.41669 14.5833 5.41669Z" fill="currentColor"/>
  </svg>
);

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const { newNotifications, setNewNotifications } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // For password change form
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.first_name || '',
        lastName: currentUser.last_name || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form when canceling edit
    if (isEditing) {
      setProfileData({
        firstName: currentUser.first_name || '',
        lastName: currentUser.last_name || '',
        email: currentUser.email || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName
      });
      
      setIsEditing(false);
      
      // Add a notification - using your toast system
      setNewNotifications([{
        id: Date.now(),
        title: 'Profile Updated',
        message: 'Your profile information has been updated successfully.',
        type: 'system'
      }]);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      await Request.post('/auth/change-password/', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });
      
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Add a notification - using your toast system
      setNewNotifications([{
        id: Date.now(),
        title: 'Password Changed',
        message: 'Your password has been changed successfully.',
        type: 'system'
      }]);
      
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-title">
          <ProfileIcon />
          <h2>My Profile</h2>
        </div>
        <p className="profile-subtitle">
          Manage your personal information and security
        </p>
      </div>

      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Personal Information</h3>
            <button 
              className="edit-profile-button"
              onClick={handleEditToggle}
              disabled={isLoading}
            >
              {isEditing ? 'Cancel' : (
                <>
                  <EditIcon />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>
          
          <div className="profile-card-content">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    className="form-control"
                    disabled
                  />
                  <small className="form-text">Email cannot be changed</small>
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-profile-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="profile-info-group">
                  <div className="profile-info-label">Name</div>
                  <div className="profile-info-value">
                    {`${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`}
                  </div>
                </div>
                
                <div className="profile-info-group">
                  <div className="profile-info-label">Email</div>
                  <div className="profile-info-value">{currentUser?.email}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Security</h3>
            <button 
              className="change-password-button"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              disabled={isLoading}
            >
              {isChangingPassword ? 'Cancel' : (
                <>
                  <KeyIcon />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
          
          <div className="profile-card-content">
            {isChangingPassword ? (
              <form onSubmit={handlePasswordUpdate}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                      minLength="8"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                      minLength="8"
                    />
                  </div>
                </div>
                
                <div className="password-requirements">
                  <h4>Password Requirements:</h4>
                  <ul>
                    <li>At least 8 characters long</li>
                    <li>Contains at least one uppercase letter</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-password-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="security-info">
                <div className="security-info-item">
                  <div className="security-info-label">Password</div>
                  <div className="security-info-value">••••••••</div>
                </div>
                
                <p className="security-message">
                  Protect your account with a strong password. We recommend using a password manager and changing your password regularly.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Account Information</h3>
          </div>
          
          <div className="profile-card-content">
            <div className="account-info">
              <div className="account-info-item">
                <div className="account-info-label">Member Since</div>
                <div className="account-info-value">
                  {currentUser?.created_at ? 
                    new Date(currentUser.created_at).toLocaleDateString() : 
                    'Unknown'}
                </div>
              </div>
              
              <div className="account-info-item">
                <div className="account-info-label">Last Login</div>
                <div className="account-info-value">
                  {currentUser?.last_login ? 
                    new Date(currentUser.last_login).toLocaleString() : 
                    'Unknown'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;