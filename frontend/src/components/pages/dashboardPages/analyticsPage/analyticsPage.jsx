import React, { useState, useEffect } from 'react';
import './style.css';
import Request from '../../../utils/request';
import BudgetProgressBars from '../../../dashoardComponents/progressBar/progressBar';
import CategoryPieChart from '../../../dashoardComponents/budgetPieChart/budgetPieChart';
import BudgetSummaryStats from '../../../dashoardComponents/budgetSummaryStats/budgetSummary';
import BudgetSetupModal from '../../../dashoardComponents/budgetSetupModal/budgetSetupModal'

const AnalyticsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 21H3V3" className="analytics-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 9L15 3L9 9L3 3" className="analytics-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AnalyticsPage = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    setIsLoading(true);
    try {
      const response = await Request.get('/budgets/summary/');
      setBudgetData(response.data);
      setError(null);
      
      // If no budgets are set, automatically open the setup modal
      if (!response.data.budgets.daily && !response.data.budgets.weekly && !response.data.budgets.monthly) {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching budget data:', err);
      setError('Failed to load budget data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBudgets = async (budgetValues) => {
    try {
      await Request.post('/budgets/set_budgets/', budgetValues);
      fetchBudgetData(); // Refresh data after saving
    } catch (err) {
      console.error('Error saving budgets:', err);
      setError('Failed to save budget settings. Please try again.');
    }
  };

  const openSetupModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="budget-analytics-page">
      <div className="budget-analytics-header">
        <div className="budget-analytics-title">
          <AnalyticsIcon />
          <h2>Budget Analytics</h2>
        </div>
        <p className="budget-analytics-subtitle">
          Track your spending and visualize your finances
        </p>
      </div>

      {error && (
        <div className="budget-analytics-error">
          {error}
        </div>
      )}

      <div className="budget-analytics-content">
        {isLoading && !budgetData ? (
          <div className="budget-analytics-loader">
            <div className="loader-spinner"></div>
            <p>Loading your financial data...</p>
          </div>
        ) : (
          <>
            <BudgetSummaryStats budgetData={budgetData} />
            
            <BudgetProgressBars 
              budgetData={budgetData} 
              onEditClick={openSetupModal} 
            />
            
            <div className="charts-container">
              <div className="chart-item">
                <CategoryPieChart 
                  data={budgetData?.category_breakdown || []} 
                  title="Monthly Spending by Category" 
                />
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <BudgetSetupModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveBudgets}
          currentBudgets={budgetData?.budgets}
        />
      )}
    </div>
  );
};

export default AnalyticsPage;