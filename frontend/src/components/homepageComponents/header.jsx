import React from "react";
import { Link } from "react-router-dom";


export default function Header() {
  return (
    <>
      <section className="header">
        <div className="features-container">
          <h1>All-in-One Financial Tracking</h1>
          <p className="features-subtitle">
            Take control of your finances with our comprehensive suite of tools
            designed to help you track, budget, and visualize your financial
            journey
          </p>
          <div className="header-buttons">
            <Link to="/register" className="primary-button">
              Start for Free
            </Link>
            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
          <div className="hero-image-container">

          </div>
        </div>
      </section>
    </>
  );
}
