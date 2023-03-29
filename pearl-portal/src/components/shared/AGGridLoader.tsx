import React from 'react';
import { CircularProgress, Grid, useTheme } from '@mui/material';

const LoaderAGGrid = (props: any) => {
    const theme = useTheme();
    return (
        <Grid container
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress variant="indeterminate"
                size={20}
                style={{ color: theme.palette.text.primary, marginRight: '0.5em' }} />
            <span>{props.loadingMessage}</span>
        </Grid>
    );
};
export default LoaderAGGrid;