import React, { useState, useEffect, useRef } from 'react';
import './style.css';

const ExpenseModal = ({ onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: categories[0].id,
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
    
    // Handle outside click
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    // Handle escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Name is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert amount to number and ensure category is a number
      const formattedData = {
        ...formData,
        amount: parseFloat(formData.amount),
        category: parseInt(formData.category, 10)
      };
      
      // Call the onSave callback
      onSave(formattedData);
    }
  };

  // Get selected category object
  const selectedCategory = categories.find(cat => cat.id === parseInt(formData.category, 10)) || categories[0];

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h3>Add New Expense</h3>
          <button className="close-button" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="title">Expense Name</label>
            <input
              type="text"
              id="title"
              name="title"
              ref={firstInputRef}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter expense name"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount ($)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.amount ? 'error' : ''}
              />
              {errors.amount && <div className="error-message">{errors.amount}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <div className="error-message">{errors.date}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <div className="category-select-container">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div 
                className="selected-category-indicator" 
                style={{ backgroundColor: selectedCategory.color + '20', color: selectedCategory.color }}
              >
                <span className="category-icon">{selectedCategory.icon}</span> {selectedCategory.name}
              </div>
            </div>
            {errors.category && <div className="error-message">{errors.category}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="comment">Comment (Optional)</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Add notes or details about this expense"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;