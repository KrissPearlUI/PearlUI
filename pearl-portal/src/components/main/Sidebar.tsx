import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import {Grid,ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TableChartIcon from '@mui/icons-material/TableChart';
import React, { useState } from 'react';
import {CSSObject, styled, Theme, useTheme} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch} from '../../redux/store';
import {useSelector} from 'react-redux';
import {RootState} from "../../redux/slices/rootSlice";
import {setActivePath, setIsDrawerOpen} from "../../redux/slices/appSlice";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactComponent as LPIcon } from '../../assets/icons/LPMenuIcon.svg';
import {ReactComponent as FundsMenuIcon} from "../../assets/icons/FundsMenuIcon.svg";
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import {LPMenuIcon} from "../../assets/icons/lpMenuIcon";
import { ReactComponent as GlobeIcon } from '../../assets/icons/GlobeIcon.svg';

const routes = [{key: 'Dashboard', url: '/'},
    {key: 'LPs', url: '/lpsOverview'},
    {key: 'Funds', url: '/fundsOverview'},
    {key: 'PCOs', url: '/pcosOverview'},
    {key: 'Settings', url: '/settings'}];

const openedMixin = (theme: Theme): CSSObject => ({
    width: 180,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 60,
    [theme.breakpoints.up('sm')]: {
        width: 60,
    },
});


const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
   // ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: 0,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const SideBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        activePath,
        drawerOpen,
        isDarkTheme
    } = useSelector((state: RootState) => state.app);
    const pathName = window.location.pathname;

    /**
     * Closes the navigation menu and navigates to the specific url
     * @param url
     */
    const handleNavigation = (url: string) => {
        dispatch(setActivePath(url));
        dispatch(setIsDrawerOpen(false));
        navigate(url);
    }

       return <Drawer variant="permanent"
                   open={drawerOpen}
                   sx={{
                       '& .MuiDrawer-paper': {
                           backgroundColor: theme.palette.primary.main,
                           color: '#F3F3F3',

                       }
                   }}>
        <DrawerHeader sx={{height:'50px'}}>
        {drawerOpen &&
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <GlobeIcon height="30" width="30" fill={'white'}/>
            <Typography variant='body2' sx={{alignSelf:'center', fontWeight:600, marginLeft:'0.5em'}}>PEARL Portal</Typography>
        </div>}
            <IconButton onClick={() => dispatch(setIsDrawerOpen(!drawerOpen))}>
            {drawerOpen?
                <ChevronLeftIcon style={{color: '#F3F3F3'}}/>
            :<MenuIcon style={{color: '#F3F3F3'}}/>}
          </IconButton> 
        </DrawerHeader>
       {/*  <Divider/> */}
        <List sx={{paddingTop:0}}>
            {routes?.map((route, index) => (
                <ListItem key={route.key} disablePadding sx={{display: 'block', marginBottom:'0.5em'}}
                          onClick={() => handleNavigation(route.url)}
                aria-label={route.key}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: drawerOpen ? 'initial' : 'center',
                            backgroundColor:route.url===activePath ?'rgba(255, 255, 255, 0.6)': 'transparent',
                            px: 2.5,
                            cursor:'pointer'
                        }}>
                        <ListItemIcon
                            sx={{
                                color: '#F3F3F3',
                                minWidth: 0,
                                mr: drawerOpen ? 3 : 'auto',
                                justifyContent: 'center',
                            }}>
                            {
                                index % 6 === 0 ? <Tooltip title={'Home'}><HomeIcon sx={{fontSize:'32px'}}/></Tooltip> : route.key==='LPs'?
                                    <Tooltip title={"Limited Partners Overview"}>
                                       {/* <LPMenuIcon/> */}
                                        <LPIcon fill={'#F3F3F3'}/>
                                        </Tooltip> 
                                        : route.key==='Funds'?<Tooltip title={"Funds Overview"}>
                                        {/* <LPMenuIcon/> */}
                                         <FundsMenuIcon/>
                                         </Tooltip>
                                         : route.key==='PCOs'? <Tooltip title={"Portfolio Companies Overview"}>
                                            <BusinessIcon sx={{fontSize:'32px'}}/>
                                          </Tooltip>
                                          :<Tooltip title={"Settings"}>
                                            <SettingsIcon sx={{fontSize:'32px'}}/>
                                           </Tooltip>

                            }
                        </ListItemIcon>
                        <ListItemText primary={route.key} sx={{opacity: drawerOpen ? 1 : 0}}/>
                        {drawerOpen && (route.key ==='LPs' || route.key==='Funds' || route.key==='PCOs') &&<ChevronRightIcon/>}
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Drawer>;
};

export default SideBar;
