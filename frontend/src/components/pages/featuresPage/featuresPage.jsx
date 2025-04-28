import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import dashboardImg from "../../../static/images/dashboard.png";
import bankImg from "../../../static/images/bank.png";
import analyticsImg from "../../../static/images/analytics.png";
import budgetImg from "../../../static/images/budget.png";

const BudgetIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BankIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 6L12 3L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotificationIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExpenseIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SecurityIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeaturesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="features-container">
          <h1>All-in-One Financial Tracking</h1>
          <p className="features-subtitle">
            Take control of your finances with our comprehensive suite of tools designed to 
            help you track, budget, and visualize your financial journey
          </p>
          <div className="features-hero-buttons">
            <Link to="/register" className="primary-button">Start for Free</Link>
            <Link to="/login" className="secondary-button">Login</Link>
          </div>
          <div className="hero-image-container">
            <img 
              src={dashboardImg} 
              alt="Finance Tracker Dashboard" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-key">
        <div className="features-container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to master your personal finances</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon budget-icon">
                <BudgetIcon />
              </div>
              <h3>Smart Budgeting</h3>
              <p>Set daily, weekly, and monthly budgets. Receive alerts when you're approaching your limits.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon analytics-icon">
                <ChartIcon />
              </div>
              <h3>Visual Analytics</h3>
              <p>Understand your spending habits with beautiful charts and detailed breakdowns by category.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon bank-icon">
                <BankIcon />
              </div>
              <h3>Bank Connections</h3>
              <p>Securely connect your bank accounts to automatically import and categorize transactions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon expense-icon">
                <ExpenseIcon />
              </div>
              <h3>Expense Tracking</h3>
              <p>Log expenses manually or automatically. Search, filter, and export your transaction history.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon notification-icon">
                <NotificationIcon />
              </div>
              <h3>Smart Notifications</h3>
              <p>Stay informed with timely alerts about budget status, large expenses, and financial insights.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon security-icon">
                <SecurityIcon />
              </div>
              <h3>Bank-Level Security</h3>
              <p>Your financial data is protected with industry-standard encryption and secure connections.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Detailed Features Section */}
      <section className="features-detailed">
        <div className="features-container">
          <div className="feature-detailed-item">
            <div className="feature-content">
              <h2>Comprehensive Budget Management</h2>
              <p>Take control of your spending with our flexible budgeting tools:</p>
              <ul className="feature-list">
                <li>Set separate budgets for daily, weekly, and monthly periods</li>
                <li>Visualize your budget progress with intuitive progress bars</li>
                <li>Receive timely notifications as you approach spending limits</li>
                <li>Get suggestions for budget adjustments based on your spending patterns</li>
                <li>Track category-specific budgets to fine-tune your financial plan</li>
              </ul>
              <Link to="/register" className="feature-cta">Start Budgeting →</Link>
            </div>
            <div className="feature-image">
              <img 
                src={budgetImg} 
                alt="Budget Management Feature" 
              />
            </div>
          </div>
          
          <div className="feature-detailed-item reverse">
            <div className="feature-content">
              <h2>Automatic Bank Synchronization</h2>
              <p>Save time and eliminate manual data entry with our secure bank connections:</p>
              <ul className="feature-list">
                <li>Connect to thousands of financial institutions securely through Plaid</li>
                <li>Automatically import and categorize your transactions</li>
                <li>View all your accounts in one place with real-time balance updates</li>
                <li>Easily reconcile transactions across multiple accounts</li>
                <li>Keep your financial data private with bank-level security</li>
              </ul>
              <Link to="/register" className="feature-cta">Connect Your Bank →</Link>
            </div>
            <div className="feature-image">
              <img 
                src={bankImg} 
                alt="Bank Synchronization Feature" 
              />
            </div>
          </div>
          
          <div className="feature-detailed-item">
            <div className="feature-content">
              <h2>Insightful Financial Analytics</h2>
              <p>Gain deeper understanding of your finances with powerful visualization tools:</p>
              <ul className="feature-list">
                <li>Interactive pie charts showing your spending by category</li>
                <li>Daily expense trends to identify spending patterns over time</li>
                <li>Comprehensive summary statistics for at-a-glance insights</li>
                <li>Category breakdowns to identify your largest expense areas</li>
                <li>Export capabilities for further analysis in your preferred tools</li>
              </ul>
              <Link to="/register" className="feature-cta">Explore Analytics →</Link>
            </div>
            <div className="feature-image">
              <img 
                src={analyticsImg} 
                alt="Financial Analytics Feature" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="features-testimonials">
        <div className="features-container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied users who've transformed their financial lives</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Finance Tracker has completely changed how I manage my money. The budget alerts have saved me from overspending countless times!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <div className="avatar-placeholder">SM</div>
                </div>
                <div className="author-info">
                  <h4>Sarah M.</h4>
                  <p>Small Business Owner</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The automatic bank sync feature saves me hours each month. I no longer have to manually track every purchase I make."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <div className="avatar-placeholder">JT</div>
                </div>
                <div className="author-info">
                  <h4>James T.</h4>
                  <p>Software Engineer</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The insights from the analytics helped me identify where I was wasting money. I've saved over $500 monthly since I started using this app!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <div className="avatar-placeholder">EL</div>
                </div>
                <div className="author-info">
                  <h4>Emma L.</h4>
                  <p>Marketing Professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Comparison */}
      <section className="features-comparison">
        <div className="features-container">
          <div className="section-header">
            <h2>The Complete Financial Solution</h2>
            <p>Compare our comprehensive features to see why Finance Tracker stands apart</p>
          </div>
          
          <div className="comparison-table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Finance Tracker</th>
                  <th>Basic Budgeting Apps</th>
                  <th>Traditional Banking Apps</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Multi-period Budgeting</td>
                  <td><span className="check">✓</span></td>
                  <td><span className="check">✓</span></td>
                  <td><span className="x">✗</span></td>
                </tr>
                <tr>
                  <td>Automatic Bank Sync</td>
                  <td><span className="check">✓</span></td>
                  <td><span className="partial">Limited</span></td>
                  <td><span className="check">✓</span></td>
                </tr>
                <tr>
                  <td>Category Analytics</td>
                  <td><span className="check">✓</span></td>
                  <td><span className="partial">Basic</span></td>
                  <td><span className="partial">Basic</span></td>
                </tr>
                <tr>
                  <td>Budget Notifications</td>
                  <td><span className="check">✓</span></td>
                  <td><span className="partial">Limited</span></td>
                  <td><span className="x">✗</span></td>
                </tr>
                <tr>
                  <td>Expense Export</td>
                  <td><span className="check">✓</span></td>
                  <td><span className="x">✗</span></td>
                  <td><span className="check">✓</span></td>
                </tr>
                <tr>
                  <td>Spending Insights</td>
                  <td><span className="check">✓</span></td>
                  <td><span className="partial">Limited</span></td>
                  <td><span className="x">✗</span></td>
                </tr>
                <tr>
                  <td>Multiple Account Management</td>
                  <td><span className="check">✓</span></td>
                  <td><span className="x">✗</span></td>
                  <td><span className="partial">Single Bank Only</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="features-faq">
        <div className="features-container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our finance tracker</p>
          </div>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Is my financial data secure?</h3>
              <p>Absolutely. We use bank-level encryption and secure connections through Plaid, an industry-leading financial services provider. We never store your banking credentials and use token-based authentication for all bank connections.</p>
            </div>
            
            <div className="faq-item">
              <h3>How do I connect my bank accounts?</h3>
              <p>After signing up, navigate to the Bank Connections page in your dashboard. Click "Connect Bank Account" and follow the secure prompts to link your accounts through our Plaid integration.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I manually add transactions?</h3>
              <p>Yes! While automatic bank synchronization is convenient, you can always manually add transactions for cash expenses or accounts that aren't connected.</p>
            </div>
            
            <div className="faq-item">
              <h3>How do budget notifications work?</h3>
              <p>Our system monitors your spending against your set budgets. When you reach 50%, 75%, 90%, or 100% of your budget, you'll receive timely notifications to help you stay on track.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I export my financial data?</h3>
              <p>Yes, you can export your transaction data to CSV format for use in spreadsheets or other financial software. This makes tax preparation and financial planning easier.</p>
            </div>
            
            <div className="faq-item">
              <h3>Is there a mobile app available?</h3>
              <p>Our responsive web application works beautifully on mobile devices. We're currently developing dedicated iOS and Android apps for an even better on-the-go experience.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="features-cta">
        <div className="features-container">
          <h2>Ready to Transform Your Financial Life?</h2>
          <p>Join thousands of users who've taken control of their finances with our powerful tracking tools</p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-button">Get Started for Free</Link>
            <Link to="/login" className="secondary-button">Sign In</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;