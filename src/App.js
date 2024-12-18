import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';  // Import Header
import LandingPage from './components/LandingPage';  // Your landing page component
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />  {/* This will appear on every page */}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Add more routes as you build other components */}
      </Routes>
    </Router>
  );
};

export default App;
