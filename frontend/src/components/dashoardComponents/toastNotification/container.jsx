import React, { useState, useEffect } from 'react';
import ToastNotification from './toastNotification';
import './style.css';
import Request from '../../utils/request';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    fetchUnreadNotifications();
  }, []);
  
  const fetchUnreadNotifications = async () => {
    try {
      const response = await Request.get('/notifications/?unread=true');
      const unreadNotifications = response.data;
      
      const shownNotifications = getShownNotifications();
      const newNotifications = unreadNotifications.filter(
        notification => !shownNotifications.includes(notification.id.toString())
      );
      
      if (newNotifications.length > 0) {
        markNotificationsAsShown(newNotifications.map(n => n.id));
        
        newNotifications.forEach(notification => {
          addToast(notification);
        });
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
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
  
  const addToast = (notification) => {
    const toast = {
      id: `toast-${notification.id}-${Date.now()}`,
      notification
    };
    
    setToasts(currentToasts => [...currentToasts, toast]);
  };
  
  const removeToast = (id) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          notification={toast.notification}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};


export default ToastContainer;