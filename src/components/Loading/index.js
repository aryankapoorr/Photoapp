import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import './styles.css';

const Loading = () => {
  return (
    <Box className="loading-container">
      <Typography variant="h4" className="loading-text">
        Loading...
      </Typography>
      <Box className="loading-bar-container">
        <LinearProgress className="loading-bar" />
      </Box>
      <Typography variant="body2" className="loading-subtext">
        Sit tight✨
      </Typography>
    </Box>
  );
};

export default Loading;
