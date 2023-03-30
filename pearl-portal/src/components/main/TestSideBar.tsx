import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Link as RouterLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { Theme } from '@mui/material';

const drawerWidth = 240;

const useStyles = makeStyles((theme:Theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function NavigationMenu() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openNested, setOpenNested] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleClick = () => {
    setOpenNested(!openNested);
  };

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <IconButton onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <List>
            <ListItem button component={RouterLink} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
              Home
            </ListItem>
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
              {openNested ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openNested} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={RouterLink} to="/dashboard/overview">
                  <ListItemText primary="Overview" className={classes.nested} />
                  Overview
                </ListItem>
                <ListItem button component={RouterLink} to="/dashboard/settings">
                  <ListItemText primary="Settings" className={classes.nested} />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button component={RouterLink} to="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}

export default NavigationMenu;