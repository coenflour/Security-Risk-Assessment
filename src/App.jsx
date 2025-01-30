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

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route path='/login' element={<Login />} />

        {/* Semua halaman ini harus login dulu */}
        <Route 
          path='/result' 
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/ai-detector' 
          element={
            <ProtectedRoute>
              <AIdec />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/about-us' 
          element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/assesment' 
          element={
            <ProtectedRoute>
              <Assesment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/home' 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
