import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { useAuth } from "../../../context/authContext";
import NotificationDropdown from "../notificationDropdown/notificationDropdown";
import { useNotifications } from "../../../context/notificationsContext";

const DashboardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 3H3V10H10V3Z"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 3H14V10H21V3Z"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 14H14V21H21V14Z"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 14H3V21H10V14Z"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BankIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 21H21"
    className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 10H21"

      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 6L12 3L19 6"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 10V21"
    className="sidebar-icon-path"
      
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 10V21"
    className="sidebar-icon-path"
      
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 14V17"
    className="sidebar-icon-path"
      
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 14V17"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 14V17"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ExpensesIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V9Z"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 14C16 12.3431 14.6569 11 13 11C11.3431 11 10 12.3431 10 14C10 15.6569 11.3431 17 13 17C14.6569 17 16 15.6569 16 14Z"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 9V7C22 5.89543 21.1046 5 20 5H4C2.89543 5 2 5.89543 2 7V9"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 10V17"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 10V17"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AnalyticsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 20V10"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 20V4"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 20V14"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 20H22"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NotificationsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17L21 12L16 7"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12H9"
      className="sidebar-icon-path"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Sidebar = ({ mobileOpen, setMobileOpen, collapsed, toggleSidebar }) => {
    const { currentUser, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const location = useLocation();
    const navigate = useNavigate();
  
    const navItems = [
      { path: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> },
      { path: "/dashboard/expenses", name: "Expenses", icon: <ExpensesIcon /> },
      { path: "/dashboard/analytics", name: "Expense Analytics", icon: <AnalyticsIcon /> },
      { path: "/dashboard/banks", name: "Connect to Bank", icon: <BankIcon /> },
      { 
        path: "/dashboard/notifications", 
        name: "Notifications", 
        icon: <NotificationsIcon />,
        badge: unreadCount > 0 ? unreadCount : null
      },
      { path: "/profile", name: "Profile", icon: <ProfileIcon /> },
    ];
  
    const handleLogout = async () => {
      try {
        await logout();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
  
    return (
      <>
        <aside
          className={`sidebar ${collapsed ? "collapsed" : ""} ${
            mobileOpen ? "mobile-open" : ""
          } ${window.innerWidth < 768 && !mobileOpen ? "mobile-hidden" : ""}`}
        >
          <div className="sidebar-header">
            <div className="logo-container">
              <div className="logo-icon-wrapper">
                <span className="logo-icon">FT</span>
              </div>
              {(!collapsed || mobileOpen) && (
                <h1 className="logo-text">Finance Tracker</h1>
              )}
            </div>
            <button
              className="collapse-button"
              onClick={toggleSidebar}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>
  
          <div className="sidebar-user">
            <div className="avatar">
              {currentUser?.first_name?.charAt(0) || "U"}
              {currentUser?.last_name?.charAt(0) || "S"}
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="user-info">
                <h3 className="user-name">
                  {currentUser?.first_name || "User"}{" "}
                  {currentUser?.last_name || ""}
                </h3>
                <p className="user-email">
                  {currentUser?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>
  
          <nav className="sidebar-nav">
            <ul>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={location.pathname === item.path ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      if (mobileOpen) setMobileOpen(false);
                    }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {(!collapsed || mobileOpen) && (
                      <span className="nav-text">{item.name}</span>
                    )}
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                    {(!collapsed || mobileOpen) &&
                      location.pathname === item.path && (
                        <span className="active-indicator"></span>
                      )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
  
          <div className="sidebar-footer">
            <button className="logout-button" onClick={handleLogout}>
              <span className="nav-icon">
                <LogoutIcon />
              </span>
              {(!collapsed || mobileOpen) && (
                <span className="nav-text">Logout</span>
              )}
            </button>
          </div>
        </aside>
      </>
    );
  };
  
  export default Sidebar;