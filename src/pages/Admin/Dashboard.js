import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/orders'),
        axios.get('/api/users')
      ]);

      const products = productsRes.data.products || productsRes.data || [];
      const orders = ordersRes.data.orders || ordersRes.data || [];
      const users = usersRes.data.users || usersRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue
      });

      // Get recent orders (last 5)
      const sortedOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOrders(sortedOrders);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card products">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7L12 3L4 7L12 11L20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 17L12 21L20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 14L11 16L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21V19C23 18.1332 22.7361 17.3328 22.2722 16.6666C21.8083 16.0003 21.1741 15.5251 20.4442 15.2687" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.7299 3.38637 17.3641 3.86165 17.828 4.52785C18.2919 5.19404 18.5558 5.99439 18.5558 6.86123C18.5558 7.72807 18.2919 8.52841 17.828 9.19461C17.3641 9.8608 16.7299 10.3361 16 10.5925" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-number">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/products" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Manage Products</h3>
            <p>Add, edit, or remove products</p>
          </Link>

          <Link to="/admin/orders" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3.89543 5 4.89543 4 6 4H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>View Orders</h3>
            <p>Manage customer orders</p>
          </Link>

          <div className="action-card" onClick={() => window.location.reload()}>
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9C19.9828 7.56678 19.1209 6.28825 17.9845 5.27455C16.8482 4.26085 15.4745 3.54933 13.9917 3.20137C12.5089 2.85342 10.9652 2.87962 9.49337 3.27785C8.02157 3.67608 6.67099 4.43574 5.56 5.49L1 10M23 14L18.44 18.51C17.329 19.5643 15.9784 20.3239 14.5066 20.7222C13.0348 21.1204 11.4911 21.1466 10.0083 20.7986C8.52547 20.4507 7.1518 19.7392 6.01547 18.7255C4.87913 17.7117 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Refresh Data</h3>
            <p>Update dashboard statistics</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <div className="orders-table">
          {recentOrders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order.orderNumber || order._id.slice(-6)}</td>
                    <td>{order.shippingAddress?.name || 'N/A'}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-orders">
              <p>No recent orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
