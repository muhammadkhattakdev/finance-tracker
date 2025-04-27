import React, { useState, useEffect } from 'react';
import './style.css';

const ToastNotification = ({ notification, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    // Automatically close toast after 6 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
      
      // Give time for exit animation before removing
      setTimeout(() => {
        onClose();
      }, 300);
    }, 6000);
    
    // Clear timer on unmount
    return () => clearTimeout(timer);
  }, [onClose]);
  
  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'budget_exceed':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 9L9 15" stroke="#F44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9L15 15" stroke="#F44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'budget_near':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'system':
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16V12" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H12.01" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  // Handle manual close
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  return (
    <div className={`toast-notification ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <h3 className="toast-title">{notification.title}</h3>
        <p className="toast-message">{notification.message}</p>
      </div>
      <button className="toast-close" onClick={handleClose}>×</button>
      <div className="toast-progress-bar"></div>
    </div>
  );
};

export default ToastNotification;