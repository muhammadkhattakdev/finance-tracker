import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './style.css';

const additionalStyles = `
  @media (max-width: 768px) {
    .sidebar:not(.mobile-open) {
      transform: translateX(-100%);
    }
  }
`;

import Sidebar from '../../dashoardComponents/sidebar/sidebar';


const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
        setMobileOpen(false);
      } else if (window.innerWidth >= 768 && window.innerWidth < 1200) {
        setCollapsed(true);
        setMobileOpen(false);
      } else if (window.innerWidth >= 1200) {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="dashboard-container">
      <style>{additionalStyles}</style>
      <button 
        className="mobile-menu-button" 
        onClick={toggleMobileSidebar}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <Sidebar 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
      />

      <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Outlet />
      </main>

      <div 
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} 
        onClick={toggleMobileSidebar}
      ></div>
    </div>
  );
};

export default DashboardLayout;