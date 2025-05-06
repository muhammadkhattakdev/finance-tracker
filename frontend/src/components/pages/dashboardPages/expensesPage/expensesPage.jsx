import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import ExpenseModal from "../../../dashoardComponents/addExpenseModal/addExpenseModal";
import Request from "../../../utils/request";
import { format } from "date-fns";
import ExportModal from "../../../dashoardComponents/exportExpensesModal/exportExpensesModal";

const ExpenseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      className="expense-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8V12L15 15"
      className="expense-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AddIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4V16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 10H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.33333 15H11.6667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 10H15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33333 5H16.6667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 17.5L13.875 13.875"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.667 3.333L13.333 6.667M13.333 6.667H17.5M13.333 6.667V2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.333 16.667L6.667 13.333M6.667 13.333H2.5M6.667 13.333V17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 9.167C17.5 13.771 13.771 17.5 9.167 17.5C4.562 17.5 0.833 13.771 0.833 9.167C0.833 4.562 4.562 0.833 9.167 0.833C9.899 0.833 10.612 0.944 11.29 1.152"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ExportIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.8333 13.3333L15 9.16667M15 9.16667L10.8333 5M15 9.16667H5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 16.6667H15C15.9205 16.6667 16.6667 15.9205 16.6667 15V3.33333C16.6667 2.41286 15.9205 1.66667 15 1.66667H5C4.07953 1.66667 3.33333 2.41286 3.33333 3.33333V15C3.33333 15.9205 4.07953 16.6667 5 16.6667Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CATEGORIES = [
  { id: 1, name: "Groceries", icon: "🛒", color: "#4CAF50" },
  { id: 2, name: "Dining", icon: "🍽️", color: "#FF9800" },
  { id: 3, name: "Transportation", icon: "🚗", color: "#2196F3" },
  { id: 4, name: "Entertainment", icon: "🎬", color: "#9C27B0" },
  { id: 5, name: "Shopping", icon: "🛍️", color: "#E91E63" },
  { id: 6, name: "Utilities", icon: "💡", color: "#607D8B" },
  { id: 7, name: "Housing", icon: "🏠", color: "#795548" },
  { id: 8, name: "Healthcare", icon: "🏥", color: "#F44336" },
  { id: 9, name: "Education", icon: "📚", color: "#009688" },
  { id: 10, name: "Travel", icon: "✈️", color: "#3F51B5" },
  { id: 11, name: "Gifts", icon: "🎁", color: "#E040FB" },
  { id: 12, name: "Personal Care", icon: "💇", color: "#8BC34A" },
  { id: 13, name: "Fitness", icon: "🏋️", color: "#FFC107" },
  { id: 14, name: "Subscriptions", icon: "📱", color: "#00BCD4" },
  { id: 15, name: "Other", icon: "📌", color: "#9E9E9E" },
];

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    pages.push(1);

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 2 && currentPage > 3) {
        pages.push("...");
      } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
        pages.push("...");
      } else {
        pages.push(i);
      }
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return Array.from(new Set(pages)).filter((page, index, array) => {
      if (page === "..." && array[index - 1] === "...") return false;
      return true;
    });
  };

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`pagination-page ${page === currentPage ? "active" : ""}`}
          onClick={() => page !== "..." && onPageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sourceFilter, setSourceFilter] = useState(null);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 30;

  // Use refs to track actual filter state
  const currentFilters = useRef({
    category: null,
    source: null,
    search: "",
    page: 1,
  });

  // Function to fetch expenses with current filters
  const fetchExpenses = async () => {
    setIsLoading(true);

    try {
      // Build query parameters based on current filters
      let queryParams = new URLSearchParams();

      // Always include pagination
      queryParams.append("page", currentFilters.current.page);
      queryParams.append("page_size", itemsPerPage);

      // Add search if present
      if (currentFilters.current.search) {
        queryParams.append("search", currentFilters.current.search);
      }

      // Add category if selected
      if (currentFilters.current.category !== null) {
        queryParams.append("category", currentFilters.current.category);
      }

      // Handle source filter
      if (currentFilters.current.source === "plaid") {
        // For plaid, use server-side filtering
        queryParams.append("source", "plaid");
      }

      // Make API request
      const response = await Request.get(
        `/expenses/?${queryParams.toString()}`
      );

      // Process response
      let fetchedExpenses;
      let totalCount;

      if (response.data.results) {
        // Paginated response
        fetchedExpenses = response.data.results;
        totalCount = response.data.count;
      } else {
        // Non-paginated response
        fetchedExpenses = response.data;
        totalCount = fetchedExpenses.length;
      }

      // Apply client-side filtering for manual source
      if (currentFilters.current.source === "manual") {
        const manualExpenses = fetchedExpenses.filter(
          (expense) => expense.source !== "plaid"
        );
        setExpenses(manualExpenses);
        setTotalItems(manualExpenses.length);
      } else {
        setExpenses(fetchedExpenses);
        setTotalItems(totalCount);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchExpenses();

    // Set up auto-refresh interval
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing expenses data");
      fetchExpenses();
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(intervalId);
  }, []);

  // Apply filters immediately when they change
  useEffect(() => {
    // Update the ref with latest filter values
    currentFilters.current = {
      category: selectedCategory,
      source: sourceFilter,
      search: searchQuery,
      page: currentPage,
    };

    // Fetch with new filters
    fetchExpenses();
  }, [selectedCategory, sourceFilter, searchQuery, currentPage]);

  const handleAddExpense = async (newExpense) => {
    setIsLoading(true);
    try {
      await Request.post("/expenses/", newExpense);
      fetchExpenses();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Failed to add expense. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setIsLoading(true);
      try {
        await Request.delete(`/expenses/${id}/`);
        fetchExpenses();
      } catch (err) {
        console.error("Error deleting expense:", err);
        setError("Failed to delete expense. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const handleSyncTransactions = async () => {
    setSyncing(true);
    try {
      await Request.post("/plaid/sync_transactions/");
      await fetchExpenses();
      setError(null);
    } catch (err) {
      console.error("Error syncing transactions:", err);
      setError("Failed to sync transactions. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async (startDate, endDate) => {
    try {
      const queryParams = new URLSearchParams();

      // Add date range
      queryParams.append("start_date", startDate);
      queryParams.append("end_date", endDate);

      // Add filters
      if (currentFilters.current.search) {
        queryParams.append("search", currentFilters.current.search);
      }

      if (currentFilters.current.category !== null) {
        queryParams.append("category", currentFilters.current.category);
      }

      // Only include source filter for plaid
      if (currentFilters.current.source === "plaid") {
        queryParams.append("source", currentFilters.current.source);
      }

      // Make export request
      const response = await Request.get(
        `/expenses/export/?${queryParams.toString()}`,
        { responseType: "blob" }
      );

      let blobData = response.data;

      // Process CSV for manual filter
      if (currentFilters.current.source === "manual") {
        const text = await response.data.text();
        const lines = text.split("\n");
        const header = lines[0];
        const filteredLines = [header];

        // Filter out plaid entries
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line && !line.includes('"plaid"') && !line.includes(",plaid,")) {
            filteredLines.push(line);
          }
        }

        const filteredText = filteredLines.join("\n");
        blobData = new Blob([filteredText], { type: "text/csv" });
      }

      // Create download link
      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expenses_${startDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Close modal
      setIsExportModalOpen(false);
    } catch (err) {
      console.error("Error exporting expenses:", err);
      setError("Failed to export expenses. Please try again.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Scroll to top of table
    window.scrollTo({
      top: document.querySelector(".expenses-table-container").offsetTop - 80,
      behavior: "smooth",
    });
  };

  const applyFilters = () => {
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSourceFilter(null);
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const getCategoryById = (categoryId) => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    return category || { name: "", icon: "-", color: "#9E9E9E" };
  };

  // Handle category filter change - direct with no delay
  const handleCategoryChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // Handle source filter change - direct with no delay
  const handleSourceChange = (e) => {
    const value = e.target.value || null;
    setSourceFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div className="expenses-title">
          <ExpenseIcon />
          <h2>Expenses</h2>
        </div>
        <div className="expenses-actions">
          <form onSubmit={handleSearchSubmit} className="search-container">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setSearchQuery("");
                  applyFilters();
                }}
              >
                ×
              </button>
            )}
            <button type="submit" style={{ display: "none" }}></button>
          </form>

          <div className="category-filter">
            <FilterIcon />
            <select
              value={selectedCategory || ""}
              onChange={handleCategoryChange}
              className="category-select"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="source-filter">
            <FilterIcon />
            <select
              value={sourceFilter || ""}
              onChange={handleSourceChange}
              className="source-select"
            >
              <option value="">All Sources</option>
              <option value="manual">Manual Entries</option>
              <option value="plaid">Bank Transactions</option>
            </select>
          </div>

          <button
            className="export-button"
            onClick={() => setIsExportModalOpen(true)}
          >
            <ExportIcon />
            <span>Export</span>
          </button>

          <button
            className={`sync-button ${syncing ? "syncing" : ""}`}
            onClick={handleSyncTransactions}
            disabled={syncing}
          >
            {syncing ? (
              <>
                <div className="button-spinner"></div>
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <RefreshIcon />
                <span>Sync</span>
              </>
            )}
          </button>

          <button
            className="add-expense-button"
            onClick={() => setIsModalOpen(true)}
          >
            <AddIcon />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="expenses-table-container">
        {isLoading && !expenses.length ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="no-expenses">
            <p>
              No expenses found.{" "}
              {(searchQuery || selectedCategory || sourceFilter) && (
                <button onClick={resetFilters} className="reset-filters-button">
                  Clear filters
                </button>
              )}
            </p>
          </div>
        ) : (
          <>
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const category = getCategoryById(expense.category);
                  return (
                    <tr key={expense.id}>
                      <td>{expense.title}</td>
                      <td>
                        <div
                          className="category-badge"
                          style={{
                            backgroundColor: category.color + "20",
                            color: category.color,
                          }}
                        >
                          <span className="category-icon">{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </td>
                      <td className="amount-cell">
                        £{parseFloat(expense.amount).toFixed(2)}
                      </td>
                      <td>{format(new Date(expense.date), "dd MMM yyyy")}</td>
                      <td>
                        <div
                          className="source-badge"
                          style={{
                            backgroundColor:
                              expense.source === "plaid"
                                ? "#4CAF5020"
                                : "#9C27B020",
                            color:
                              expense.source === "plaid"
                                ? "#4CAF50"
                                : "#9C27B0",
                          }}
                        >
                          {expense.source === "plaid" ? "Bank" : "Manual"}
                        </div>
                      </td>
                      <td className="comment-cell">
                        {expense.comment ? (
                          <div className="comment-content">
                            {expense.comment.length > 50
                              ? `£{expense.comment.substring(0, 50)}...`
                              : expense.comment}
                          </div>
                        ) : (
                          <span className="no-comment">-</span>
                        )}
                      </td>
                      <td>
                        <div className="expense-actions">
                          {expense.source !== "plaid" && (
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteExpense(expense.id)}
                              aria-label="Delete expense"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {isModalOpen && (
        <ExpenseModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddExpense}
          categories={CATEGORIES}
        />
      )}

      {isExportModalOpen && (
        <ExportModal
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

export default ExpensesPage;
