import React, { useState } from "react";
import "./style.css";

const ExportModal = ({ onClose, onExport }) => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleExport = async (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError("Both start and end dates are required");
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setError("Start date cannot be after end date");
      return;
    }
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      if (!window.confirm("You are exporting data for more than a year. This might take longer to process. Do you want to continue?")) {
        return;
      }
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      await onExport(startDate, endDate);
      onClose();
    } catch (err) {
      console.error("Export failed:", err);
      setError("Failed to export data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="export-modal">
        <div className="modal-header">
          <h3>Export Expenses</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleExport}>
          <div className="modal-body">
            <p className="export-description">
              Export your expenses as a CSV file for the selected date range.
              You can open this file in Excel, Google Sheets, or any other spreadsheet software.
            </p>
            
            {error && <div className="export-error">{error}</div>}
            
            <div className="date-range-inputs">
              <div className="form-group">
                <label htmlFor="start-date">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="end-date">End Date</label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
            
            <div className="export-info">
              <p>
                <strong>Note:</strong> The exported file will include all expenses within the selected date range
                and will respect any active filters (category, source, search).
              </p>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="export-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="button-spinner small"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <span>Export Data</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportModal;