import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    adminKey: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated as admin
  React.useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!formData.adminKey.trim()) {
      newErrors.adminKey = 'Admin registration key is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const adminRegister = async (userData) => {
    try {
      const response = await axios.post('/api/auth/admin/register', userData);
      
      const { token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Admin registration successful!');
      
      // Reload to refresh auth context
      window.location.reload();
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Admin registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await adminRegister(userData);
    
    if (!result.success) {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-card">
        <div className="admin-register-header">
          <div className="admin-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
              <path d="M12 7C10.34 7 9 8.34 9 10S10.34 13 12 13 15 11.66 15 10 13.66 7 12 7ZM12 15C9.33 15 7 16.67 7 19H17C17 16.67 14.67 15 12 15Z" fill="currentColor"/>
            </svg>
          </div>
          <h2>Create Admin Account</h2>
          <p>Register as an administrator</p>
        </div>
        
        <form className="admin-register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="adminKey" className="form-label">
              Admin Registration Key
            </label>
            <input
              id="adminKey"
              name="adminKey"
              type="password"
              required
              className={`form-input ${errors.adminKey ? 'error' : ''}`}
              placeholder="Enter admin registration key"
              value={formData.adminKey}
              onChange={handleChange}
            />
            {errors.adminKey && <div className="form-error">{errors.adminKey}</div>}
            <div className="form-help">
              Contact system administrator for the registration key
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-register-btn"
          >
            {loading ? (
              <div className="loading-content">
                <div className="spinner"></div>
                Creating account...
              </div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
                </svg>
                Create Admin Account
              </>
            )}
          </button>

          <div className="admin-links">
            <Link to="/admin/login" className="admin-login-link">
              Already have an admin account? Sign In
            </Link>
            <Link to="/login" className="user-login-link">
              User Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
