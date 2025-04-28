import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const NotFoundPage = () => {
  useEffect(() => {
    document.body.classList.add('not-found-body');
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('not-found-body');
    };
  }, []);

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">
          <div className="digit four-left">4</div>
          <div className="digit zero">
            <div className="planet">
              <div className="circle"></div>
              <div className="craters">
                <div className="crater"></div>
                <div className="crater"></div>
                <div className="crater"></div>
              </div>
              <div className="orbit">
                <div className="satellite"></div>
              </div>
            </div>
          </div>
          <div className="digit four-right">4</div>
        </div>
        
        <h1>Page Not Found</h1>
        <p>Oops! Looks like you've ventured into unknown space.</p>
        <p>The page you're looking for might have been moved, deleted, or never existed.</p>
        
        <div className="actions">
          <Link to="/" className="primary-button">
            Return Home
          </Link>
          <Link to="/how-to-use" className="secondary-button">
            View Guide
          </Link>
        </div>
        
        <div className="stars">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}></div>
          ))}
        </div>
        
        <div className="shooting-stars">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="shooting-star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 3 + Math.random() * 3}s`
            }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;