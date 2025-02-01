import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    // Redirect to login page if user is not logged in
    return <Navigate to="/login" replace />;
  }

  return element;  // Allow access to protected page if logged in
};

export default ProtectedRoute;
