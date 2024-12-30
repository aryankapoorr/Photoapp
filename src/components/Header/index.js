// src/components/Header.js
import React, { useState } from 'react';
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as MUIButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { Button } from '@mui/joy'; // Import Joy UI Button
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import './styles.css';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleUploadClick = () => {
    document.getElementById('file-input').click();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLogoutDialogOpen(false); // Close dialog after logout
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
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
          {/* Home Option */}
          <ListItem button onClick={() => toggleDrawer(false)}>
            <Link to="/">
              <ListItemText primary="Home" />
            </Link>
          </ListItem>

          <ListItem button onClick={() => toggleDrawer(false)}>
            <Link to="/myphotos">
              <ListItemText primary="My Photos" />
            </Link>
          </ListItem>

          {/* Logout Option */}
          <ListItem button onClick={() => setLogoutDialogOpen(true)}>
            <ListItemText primary="Logout" />
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

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out of the application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MUIButton
            onClick={() => setLogoutDialogOpen(false)}
            color="primary"
          >
            Cancel
          </MUIButton>
          <MUIButton onClick={handleLogout} color="error">
            Logout
          </MUIButton>
        </DialogActions>
      </Dialog>

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
