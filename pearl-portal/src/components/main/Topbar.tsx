import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/rootSlice';
import { AppBar, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Popover, Theme, Tooltip } from '@mui/material';
import { setIsDarkTheme, setIsDrawerOpen } from "../../redux/slices/appSlice";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ReactComponent as GlobeIcon } from '../../assets/icons/GlobeIcon.svg';
import { ReactComponent as LogoIcon } from '../../assets/icons/LogoIcon.svg';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useNavigate } from 'react-router-dom';

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
    const [anchorEl, setAnchorEl] = useState(null);
    const [isIconRotated, setIsIconRotated] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleUploadClick = () => {
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleIconClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        setIsIconRotated(!isIconRotated);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'popover' : undefined;
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

    const handleNavigateToSettings = () => {
        handlePopoverClose();
        const otherPageUrl = `/settings`;
        navigate(otherPageUrl);
    }

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
                    <Typography variant="h6" noWrap aria-label={'title'} sx={{ marginLeft: drawerOpen ? '7em' : '1em', fontSize: { xs: '16px', md: '20px' } }}>
                        {topBarTitle}
                    </Typography>
                </Grid>
                <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                    <GlobeIcon height="40" width="40" fill={theme.palette.mode === 'dark' ? '#008000' : '#1B4357'} />
                    <LogoIcon height="30" width="80" fill={theme.palette.mode === 'dark' ? 'white' : '#454545'} />
                    <IconButton color="primary" onClick={handleUploadClick} aria-label="AccountPic" sx={{ marginLeft: '1em' }}>
                        <Tooltip title="Upload an immage">
                            {selectedImage ? (
                                <Avatar alt='Selected' src={selectedImage} style={{ height: 32, width: 32 }} />
                            ) : (
                                <AccountCircleIcon sx={{ fontSize: '32px' }} />
                            )}
                        </Tooltip>
                    </IconButton>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <Typography variant="body2" noWrap aria-label={'title'} sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: '16px' }}>
                        {userName ?? 'Jane Doe'}
                    </Typography>
                    <div>
                        <IconButton color="primary" onClick={handleIconClick} aria-label="accountSettings">
                            <Tooltip title="Account Settings">
                                {open ? <ChevronRightIcon style={{ transform: 'rotate(90deg)', cursor: 'pointer' }} />
                                    : <ChevronRightIcon style={{ cursor: 'pointer' }} />}
                            </Tooltip>
                        </IconButton>
                        <Popover
                            id={popoverId}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <Grid container sx={{ display: 'flex', justifyContent: 'start', maxWidth: '200px' }}>
                                <Grid container item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <IconButton color="inherit" onClick={handleThemeChange} aria-label="Light/Dark">
                                        <Tooltip title="Toggle light/dark theme">
                                            {isDarkTheme ? <BrightnessHighIcon /> : <Brightness4Icon />}
                                        </Tooltip>
                                    </IconButton>
                                    <Typography variant='body2' onClick={handleThemeChange} sx={{ cursor: 'pointer' }}>Change Theme</Typography>
                                </Grid>
                                <Grid container item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <IconButton color="inherit" onClick={handleNavigateToSettings} aria-label="Light/Dark">
                                        <Tooltip title="Account settings">
                                            <AccountCircleIcon />
                                        </Tooltip>
                                    </IconButton>
                                    <Typography variant='body2' onClick={handleNavigateToSettings} sx={{ cursor: 'pointer' }}>Account settings</Typography>
                                </Grid>
                                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', textTransform: 'none' }}>
                                    <Button onClick={handlePopoverClose} color="primary">
                                        Close
                                    </Button>
                                </Grid>
                            </Grid>
                        </Popover>
                    </div>
                </Grid>
            </Grid>
        </Toolbar>
    </AppBar>;
};

