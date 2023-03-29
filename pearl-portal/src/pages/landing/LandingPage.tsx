import { Grid, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { setTopBarTitle } from '../../redux/slices/appSlice';
import { useAppDispatch } from '../../redux/store';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import LPChartComponent from '../../components/landing/LPChart';

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

const LoaderPage = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    /**
     * Sets the title for the page in the topBar component
     */
    useEffect(() => {
        dispatch(setTopBarTitle("Dashboard"));
    }, [dispatch])

    return (
        <div style={{ display: 'flex', flex: 1 }}>
            <Grid container sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Grid item xs={6} md={6} lg={6} className={classes.summary}>
                    <Paper elevation={3} style={{ marginBottom: '1em' }}>
                        <Grid item container className={classes.chart}>
                            <LPChartComponent />
                        </Grid>
                    </Paper>
                </Grid>
                <Grid container item xs={6} md={6} lg={6}>
                    <Typography>
                        test1
                    </Typography>
                    <Typography>
                        test2
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default LoaderPage;