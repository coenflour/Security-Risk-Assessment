import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Result from './pages/Result/Result';
import Dashboard from './pages/Dashboard/Dashboard';
import AboutUs from './pages/AboutUs/aboutus';
import AIdec from './pages/AI Detector/AIdec';
import Assesment from './pages/Steps/assesment';
import Department from './pages/Departmen/department';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path='/login' 
          element={localStorage.getItem("userEmail") ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path='/home' 
          element={<ProtectedRoute element={<Home />} />} 
        />
        <Route 
          path='/dashboard' 
          element={<ProtectedRoute element={<Dashboard />} />} 
        />
        <Route 
          path='/assesment' 
          element={<ProtectedRoute element={<Assesment />} />} 
        />
        <Route 
          path='/AIdec' 
          element={<ProtectedRoute element={<AIdec />} />} 
        />
        <Route 
          path='/Mine' 
          element={<ProtectedRoute element={<Result />} />} 
        />
        <Route 
          path='/Department' 
          element={<ProtectedRoute element={<Department />} />} 
        />
        <Route path='/about-us' element={<AboutUs />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
