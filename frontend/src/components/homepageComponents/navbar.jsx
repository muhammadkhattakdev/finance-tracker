import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

// Logo component
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

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  
  // Add scroll event listener to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <div className="logo-icon">
            </div>
            <div className="logo-text">Finance<span>Tracker</span></div>
          </Link>
        </div>
        
        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/features" className={location.pathname === '/features' ? 'active' : ''}>
                Features
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/how-to-use" className={location.pathname === '/how-to-use' ? 'active' : ''}>
                How To Use
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>
                Pricing
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
                About
              </Link>
            </li> */}
          </ul>
          
          <div className="nav-buttons">
            <Link to="/login" className="login-button">
              Login
            </Link>
            <Link to="/register" className="signup-button">
              Get Started
            </Link>
          </div>
        </div>
        
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;