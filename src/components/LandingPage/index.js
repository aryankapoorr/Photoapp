import React, { useState } from 'react';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';  // Camera icon for "Add Photo"
import './styles.css';

const LandingPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Toggle the drawer open/close
  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  // Trigger file input click
  const handleAddPhotoClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div className="landing-page">
      {/* Hamburger Icon for Drawer */}
      <IconButton
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={() => toggleDrawer(true)}
        className="menu-icon"
      >
        <MenuIcon />
      </IconButton>

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

      {/* Drawer with options */}
      <Drawer
        anchor="top" // Drawer opens from top
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        variant="temporary" // Ensures it closes when clicking outside
      >
        <List>
          <ListItem button onClick={() => toggleDrawer(false)}>
            <ListItemText primary="Option 1" />
          </ListItem>
          <ListItem button onClick={() => toggleDrawer(false)}>
            <ListItemText primary="Option 2" />
          </ListItem>
          <ListItem button onClick={() => toggleDrawer(false)}>
            <ListItemText primary="Option 3" />
          </ListItem>
        </List>

        {/* Close Button at the Bottom Center */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={() => toggleDrawer(false)}
          className="close-btn"
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </div>
  );
};

export default LandingPage;
