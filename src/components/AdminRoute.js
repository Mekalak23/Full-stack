import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
