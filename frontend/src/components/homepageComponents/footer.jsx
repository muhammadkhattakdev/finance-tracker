import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const FinanceTrackerLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.6 2H3.4C2.6 2 2 2.6 2 3.4V20.6C2 21.4 2.6 22 3.4 22H20.6C21.4 22 22 21.4 22 20.6V3.4C22 2.6 21.4 2 20.6 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 9C18.1046 9 19 8.10457 19 7C19 5.89543 18.1046 5 17 5C15.8954 5 15 5.89543 15 7C15 8.10457 15.8954 9 17 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15C13.1046 15 14 14.1046 14 13C14 11.8954 13.1046 11 12 11C10.8954 11 10 11.8954 10 13C10 14.1046 10.8954 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 13L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 10L5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-info-section">
            <div className="footer-logo-container">
              <FinanceTrackerLogo />
              <div className="footer-brand">
                Finance<span>Tracker</span>
              </div>
            </div>
            <p className="footer-description">
              Take control of your finances with our comprehensive suite of tools designed to
              help you track, budget, and visualize your financial journey.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" className="social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.57143 0C1.15313 0 0 1.15313 0 2.57143V15.4286C0 16.8469 1.15313 18 2.57143 18H6.51696V12.142H4.39554V9H6.51696V7.64598C6.51696 4.14643 8.1 2.52321 11.5393 2.52321C12.1902 2.52321 13.3152 2.65179 13.7772 2.78036V5.625C13.5362 5.60089 13.1143 5.58482 12.5879 5.58482C10.9004 5.58482 10.2496 6.22366 10.2496 7.88304V9H13.6085L13.0299 12.142H10.2455V18H15.4286C16.8469 18 18 16.8469 18 15.4286V2.57143C18 1.15313 16.8469 0 15.4286 0H2.57143Z" fill="currentColor" />
                </svg>
              </a>
              <a href="https://instagram.com" className="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.81071 7.22009C7.57671 7.37653 7.37581 7.57753 7.21949 7.81162C7.06316 8.0457 6.95447 8.30829 6.89963 8.58437C6.78887 9.14196 6.90414 9.72071 7.22009 10.1933C7.53604 10.6659 8.02679 10.9936 8.58437 11.1044C9.14196 11.2152 9.72071 11.0999 10.1933 10.7839C10.6659 10.468 10.9936 9.97723 11.1044 9.41964C11.2152 8.86206 11.0999 8.28331 10.7839 7.81071C10.468 7.33812 9.97723 7.01039 9.41964 6.89963C8.86206 6.78887 8.28331 6.90414 7.81071 7.22009ZM13.5281 4.47188C13.3192 4.26295 13.0661 4.09821 12.7888 3.98973C12.0616 3.70446 10.4746 3.71652 9.45 3.72857C9.28527 3.72857 9.13259 3.73259 9 3.73259C8.86741 3.73259 8.71071 3.73259 8.54196 3.72857C7.51741 3.71652 5.93839 3.70045 5.21116 3.98973C4.93393 4.09821 4.68482 4.26295 4.47188 4.47188C4.25893 4.6808 4.09821 4.93393 3.98973 5.21116C3.70446 5.93839 3.72054 7.52946 3.72857 8.55402C3.72857 8.71875 3.73259 8.87143 3.73259 9C3.73259 9.12857 3.73259 9.28125 3.72857 9.44598C3.72054 10.4705 3.70446 12.0616 3.98973 12.7888C4.09821 13.0661 4.26295 13.3152 4.47188 13.5281C4.6808 13.7411 4.93393 13.9018 5.21116 14.0103C5.93839 14.2955 7.52545 14.2835 8.55 14.2714C8.71473 14.2714 8.86741 14.2674 9 14.2674C9.13259 14.2674 9.28929 14.2674 9.45804 14.2714C10.4826 14.2835 12.0616 14.2996 12.7888 14.0103C13.0661 13.9018 13.3152 13.7371 13.5281 13.5281C13.7411 13.3192 13.9018 13.0661 14.0103 12.7888C14.2996 12.0656 14.2835 10.4826 14.2714 9.45402C14.2714 9.28527 14.2674 9.12857 14.2674 8.99598C14.2674 8.86339 14.2674 8.71071 14.2714 8.53795C14.2835 7.51339 14.2996 5.93036 14.0103 5.20312C13.9018 4.92589 13.7371 4.67679 13.5281 4.46384V4.47188ZM10.8321 6.25982C11.5589 6.74574 12.0628 7.50045 12.2331 8.35792C12.4034 9.2154 12.2261 10.1054 11.7402 10.8321C11.4996 11.192 11.1905 11.5009 10.8305 11.7413C10.4705 11.9817 10.0667 12.1488 9.64208 12.2331C8.7846 12.4034 7.8946 12.2261 7.16786 11.7402C6.44112 11.2548 5.93696 10.5006 5.76629 9.6435C5.59563 8.7864 5.77243 7.89661 6.25781 7.16987C6.74319 6.44313 7.49739 5.93897 8.35449 5.7683C9.21159 5.59763 10.1014 5.77444 10.8281 6.25982H10.8321ZM12.0054 6.20759C11.8808 6.12321 11.7804 6.00268 11.7201 5.86205C11.6598 5.72143 11.6478 5.56875 11.6759 5.41607C11.704 5.26339 11.7804 5.1308 11.8848 5.02232C11.9893 4.91384 12.1299 4.84152 12.2786 4.81339C12.4272 4.78527 12.5839 4.79732 12.7246 4.85759C12.8652 4.91786 12.9857 5.01429 13.0701 5.13884C13.1545 5.26339 13.1987 5.41205 13.1987 5.56473C13.1987 5.66518 13.1786 5.76562 13.1424 5.85804C13.1062 5.95045 13.046 6.03482 12.9777 6.10714C12.9094 6.17946 12.821 6.23571 12.7286 6.27589C12.6362 6.31607 12.5357 6.33616 12.4353 6.33616C12.2826 6.33616 12.1339 6.29196 12.0094 6.20759H12.0054ZM18 2.57143C18 1.15313 16.8469 0 15.4286 0H2.57143C1.15313 0 0 1.15313 0 2.57143V15.4286C0 16.8469 1.15313 18 2.57143 18H15.4286C16.8469 18 18 16.8469 18 15.4286V2.57143ZM14.3438 14.3438C13.5924 15.0951 12.6804 15.3321 11.6518 15.3844C10.5911 15.4446 7.40893 15.4446 6.34821 15.3844C5.31964 15.3321 4.40759 15.0951 3.65625 14.3438C2.90491 13.5924 2.66786 12.6804 2.61964 11.6518C2.55937 10.5911 2.55937 7.40893 2.61964 6.34821C2.67187 5.31964 2.90491 4.40759 3.65625 3.65625C4.40759 2.90491 5.32366 2.66786 6.34821 2.61964C7.40893 2.55937 10.5911 2.55937 11.6518 2.61964C12.6804 2.67187 13.5924 2.90491 14.3438 3.65625C15.0951 4.40759 15.3321 5.31964 15.3804 6.34821C15.4406 7.40491 15.4406 10.583 15.3804 11.6478C15.3281 12.6763 15.0951 13.5884 14.3438 14.3397V14.3438Z" fill="currentColor" />
                </svg>
              </a>
              <a href="https://linkedin.com" className="social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 2.57143C18 1.15312 16.8469 0 15.4286 0H2.57143C1.15313 0 0 1.15312 0 2.57143V15.4286C0 16.8469 1.15313 18 2.57143 18H15.4286C16.8469 18 18 16.8469 18 15.4286V2.57143ZM2.77232 6.83839V15.4286H5.4442V6.83839H2.77232ZM2.55938 4.1183C2.55938 4.97009 3.25045 5.66518 4.10625 5.66518C4.96205 5.66518 5.65312 4.97411 5.65312 4.1183C5.65312 3.26652 4.95804 2.57143 4.10625 2.57143C3.25045 2.57143 2.55938 3.26652 2.55938 4.1183ZM12.7728 15.4286H15.4406V10.7196C15.4406 8.40536 14.9384 6.62545 12.2384 6.62545C10.9406 6.62545 10.0688 7.33661 9.71116 8.01161H9.675V6.83839H7.11563V15.4286H9.78348V11.1777C9.78348 10.0567 9.99643 8.97188 11.3866 8.97188C12.7527 8.97188 12.7728 10.2536 12.7728 11.25V15.4286Z" fill="currentColor" />
                </svg>
              </a>
              <a href="https://twitter.com" className="social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 4.01C21.0424 4.67548 19.9821 5.19211 18.86 5.54C18.2577 4.84751 17.4573 4.35418 16.567 4.12085C15.6767 3.88753 14.7395 3.92427 13.8821 4.22426C13.0247 4.52425 12.2884 5.0719 11.773 5.8C11.2575 6.52811 10.9877 7.40577 11 8.3V9.3C9.36831 9.35384 7.75122 8.99742 6.29165 8.2733C4.83208 7.54918 3.57791 6.47953 2.67 5.16C2.67 5.16 -0.830001 13.16 8.17 16.76C6.25975 18.0352 3.98418 18.6894 1.67 18.66C10.67 23.06 21.67 18.66 21.67 8.26C21.6674 7.98312 21.6401 7.7075 21.59 7.44C22.6147 6.44145 23.3399 5.18621 23.69 3.81L22 4.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links-section">
            <div className="footer-links-column">
              <h3 className="footer-links-title">Product</h3>
              <ul className="footer-links-list">
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/dashboard/banks">Integrations</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Resources</h3>
              <ul className="footer-links-list">
                <li><Link to="/how-to-use">Guides</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Company</h3>
              <ul className="footer-links-list">
                <li><Link to="/features">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-contact">
            <a href="mailto:support@financetracker.com" className="footer-email">
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.8 0.800049C0.804375 0.800049 0 1.60442 0 2.60005V3.3313L8.72438 9.79442C8.80313 9.85067 8.89875 9.88442 9 9.88442C9.10125 9.88442 9.19687 9.85067 9.27563 9.79442L18 3.3313V2.60005C18 1.60442 17.1956 0.800049 16.2 0.800049H1.8ZM18 5.57005L10.35 11.24C9.96187 11.5269 9.48938 11.6844 9 11.6844C8.51062 11.6844 8.04375 11.5269 7.65 11.24L0 5.57005V13.4C0 14.3957 0.804375 15.2 1.8 15.2H16.2C17.1956 15.2 18 14.3957 18 13.4V5.57005Z" fill="currentColor" />
              </svg>
              support@financetracker.com
            </a>
          </div>
          
          <div className="footer-legal">
            <div className="footer-copyright">
              © {new Date().getFullYear()} FinanceTracker. All rights reserved.
            </div>
            <div className="footer-legal-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
          
          <div className="footer-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to top
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;