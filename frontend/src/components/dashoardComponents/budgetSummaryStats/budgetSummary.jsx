import React from 'react';
import './style.css';

// SVG Icons Component
const MoneyBagIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 16v6M8 6h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H8a4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
    <path d="M16 10c0 2.5-2 3-4 3s-4-.5-4-3" />
  </svg>
);

const ChartIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M8 15v-6M12 15V9M16 15v-3" />
  </svg>
);

const CategoryIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
  </svg>
);

const CheckIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const WarningIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ThumbsUpIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12M15 5.88l1 .12c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2h-4l2 3c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2h-3.3L8.7 13H7V5.88C7 4.8 7.8 4 8.88 4h.62c.7 0 1.34.4 1.66 1.03L15 5.88z" />
  </svg>
);

const StatCard = ({ title, value, icon, trend, trendValue, color }) => {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-icon" style={{ backgroundColor: `${color}20`, color: color }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-trend ${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
    </div>
  );
};

const BudgetSummaryStats = ({ budgetData }) => {
  if (!budgetData || !budgetData.spending) {
    return (
      <div className="budget-summary-container skeleton">
        <div className="budget-summary-header">
          <h2>Summary Stats</h2>
        </div>
        <div className="budget-summary-stats">
          <div className="stat-card skeleton"></div>
          <div className="stat-card skeleton"></div>
          <div className="stat-card skeleton"></div>
          <div className="stat-card skeleton"></div>
        </div>
      </div>
    );
  }

  const { spending, percentages, category_breakdown } = budgetData;
  
  // Calculate insights based on the data
  const totalSpent = spending.monthly || 0;
  const formattedTotal = totalSpent.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
  // Find highest spending category
  let highestCategory = { name: 'None', amount: 0, percentage: 0, icon: <CategoryIcon color="#9E9E9E" />, color: '#9E9E9E' };
  if (category_breakdown && category_breakdown.length > 0) {
    highestCategory = category_breakdown.reduce((max, cat) => (cat.amount > max.amount ? cat : max), { amount: 0 });
  }
  
  // Calculate daily average spending for this month
  const today = new Date();
  const dayOfMonth = today.getDate();
  const dailyAvg = totalSpent / dayOfMonth;
  const formattedDailyAvg = dailyAvg.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
  // Format percentage for highest category
  const highestCategoryPercentage = `${Math.round(highestCategory.percentage)}%`;
  
  // Determine budget status
  let budgetStatus = 'On track';
  let budgetStatusColor = '#4CAF50';
  let budgetStatusIcon = <CheckIcon color="#4CAF50" />;
  
  if (percentages.monthly > 100) {
    budgetStatus = 'Over budget';
    budgetStatusColor = '#F44336';
    budgetStatusIcon = <WarningIcon color="#F44336" />;
  } else if (percentages.monthly > 90) {
    budgetStatus = 'Near limit';
    budgetStatusColor = '#FF9800';
    budgetStatusIcon = <WarningIcon color="#FF9800" />;
  } else if (percentages.monthly < 50) {
    budgetStatus = 'Under budget';
    budgetStatusColor = '#2196F3';
    budgetStatusIcon = <ThumbsUpIcon color="#2196F3" />;
  }

  return (
    <div className="budget-summary-container">
      <div className="budget-summary-header">
        <h2>Summary Stats</h2>
      </div>
      <div className="budget-summary-stats">
        <StatCard 
          title="Total Spent"
          value={formattedTotal}
          icon={<MoneyBagIcon color="#4CAF50" />}
          color="#4CAF50"
        />
        
        <StatCard 
          title="Daily Average"
          value={formattedDailyAvg}
          icon={<ChartIcon color="#2196F3" />}
          color="#2196F3"
        />
        
        <StatCard 
          title="Top Category"
          value={highestCategory.name}
          icon={<CategoryIcon color={highestCategory.color} />}
          trendValue={highestCategoryPercentage}
          trend="up"
          color={highestCategory.color}
        />
        
        <StatCard 
          title="Budget Status"
          value={budgetStatus}
          icon={budgetStatusIcon}
          color={budgetStatusColor}
        />
      </div>
    </div>
  );
};

export default BudgetSummaryStats;