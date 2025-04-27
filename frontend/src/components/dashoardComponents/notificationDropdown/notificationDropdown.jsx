import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Request from '../../utils/request';
import './style.css';

const NotificationBellIcon = ({ count }) => (
  <div className="notification-bell">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        className="notification-bell-path"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        className="notification-bell-path"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {count > 0 && <span className="notification-count">{count}</span>}
  </div>
);

const BudgetAlertIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
      stroke="#FF9800" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 8V12" 
      stroke="#FF9800" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 16H12.01" 
      stroke="#FF9800" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const BudgetExceedIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
      stroke="#F44336" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M15 9L9 15" 
      stroke="#F44336" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M9 9L15 15" 
      stroke="#F44336" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const SystemNotificationIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
      stroke="#2196F3" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 16V12" 
      stroke="#2196F3" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 8H12.01" 
      stroke="#2196F3" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// NotificationDropdown Component
const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch unread count on initial load
    fetchUnreadCount();
    
    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60000); // Check every minute
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Handle clicks outside of dropdown to close it
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const fetchUnreadCount = async () => {
    try {
      const response = await Request.get('/notifications/unread_count/');
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };
  
  const fetchNotifications = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await Request.get('/notifications/?limit=5');
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      fetchNotifications();
      
      // Position the dropdown on next render cycle
      setTimeout(() => {
        positionDropdown();
      }, 0);
    }
  };
  
  const positionDropdown = () => {
    if (!buttonRef.current || !dropdownRef.current) return;
    
    const button = buttonRef.current;
    const dropdown = dropdownRef.current.querySelector('.notification-dropdown');
    
    if (!dropdown) return;
    
    const buttonRect = button.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    const isCollapsed = document.querySelector('.sidebar.collapsed') !== null;
    
    // Create dropdown styles for portal root
    const portal = document.getElementById('portal-root') || document.createElement('div');
    if (!document.getElementById('portal-root')) {
      portal.id = 'portal-root';
      document.body.appendChild(portal);
    }
    
    // Set dropdown styles
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${buttonRect.bottom + 10}px`;
    
    // Calculate left position
    if (isMobile) {
      dropdown.style.left = `${Math.max(20, buttonRect.left - 180)}px`;
      dropdown.style.width = '300px';
    } else if (isCollapsed) {
      dropdown.style.left = `${Math.max(20, buttonRect.left - 280)}px`;
    } else {
      dropdown.style.left = `${Math.max(20, buttonRect.left - 250)}px`;
    }
    
    // Ensure it's not going off-screen on the right
    const rightEdge = parseFloat(dropdown.style.left) + dropdown.offsetWidth;
    if (rightEdge > window.innerWidth - 20) {
      dropdown.style.left = `${window.innerWidth - dropdown.offsetWidth - 20}px`;
    }
  };
  
  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    
    try {
      await Request.post(`/notifications/${notificationId}/mark_as_read/`);
      
      // Update the notification in the list
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const handleMarkAllAsRead = async (event) => {
    event.stopPropagation();
    
    try {
      await Request.post('/notifications/mark_all_as_read/');
      
      // Update all notifications as read
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, is_read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };
  
  const navigateToNotifications = () => {
    setIsOpen(false);
    navigate('/dashboard/notifications');
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'budget_exceed':
        return <BudgetExceedIcon />;
      case 'budget_near':
        return <BudgetAlertIcon />;
      case 'system':
      default:
        return <SystemNotificationIcon />;
    }
  };
  
  return (
    <div className="notification-dropdown-container" ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className={`notification-button ${unreadCount > 0 ? 'has-notifications' : ''}`} 
        onClick={toggleDropdown}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <NotificationBellIcon count={unreadCount} />
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notification-dropdown-content">
            {isLoading ? (
              <div className="dropdown-loading">
                <div className="dropdown-spinner"></div>
                <p>Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="no-dropdown-notifications">
                <p>No notifications</p>
              </div>
            ) : (
              <div className="dropdown-notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`dropdown-notification-item ${notification.is_read ? 'read' : 'unread'}`}
                    onClick={() => handleMarkAsRead(notification.id, { stopPropagation: () => {} })}
                  >
                    <div className="dropdown-notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="dropdown-notification-content">
                      <div className="dropdown-notification-title">{notification.title}</div>
                      <div className="dropdown-notification-time">{notification.time_ago}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="notification-dropdown-footer">
            <button 
              className="view-all-button"
              onClick={navigateToNotifications}
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;