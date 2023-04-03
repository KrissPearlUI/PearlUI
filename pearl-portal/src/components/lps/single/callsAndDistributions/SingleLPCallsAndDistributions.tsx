import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, ToggleButton, ToggleButtonGroup, Toolbar, Typography, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { RootState } from '../../../../redux/slices/rootSlice';
import { Fund } from '../../../../models/lps/lpModels';
import SingleLPCallsTable from './LPCallsTable';
import SingleLPDistributionsTable from './LPDistributionsTable';


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            height: '100%',
            overflow: 'hidden',
            marginRight: '1em'
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%',
            paddingLeft: '0.4em',
            paddingBottom: '0.5em',
        },
        toolbar: {
            padding: 5
        },
    })
);

interface SingleLPCallsAndDistributionsProps {
    selectedCallDistView:string,
    setSelecteCalDistdView:(value:string)=>void
}

const SingleLPCallsAndDistributions = ({selectedCallDistView,setSelecteCalDistdView}:SingleLPCallsAndDistributionsProps) => {
    const classes = useStyles();
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const theme = useTheme();
    const [, setRowData] = useState<Fund[]>([]);

    const handleChangeVaue = (value: any) => {
        setSelecteCalDistdView(value);
    };


    useEffect(() => {
        setRowData(selectedLP?.funds ?? []);
    }, [selectedLP])

    return (
        <Paper elevation={3} className={classes.root} sx={{ paddingRight: '0.5em' }}>
            <Grid container
                style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'start',
                    flexDirection: 'column',
                    flex: 1,
                }}>
                <Toolbar variant="dense" disableGutters className={classes.toolbar}>
                    <Grid container
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '100%'
                        }}>
                        <Grid item style={{ flex: 1 }}>
                            <ToggleButtonGroup
                                size="small"
                                exclusive
                                sx={{ border: `1px solid ${theme.palette.primary.main}` }}
                                style={{ cursor: 'pointer' }}
                                value={selectedCallDistView}
                                onChange={(e, value) => {
                                    if (value) {
                                        handleChangeVaue(value);
                                    }
                                }}>
                                <ToggleButton value="Calls" style={{
                                    textTransform: 'none',
                                    fontSize: 14,
                                    height: 32,
                                    width: 154,
                                    cursor: 'pointer',
                                    backgroundColor: selectedCallDistView === 'Calls' ? theme.palette.primary.main : 'transparent'

                                }}>
                                    <Typography style={{
                                        padding: '0.1em', fontWeight: 800, fontSize: '12px',
                                        color: selectedCallDistView === 'Calls' ? 'white' : theme.palette.primary.main
                                    }}
                                        variant={'body2'}> {'Calls'}</Typography>

                                </ToggleButton>
                                <ToggleButton value="Distributions"
                                    style={{
                                        textTransform: 'none',
                                        fontSize: 14,
                                        height: 32,
                                        width: 154,
                                        backgroundColor: selectedCallDistView === 'Distributions' ? theme.palette.primary.main : 'transparent'
                                    }}>
                                    <Typography style={{
                                        padding: '0.1em', fontWeight: 800, fontSize: '12px',
                                        color: selectedCallDistView === 'Distributions' ? 'white' : theme.palette.primary.main
                                    }}
                                        variant={'body2'}> {'Distributions'}</Typography>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                </Toolbar>
                {selectedCallDistView === 'Calls' ? <SingleLPCallsTable /> : <SingleLPDistributionsTable />}
                {/*  <div className={clsx(getGridTheme(isDarkTheme), classes.fill)} style={{flex:1}}>
                    <AgGridReact gridOptions={gridOptions}
                                columnDefs={getColumnDefs}
                                rowData={rowData}
                                onGridReady={onGridReady}
                                loadingOverlayComponentParams={loadingOverlayRendererParams}
                                loadingOverlayComponent={AGGridLoader}
                                tooltipShowDelay={0}
                                tooltipHideDelay={10000}
                                />
                </div> */}
            </Grid>
        </Paper>

    );
};


export default SingleLPCallsAndDistributions;
