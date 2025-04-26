import React from 'react';
import './style.css';

// SVG Icon Components
const DailyBudgetIcon = ({ color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
  </svg>
);

const WeeklyBudgetIcon = ({ color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01" />
    <rect x="7" y="16" width="10" height="4" rx="1" />
  </svg>
);

const MonthlyBudgetIcon = ({ color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <rect x="6" y="12" width="12" height="8" rx="1" />
  </svg>
);

const ExceededArrowIcon = ({ color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

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
          <div className="budget-icon">
            {icon}
          </div>
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
              <span className="budget-exceeded-arrow">
                <ExceededArrowIcon color="#ffffff" />
              </span>
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

const BudgetProgressBars = ({ budgetData, onEditClick }) => {
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
        <button className="edit-budgets-button" onClick={onEditClick}>
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
          icon={<DailyBudgetIcon color="var(--accent)" />}
        />
        
        <BudgetProgressBar 
          label="Weekly Budget"
          current={spending?.weekly || 0}
          limit={budgets?.weekly}
          percentage={percentages?.weekly || 0}
          period="This Week"
          icon={<WeeklyBudgetIcon color="var(--accent)" />}
        />
        
        <BudgetProgressBar 
          label="Monthly Budget"
          current={spending?.monthly || 0}
          limit={budgets?.monthly}
          percentage={percentages?.monthly || 0}
          period="This Month"
          icon={<MonthlyBudgetIcon color="var(--accent)" />}
        />
      </div>
    </div>
  );
};

export default BudgetProgressBars;