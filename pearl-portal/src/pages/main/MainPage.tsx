import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { Grid, Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { RoutesSwitch } from "../../router/RouteSwitch";
import { useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/slices/rootSlice";
import { setIsDrawerOpen } from "../../redux/slices/appSlice";
import Sidebar from "../../components/main/Sidebar";
import { Topbar } from "../../components/main/Topbar";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import NavigationMenu from '../../components/main/TestSideBar';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
    },
    content: {
        flex: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    pageArea: {
        flex: 1,
        overflow: 'auto',
        width: '100%',
        paddingBottom: theme.spacing(1)
    },
}));

const MainPage = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const {
        drawerOpen,
    } = useSelector((state: RootState) => state.app);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>

            <div className={classes.root}>
                <CssBaseline />
                <div >
                    <Topbar />
                    <Sidebar />
                </div>
                <Grid container direction="column" className={classes.content}>
                    <Grid className={classes.appBarSpacer} />
                    <Grid container className={classes.pageArea}>
                        <RoutesSwitch />
                    </Grid>
                </Grid>
            </div>
        </LocalizationProvider>);

};

export default MainPage;

//onBlur={() => drawerOpen ? dispatch(setIsDrawerOpen(!drawerOpen)) : null}