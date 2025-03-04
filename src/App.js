import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebase';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import EmergencyLogin from './components/EmergencyLogin';
import MyPhotos from './components/MyPhotos';
import Photos from './components/Photos';
import Loading from './components/Loading'; // Import the Loading component
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#705C53',
    },
    secondary: {
      main: '#B7B7B7',
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#705C53',
        },
        selected: {
          color: '#705C53',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          color: '#705C53', // Color for text of pagination
        },
        ul: {
          justifyContent: 'center', // Center pagination items
        },
        item: {
          '&.Mui-selected': {
            backgroundColor: '#705C53', // Selected pagination item background color
            color: 'white', // Selected text color
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#B7B7B7', // Set the text color of all buttons to #B7B7B7
        },
        '&.MuiButton-contained': {
          color: '#B7B7B7', // Adjust for contained button
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '2rem', // Increase font size for primary text
          fontWeight: 'bold', // Make the text bold
        },
        secondary: {
          fontSize: '1.2rem', // Optional: Adjust secondary text size
          fontWeight: 'normal', // Optional: Set secondary text weight
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#EDDFE0',  // Background color for Dialog
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#705C53',  // Text color for Typography inside DialogContent
        },
      },
    },
    MuiTypography: {
      fontFamily: 'Charm'
    },
  },
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); // Set logged-in state based on authentication
      setIsLoading(false); // Stop loading once the auth state is determined
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  if (isLoading) {
    return <Loading />; // Show the Loading screen while loading
  }

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};

export default App;
