import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Request from './request';
import "./style.css";


const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (Request.isAuthenticated()) {
          // Verify token by making a request to the user endpoint
          const response = await Request.get('/auth/user/');
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            // If status is not 200, token might be invalid
            Request.logout();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        Request.logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;