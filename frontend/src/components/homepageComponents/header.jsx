import React, { useState } from "react";
import Logo from "../../static/images/main-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

function Header({ isLoggedInUser, isNavExisted = true, isHome = false }) {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavbar = () => {
    setIsNavOpen(!isNavOpen);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <header className="header">
        <div className="nav-container px-primary">
          <nav className="navbar d-flex align-items-center justify-content-between">
            <div className="nav-logo-box">
              <Link to={"/"}>
                <img src={Logo} alt="" />
              </Link>
            </div>
            <div
              className={
                isNavOpen & isNavExisted
                  ? "responsive-nav-section d-flex align-items-center justify-content-between active"
                  : "responsive-nav-section d-flex align-items-center justify-content-between"
              }
            >
              {!isLoggedInUser ? (
                <div className="nav-links-box">
                  <ul className="nav-links d-flex align-items-center">
                    <li>
                      {isHome ? (
                        <Link to={"/"} className="nav-link">
                          Home
                        </Link>
                      ) : (
                        <a href="#home" className="nav-link">
                          Home
                        </a>
                      )}
                    </li>
                    <li>
                      <a href="#trusted" className="nav-link">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#services" className="nav-link">
                        Service
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                ""
              )}
              {!user ? (
                <div className="nav-registration-btns-box d-flex align-items-center">
                  <Link to={"/login"} className="login-btn">
                    Log in
                  </Link>
                  <button onClick={() => {
                    navigate('/register')
                  }} className="get-started-btn">Get Started</button>
                </div>
              ) : (
                ""
              )}
            </div>
            {user ? (
              <div className="nav-registration-btns-box d-flex align-items-center">
                <Link to={"/account"} className="login-btn">
                  Dashboard
                </Link>
                <button className="logout-btn">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.16667 15.5C1.70833 15.5 1.31597 15.3368 0.989583 15.0104C0.663194 14.684 0.5 14.2917 0.5 13.8333V2.16667C0.5 1.70833 0.663194 1.31597 0.989583 0.989583C1.31597 0.663194 1.70833 0.5 2.16667 0.5H8V2.16667H2.16667V13.8333H8V15.5H2.16667ZM11.3333 12.1667L10.1875 10.9583L12.3125 8.83333H5.5V7.16667H12.3125L10.1875 5.04167L11.3333 3.83333L15.5 8L11.3333 12.1667Z"
                      fill="#090D11"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              ""
            )}

            {isNavExisted ? (
              <div className={isNavOpen ? "nav-toggle light" : "nav-toggle"}>
                <FontAwesomeIcon
                  icon={isNavOpen ? faTimes : faBars}
                  size="2x"
                  onClick={() => handleNavbar()}
                />
              </div>
            ) : (
              ""
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
