// src/App.js
import React from 'react';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import EmergencyLogin from './components/EmergencyLogin';

function App() {
  return (
    <Router>
      <Header />
      <div className="body-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/emergencylogin" element={<EmergencyLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
