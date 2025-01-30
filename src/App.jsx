import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
        <Route path='/login' element={<Login />} />
        <Route path='/result' element={<Result />} />
        <Route path='/ai-detector' element={<AIdec />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/assesment' element={<Assesment />} />
        
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
