import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import signUpImg from "../../../static/images/signup.png";
import bankImg from "../../../static/images/bank.png";
import analyticsImg from "../../../static/images/analytics.png";
import budgetImg from "../../../static/images/budget.png";

// Icon components
const ConnectIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 16L14 10L10 14L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 16H20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SetupIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15C19.1277 15.8031 19.2583 16.6718 19.7601 17.37C20.262 17.9682 21.0005 18.3351 21.8 18.35C21.8 18.35 22.67 21.5 20 21.5C18.5 21.5 17.5 20.5 17.5 19V18.65C17.5 17.2985 16.7615 16.0749 15.5 15.5C14.2385 14.9251 12.7615 14.9251 11.5 15.5C10.2385 16.0749 9.49997 17.2985 9.49997 18.65V19C9.49997 20.5 8.49997 21.5 6.99997 21.5C4.32997 21.5 5.19997 18.35 5.19997 18.35C5.99946 18.3351 6.73795 17.9682 7.23979 17.3701C7.74164 16.7719 7.87224 15.9032 7.59997 15.1C7.32771 14.2969 6.65767 13.6687 5.82101 13.45C4.98434 13.2314 4.10585 13.4459 3.49997 14C3.49997 14 1.99997 11.86 3.99997 10.5C5.09997 9.69 6.49997 10 6.99997 10.5H7.34997C8.70144 10.5 9.92505 9.76149 10.5 8.5C11.0749 7.23853 11.0749 5.76149 10.5 4.5C9.92505 3.23853 8.70144 2.5 7.34997 2.5H6.99997C6.49997 3 5.09997 3.31 3.99997 2.5C1.99997 1.14 3.49997 -1 3.49997 -1C4.10585 -0.445855 4.98434 -0.231447 5.82101 -0.45C6.65767 -0.668552 7.32771 -1.29687 7.59997 -2.1C7.87224 -2.90312 7.74164 -3.77185 7.23979 -4.37C6.73795 -4.96815 5.99946 -5.33515 5.19997 -5.35C5.19997 -5.35 4.32997 -8.5 6.99997 -8.5C8.49997 -8.5 9.49997 -7.5 9.49997 -6V-5.65C9.49997 -4.29853 10.2385 -3.07492 11.5 -2.5C12.7615 -1.92507 14.2385 -1.92507 15.5 -2.5C16.7615 -3.07492 17.5 -4.29853 17.5 -5.65V-6C17.5 -7.5 18.5 -8.5 20 -8.5C22.67 -8.5 21.8 -5.35 21.8 -5.35C21.0005 -5.33515 20.262 -4.96815 19.7601 -4.37C19.2583 -3.77185 19.1277 -2.90312 19.4 -2.1C19.6722 -1.29687 20.3423 -0.668552 21.1789 -0.45C22.0156 -0.231447 22.8941 -0.445855 23.5 -1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrackIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3H21V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 21H3V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 14V21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 3H3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 10L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 14L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BudgetIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3L19 12L5 21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HowToUsePage = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    
    // Add animations on scroll
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75);
        
        if (isVisible) {
          section.classList.add('animate-visible');
        }
      });
    };
    
    setTimeout(handleScroll, 100);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="how-to-use-page">
      {/* Header section */}
      <section className="how-to-header-section">
        <div className="how-to-container">
          <div className="how-to-header-content animate-on-scroll">
            <h1>How to Use Finance Tracker</h1>
            <p className="how-to-subtitle">
              Follow this step-by-step guide to take full advantage of all the features
              our finance tracking platform has to offer.
            </p>
            <div className="how-to-header-cta">
              <Link to="/sign-up" className="primary-button">
                Get Started
              </Link>
              <a href="#quick-start" className="text-button">
                Jump to Quick Start
              </a>
            </div>
          </div>
        </div>
        
        <div className="header-decoration">
          <div className="header-glow"></div>
        </div>
      </section>
      
      {/* Overview section */}
      <section className="how-to-overview-section">
        <div className="how-to-container">
          <div className="overview-content animate-on-scroll">
            <h2>Platform Overview</h2>
            <p className="overview-intro">
              Finance Tracker is a comprehensive personal finance management tool that helps you track expenses,
              create budgets, connect bank accounts, and visualize your financial data.
            </p>
            
            <div className="overview-features">
              <div className="overview-feature">
                <div className="feature-icon">
                  <ConnectIcon />
                </div>
                <div className="feature-text">
                  <h3>Bank Connectivity</h3>
                  <p>Securely connect your accounts to automatically import transactions</p>
                </div>
              </div>
              
              <div className="overview-feature">
                <div className="feature-icon">
                  <BudgetIcon />
                </div>
                <div className="feature-text">
                  <h3>Budget Management</h3>
                  <p>Create and track daily, weekly, and monthly spending limits</p>
                </div>
              </div>
              
              <div className="overview-feature">
                <div className="feature-icon">
                  <TrackIcon />
                </div>
                <div className="feature-text">
                  <h3>Expense Tracking</h3>
                  <p>Categorize and monitor all your spending in one place</p>
                </div>
              </div>
              
              <div className="overview-feature">
                <div className="feature-icon">
                  <AnalyticsIcon />
                </div>
                <div className="feature-text">
                  <h3>Visual Analytics</h3>
                  <p>Get insights through interactive charts and detailed breakdowns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Getting Started (Steps) Section */}
      <section className="how-to-steps-section" id="quick-start">
        <div className="how-to-container">
          <div className="steps-header animate-on-scroll">
            <h2>Getting Started</h2>
            <p>Follow these simple steps to set up your account and start tracking your finances</p>
          </div>
          
          <div className="steps-timeline">
            <div className="step-item animate-on-scroll">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Account</h3>
                <p>
                  Sign up with your email address and create a secure password. We'll send you
                  a verification email to confirm your account.
                </p>
                <div className="step-image-container">
                  <div className="step-browser-ui">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-title">Sign Up - Finance Tracker</div>
                  </div>
                  <div className="step-image">
                    <img src={signUpImg} alt="Sign up screen" />
                  </div>
                </div>
                <div className="step-tips">
                  <h4>Pro Tips:</h4>
                  <ul className="tips-list">
                    <li><CheckIcon /> Use a strong, unique password</li>
                    <li><CheckIcon /> Add a profile picture to personalize your account</li>
                    <li><CheckIcon /> Set your local currency for accurate tracking</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="step-item animate-on-scroll">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Connect Your Bank Accounts</h3>
                <p>
                  Securely link your financial accounts to automatically import transactions.
                  We use bank-level encryption to keep your data safe.
                </p>
                <div className="step-image-container">
                  <div className="step-browser-ui">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-title">Connect Banks - Finance Tracker</div>
                  </div>
                  <div className="step-image">
                    <img src={bankImg} alt="Connect bank screen" />
                  </div>
                </div>
                <div className="step-tips">
                  <h4>Pro Tips:</h4>
                  <ul className="tips-list">
                    <li><CheckIcon /> Connect all accounts for a complete financial picture</li>
                    <li><CheckIcon /> Check the sync status to ensure transactions are up-to-date</li>
                    <li><CheckIcon /> You can always add accounts manually if you prefer</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="step-item animate-on-scroll">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Set Up Your Budgets</h3>
                <p>
                  Create personalized budgets for different time periods and categories.
                  We'll help you track your progress and send notifications when you're approaching limits.
                </p>
                <div className="step-image-container">
                  <div className="step-browser-ui">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-title">Budget Setup - Finance Tracker</div>
                  </div>
                  <div className="step-image">
                    <img src={budgetImg} alt="Budget setup screen" />
                  </div>
                </div>
                <div className="step-tips">
                  <h4>Pro Tips:</h4>
                  <ul className="tips-list">
                    <li><CheckIcon /> Start with realistic budget amounts</li>
                    <li><CheckIcon /> Use the 50/30/20 rule as a starting point</li>
                    <li><CheckIcon /> Adjust category limits based on your spending patterns</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="step-item animate-on-scroll">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Track and Analyze Your Finances</h3>
                <p>
                  Review your spending habits, check your budget progress, and gain insights
                  through our interactive charts and analytics tools.
                </p>
                <div className="step-image-container">
                  <div className="step-browser-ui">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-title">Dashboard - Finance Tracker</div>
                  </div>
                  <div className="step-image">
                    <img src={analyticsImg} alt="Dashboard screen" />
                  </div>
                </div>
                <div className="step-tips">
                  <h4>Pro Tips:</h4>
                  <ul className="tips-list">
                    <li><CheckIcon /> Check your dashboard weekly for the best insights</li>
                    <li><CheckIcon /> Export reports for tax preparation or financial planning</li>
                    <li><CheckIcon /> Set goals based on your spending analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 
      <section className="video-tutorials-section">
        <div className="how-to-container">
          <div className="video-tutorials-header animate-on-scroll">
            <h2>Video Tutorials</h2>
            <p>Watch these short videos to master Finance Tracker's features</p>
          </div>
          
          <div className="video-grid animate-on-scroll">
            <div className="video-card">
              <div className="video-thumbnail">
                <div className="play-button">
                  <PlayIcon />
                </div>
                <img src="/images/tutorial-1-thumbnail.png" alt="Getting Started Tutorial" />
              </div>
              <div className="video-info">
                <h3>Getting Started with Finance Tracker</h3>
                <p>A complete walkthrough of the platform's core features</p>
                <span className="video-duration">4:32</span>
              </div>
            </div>
            
            <div className="video-card">
              <div className="video-thumbnail">
                <div className="play-button">
                  <PlayIcon />
                </div>
                <img src="/images/tutorial-2-thumbnail.png" alt="Bank Connectivity Tutorial" />
              </div>
              <div className="video-info">
                <h3>Connecting Your Bank Accounts</h3>
                <p>Learn how to securely link your financial institutions</p>
                <span className="video-duration">3:15</span>
              </div>
            </div>
            
            <div className="video-card">
              <div className="video-thumbnail">
                <div className="play-button">
                  <PlayIcon />
                </div>
                <img src="/images/tutorial-3-thumbnail.png" alt="Budget Creation Tutorial" />
              </div>
              <div className="video-info">
                <h3>Creating Effective Budgets</h3>
                <p>Tips for setting realistic and helpful budget limits</p>
                <span className="video-duration">5:48</span>
              </div>
            </div>
            
            <div className="video-card">
              <div className="video-thumbnail">
                <div className="play-button">
                  <PlayIcon />
                </div>
                <img src="/images/tutorial-4-thumbnail.png" alt="Analytics Tutorial" />
              </div>
              <div className="video-info">
                <h3>Understanding Your Analytics</h3>
                <p>How to interpret and use financial insights</p>
                <span className="video-duration">6:24</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* FAQ Section */}
      <section className="how-to-faq-section">
        <div className="how-to-container">
          <div className="faq-header animate-on-scroll">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about using Finance Tracker</p>
          </div>
          
          <div className="faq-grid animate-on-scroll">
            <div className="faq-item">
              <h3>Is my financial data secure?</h3>
              <p>
                Yes, we use bank-level encryption and secure connections. We never store your 
                banking credentials and all data is encrypted both in transit and at rest.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>Can I manually add transactions?</h3>
              <p>
                Absolutely! While automatic bank synchronization is convenient, you can always 
                manually add transactions for cash expenses or accounts that aren't connected.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>How do I categorize transactions?</h3>
              <p>
                Finance Tracker automatically categorizes most transactions, but you can easily 
                recategorize them by clicking on any transaction and selecting a different category.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>Can I export my financial data?</h3>
              <p>
                Yes, you can export your transaction data to CSV format for use in spreadsheets 
                or other financial software. This makes tax preparation and financial planning easier.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>How often does Finance Tracker sync with my bank?</h3>
              <p>
                We automatically sync with your bank once every 24 hours. You can also manually 
                trigger a sync anytime by clicking the "Sync Now" button in your dashboard.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>What if I need help using the platform?</h3>
              <p>
                Our support team is available 24/7 via chat or email. You can also explore our 
                extensive help center for guides, tutorials, and troubleshooting information.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="how-to-cta-section">
        <div className="how-to-container">
          <div className="cta-content animate-on-scroll">
            <h2>Ready to Get Started?</h2>
            <p>Begin your journey to better financial management today</p>
            <div className="cta-buttons">
              <Link to="/register" className="primary-button">Create Free Account</Link>
              <Link to="/contact" className="secondary-button">Contact Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToUsePage;