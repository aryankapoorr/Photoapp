// src/components/Header.js
import React, { useState } from 'react';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { Button } from '@mui/joy';  // Import Joy UI Button
import './styles.css';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleUploadClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div className="header">
      {/* Upload Photos Button (Joy UI) */}
      <Button
        variant="soft"
        color="primary"
        onClick={handleUploadClick}
        className="upload-btn"
      >
        upload photos
      </Button>

      {/* Hamburger Menu Icon */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => toggleDrawer(true)}
        className="menu-icon"
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        variant="temporary"
      >
        <List>
          {/* New Home Option */}
          <ListItem button onClick={() => toggleDrawer(false)}>
            <Link to="/">
              <ListItemText primary="Home" />
            </Link>
          </ListItem>

          {/* Login Option */}
          <ListItem button onClick={() => toggleDrawer(false)}>
            <Link to="/login">
              <ListItemText primary="Login" />
            </Link>
          </ListItem>
        </List>

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

export default Header;
