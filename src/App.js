import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebase';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import EmergencyLogin from './components/EmergencyLogin';
import MyPhotos from './components/MyPhotos';
import Photos from './components/Photos';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); // Set logged-in state based on authentication
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  return (
    <Router>
      {isLoggedIn && <Header />} {/* Show Header only when user is logged in */}
      <Routes>
        <Route path="/" element={!isLoggedIn ? <Auth /> : <LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/emergencylogin" element={<EmergencyLogin />} />
        <Route path="/myphotos" element={<MyPhotos />} />
        <Route path="/photos" element={<Photos />} />
      </Routes>
    </Router>
  );
};

export default App;
