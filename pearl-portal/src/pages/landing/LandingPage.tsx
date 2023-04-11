import { Grid, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { setTopBarTitle } from '../../redux/slices/appSlice';
import { useAppDispatch } from '../../redux/store';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import LPChartComponent from '../../components/landing/LPChart';
import FundsChartComponent from '../../components/landing/FundsChart';
import { fetchFunds } from '../../redux/thunks/fundThunk';
import { fetchLPs } from '../../redux/thunks/lpThunk';
import { fetchPCOs } from '../../redux/thunks/pcoThunk';
import InfoCardsComponent from '../../components/landing/InfoCards';
import PCOChartComponent from '../../components/landing/PCOChart';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chart: {
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            alignContent: 'center',
        },
        summary: {
            flex: 1
        },
    }),
);

const LandingrPage = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    /**
     * Sets the title for the page in the topBar component
     */
    useEffect(() => {
        dispatch(setTopBarTitle("Dashboard"));
    }, [dispatch])


    useEffect(() => {
        dispatch(fetchFunds());
        dispatch(fetchLPs());
        dispatch(fetchPCOs());
    }, [dispatch])

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '0.5em', marginBottom: 0, paddingBottom: 0 }}>
            <Grid item xs={12} md={12} lg={12}>
                <InfoCardsComponent />
            </Grid>
            <Grid item xs={12} md={12} lg={12} className={classes.summary}>
                <Paper elevation={3} style={{ marginBottom: '1em' }}>
                    <Grid item container className={classes.chart}>
                        <LPChartComponent />
                    </Grid>
                </Paper>
            </Grid>
            <Grid container spacing={2} item xs={12} md={12} lg={12}>
                <Grid item xs={6} md={6} lg={6}>
                    <Paper elevation={3} style={{ padding: '0.5em', paddingBottom: 0, height: '470px' }}>
                        <FundsChartComponent />
                    </Paper>
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                    <Paper elevation={3} style={{ padding: '0.5em', paddingBottom: 0, height: '470px' }}>
                        <PCOChartComponent />
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LandingrPage;