import React from 'react';
import './style.css';

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
  let highestCategory = { name: 'None', amount: 0, percentage: 0, icon: '📊', color: '#9E9E9E' };
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
  let budgetStatusIcon = '✅';
  
  if (percentages.monthly > 100) {
    budgetStatus = 'Over budget';
    budgetStatusColor = '#F44336';
    budgetStatusIcon = '⚠️';
  } else if (percentages.monthly > 90) {
    budgetStatus = 'Near limit';
    budgetStatusColor = '#FF9800';
    budgetStatusIcon = '⚠️';
  } else if (percentages.monthly < 50) {
    budgetStatus = 'Under budget';
    budgetStatusColor = '#2196F3';
    budgetStatusIcon = '👍';
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
          icon="💰"
          color="#4CAF50"
        />
        
        <StatCard 
          title="Daily Average"
          value={formattedDailyAvg}
          icon="📊"
          color="#2196F3"
        />
        
        <StatCard 
          title="Top Category"
          value={highestCategory.name}
          icon={highestCategory.icon}
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