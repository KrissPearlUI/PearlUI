import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Theme, ToggleButton, ToggleButtonGroup, Toolbar, Typography, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { RootState } from '../../../../redux/slices/rootSlice';
import { Fund } from '../../../../models/lps/lpModels';
import ContractsTable from './ContractsTable';
import CompaniesTable from './CompaniesTable';
import ReportsTable from './ReportsTable';


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            height: '100%',
            overflow: 'hidden',
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%',
            paddingLeft: '0.4em',
            paddingBottom: '0.5em',
            marginLeft: '-0.1em'
        },
        toolbar: {
            padding: 5
        },
    })
);

const togglrBtnStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            border: 'none',
            boxShadow: 'none',
        },
        grouped: {
            '&:not(:first-child)': {
                borderRadius: theme.shape.borderRadius,
            },
            '&:first-child': {
                borderRadius: theme.shape.borderRadius,
            },
        }
    }));

const SingleLPDocuments = () => {
    const classes = useStyles();
    const btnStyles = togglrBtnStyles();
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const theme = useTheme();
    const [, setRowData] = useState<Fund[]>([]);
    const [selectedView, setSelectedView] = useState<string>('Contracts');

    const handleChangeVaue = (value: any) => {
        setSelectedView(value);
    };


    useEffect(() => {
        setRowData([]);
    }, [selectedLP])

    return (
        <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={1} sx={{ marginRight: '0.5em', marginTop: '-1.5em', overflow: 'hidden' }}>
            <Grid item >
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
                                style={{ cursor: 'pointer' }}
                                classes={{
                                    root: btnStyles.root,
                                    grouped: btnStyles.grouped,
                                }}
                                value={selectedView}
                                onChange={(e, value) => {
                                    if (value) {
                                        handleChangeVaue(value);
                                    }
                                }}>
                                <ToggleButton value="Contracts" sx={{
                                    textTransform: 'none',
                                    fontSize: 14,
                                    height: 32,
                                    width: 154,
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent',
                                    borderLeft: 'none',
                                    borderTop: 'none',
                                    borderRight: 'none',
                                    borderRadius: 0,
                                    borderBottom: selectedView === 'Contracts' ? `1px solid ${theme.palette.primary.main}` : 'none',
                                    '&:hover': {
                                        backgroundColor: selectedView === 'Contracts' ? theme.palette.grey[500] : 'none',
                                    }
                                }}>
                                    <Typography style={{
                                        padding: '0.1em', fontWeight: 800, fontSize: '12px',
                                        color: theme.palette.primary.main
                                    }}
                                        variant={'body2'}> {'Contracts'}</Typography>

                                </ToggleButton>
                                <ToggleButton value="Companies"
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: 14,
                                        height: 32,
                                        width: 154,
                                        backgroundColor: 'transparent',
                                        borderLeft: 'none',
                                        borderTop: 'none',
                                        borderRight: 'none',
                                        borderRadius: 0,
                                        borderBottom: selectedView === 'Companies' ? `1px solid ${theme.palette.primary.main}` : 'none',
                                        '&:hover': {
                                            backgroundColor: selectedView === 'Companies' ? theme.palette.grey[500] : 'none',
                                        }
                                    }}>
                                    <Typography style={{
                                        padding: '0.1em', fontWeight: 800, fontSize: '12px',
                                        color: theme.palette.primary.main
                                    }}
                                        variant={'body2'}> {'Companies'}</Typography>
                                </ToggleButton>
                                <ToggleButton value="Reports"
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: 14,
                                        height: 32,
                                        width: 154,
                                        backgroundColor: 'transparent',
                                        borderLeft: 'none',
                                        borderTop: 'none',
                                        borderRight: 'none',
                                        borderRadius: 0,
                                        borderBottom: selectedView === 'Reports' ? `1px solid ${theme.palette.primary.main}` : 'none',
                                        '&:hover': {
                                            backgroundColor: selectedView === 'Reports' ? theme.palette.grey[500] : 'none',
                                        }
                                    }}>
                                    <Typography style={{
                                        padding: '0.1em', fontWeight: 800, fontSize: '12px',
                                        color: theme.palette.primary.main
                                    }}
                                        variant={'body2'}> {'Reports'}</Typography>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                </Toolbar>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{ width: '100%', height: '100%', flex: 1 }}>
                {selectedView === 'Contracts' ? <ContractsTable />
                    : selectedView === 'Companies'
                        ? <CompaniesTable />
                        : <ReportsTable />}
            </Grid>
        </Grid>

    );
};


export default SingleLPDocuments;
