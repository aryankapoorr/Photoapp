import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import roscoeImage from '../../constants/roscoe.jpeg'; // Importing the image
import './styles.css';

const Loading = () => {
  return (
    <Box className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h4" className="loading-text" style={{ marginBottom: '16px' }}>
        Loading...
      </Typography>
      <img
        src={roscoeImage}
        alt="Loading Visual"
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
