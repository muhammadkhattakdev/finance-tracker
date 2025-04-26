import React from 'react';
import './style.css';

const BudgetProgressBar = ({ 
  label, 
  current, 
  limit, 
  period,
  icon
}) => {
  // Calculate percentage and ensure it's capped at 100% for display purposes
  const percentage = limit ? Math.min(Math.round((current / limit) * 100), 100) : 0;
  
  // Status based on percentage of budget used
  let status;
  let statusText;
  
  if (percentage >= 100) {
    status = 'exceeded';
    statusText = 'Exceeded';
  } else if (percentage >= 80) {
    status = 'warning';
    statusText = 'Near limit';
  } else if (percentage >= 50) {
    status = 'moderate';
    statusText = 'Moderate';
  } else {
    status = 'good';
    statusText = 'Good';
  }

  // Get gradient based on status
  const getGradient = () => {
    switch (status) {
      case 'exceeded':
        return 'linear-gradient(90deg, #ff4d4d, #ff1a1a)';
      case 'warning':
        return 'linear-gradient(90deg, #ffc107, #ff9800)';
      case 'moderate':
        return 'linear-gradient(90deg, #4CAF50, #2E7D32)';
      case 'good':
      default:
        return 'linear-gradient(90deg, #00E5BE, #00C4B8)';
    }
  };

  // Calculate whether we should show exceeded indicators
  const isExceeded = percentage >= 100;
  
  // Display values
  const displayCurrent = current.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const displayLimit = limit ? limit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'Not set';
  
  return (
    <div className={`budget-progress-item ${isExceeded ? 'exceeded' : ''}`}>
      <div className="budget-progress-header">
        <div className="budget-progress-title">
          <div className="budget-icon">{icon}</div>
          <div>
            <h3>{label}</h3>
            <div className="budget-meta">
              <span className={`budget-status ${status}`}>{statusText}</span>
              <span className="budget-period">{period}</span>
            </div>
          </div>
        </div>
        <div className="budget-values">
          <div className="budget-current">{displayCurrent}</div>
          <div className="budget-separator">/</div>
          <div className="budget-limit">{displayLimit}</div>
        </div>
      </div>
      
      <div className="budget-progress-bar-container">
        <div 
          className="budget-progress-bar"
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            background: getGradient()
          }}
        >
          {isExceeded && (
            <div className="budget-exceeded-indicator">
              <span className="budget-exceeded-arrow">→</span>
            </div>
          )}
        </div>
        <div className="budget-percentage">
          {percentage}%
        </div>
      </div>
    </div>
  );
};

const BudgetProgressBars = ({ budgetData }) => {
  if (!budgetData) {
    return (
      <div className="budget-progress-skeleton">
        <div className="budget-progress-skeleton-item"></div>
        <div className="budget-progress-skeleton-item"></div>
        <div className="budget-progress-skeleton-item"></div>
      </div>
    );
  }
  
  const { budgets, spending, percentages } = budgetData;
  
  return (
    <div className="budget-progress-container">
      <div className="budget-progress-header-main">
        <h2>Budget Progress</h2>
        <button className="edit-budgets-button">
          Edit Budgets
        </button>
      </div>
      
      <div className="budget-progress-bars">
        <BudgetProgressBar 
          label="Daily Budget"
          current={spending?.daily || 0}
          limit={budgets?.daily}
          percentage={percentages?.daily || 0}
          period="Today"
          icon="📅"
        />
        
        <BudgetProgressBar 
          label="Weekly Budget"
          current={spending?.weekly || 0}
          limit={budgets?.weekly}
          percentage={percentages?.weekly || 0}
          period="This Week"
          icon="📊"
        />
        
        <BudgetProgressBar 
          label="Monthly Budget"
          current={spending?.monthly || 0}
          limit={budgets?.monthly}
          percentage={percentages?.monthly || 0}
          period="This Month"
          icon="📆"
        />
      </div>
    </div>
  );
};

export default BudgetProgressBars;