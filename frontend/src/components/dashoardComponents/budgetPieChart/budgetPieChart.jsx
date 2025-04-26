import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './style.css';

// SVG Icon Components
const ShoppingIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const FoodIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const HousingIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const TransportIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <rect x="1" y="6" width="22" height="12" rx="2"/>
    <circle cx="7" cy="18" r="2"/>
    <circle cx="17" cy="18" r="2"/>
    <path d="M5 6v4M19 6v4M3 10h18"/>
  </svg>
);

const EntertainmentIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M12 3v16M5.52 5.52l12.96 12.96M3 12h16M5.52 18.48l12.96-12.96" />
  </svg>
);

const HealthIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const OtherIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Helper function to get appropriate icon based on category name
const getCategoryIcon = (categoryName, color) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('food') || name.includes('grocery') || name.includes('restaurant')) {
    return <FoodIcon color={color} />;
  } else if (name.includes('shop') || name.includes('cloth') || name.includes('retail')) {
    return <ShoppingIcon color={color} />;
  } else if (name.includes('home') || name.includes('house') || name.includes('rent') || name.includes('mortgage')) {
    return <HousingIcon color={color} />;
  } else if (name.includes('transport') || name.includes('car') || name.includes('gas') || name.includes('travel')) {
    return <TransportIcon color={color} />;
  } else if (name.includes('entertain') || name.includes('fun') || name.includes('movie') || name.includes('game')) {
    return <EntertainmentIcon color={color} />;
  } else if (name.includes('health') || name.includes('medical') || name.includes('doctor')) {
    return <HealthIcon color={color} />;
  } else {
    return <OtherIcon color={color} />;
  }
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label for segments that are large enough (more than 5%)
  if (percent < 0.05) return null;
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="pie-chart-label"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="pie-chart-tooltip">
        <div className="tooltip-category">
          <span className="tooltip-icon">
            {getCategoryIcon(data.name, "#ffffff")}
          </span>
          <span className="tooltip-name">{data.name}</span>
        </div>
        <div className="tooltip-value">{data.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        <div className="tooltip-percentage">{data.percentage.toFixed(1)}% of total</div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => {
  // Show only top 5 categories in legend to avoid clutter
  const displayItems = payload.slice(0, 5);
  
  return (
    <div className="pie-chart-legend">
      {displayItems.map((entry, index) => (
        <div key={`legend-${index}`} className="legend-item">
          <div 
            className="legend-color" 
            style={{ backgroundColor: entry.color }}
          />
          <div className="legend-content">
            <div className="legend-name">
              <span className="legend-icon">
                {getCategoryIcon(entry.value, entry.color)}
              </span>
              <span className="legend-text">{entry.value}</span>
            </div>
            <div className="legend-value">
              {entry.payload.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
          </div>
        </div>
      ))}
      {payload.length > 5 && (
        <div className="legend-more">
          +{payload.length - 5} more categories
        </div>
      )}
    </div>
  );
};

const CategoryPieChart = ({ data, title = "Category Breakdown" }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="category-chart-container">
        <div className="category-chart-header">
          <h2>{title}</h2>
        </div>
        <div className="no-data-message">
          <p>No expense data available for categories</p>
        </div>
      </div>
    );
  }

  const formattedData = data.map(item => ({
    name: item.name,
    value: item.amount,
    percentage: item.percentage,
    color: item.color
  }));

  const total = formattedData.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="category-chart-container">
      <div className="category-chart-header">
        <h2>{title}</h2>
        <div className="total-expenses">
          Total: <span>{formattedTotal}</span>
        </div>
      </div>
      
      <div className="category-chart-content">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {formattedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={activeIndex === index ? "#fff" : "none"}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={<CustomLegend />} 
              verticalAlign="bottom" 
              height={100}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryPieChart;