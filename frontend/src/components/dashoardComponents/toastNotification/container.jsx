import React, { useState, useEffect } from 'react';
import ToastNotification from './toastNotification';
import './style.css';
import { useNotifications } from '../../../context/notificationsContext';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  const { newNotifications, clearNewNotifications } = useNotifications();
  
  useEffect(() => {
    if (newNotifications.length > 0) {
      newNotifications.forEach(notification => {
        addToast(notification);
      });
      
      clearNewNotifications();
    }
  }, [newNotifications, clearNewNotifications]);
  
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