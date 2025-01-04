import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase'; // Import Firebase auth
import './styles.css'; // Import the new styles.css file

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Track login state
  const navigate = useNavigate();

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setIsLoggedIn(false);
      navigate('/');
    });
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {/* Left side: Drawer (Menu) */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)} className='hamburger-icon'>
            <MenuIcon sx={{fontSize: '2rem'}}/>
          </IconButton>

          {/* Centered Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            
          </Typography>

          {/* Right side: Logout Button */}
          {isLoggedIn && (
            <Button
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ marginLeft: 'auto', color: '#705C53' }} // Move the button to the right
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer for Navigation (Top-down) */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        variant="temporary"
        className="drawer" // Use class for custom styling
      >
        <List>
          {/* Menu Items */}
          <ListItemButton onClick={() => { toggleDrawer(false); navigate('/'); }} className="menu-item">
            <ListItemText className="list-text" primary="Home" />
          </ListItemButton>

          <ListItemButton onClick={() => { toggleDrawer(false); navigate('/photos'); }} className="menu-item">
            <ListItemText className="list-text" variant="h2" primary="Photo Feed" />
          </ListItemButton>

          <ListItemButton onClick={() => { toggleDrawer(false); navigate('/myphotos'); }} className="menu-item">
            <ListItemText className="list-text" primary="My Photos" />
          </ListItemButton>
        </List>

        {/* Close Button at the Bottom */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          size="large"
          onClick={() => toggleDrawer(false)}
          className="close-btn"
        >
          <CloseIcon sx={{fontSize: '2.5rem', color: '#705C53'}}/>
        </IconButton>
      </Drawer>
    </>
  );
};

export default Header;
