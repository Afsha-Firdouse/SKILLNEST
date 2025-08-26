import React from 'react';
import './Header.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  // 🚀 Hide Header on adminDashboard page
  if (location.pathname === "/admin/dashboard") {
    return null;
  }

  return (
    <header className="header">
      <div className="logo-div">
        {isHome ? (
          <>
            <img 
              className="logo" 
              src="https://i.ibb.co/Z1LNnrLZ/logo.png" 
              alt="logo" 
              onClick={() => navigate("/")} 
            />
            <div onClick={() => navigate("/")} className="logo-name">
              SkillNest
            </div>
          </>
        ) : (
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
