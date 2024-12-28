import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Input, Button, Typography, Box, Card } from '@mui/joy';
import { auth, engagementPhotosDb } from '../../firebase'; // Ensure engagementPhotosDb is imported
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth'; // Firebase methods
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    setMessage('Registration flow triggered.'); // Placeholder action
  };

  // Google Sign-In Success Handler
  const handleGoogleSuccess = async (response) => {
    try {
      // Get the Google credential using the response token
      const credential = GoogleAuthProvider.credential(response.credential);

      // Sign in with the credential using Firebase Authentication
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      // Add user to Firestore with UID as the document ID in the "engagementphotos" database
      const userRef = doc(engagementPhotosDb, "users", user.uid);
      await setDoc(userRef, {
        email: user.email
      });

      // Optionally, you can also log additional user data or perform more actions here
      setMessage(`Hello, ${user.displayName || user.email}! Successfully signed in and added to Firestore.`);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setMessage('Google Sign-In failed. Please try again.');
    }
  };

  // Google Sign-In Failure Handler
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
      </Box>
    </GoogleOAuthProvider>
  );
};

export default Login;
