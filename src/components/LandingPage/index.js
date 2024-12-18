import React, {  } from 'react';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';  // Camera icon for "Add Photo"
import './styles.css';

const LandingPage = () => {
  // Trigger file input click
  const handleAddPhotoClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div className="landing-page">
      {/* Floating Camera Icon for "Add Photo" */}
      <IconButton
        color="primary"
        onClick={handleAddPhotoClick}
        className="floating-camera-icon"
      >
        <PhotoCameraIcon />
      </IconButton>

      {/* Hidden file input */}
      <input
        type="file"
        id="file-input"
        style={{ display: 'none' }}
        accept="image/*"
      />
    </div>
  );
};

export default LandingPage;
