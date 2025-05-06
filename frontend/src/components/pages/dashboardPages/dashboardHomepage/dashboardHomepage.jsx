import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './style.css';

import Request from '../../../utils/request';
import { useNotifications } from '../../../../context/notificationsContext';
import BudgetSummaryStats from '../../../dashoardComponents/budgetSummaryStats/budgetSummary';
import CategoryPieChart from '../../../dashoardComponents/budgetPieChart/budgetPieChart';
import DailyExpenseChart from '../../../dashoardComponents/expensesLineChart/lineChart';

const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3H3V10H10V3Z" className="dashboard-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 3H14V10H21V3Z" className="dashboard-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 14H14V21H21V14Z" className="dashboard-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14H3V21H10V14Z" className="dashboard-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotificationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 6C13.5 4.80653 13.0259 3.66193 12.182 2.81802C11.3381 1.97411 10.1935 1.5 9 1.5C7.80653 1.5 6.66193 1.97411 5.81802 2.81802C4.97411 3.66193 4.5 4.80653 4.5 6C4.5 11.25 2.25 12.75 2.25 12.75H15.75C15.75 12.75 13.5 11.25 13.5 6Z" className="notification-icon-path" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.2975 15.75C10.1657 15.9773 9.9764 16.166 9.74868 16.2971C9.52097 16.4283 9.2628 16.4973 9.00001 16.4973C8.73723 16.4973 8.47906 16.4283 8.25134 16.2971C8.02363 16.166 7.83437 15.9773 7.70251 15.75" className="notification-icon-path" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BudgetAlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#FF9800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 6V9" stroke="#FF9800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12H9.0075" stroke="#FF9800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BudgetExceedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#F44336" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.25 6.75L6.75 11.25" stroke="#F44336" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.75 6.75L11.25 11.25" stroke="#F44336" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SystemNotificationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12V9" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 6H9.0075" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WeeklySummaryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4.5H15.75" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 9H15.75" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 13.5H15.75" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.25 4.5H2.2575" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.25 9H2.2575" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.25 13.5H2.2575" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExpenseItem = ({ expense }) => {
  const date = new Date(expense.date);
  const formattedDate = format(date, 'dd MMM');

  return (
    <div className="expense-item">
      <div className="expense-item-icon" style={{ backgroundColor: `${expense.category_color}20`, color: expense.category_color }}>
        {expense.category_icon}
      </div>
      <div className="expense-item-content">
        <div className="expense-item-title">{expense.title}</div>
        <div className="expense-item-category">{expense.category_name}</div>
      </div>
      <div className="expense-item-right">
        <div className="expense-item-amount">£{parseFloat(expense.amount).toFixed(2)}</div>
        <div className="expense-item-date">{formattedDate}</div>
      </div>
    </div>
  );
};

const NotificationItem = ({ notification }) => {
  // Format date - check if notification.created_at exists, otherwise fallback to current date
  const date = notification.created_at ? new Date(notification.created_at) : 
               notification.createdAt ? new Date(notification.createdAt) : 
               new Date();
  const formattedDate = format(date, 'dd MMM');
  
  // Get icon based on notification type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'budget_exceed':
        return <BudgetExceedIcon />;
      case 'budget_near':
        return <BudgetAlertIcon />;
      case 'weekly_summary':
        return <WeeklySummaryIcon />;
      case 'system':
      default:
        return <SystemNotificationIcon />;
    }
  };

  return (
    <div className="notification-item">
      <div className="notification-dot"></div>
      <div className="notification-content">
        <div className="notification-icon" style={{ marginRight: '8px', display: 'inline-block' }}>
          {getNotificationIcon()}
        </div>
        <div className="notification-message">{notification.message || notification.title}</div>
        <div className="notification-date">{notification.time_ago || formattedDate}</div>
      </div>
    </div>
  );
};

const DashboardHomepage = () => {
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [dashboardNotifications, setDashboardNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the notifications context - but DON'T include it in the dependency array
  const { fetchUnreadCount } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch budget summary data
        const budgetResponse = await Request.get('/budgets/summary/');
        setBudgetData(budgetResponse.data);

        // Fetch recent expenses (limit to 5)
        const expensesResponse = await Request.get('/expenses/?limit=5');
        
        // Check if expensesResponse.data is an array or has a results property
        const expensesData = expensesResponse.data.results 
          ? expensesResponse.data.results 
          : expensesResponse.data;
          
        console.log('Expenses data fetched:', expensesData);
        setRecentExpenses(expensesData);

        // Fetch real notifications (limit to 10)
        const notificationsResponse = await Request.get('/notifications/?limit=10');
        // Handle different response structures (array or paginated object)
        const notificationsData = notificationsResponse.data.results 
          ? notificationsResponse.data.results 
          : notificationsResponse.data;
        
        setDashboardNotifications(notificationsData);

        // Update the unread count in the context
        fetchUnreadCount();

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Do NOT include context methods in the dependency array
  }, []);

  const handleViewAllExpenses = () => {
    navigate('/dashboard/expenses');
  };

  const handleViewAllNotifications = () => {
    navigate('/dashboard/notifications');
  };

  return (
    <div className="dashboard-homepage">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <DashboardIcon />
          <h2>Dashboard</h2>
        </div>
        <p className="dashboard-subtitle">
          Welcome back! Here's an overview of your finances
        </p>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}
      
      <div className="dashboard-content">
        {isLoading ? (
          <div className="dashboard-loading">
            <div className="loader-spinner"></div>
            <p>Loading your financial data...</p>
          </div>
        ) : (
          <>
            <BudgetSummaryStats budgetData={budgetData} />

            <div className="dashboard-charts">
              <div className="chart-item">
                <DailyExpenseChart />
              </div>
              <div className="chart-item">
                <CategoryPieChart 
                  data={budgetData?.category_breakdown || []} 
                  title="Spending by Category" 
                />
              </div>
            </div>

            <div className="dashboard-activity">
              <div className="recent-expenses">
                <div className="section-header">
                  <h2>Recent Expenses</h2>
                  <button 
                    className="view-all-button"
                    onClick={handleViewAllExpenses}
                  >
                    View All
                  </button>
                </div>
                <div className="expenses-list">
                  {recentExpenses && recentExpenses.length > 0 ? (
                    recentExpenses.map(expense => (
                      <ExpenseItem key={expense.id} expense={expense} />
                    ))
                  ) : (
                    <div className="no-data-message">
                      No recent expenses found
                    </div>
                  )}
                </div>
              </div>

              <div className="notifications">
                <div className="section-header">
                  <h2>
                    <NotificationIcon />
                    Notifications
                  </h2>
                  <button 
                    className="view-all-button"
                    onClick={handleViewAllNotifications}
                  >
                    View All
                  </button>
                </div>
                <div className="notifications-list">
                  {dashboardNotifications && dashboardNotifications.length > 0 ? (
                    dashboardNotifications.map(notification => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))
                  ) : (
                    <div className="no-data-message">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardHomepage;