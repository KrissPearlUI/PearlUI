import {useTheme} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import {useAppDispatch} from '../../redux/store';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/slices/rootSlice';
import {AppBar, Grid, IconButton, Theme, Tooltip} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {setIsDarkTheme, setIsDrawerOpen} from "../../redux/slices/appSlice";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const useStyles = makeStyles((theme: Theme) =>
    ({
        appBar: {
            zIndex: theme.zIndex.drawer,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        menuButtonHidden: {
            display:'none',
        },
    })
);

export const Topbar = () => {
    const theme:Theme = useTheme();
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const {
        isDarkTheme,
        drawerOpen,
        topBarTitle,
        userName
    } = useSelector((state: RootState) => state.app);

    /**
     * Changes the theme of the app
     */
    const handleThemeChange = () => {
        dispatch(setIsDarkTheme(!isDarkTheme));
    }

    /**
     * Changes the state of the drawer (the menu on the left)
     */
    const handleDrawerOpen = () => {
        dispatch(setIsDrawerOpen(true));
    };

    return <AppBar position="absolute" className={classes.appBar}
                   sx={{backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, height:'50px', display:'flex', justifyContent:'center'}}>
        <Toolbar sx={{height:'50px'}}>
            <Grid container sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'start', flex: 1}}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                        {/* <img src="../../Group.svg" alt="Kitten" height="30" width="30" style={{backgroundColor:'transparent'}} /> */}
                        {/* <MenuIcon/> */}
                    </IconButton>
                    {/* <img src="../../logoName.svg" alt="Kitten" height="50" width="100" style={{backgroundColor:'transparent'}} /> */}
                    <Typography variant="h6" noWrap aria-label={'title'} sx={{marginLeft:'1em'}}>
                        {topBarTitle}
                    </Typography>
                   {/*  <img src="../../Group.svg" alt="Kitten" height="50" width="150" style={{backgroundColor:'transparent'}} /> */}
                </Grid>
                <Grid item xs={8} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1}}>
                {isDarkTheme ?<img src="../../Globe_White_Trans.svg" alt="Kitten" height="40" width="40" style={{backgroundColor:'transparent', marginRight:'0.3em'}} />
                : <img src="../../Globe_White_Trans_LightMode.svg" alt="Kitten" height="40" width="40" style={{backgroundColor:'transparent', marginRight:'0.3em'}} />}
                {isDarkTheme ?<img src="../../logoName.svg" alt="Kitten" height="30" width="80" style={{backgroundColor:'transparent'}} />
                : <img src="../../logoNameLight.svg" alt="Kitten" height="30" width="80" style={{backgroundColor:'transparent'}}/>}
                   {/*  <IconButton color="inherit" onClick={handleThemeChange} aria-label="Light/Dark" sx={{marginLeft:'1em'}}>
                        <Tooltip title="Toggle light/dark theme">
                            <DarkModeIcon/>
                        </Tooltip>
                    </IconButton> */}
                     <IconButton color="primary" onClick={handleThemeChange} aria-label="AccountPic" sx={{marginLeft:'1em'}}>
                        <Tooltip title="Upload an immage">
                            <AccountCircleIcon sx={{fontSize:'32px'}}/>
                        </Tooltip>
                    </IconButton>
                    <Typography variant="body2" noWrap aria-label={'title'} sx={{color:theme.palette.text.primary, fontWeight:600, fontSize:'16px'}}>
                        {userName??'Jane Doe'}
                    </Typography>
                    <IconButton color="primary" onClick={handleThemeChange} aria-label="accountSettings" >
                        <Tooltip title="Account Settings">
                            <ChevronRightIcon/>
                        </Tooltip>
                    </IconButton>
                </Grid>
            </Grid>
        </Toolbar>
    </AppBar>;
};

