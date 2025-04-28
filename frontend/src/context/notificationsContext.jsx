import React, { createContext, useState, useContext, useEffect } from 'react';
import Request from '../components/utils/request';
import { useAuth } from './authContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(Date.now());
  const [newNotifications, setNewNotifications] = useState([]);
  
  const { currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    if (currentUser) {
      fetchUnreadCount();
      
      const interval = setInterval(() => {
        if (Request.isAuthenticated()) {
          checkForNewNotifications();
        }
      }, 30000); 
      
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  const fetchUnreadCount = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await Request.get('/notifications/unread_count/');
      setUnreadCount(response.data.count);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setLoading(false);
    }
  };

  const checkForNewNotifications = async () => {
    if (!currentUser) return;
    
    try {
      const queryParams = new URLSearchParams({
        since: Math.floor(lastFetched / 1000), 
        unread: 'true'
      }).toString();
      
      const response = await Request.get(`/notifications/?${queryParams}`);
      
      const notificationData = response.data.results ? response.data.results : response.data;
      
      if (notificationData && notificationData.length > 0) {
        const shownNotifications = getShownNotifications();
        
        const filteredNotifications = notificationData.filter(
          notification => !shownNotifications.includes(notification.id.toString())
        );
        
        if (filteredNotifications.length > 0) {
          fetchUnreadCount();
          
          markNotificationsAsShown(filteredNotifications.map(n => n.id));
          
          setNewNotifications(filteredNotifications);
        }
      }
      
      setLastFetched(Date.now());
    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  };
  
  const getShownNotifications = () => {
    const shown = sessionStorage.getItem('shown_notifications');
    return shown ? JSON.parse(shown) : [];
  };
  
  const markNotificationsAsShown = (notificationIds) => {
    const shown = getShownNotifications();
    const updatedShown = [...shown, ...notificationIds.map(id => id.toString())];
    sessionStorage.setItem('shown_notifications', JSON.stringify(updatedShown));
  };
  
  const markAsRead = async (notificationId) => {
    if (!currentUser) return false;
    
    try {
      await Request.post(`/notifications/${notificationId}/mark_as_read/`);
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };
  
  const markAllAsRead = async () => {
    if (!currentUser) return false;
    
    try {
      await Request.post('/notifications/mark_all_as_read/');
      
      setUnreadCount(0);
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };
  
  const clearNewNotifications = () => {
    setNewNotifications([]);
  };

  const value = {
    unreadCount,
    loading,
    newNotifications,
    clearNewNotifications,
    markAsRead,
    markAllAsRead,
    fetchUnreadCount,
    checkForNewNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;