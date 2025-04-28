import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { useNotifications } from "../../../context/notificationsContext";

const BudgetSetupModal = ({ onClose, onSave, currentBudgets = {} }) => {
  const [budgets, setBudgets] = useState({
    daily: currentBudgets.daily || "",
    weekly: currentBudgets.weekly || "",
    monthly: currentBudgets.monthly || "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  
  // Add notifications context
  const { checkForNewNotifications } = useNotifications();

  useEffect(() => {
    // Focus first input when modal opens
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }

    // Handle click outside modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Handle escape key
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    // Prevent background scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setBudgets((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when field is edited
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate daily budget
    if (!budgets.daily || budgets.daily === '') {
      newErrors.daily = 'Daily budget is required';
    } else if (isNaN(parseFloat(budgets.daily)) || parseFloat(budgets.daily) <= 0) {
      newErrors.daily = 'Must be a positive number';
    }
    
    // Validate weekly budget
    if (!budgets.weekly || budgets.weekly === '') {
      newErrors.weekly = 'Weekly budget is required';
    } else if (isNaN(parseFloat(budgets.weekly)) || parseFloat(budgets.weekly) <= 0) {
      newErrors.weekly = 'Must be a positive number';
    } else if (parseFloat(budgets.weekly) < parseFloat(budgets.daily) * 7) {
      newErrors.weekly = 'Weekly budget should be at least 7x daily budget';
    }
    
    // Validate monthly budget
    if (!budgets.monthly || budgets.monthly === '') {
      newErrors.monthly = 'Monthly budget is required';
    } else if (isNaN(parseFloat(budgets.monthly)) || parseFloat(budgets.monthly) <= 0) {
      newErrors.monthly = 'Must be a positive number';
    } else if (parseFloat(budgets.monthly) < parseFloat(budgets.weekly) * 4) {
      newErrors.monthly = 'Monthly budget should be at least 4x weekly budget';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const formattedBudgets = {
          daily: parseFloat(budgets.daily),
          weekly: parseFloat(budgets.weekly),
          monthly: parseFloat(budgets.monthly),
        };

        await onSave(formattedBudgets);
        
        // Check for new notifications after budget update
        setTimeout(() => {
          checkForNewNotifications();
        }, 500); // Small delay to allow backend to process
        
        onClose();
      } catch (error) {
        console.error("Error saving budgets:", error);
        // Handle error as needed
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getBudgetSuggestion = (type) => {
    if (type === "weekly" && budgets.daily) {
      return (parseFloat(budgets.daily) * 7).toFixed(2);
    }
    if (type === "monthly" && budgets.weekly) {
      return (parseFloat(budgets.weekly) * 4.3).toFixed(2);
    }
    return null;
  };

  const suggestWeekly = getBudgetSuggestion("weekly");
  const suggestMonthly = getBudgetSuggestion("monthly");

  return (
    <div className="budget-modal-overlay">
      <div className="budget-modal-container" ref={modalRef}>
        <div className="budget-modal-header">
          <h3>Set Your Budget Limits</h3>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="budget-form">
          <div className="budget-form-intro">
            <p>
              Define how much you plan to spend in each period. We'll track your
              expenses against these budgets.
            </p>
          </div>

          <div className="budget-form-group">
            <label htmlFor="daily">
              Daily Budget
              <span className="budget-period-note">Resets every day</span>
            </label>
            <div className="budget-input-container">
              <span className="budget-currency-symbol">$</span>
              <input
                type="text"
                id="daily"
                name="daily"
                ref={firstInputRef}
                value={budgets.daily}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.daily ? "error" : ""}
              />
            </div>
            {errors.daily && (
              <div className="error-message">{errors.daily}</div>
            )}
          </div>

          <div className="budget-form-group">
            <label htmlFor="weekly">
              Weekly Budget
              <span className="budget-period-note">Resets every Monday</span>
            </label>
            <div className="budget-input-container">
              <span className="budget-currency-symbol">$</span>
              <input
                type="text"
                id="weekly"
                name="weekly"
                value={budgets.weekly}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.weekly ? "error" : ""}
              />
            </div>
            {errors.weekly && (
              <div className="error-message">{errors.weekly}</div>
            )}
            {suggestWeekly && !budgets.weekly && (
              <div className="budget-suggestion">
                Suggestion: ${suggestWeekly}
                <button
                  type="button"
                  className="use-suggestion"
                  onClick={() =>
                    handleChange({
                      target: { name: "weekly", value: suggestWeekly },
                    })
                  }
                >
                  Use
                </button>
              </div>
            )}
          </div>

          <div className="budget-form-group">
            <label htmlFor="monthly">
              Monthly Budget
              <span className="budget-period-note">Resets on the 1st</span>
            </label>
            <div className="budget-input-container">
              <span className="budget-currency-symbol">$</span>
              <input
                type="text"
                id="monthly"
                name="monthly"
                value={budgets.monthly}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.monthly ? "error" : ""}
              />
            </div>
            {errors.monthly && (
              <div className="error-message">{errors.monthly}</div>
            )}
            {suggestMonthly && !budgets.monthly && (
              <div className="budget-suggestion">
                Suggestion: ${suggestMonthly}
                <button
                  type="button"
                  className="use-suggestion"
                  onClick={() =>
                    handleChange({
                      target: { name: "monthly", value: suggestMonthly },
                    })
                  }
                >
                  Use
                </button>
              </div>
            )}
          </div>

          <div className="budget-form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="button-spinner"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Budgets</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetSetupModal;