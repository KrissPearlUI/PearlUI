import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import { Collapse, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import React, { useState } from 'react';
import { CSSObject, lighten, styled, Theme, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import { RootState } from "../../redux/slices/rootSlice";
import { setActivePath, setIsDrawerOpen } from "../../redux/slices/appSlice";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactComponent as LPIcon } from '../../assets/icons/LPMenuIcon.svg';
import { ReactComponent as FundsMenuIcon } from "../../assets/icons/FundsMenuIcon.svg";
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import { ReactComponent as GlobeIcon } from '../../assets/icons/GlobeIcon.svg';
import { makeStyles, createStyles } from '@mui/styles';
import { RouteDefinition } from '../../router/models';
import clsx from 'clsx';
import { RootRouteDefinition } from '../../router/RootRouteDefinition';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Dashboard } from '@mui/icons-material';

const routes = [{ key: 'Dashboard', url: '/' },
{ key: 'LPs', url: '/lpsOverview' },
{ key: 'Funds', url: '/fundsOverview' },
{ key: 'PCOs', url: '/pcosOverview' },
{ key: 'Settings', url: '/settings' }];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        logo: {
            height: '1em',
            margin: '1em .5em',
            textAlign: 'right',
            backgroundPosition: 'left',
            backgroundOrigin: 'content-box',
            padding: 1
        },
        drawerPaper: {
            position: 'relative',
            whiteSpace: 'nowrap',
            flex: 1,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerPaperClose: {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(8),
            },
        },
        drawerLink: {
            textDecoration: 'none',
            color: theme.palette.text.primary,
        },
        drawerSubLink: {
            //paddingLeft: theme.spacing(6),
            color: theme.palette.text.primary,
        },
        drawerButton: {
            '&:hover': {
                borderRight: `5px solid ${lighten(theme.palette.secondary.main, 0.3)}`,
            }
        },
        drawerButtonActive: {
            borderRight: `5px solid ${theme.palette.secondary.main}`,
        },
        avatar: {
            marginRight: theme.spacing(1),
            width: 48,
            height: 48,
        },
    })
);

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


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
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

const NavLinkSection = (): JSX.Element => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const location = useLocation();
    const [navLinkState, setNavLinkState] = useState<Record<string, boolean>>({});
    const {
        activePath,
        drawerOpen,
    } = useSelector((state: RootState) => state.app);
    const pathName = location.pathname;
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [expandedPath, setExpandedPath] = useState<string | null>(null); // keep track of currently expanded path

    const handleClick = (url: any) => {
        Object.keys(navLinkState).forEach((key) => {
            navLinkState[key] = false;
        });
        setNavLinkState({ ...navLinkState });
        dispatch(setActivePath(url));
    };

    const handleNavLinkExpand = (path: string) => {
        dispatch(setActivePath(path));
        /* setNavLinkState((prevState) => {
            return { ...prevState, [path]: !prevState[path] };
        }); */
        setExpanded(true);
        setNavLinkState((prevState) => {
            return { ...prevState, [path]: !prevState[path] };
        });
        /*         if (!isMenuHovered) {
                    dispatch(setIsDrawerOpen(false));
                } */

        const ancestors = getAncestors(path);
        setNavLinkState((prevState) => {
            const newState = { ...prevState };
            ancestors.forEach((ancestor) => {
                newState[ancestor] = true;
            });
            return newState;
        });
    };


    // helper function to get all the ancestor paths of a given path
    const getAncestors = (path: string): string[] => {
        const parts = path.split('/').filter((part) => part !== '');
        const ancestors: string[] = [];
        parts.reduce((prev, curr) => {
            const path = prev + '/' + curr;
            ancestors.push(path);
            return path;
        }, '');
        return ancestors;
    };


    const renderNavLinks = (routes: RouteDefinition[], isSubLink: boolean) => {
        return routes.map((route, index) => {
            if (!route.children) {
                return (
                    <List key={`${index}-${route.path}`} component="div" >
                        <NavLink to={route.path} className={clsx(classes.drawerLink)}>
                            <ListItem
                                button
                                onClick={() => { handleClick(route.path) }}
                                className={clsx(pathName
                                    ? classes.drawerButton : '', isSubLink ? classes.drawerSubLink : '')}

                                sx={{ backgroundColor: activePath === route.path ? 'rgba(255, 255, 255, 0.6)' : 'transparent' }}
                            >
                                <ListItemIcon>
                                    <route.icon />
                                </ListItemIcon>
                                <ListItemText primary={route?.name} sx={{ color: '#F3F3F3' }} />
                            </ListItem>
                        </NavLink>
                    </List>
                );
            } else {
                const isExpanded = navLinkState[route.path];
                return (
                    <List key={`${index}-${route.path}`} disablePadding sx={{ marginBottom: '0.5em' }} onMouseEnter={() => setIsMenuHovered(true)}>
                        {
                            <NavLink to={route.path} className={clsx(classes.drawerLink)}>
                                <ListItem
                                    className={clsx(pathName
                                        ? classes.drawerButton : '', isSubLink ? classes.drawerSubLink : '')}
                                    button
                                    onClick={() => handleNavLinkExpand(route.path)}
                                    sx={{ backgroundColor: activePath === route.path ? 'rgba(255, 255, 255, 0.6)' : 'transparent' }}>
                                    <ListItemIcon>
                                        <route.icon />
                                    </ListItemIcon>
                                    <ListItemText primary={route?.name} sx={{ color: '#F3F3F3' }} />
                                    {
                                        navLinkState[route.path] ? <ExpandLessIcon sx={{ color: '#F3F3F3' }} /> : <ExpandMoreIcon sx={{ color: '#F3F3F3' }} />
                                    }
                                </ListItem>
                            </NavLink>
                        }
                        {isExpanded &&
                            <Collapse
                                in={isExpanded}
                                timeout="auto"
                                unmountOnExit
                                sx={{ color: '#F3F3F3' }}>
                                {
                                    route.children?.map((route, index) => {
                                        return (<>
                                            {drawerOpen ?
                                                <List key={`${index}-${route.path}`} component="div" sx={{ paddingLeft: '0.8em' }} disablePadding>
                                                    <NavLink to={route.path} className={clsx(classes.drawerLink)}>
                                                        <ListItem
                                                            button
                                                            onClick={() => { handleClick(route.path) }}
                                                            selected={pathName === route.path}
                                                            className={clsx(pathName
                                                                ? classes.drawerButton : '', isSubLink ? classes.drawerSubLink : '')}
                                                            sx={{ backgroundColor: activePath === route.path ? 'rgba(255, 255, 255, 0.6)' : 'transparent' }}>
                                                            <ListItemIcon>
                                                                <route.icon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={route?.name} sx={{ color: '#F3F3F3', marginLeft: '-1em' }} />
                                                        </ListItem>
                                                    </NavLink>
                                                </List> : null}
                                        </>
                                        );
                                    })
                                }
                            </Collapse>
                        }
                    </List>
                );
            }
        });
    };


    return (<>
        {renderNavLinks(RootRouteDefinition.children ?? [], false)}
    </>);
};

const SideBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        activePath,
        drawerOpen,
    } = useSelector((state: RootState) => state.app);
    const [openExtended, setopenExtended] = useState(false);

    /**
     * Closes the navigation menu and navigates to the specific url
     * @param url
     */
    const handleNavigation = (url: string) => {
        dispatch(setActivePath(url));
        dispatch(setIsDrawerOpen(false));
        navigate(url);
    }

    const handleExpanded = (route: any) => {
        setopenExtended(!openExtended);
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        dispatch(setIsDrawerOpen(open));
    };

    return <Drawer variant="permanent"
        open={drawerOpen}
        sx={{
            '& .MuiDrawer-paper': {
                backgroundColor: theme.palette.primary.main,
                color: '#F3F3F3',

            }
        }}>
        <DrawerHeader sx={{ height: '50px' }}>
            {drawerOpen &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <GlobeIcon height="30" width="30" fill={'white'} />
                    <Typography variant='body2' sx={{ alignSelf: 'center', fontWeight: 600, marginLeft: '0.5em', marginRight: '0.5em' }}>PEARL Portal</Typography>
                </div>}
            {drawerOpen ?
                <ChevronLeftIcon style={{ color: '#F3F3F3', cursor: 'pointer' }} onClick={() => dispatch(setIsDrawerOpen(false))} />
                : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                    <MenuIcon style={{ color: '#F3F3F3', marginRight: '0.3em' }} onClick={() => dispatch(setIsDrawerOpen(true))} />
                </div>}
        </DrawerHeader>
        <NavLinkSection />
    </Drawer>;
};

export default SideBar;


{/* <List sx={{ paddingTop: 0 }}>
            {routes?.map((route, index) => (
                <ListItem key={route.key} disablePadding sx={{ display: 'block', marginBottom: '0.5em' }}
                    onClick={() => handleNavigation(route.url)}
                    aria-label={route.key}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: drawerOpen ? 'initial' : 'center',
                            backgroundColor: route.url === activePath ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
                            px: 2.5,
                            cursor: 'pointer'
                        }}>
                        <ListItemIcon
                            sx={{
                                color: '#F3F3F3',
                                minWidth: 0,
                                mr: drawerOpen ? 3 : 'auto',
                                justifyContent: 'center',
                            }}>
                            {
                                index % 6 === 0 ? <Tooltip title={'Home'}><HomeIcon sx={{ fontSize: '32px' }} /></Tooltip> : route.key === 'LPs' ?
                                    <Tooltip title={"Limited Partners Overview"}>
                                        <LPIcon fill={'#F3F3F3'} />
                                    </Tooltip>
                                    : route.key === 'Funds' ? <Tooltip title={"Funds Overview"}>
                                        <FundsMenuIcon />
                                    </Tooltip>
                                        : route.key === 'PCOs' ? <Tooltip title={"Portfolio Companies Overview"}>
                                            <BusinessIcon sx={{ fontSize: '32px' }} />
                                        </Tooltip>
                                            : <Tooltip title={"Settings"}>
                                                <SettingsIcon sx={{ fontSize: '32px' }} />
                                            </Tooltip>

                            }
                        </ListItemIcon>
                        <ListItemText primary={route.key} sx={{ opacity: drawerOpen ? 1 : 0 }} />
                        {drawerOpen && (route.key === 'LPs' || route.key === 'Funds' || route.key === 'PCOs') && <ChevronRightIcon />}
                    </ListItemButton>
                </ListItem>
            ))}
        </List>  */}
