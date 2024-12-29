import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Input, Button, Typography, Box, Card } from '@mui/joy';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Material-UI imports
import { auth, engagementPhotosDb } from '../../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  isSignInWithEmailLink,  // Add this import
  signInWithEmailLink,    // Add this import
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import './styles.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const [name, setName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

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

    // Validate email format
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      // Static password for email registration (not used for existing users)
      const password = 'password';

      // Attempt to create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add the user to Firestore with UID as the document ID
      await setDoc(doc(engagementPhotosDb, 'users', user.uid), { email: user.email });

      setMessage('User successfully registered! Please enter your name.');
      setCurrentUserId(user.uid);
      setNamePromptOpen(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // If email already exists, sign the user in with the hardcoded password
        try {
          const password = 'password';
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          setCurrentUserId(user.uid);

          const userRef = doc(engagementPhotosDb, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            await setDoc(userRef, { email: user.email });
            setMessage('Welcome back! Please enter your name.');
            setNamePromptOpen(true);
          } else if (!userDoc.data().name) {
            setMessage('Welcome back! Please enter your name.');
            setNamePromptOpen(true);
          } else {
            setMessage(`Hello, ${userDoc.data().name || user.email}!`);
          }
        } catch (signInError) {
          console.error('Error signing in:', signInError);
          setMessage('Sign-in failed. Please try again.');
        }
      } else {
        console.error('Error during email registration:', error);
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
        setNamePromptOpen(true);
      } else if (!userDoc.data().name) {
        setMessage('Welcome back! Please enter your name.');
        setCurrentUserId(user.uid);
        setNamePromptOpen(true);
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

  useEffect(() => {
    const completeSignInWithEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let storedEmail = window.localStorage.getItem('emailForSignIn');
        if (!storedEmail) {
          storedEmail = window.prompt('Please provide your email for confirmation.');
        }

        try {
          const userCredential = await signInWithEmailLink(auth, storedEmail, window.location.href);
          const user = userCredential.user;

          setMessage(`Welcome back, ${user.email}!`);
          window.localStorage.removeItem('emailForSignIn');
        } catch (error) {
          console.error('Error completing email link sign-in:', error);
          setMessage('Failed to sign in. Please try again.');
        }
      }
    };

    completeSignInWithEmailLink();
  }, []);

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
            onClick={handleRegister}
            className="login-button"
            fullWidth
          >
            Proceed
          </Button>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              width="100%"
              className="google-login-button"
            />
          </div>
        </Card>

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

export default Auth;
