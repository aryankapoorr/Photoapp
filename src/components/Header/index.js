import React, { useState } from 'react';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './styles.css';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <div className="header">
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

export default Header;
