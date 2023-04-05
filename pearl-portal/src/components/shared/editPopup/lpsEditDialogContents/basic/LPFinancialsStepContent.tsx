import { Autocomplete, AutocompleteRenderInputParams, Box, Divider, Fab, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList } from '../../../../../models/shared/sharedModels';
import { LP, NewLP } from '../../../../../models/lps/lpModels';
import { useTheme } from "@mui/material/styles";
import { DatePicker } from '@mui/x-date-pickers';
import { amountValueFormatter } from '../../../../../helpers/app';

const autocompleteInputStyles = makeStyles((theme: Theme) => ({
    autocomplete: {
        'borderRadius': 5,
        'backgroundColor': theme.palette.background.paper,
        '& input::placeholder': {
            color: theme.palette.text.primary
        },
        '& .Mui-disabled': {
            color: theme.palette.text.primary,
            opacity: 0.8
        }
    },
    textInput: {
        'color': theme.palette.text.primary,
        'fontWeight': 800,
        'fontFamily': 'Raleway',
        height: '2.2em',
        /* 'height': '2.5em', */
        'fontSize': 10,
        '& .MuiIconButton-label': {
            color: theme.palette.text.primary
        }
    },
    clearIndicator: {
        color: theme.palette.text.primary
    }
}));

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chart: {
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            alignContent: 'center',
        },
        fabIcon: {
            marginLeft: 10,
            alignSelf: 'center',
        },
        searchBox: {
            width: '440px',
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
        },
        datePickers: {
            width: '100%',
            flex: 1,
        },
        textField: {
            width: '435px',
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            borderRadius: 5,
            '& .MuiSvgIcon-root':
            {
                color: theme.palette.text.primary
            },

            '& label': {
                '&.Mui-focused': {
                    color: theme.palette.text.primary
                }
            },
        },
        textFildsSmall: {
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
        },
        inputRoot: {
            height: '1em',
            'borderRadius': 5,
            'backgroundColor': 'transparent',
            /*         '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black'
                    },*/
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main
            },
            /*  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black'
              }, */
            '& .MuiChip-root': {
                color: theme.palette.text.primary,
                backgroundColor: 'transparent',
                borderRadius: 5
            },
            '& .MuiChip-deleteIconSmall': {
                color: theme.palette.text.primary
            }
        },
        option: {
            'background': theme.palette.background.paper,
            '&:hover': {
                color: theme.palette.primary.main,
                fontWeight: 400,
                fontFamily: 'Raleway'
            },
            '&[aria-selected="true"]': {
                background: theme.palette.background.paper,
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontFamily: 'Raleway'
            }
        },
        popupIndicator: {
            '&.MuiIconButton-root': {
                color: theme.palette.text.primary
            }
        },
        clearIndicator: {
            color: theme.palette.text.primary
        },
    }),
);
const LPTypes = [
    "Corporate",
    "General Partner",
    "Individual",
    "Institutional",
];

interface LPFinancialsStepContentProps {
    selectedLP: LP | null
}

const LPFinancialsStepContentComponent = ({ selectedLP }: LPFinancialsStepContentProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [managementFee, setManagementFee] = useState<number | null>(selectedLP?.fees?.filter(x => x.feeType === 'Management Fee')[0] ? selectedLP?.fees?.filter(x => x.feeType === 'Management Fee')[0].amount : null);
    const [capitalPaidIn, setCapitalPaidIn] = useState<number | null>(selectedLP?.capPaidIn ?? null);
    const [capitalDistributed, setCapitalDistributed] = useState<number | null>(selectedLP?.totalDistributions ?? null);
    const [capitalInvested, setCapitalinvested] = useState<number | null>(selectedLP?.totalInvestments ?? null);
    const [recyclingReserves, setRecyclingReserves] = useState<number | null>(selectedLP?.fees?.filter(x => x.feeType === 'Recycling Reserves')[0] ? selectedLP?.fees?.filter(x => x.feeType === 'Recycling Reserves')[0].amount : null);
    const [availablecapital, setAvailableCapital] = useState<number | null>(selectedLP?.capAvailable ?? null);
    const [reserved, setReserved] = useState<number | null>(selectedLP?.reserved ?? null);
    const [dryPowder, setDryPowder] = useState<number | null>(selectedLP?.dryPowder ?? null);
    const [numAvgDeals, setNumAvgDeals] = useState<number | null>(selectedLP?.avgDealsAvailable ?? null);
    const [tappedOut, setTappedOut] = useState<boolean>(selectedLP?.tappedOot ?? false);
    const [estimatedUntilTappedOut, setEstimatedUntilTapedOut] = useState<string>(selectedLP?.dateTappedOut ?? '');

    return (
        <Grid container spacing={2} sx={{ flex: 1, width: '100%', marginTop: '0.2em' }}>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        label='Management Fees'
                        aria-label="name"
                        value={managementFee? amountValueFormatter(managementFee,''):null}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        label='Capital Paid In'
                        aria-label="name"
                        value={capitalPaidIn? amountValueFormatter(capitalPaidIn,''):null}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Capital Distributed'
                        value={capitalDistributed? amountValueFormatter(capitalDistributed,''):null}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        label='Capital Invested'
                        aria-label="name"
                        value={capitalInvested? amountValueFormatter(capitalInvested,''):null}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Divider sx={{ marginTop: '0.8em', marginBottom: 0, marginLeft: '1em', minWidth: '440px' }} />
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Recycling Reserves'
                        value={recyclingReserves? amountValueFormatter(recyclingReserves,''):null}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Available Capital to be called'
                        value={availablecapital? amountValueFormatter(availablecapital,''):null}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Reserved'
                        value={reserved? amountValueFormatter(reserved,''):null}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Dry Powder'
                        value={dryPowder? amountValueFormatter(dryPowder,''):null}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Divider sx={{ marginTop: '0.8em', marginBottom: 0, marginLeft: '1em', minWidth: '440px' }} />
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="baseCapital"
                        label='Num. of avg. deals available'
                        value={numAvgDeals}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid container item sx={{ display: 'flex', justifyContent: 'space-between', flex: 1 }} spacing={2}>
                <Grid item xs={4}>
                    <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '120px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                        <TextField
                            className={classes.textFildsSmall}
                            sx={{ width: '120px' }}
                            variant="outlined"
                            size="small"
                            label='Tapped Out'
                            aria-label="city"
                            value={tappedOut}
                            inputProps={{
                                style: { height: '1em' },
                            }}
                            InputLabelProps={{
                                sx: {
                                    fontSize: 'small'
                                }
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, minWidth: '290px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                        <TextField
                            className={classes.textFildsSmall}
                            variant="outlined"
                            sx={{ minWidth: '290px' }}
                            size="small"
                            aria-label="city"
                            label='Estimated until tapped out'
                            value={estimatedUntilTappedOut}
                            inputProps={{
                                style: { height: '1em' },
                            }}
                            InputLabelProps={{
                                sx: {
                                    fontSize: 'small'
                                }
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LPFinancialsStepContentComponent;