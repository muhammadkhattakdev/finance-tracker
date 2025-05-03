import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import dashboardImg from "../../../static/images/dashboard.png";


const FinanceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BudgetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SecurityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const scrollValue = window.scrollY;
      const heroImage = document.querySelector('.hero-dashboard-image');
      const heroContent = document.querySelector('.hero-content');
      const orbs = document.querySelectorAll('.background-orb');
      
      if (heroImage) {
        heroImage.style.transform = `translateY(${scrollValue * 0.1}px)`;
      }
      
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollValue * 0.05}px)`;
      }
      
      if (orbs.length) {
        orbs.forEach((orb, index) => {
          const factor = 0.05 + (index * 0.02);
          orb.style.transform = `translate(${scrollValue * factor}px, ${scrollValue * -factor}px)`;
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="homepage">
      <div className="background-decoration">
        <div className="background-orb orb1"></div>
        <div className="background-orb orb2"></div>
        <div className="background-orb orb3"></div>
      </div>
      
      <section className="hero-section">
        <div className="hero-container">
          <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
            <h1 className="hero-title">Take Control of Your Finances</h1>
            <p className="hero-subtitle">
              Track expenses, manage budgets, and gain valuable insights into your financial health with our
              all-in-one personal finance dashboard
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="primary-button">Start For Free</Link>
              <Link to="/features" className="secondary-button">Explore Features</Link>
            </div>
            <div className="hero-metrics">
              <div className="metric">
                <span className="metric-number">50K+</span>
                <span className="metric-label">Active Users</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric">
                <span className="metric-number">$2.5B</span>
                <span className="metric-label">Expenses Tracked</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric">
                <span className="metric-number">4.9/5</span>
                <span className="metric-label">User Rating</span>
              </div>
            </div>
          </div>
          
          <div className="hero-dashboard-wrapper">
            <div className={`hero-dashboard-container ${isVisible ? 'visible' : ''}`}>
              <div className="dashboard-browser-ui">
                <div className="browser-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="hero-dashboard-image">
                <img src={dashboardImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="features-overview-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Everything You Need to Manage Your Money</h2>
            <p>Powerful tools that work together to give you complete financial visibility</p>
          </div>
          
          <div className="features-cards">
            <div className="feature-card">
              <div className="feature-icon">
                <FinanceIcon />
              </div>
              <h3>Smart Expense Tracking</h3>
              <p>Automatically categorize and track your expenses across all your accounts with bank-grade security.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <BudgetIcon />
              </div>
              <h3>Flexible Budgeting</h3>
              <p>Create daily, weekly, and monthly budgets. Get instant notifications when you approach your limits.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <AnalyticsIcon />
              </div>
              <h3>Insightful Analytics</h3>
              <p>Visualize your spending patterns with interactive charts and discover where your money goes.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <SecurityIcon />
              </div>
              <h3>Bank-Level Security</h3>
              <p>Your data is encrypted with bank-grade security. We never store your banking credentials.</p>
            </div>
          </div>
          
          <div className="features-cta">
            <Link to="/features" className="text-button">Explore All Features <span>→</span></Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="features-container">
          <div className="section-header">
            <h2>How Finance Tracker Works</h2>
            <p>Simple, powerful, and secure — all in one place</p>
          </div>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Connect Your Accounts</h3>
              <p>Link your bank accounts securely through our trusted Plaid integration to automatically import transactions.</p>
            </div>
            
            <div className="steps-arrow"></div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Set Your Budgets</h3>
              <p>Create customized budgets for different time periods and categories based on your financial goals.</p>
            </div>
            
            <div className="steps-arrow"></div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Gain Insights</h3>
              <p>Visualize your spending patterns, identify saving opportunities, and optimize your financial decisions.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Loved by Thousands</h2>
            <p>Join our growing community of financially savvy users</p>
          </div>
          
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </div>
              <p className="testimonial-text">"This app completely changed how I manage my finances. The insights it provides have helped me save over $400 each month!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <div className="avatar-placeholder">JD</div>
                </div>
                <div className="author-info">
                  <h4>Jamie Doe</h4>
                  <p>Marketing Director</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </div>
              <p className="testimonial-text">"I love how it automatically categorizes my expenses. The budget notifications have saved me from overspending countless times."</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <div className="avatar-placeholder">AT</div>
                </div>
                <div className="author-info">
                  <h4>Alex Taylor</h4>
                  <p>Software Developer</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </div>
              <p className="testimonial-text">"The visualization tools are incredible. I finally understand where my money goes each month and have been able to cut unnecessary expenses."</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <div className="avatar-placeholder">SJ</div>
                </div>
                <div className="author-info">
                  <h4>Sam Johnson</h4>
                  <p>Small Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Teaser Section
      <section className="pricing-teaser-section">
        <div className="pricing-glass-card">
          <div className="pricing-header">
            <h2>Start Managing Your Finances Today</h2>
            <p>Choose the plan that works for your financial goals</p>
          </div>
          
          <div className="pricing-tiers">
            <div className="pricing-tier">
              <div className="tier-header">
                <h3>Free</h3>
                <div className="tier-price">
                  <span className="price">$0</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <div className="tier-features">
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Basic expense tracking</span>
                </div>
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Monthly budget setting</span>
                </div>
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Connect up to 2 accounts</span>
                </div>
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Basic analytics</span>
                </div>
              </div>
              <Link to="/register" className="tier-button free">Get Started</Link>
            </div>

            <div className="pricing-tier premium">
              <div className="tier-badge">Coming Soon</div>
              <div className="tier-header">
                <h3>Premium</h3>
                <div className="tier-price">
                  <span className="price">$7.99</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <div className="tier-features">
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Advanced expense tracking</span>
                </div>
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Daily, weekly & monthly budgets</span>
                </div>
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Unlimited account connections</span>
                </div>
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Advanced analytics & insights</span>
                </div>
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Custom categories & tagging</span>
                </div>
                <div className="tier-feature">
                  <CheckIcon />
                  <span>Data export capabilities</span>
                </div>
              </div>
              <Link to="/register" className="tier-button premium">Start 14-Day Trial</Link>
            </div>
          </div>
          
          <div className="pricing-cta">
            <Link to="/pricing" className="text-button">View Full Pricing Details <span>→</span></Link>
          </div>
        </div>
      </section> */}
      
      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="features-container">
          <div className="cta-content">
            <h2>Ready to take control of your finances?</h2>
            <p>Join thousands of users who have transformed their financial lives</p>
            <div className="cta-buttons">
              <Link to="/register" className="primary-button">Get Started For Free</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;