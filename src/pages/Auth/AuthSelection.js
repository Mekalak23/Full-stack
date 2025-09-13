import React from 'react';
import { Link } from 'react-router-dom';

const AuthSelection = () => {
  return (
    <div className="auth-selection-container">
      <div className="auth-selection-card">
        <div className="auth-selection-header">
          <h1>Welcome to FurniShop</h1>
          <p>Please select your login type to continue</p>
        </div>
        
        <div className="auth-options">
          <Link to="/user/login" className="auth-option user-option">
            <div className="auth-option-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor"/>
                <path d="M12 14C8.67 14 2 15.67 2 19V22H22V19C22 15.67 15.33 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>User Login</h3>
            <p>Access your account to shop furniture</p>
            <div className="auth-option-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
          
          <Link to="/admin/login" className="auth-option admin-option">
            <div className="auth-option-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor"/>
                <path d="M12 14C8.67 14 2 15.67 2 19V22H22V19C22 15.67 15.33 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Admin Login</h3>
            <p>Access admin dashboard and manage products</p>
            <div className="auth-option-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        </div>
        
        <div className="auth-selection-footer">
          <p>Don't have an account? <Link to="/user/register" className="register-link">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AuthSelection;
