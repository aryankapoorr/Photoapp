import React, { useState, useEffect } from 'react';
import { Box, Input, Button, Typography, Card } from '@mui/material';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './styles.css';

const EmergencyLogin = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const user = auth.currentUser;
    if (user) {
      setLoggedIn(true); // If user is logged in, show the email
    } else {
      setLoggedIn(false); // If not logged in, show login form
    }
  }, []);

  const handleLogin = async () => {
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    try {
      const password = 'password'; // Fixed password for login
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
      setLoggedIn(true); // User is now logged in
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setLoggedIn(false);
      setMessage('You have been logged out.');
    }).catch((error) => {
      console.error('Error logging out:', error);
      setMessage('Logout failed. Please try again.');
    });
  };

  return (
    <Box className="login-container">
      <Card className="login-card">
        <Typography level="h4" className="login-header">
          {loggedIn ? 'You are logged in!' : 'Emergency Login'}
        </Typography>

        {loggedIn ? (
          <>
            <Typography level="body2" className="login-email">
              Logged in as: {auth.currentUser?.email}
            </Typography>
            <Button
              variant="solid"
              color="primary"
              onClick={handleLogout}
              className="login-button"
              fullWidth
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Typography level="body2" className="login-subheader">
              Please enter your email to login.
            </Typography>

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              fullWidth
            />

            {message && (
              <Typography level="body2" className="login-message">
                {message}
              </Typography>
            )}

            <Button
              variant="solid"
              color="primary"
              onClick={handleLogin}
              className="login-button"
              fullWidth
            >
              Login
            </Button>
          </>
        )}
      </Card>
    </Box>
  );
};

export default EmergencyLogin;
