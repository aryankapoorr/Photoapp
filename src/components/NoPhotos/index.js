import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SentimentVeryDissatisfied } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NoPhotos = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '30px',
      }}
    >
      {/* Icon */}
      <SentimentVeryDissatisfied
        sx={{
          fontSize: '80px',
          color: '#705C53',
          marginBottom: '20px',
        }}
      />

      {/* Main message */}
      <Typography
        sx={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#705C53',
          marginBottom: '10px',
        }}
      >
        Oops! No Photos Yet
      </Typography>

      {/* Additional text and link */}
      <Typography
        sx={{
          fontSize: '1rem',
          color: '#705C53',
          marginTop: '20px',
        }}
      >
        Visit the{' '}
        <Link
          to="/"
          style={{
            color: '#0000FF',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          home page
        </Link>{' '}
        to add/upload photos.
      </Typography>
    </Box>
  );
};

export default NoPhotos;
