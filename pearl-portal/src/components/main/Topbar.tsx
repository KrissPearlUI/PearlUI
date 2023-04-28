import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/rootSlice';
import { AppBar, Grid, IconButton, Theme, Tooltip } from '@mui/material';
import { setIsDarkTheme, setIsDrawerOpen } from "../../redux/slices/appSlice";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ReactComponent as GlobeIcon } from '../../assets/icons/GlobeIcon.svg';
import { ReactComponent as LogoIcon } from '../../assets/icons/LogoIcon.svg';

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
        display: 'none',
    },
})
);

export const Topbar = () => {
    const theme: Theme = useTheme();
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
        sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, height: '50px', display: 'flex', justifyContent: 'center' }}>
        <Toolbar sx={{ height: '50px' }}>
            <Grid container sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flex: 1 }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap aria-label={'title'} sx={{ marginLeft: drawerOpen ? '7em' : '1em', fontSize:{xs:'16px', md:'20px'} }}>
                        {topBarTitle}
                    </Typography>
                </Grid>
                <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                    <GlobeIcon height="40" width="40" fill={theme.palette.mode === 'dark' ? '#008000' : '#1B4357'} />
                    <LogoIcon height="30" width="80" fill={theme.palette.mode === 'dark' ? 'white' : '#454545'} />
                    <IconButton color="primary" onClick={handleThemeChange} aria-label="AccountPic" sx={{ marginLeft: '1em' }}>
                        <Tooltip title="Upload an immage">
                            <AccountCircleIcon sx={{ fontSize: '32px' }} />
                        </Tooltip>
                    </IconButton>
                    <Typography variant="body2" noWrap aria-label={'title'} sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: '16px' }}>
                        {userName ?? 'Jane Doe'}
                    </Typography>
                    <IconButton color="primary" onClick={handleThemeChange} aria-label="accountSettings" >
                        <Tooltip title="Account Settings">
                            <ChevronRightIcon />
                        </Tooltip>
                    </IconButton>
                </Grid>
            </Grid>
        </Toolbar>
    </AppBar>;
};

