import React, { useEffect, useState } from 'react';
import { FaCogs, FaHeart, FaHome, FaShoppingCart, FaSignInAlt, FaTruck, FaUser, FaUserCircle, FaUserShield, FaUtensils } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/layout.css";

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("userName");

  useEffect(() => {
    setIsLoggedIn(true);
    setUserName(name);
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate('/login');
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand font-weight-bold" to="#"><FaUtensils className="me-1" /> Food Ordering System</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item mx-1">
                <Link className="nav-link" to="/"><FaHome className="me-1" />Home</Link>
              </li>
              <li className="nav-item mx-1">
                <Link className="nav-link" to="#"><FaUtensils className="me-1" />Menu</Link>
              </li>
              <li className="nav-item mx-1">
                <Link className="nav-link" to="#"><FaTruck className="me-1" />Track</Link>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="nav-item mx-1">
                    <Link className="nav-link" to="/register"><FaSignInAlt className="me-1" />Register</Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link" to="/login"><FaSignInAlt className="me-1" />Login</Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link" to="#"><FaUserShield className="me-1" />Admin</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item mx-1">
                    <Link className="nav-link" to="#"><FaUser className="me-1" />My Orders</Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link" to="/cart"><FaShoppingCart className="me-1" />Cart</Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link" to="#"><FaHeart className="me-1" />Wishlist</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle text-capitalize" to="#" role="button" data-bs-toggle="dropdown">
                      <FaUserCircle className="me-1" /> {userName}
                    </a>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="#"><FaUser className="me-1" />Profile</Link></li>
                      <li><Link className="dropdown-item" to="#"><FaCogs className="me-1" />Settings</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={handleLogout}><FaSignInAlt className="me-1" />Logout</button></li>
                    </ul>
                  </li>
                </>
              )
              }
            </ul>
          </div>
        </div>
      </nav>

      <div>{children}</div>

      <footer className="text-center py-3 mt-5">
        <div className="container">
          <p>&copy; 2026 Food Ordering System. All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout;