import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Input, Button, Typography, Box, Card } from '@mui/joy';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Import from Material-UI
import { auth, engagementPhotosDb } from '../../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const [name, setName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  const handleNameSubmit = async () => {
    try {
      if (currentUserId && name) {
        const userRef = doc(engagementPhotosDb, 'users', currentUserId);
        await updateDoc(userRef, { name });
        setMessage('Your name has been saved successfully!');
        setNamePromptOpen(false);
        setName('');
      }
    } catch (error) {
      console.error('Error saving name:', error);
      setMessage('Failed to save your name. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    try {
      // Static password for email login
      const password = 'password';

      // Attempt to create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add the user to Firestore with UID as the document ID
      const userRef = doc(engagementPhotosDb, 'users', user.uid);
      await setDoc(userRef, { email: user.email });

      setMessage('User successfully registered! Please enter your name.');
      setCurrentUserId(user.uid);
      setNamePromptOpen(true); // Open the name prompt
    } catch (error) {
      // If the user already exists, attempt to log them in
      if (error.code === 'auth/email-already-in-use') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, 'password');
          const user = userCredential.user;

          // Check if the user has a name field in Firestore
          const userRef = doc(engagementPhotosDb, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists() && !userDoc.data().name) {
            setMessage('Welcome back! Please enter your name.');
            setCurrentUserId(user.uid);
            setNamePromptOpen(true); // Open the name prompt
          } else {
            setMessage(`Welcome back, ${userDoc.data().name || user.email}!`);
          }
        } catch (loginError) {
          console.error('Login error:', loginError);
          setMessage('Login failed. Please try again.');
        }
      } else {
        console.error('Registration error:', error);
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const credential = GoogleAuthProvider.credential(response.credential);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      const userRef = doc(engagementPhotosDb, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, { email: user.email });
        setMessage('Google Sign-In successful! Please enter your name.');
        setCurrentUserId(user.uid);
        setNamePromptOpen(true); // Open the name prompt
      } else if (!userDoc.data().name) {
        setMessage('Welcome back! Please enter your name.');
        setCurrentUserId(user.uid);
        setNamePromptOpen(true); // Open the name prompt
      } else {
        setMessage(`Hello, ${userDoc.data().name || user.email}!`);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setMessage('Google Sign-In failed. Please try again.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In Failed:', error);
    setMessage('Google Sign-In failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Box className="login-container">
        <Card className="login-card">
          <Typography level="h4" className="login-header">
            Welcome Back!
          </Typography>
          <Typography level="body2" className="login-subheader">
            Please enter your email to proceed or sign in with Google.
          </Typography>

          {/* Email Input */}
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            fullWidth
          />

          {/* Message */}
          {message && (
            <Typography level="body2" className="login-message">
              {message}
            </Typography>
          )}

          {/* Proceed Button */}
          <Button
            variant="solid"
            color="primary"
            onClick={handleRegister}
            className="login-button"
            fullWidth
          >
            Proceed
          </Button>

          {/* Google Sign-In Button */}
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              width="100%"
              className="google-login-button"
            />
          </div>
        </Card>

        {/* Name Prompt Dialog */}
        <Dialog open={namePromptOpen} onClose={() => setNamePromptOpen(false)}>
          <DialogTitle>Enter Your Name</DialogTitle>
          <DialogContent>
            <Input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNameSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default Login;
