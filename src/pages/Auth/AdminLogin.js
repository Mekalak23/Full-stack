import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  // Redirect if already authenticated as admin
  React.useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, from]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const adminLogin = async (email, password) => {
    try {
      // Only allow the specific admin credentials
      if (email !== 'admin@furnishop.com' || password !== 'admin123') {
        toast.error('Invalid admin credentials. Only authorized admin can access.');
        return { success: false, message: 'Invalid admin credentials' };
      }

      const response = await axios.post('/api/auth/admin/login', {
        email,
        password
      });

      const { token: newToken } = response.data;
      
      // Store token and set axios header
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Admin login successful!');
      
      // Reload to refresh auth context
      window.location.reload();
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await adminLogin(formData.email, formData.password);
    
    if (!result.success) {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="text-center mb-4">
            <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Login Options
            </Link>
          </div>
          <div className="admin-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor"/>
              <path d="M12 14C8.67 14 2 15.67 2 19V22H22V19C22 15.67 15.33 14 12 14Z" fill="currentColor"/>
            </svg>
          </div>
          <h2>Admin Portal</h2>
          <p>Authorized admin access only</p>
        </div>
        
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Admin Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-input"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-login-btn"
          >
            {loading ? (
              <div className="loading-content">
                <div className="spinner"></div>
                Signing in...
              </div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign In to Admin Panel
              </>
            )}
          </button>

          <div className="demo-credentials">
            
            <p className="text-sm text-red-600 mt-2">⚠️ Only this specific account can access admin panel</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
