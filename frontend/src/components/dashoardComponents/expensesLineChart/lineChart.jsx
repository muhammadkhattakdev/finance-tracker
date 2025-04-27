import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import Request from '../../utils/request';
import './style.css';

const DailyExpenseChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [averageDaily, setAverageDaily] = useState(0);

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      setIsLoading(true);
      try {
        const today = new Date();
        const firstDayOfMonth = startOfMonth(today);
        const lastDayOfMonth = endOfMonth(today);
        
        // Format dates for API query
        const formattedStartDate = format(firstDayOfMonth, 'yyyy-MM-dd');
        const formattedEndDate = format(lastDayOfMonth, 'yyyy-MM-dd');
        
        // Fetch expenses within current month
        const response = await Request.get(`/expenses/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
        const expenses = response.data;
        
        // Process expenses to get daily totals for current month
        const monthlyData = processMonthlyExpenses(expenses, firstDayOfMonth, today);
        
        // Calculate statistics
        const total = monthlyData.reduce((sum, day) => sum + day.amount, 0);
        const daysElapsed = monthlyData.length;
        
        setTotalSpent(total);
        setAverageDaily(daysElapsed > 0 ? total / daysElapsed : 0);
        
        // Set chart data
        setChartData(monthlyData);
        setError(null);
      } catch (err) {
        console.error('Error fetching monthly expenses:', err);
        setError('Failed to load expense trend data');
        // Fallback to empty data
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyExpenses();
  }, []);

  // Process expenses to get daily totals for the current month
  const processMonthlyExpenses = (expenses, startDate, endDate) => {
    // Create a map to store daily totals
    const dailyMap = new Map();
    
    // Get all days in the current month up to today
    const days = eachDayOfInterval({
      start: startDate,
      end: endDate
    });
    
    // Initialize all days with zero amounts
    days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      dailyMap.set(dateKey, { 
        date: dateKey, 
        displayDate: format(day, 'MMM dd'),
        amount: 0 
      });
    });
    
    // Add up expenses for each day
    expenses.forEach(expense => {
      const dateKey = expense.date; // Assuming the date format is yyyy-MM-dd
      if (dailyMap.has(dateKey)) {
        const day = dailyMap.get(dateKey);
        day.amount += parseFloat(expense.amount);
        dailyMap.set(dateKey, day);
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(dailyMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="expense-chart-tooltip">
          <p className="tooltip-date">{payload[0].payload.displayDate}</p>
          <p className="tooltip-value">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Format display values
  const formattedTotal = totalSpent.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const formattedAverage = averageDaily.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
  // Get current month name for display
  const currentMonth = format(new Date(), 'MMMM yyyy');

  return (
    <div className="expense-chart-container">
      <div className="expense-chart-header">
        <h2>Daily Expenses Trend</h2>
        <div className="chart-period">{currentMonth}</div>
      </div>
      
      {error && <div className="chart-error">{error}</div>}
      
      <div className="chart-stats">
        <div className="chart-stat-item">
          <div className="chart-stat-label">Total Spent</div>
          <div className="chart-stat-value">{formattedTotal}</div>
        </div>
        <div className="chart-stat-item">
          <div className="chart-stat-label">Daily Average</div>
          <div className="chart-stat-value">{formattedAverage}</div>
        </div>
      </div>
      
      <div className="expense-chart">
        {isLoading ? (
          <div className="chart-loading">
            <div className="chart-spinner"></div>
            <span>Loading chart data...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="chart-no-data">
            <p>No expense data available for this month</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5DE7FF" stopOpacity={0.8}/>
                  <stop offset="50%" stopColor="#5DE7FF" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#5DE7FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: '#888888', fontSize: 12 }}
                minTickGap={15}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: '#888888', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#5DE7FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExpense)"
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#5DE7FF"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#5DE7FF", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DailyExpenseChart;