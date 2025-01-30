import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();

    // If the user is not authenticated, redirect to login
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // If the user is authenticated, render the children (the component passed to ProtectedRoute)
    return children;
};

export default ProtectedRoute;
