import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './style.css';

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
          <span className="tooltip-icon">{data.icon}</span>
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
              <span className="legend-icon">{entry.payload.icon}</span>
              <span>{entry.value}</span>
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
    color: item.color,
    icon: item.icon
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