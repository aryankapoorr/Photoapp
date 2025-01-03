import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import roscoeImage from '../../constants/roscoe.jpeg'; // Importing the image
import kyloImage from '../../constants/kylo.jpg';
import './styles.css';
import { useState, useEffect, useRef } from 'react';

const Loading = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const isInitialized = useRef(false); // Track if logic has already run
  
    useEffect(() => {
      if (!isInitialized.current) {
        // Get the last displayed image from localStorage
        const lastImage = localStorage.getItem('lastLoadingImage');
        const newImage = lastImage === 'roscoe' ? kyloImage : roscoeImage;
  
        // Update the selected image
        setSelectedImage(newImage);
  
        // Update localStorage with the new image name
        localStorage.setItem('lastLoadingImage', newImage === roscoeImage ? 'roscoe' : 'kylo');
  
        // Mark the logic as executed
        isInitialized.current = true;
      }
    }, []);

  return (
    <Box className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h4" className="loading-text" style={{ marginBottom: '16px' }}>
        Loading...
      </Typography>
      <img
        src={selectedImage}
        style={{
          width: '200px',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '50%',
          marginBottom: '16px',
        }}
      />
      <Box className="loading-bar-container" style={{ width: '80%', marginBottom: '8px' }}>
        <LinearProgress className="loading-bar" />
      </Box>
      <Typography variant="body2" className="loading-subtext">
        Sit tight✨
      </Typography>
    </Box>
  );
};

export default Loading;
