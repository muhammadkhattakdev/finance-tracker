import React, { useState, useEffect } from 'react';
import './style.css';
import Request from '../../../utils/request';
import { useNotifications } from '../../../../context/notificationsContext';

const NotificationIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      className="notification-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      className="notification-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const CheckmarkIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      <path 
        d="M16.6667 5L7.50004 14.1667L3.33337 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

const BudgetAlertIcon = () => (
  <svg 
    width="24" 
    height="24" 
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
    width="24" 
    height="24" 
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
    width="24" 
    height="24" 
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

const WeeklySummaryIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8 6H21" 
      stroke="#4CAF50" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M8 12H21" 
      stroke="#4CAF50" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M8 18H21" 
      stroke="#4CAF50" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 6H3.01" 
      stroke="#4CAF50" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 12H3.01" 
      stroke="#4CAF50" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 18H3.01" 
      stroke="#4CAF50" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const NotificationItem = ({ notification, onMarkAsRead }) => {
  let icon;
  
  switch (notification.type) {
    case 'budget_exceed':
      icon = <BudgetExceedIcon />;
      break;
    case 'budget_near':
      icon = <BudgetAlertIcon />;
      break;
    case 'weekly_summary':
      icon = <WeeklySummaryIcon />;
      break;
    case 'system':
    default:
      icon = <SystemNotificationIcon />;
      break;
  }

  return (
    <div className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}>
      <div className="notification-icon">
        {icon}
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <h3 className="notification-title">{notification.title}</h3>
          <span className="notification-time">{notification.time_ago}</span>
        </div>
        <p className="notification-message">{notification.message}</p>
      </div>
      {!notification.is_read && (
        <button 
          className="mark-read-button" 
          onClick={() => onMarkAsRead(notification.id)}
          title="Mark as read"
        >
          <CheckmarkIcon />
        </button>
      )}
    </div>
  );
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'read'
  
  // Use the notifications context instead of local state for unread count
  const { 
    unreadCount, 
    loading,
    markAsRead, 
    markAllAsRead,
    fetchUnreadCount
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await Request.get('/notifications/');
      setNotifications(response.data);
      setError(null);
      
      // Update the unread count in the context
      fetchUnreadCount();
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    const success = await markAsRead(notificationId);
    
    if (success) {
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    
    if (success) {
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, is_read: true }))
      );
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.is_read;
    if (activeTab === 'read') return notification.is_read;
    return true;
  });

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="notifications-title">
          <NotificationIcon />
          <h2>Notifications</h2>
        </div>
        <p className="notifications-subtitle">
          Stay informed about your finances and budget status
        </p>
      </div>

      {error && (
        <div className="notifications-error">
          {error}
        </div>
      )}

      <div className="notifications-actions">
        <div className="notifications-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread 
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </button>
          <button 
            className={`tab-button ${activeTab === 'read' ? 'active' : ''}`}
            onClick={() => setActiveTab('read')}
          >
            Read
          </button>
        </div>
        
        {unreadCount > 0 && (
          <button 
            className="mark-all-read-button"
            onClick={handleMarkAllAsRead}
          >
            <CheckmarkIcon />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      <div className="notifications-content">
        {isLoading ? (
          <div className="notifications-loading">
            <div className="spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <div className="no-notifications-icon">
              <NotificationIcon />
            </div>
            <h3>No notifications</h3>
            <p>
              {activeTab === 'all' 
                ? "You don't have any notifications yet." 
                : activeTab === 'unread' 
                  ? "You've read all your notifications." 
                  : "You don't have any read notifications."}
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;