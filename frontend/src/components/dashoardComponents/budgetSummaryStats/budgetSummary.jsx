import React from 'react';
import './style.css';

// Improved SVG Icons Component
const MoneyBagIcon = ({ color }) => (
<svg width="800px" height="800px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke={color} fill="none"><path d="M49.19,57.34H14.81L16,35.91A15.46,15.46,0,0,1,31.44,21.3h1.83A14.71,14.71,0,0,1,48,35.2Z"/><path d="M27.38,21.84,19.72,7.39a.5.5,0,0,1,.52-.73l4.65.77a46,46,0,0,0,14.76.05l5.11-.81a.5.5,0,0,1,.51.75L36.85,21.53"/><line x1="28.23" y1="13.15" x2="30.73" y2="21.3" strokeLinecap="round"/><line x1="35.14" y1="14.79" x2="33.79" y2="21.31" strokeLinecap="round"/><path d="M38.34,50.12H26.12a.1.1,0,0,1-.07-.16c.83-.9,4.83-5.47,3.3-9.59-1.7-4.59-.6-11.88,7.64-8.49" strokeLinecap="round"/><line x1="24.19" y1="40.49" x2="35.59" y2="40.49" strokeLinecap="round"/></svg>
);

const ChartIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} fill={`${color}10`} />
    <path d="M8 15v-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M12 15V9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M16 15v-3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M7 18h10" stroke={color} opacity="0.4" />
    <path d="M4 6h2" stroke={color} opacity="0.4" />
    <path d="M18 6h2" stroke={color} opacity="0.4" />
  </svg>
);

const CategoryIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h6v6H4z" stroke={color} fill={`${color}20`} />
    <path d="M14 4h6v6h-6z" stroke={color} fill={`${color}15`} />
    <path d="M4 14h6v6H4z" stroke={color} fill={`${color}10`} />
    <path d="M14 14h6v6h-6z" stroke={color} fill={`${color}25`} />
    <circle cx="7" cy="7" r="1" fill={color} opacity="0.6" />
    <circle cx="17" cy="7" r="1" fill={color} opacity="0.6" />
    <circle cx="7" cy="17" r="1" fill={color} opacity="0.6" />
    <circle cx="17" cy="17" r="1" fill={color} opacity="0.6" />
  </svg>
);

const CheckIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={color} />
    <polyline points="22 4 12 14.01 9 11.01" stroke={color} />
    <path d="M12 22a10 10 0 0 1-9.44-6.69" stroke={color} opacity="0.4" />
    <path d="M12 14.01L18 8" stroke={color} opacity="0.5" />
    <circle cx="12" cy="12" r="10" fill={`${color}10`} />
  </svg>
);

const WarningIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} fill={`${color}15`} />
    <line x1="12" y1="9" x2="12" y2="13" stroke={color} />
    <line x1="12" y1="17" x2="12.01" y2="17" stroke={color} />
    <path d="M8.5 18.5h7" stroke={color} opacity="0.5" />
    <path d="M12 17.5v1" stroke={color} opacity="0.5" />
  </svg>
);

const ThumbsUpIcon = ({ color }) => (

<svg fill="#6bceff" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 447.514 447.514" xmlSpace="preserve" stroke={color}>

<g id="SVGRepo_bgCarrier" strokeWidth="0"/>

<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>

<g id="SVGRepo_iconCarrier"> <path d="M389.183,10.118c-3.536-2.215-7.963-2.455-11.718-0.634l-50.653,24.559c-35.906,17.409-77.917,16.884-113.377-1.418 c-38.094-19.662-83.542-18.72-120.789,2.487V20c0-11.046-8.954-20-20-20s-20,8.954-20,20v407.514c0,11.046,8.954,20,20,20 s20-8.954,20-20V220.861c37.246-21.207,82.694-22.148,120.789-2.487c35.46,18.302,77.47,18.827,113.377,1.418l56.059-27.18 c7.336-3.557,11.995-10.993,11.995-19.146V20.385C394.866,16.212,392.719,12.333,389.183,10.118z"/> </g>

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
  
  const totalSpent = spending.monthly || 0;
  const formattedTotal = totalSpent.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
  
  // Find highest spending category
  let highestCategory = { name: 'None', amount: 0, percentage: 0, icon: <CategoryIcon color="#9E9E9E" />, color: '#9E9E9E' };
  if (category_breakdown && category_breakdown.length > 0) {
    highestCategory = category_breakdown.reduce((max, cat) => (cat.amount > max.amount ? cat : max), { amount: 0 });
  }
  
  // Calculate daily average spending for this month
  const today = new Date();
  const dayOfMonth = today.getDate();
  const dailyAvg = totalSpent / dayOfMonth;
  const formattedDailyAvg = dailyAvg.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
  
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