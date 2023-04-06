import { Autocomplete, AutocompleteRenderInputParams, Box, Divider, Fab, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList } from '../../../../../models/shared/sharedModels';
import { LP, NewLP } from '../../../../../models/lps/lpModels';
import { useTheme } from "@mui/material/styles";
import { DatePicker } from '@mui/x-date-pickers';
import { amountValueFormatter } from '../../../../../helpers/app';
import { PCOSummary } from '../../../../../models/pcos/pcoModels';
import moment from 'moment';

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
            width: '440px',
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

interface PCOFinancialsStepContentProps {
    selectedPCO: PCOSummary | null,
    setSelectedPCO: React.Dispatch<React.SetStateAction<PCOSummary | null>>,
    disabled: boolean,
    setDisabled: any
}

const PCOFinancialsStepContentComponent = ({ selectedPCO, setSelectedPCO, disabled, setDisabled }: PCOFinancialsStepContentProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [amountInvestedEUR, setAmountInvestedEUR] = useState<number | null>(selectedPCO?.amountInvestedFundCcy ?? null);
    const [amountInvestedLocalCcy, setAmountInvestedLocalCCy] = useState<number | null>(selectedPCO?.amountInvestedLocalCcy ?? null);
    const [grossIRR, setGrossIRR] = useState<number | null>(selectedPCO?.grossIRR ?? null);
    const [currentValuationOfCompany, setCurrentValuationOfCompany] = useState<number | null>(selectedPCO?.currentValuationPCO ?? null);
    const [valuationEmerald, setValuationEmerald] = useState<number | null>(selectedPCO?.currentValuationEmerald ?? null);
    const [realised, setRealised] = useState<number | null>(selectedPCO?.realised ?? null);
    const [currentRound, setCurrentRound] = useState<string>(selectedPCO?.currentRound ?? '');
    const [dateLastRound, setdateLastRound] = useState<string>(selectedPCO?.lastRound ?? '');

    const dateDifference = (date1: string, date2: string) => {
        const date1Date = new Date(date1);
        const date2Date = new Date(date2);
        const diffInMs = Math.abs(date2Date.getTime() - date1Date.getTime());
        const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(diffInMonths / 12);
        const months = diffInMonths % 12;
        const returnString = years && months ? `${years} years and ${months} months` : years && !months ? `${years} years` : !years && months ? `${months} months` : '';

        return returnString;
    }

    const onValueChange = (value: string, field: string) => {
        if (selectedPCO) {
            switch (field) {
                case 'amountInvestedFundCcy':
                    setAmountInvestedEUR(+value);
                    setSelectedPCO({
                        ...selectedPCO,
                        amountInvestedFundCcy: +value
                    });
                    setDisabled(value === '');
                    break;
                case 'amountInvestedLocalCcy':
                    setAmountInvestedLocalCCy(+value);
                    setSelectedPCO({
                        ...selectedPCO,
                        amountInvestedLocalCcy: +value
                    });
                    setDisabled(value === '');
                    break;
                case 'grossIRR':
                    setGrossIRR(+value);
                    setSelectedPCO({
                        ...selectedPCO,
                        grossIRR: +value
                    });
                    setDisabled(value === '');
                    break;
                case 'currentValuationPCO':
                    setCurrentValuationOfCompany(+value);
                    setSelectedPCO({
                        ...selectedPCO,
                        currentValuationPCO: +value
                    });
                    setDisabled(value === '');
                    break;
                case 'currentValuationEmerald':
                    setValuationEmerald(+value);
                    setSelectedPCO({
                        ...selectedPCO,
                        currentValuationEmerald: +value
                    });
                    setDisabled(value === '');
                    break;
                case 'realised':
                    setRealised(+value);
                    setSelectedPCO({
                        ...selectedPCO,
                        realised: +value
                    });
                    setDisabled(value === '');
                    break;
                case 'currentRound':
                    setCurrentRound(value);
                    setSelectedPCO({
                        ...selectedPCO,
                        currentRound: value
                    });
                    setDisabled(value === '');
                    break;
                default:
                    break;
            }
        }
    };

    const onDateChange = (value: any, field: string) => {
        setdateLastRound(value);
        if (selectedPCO) {
            setSelectedPCO({
                ...selectedPCO,
                lastRound: value
            });
        }

    }

    return (
        <Grid container spacing={2} sx={{ flex: 1, width: '100%', marginTop: '0.2em' }}>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        label='Amount Invested (EUR)'
                        aria-label="name"
                        value={amountInvestedEUR ? amountValueFormatter(amountInvestedEUR, '') : null}
                        onChange={(e) => onValueChange(e.target.value, 'amountInvestedFundCcy')}
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
                        label={`Amount Original Ccy (${selectedPCO?.localCurrency})`}
                        aria-label="name"
                        value={amountInvestedLocalCcy ? amountValueFormatter(amountInvestedLocalCcy, '') : null}
                        onChange={(e) => onValueChange(e.target.value, 'amountInvestedLocalCcy')}
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
                        label='Gross IRR'
                        value={grossIRR ? (grossIRR * 100).toFixed(2) : null}
                        onChange={(e) => onValueChange(e.target.value, 'grossIRR')}
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
                        label='Current Round'
                        aria-label="name"
                        value={currentRound}
                        onChange={(e) => onValueChange(e.target.value, 'currentRound')}
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
            <Grid item >
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '440px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <DatePicker
                        className={classes.datePickers}
                        inputFormat={'dd/MM/yyyy'}
                        disableFuture
                        value={dateLastRound ? moment(new Date(dateLastRound)).format('DD MMM YYYY') : null}
                        disableHighlightToday
                        onChange={(e) => onDateChange(e ?? '', 'dateLastRound')}
                        renderInput={(props: any) =>
                            <TextField {...props}
                                label={'Date of Last Round'}
                                variant={'outlined'}
                                size={'small'}
                                className={classes.textField}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: 'small'
                                    }
                                }}
                            />}
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
                        label='Current Valuation of Company'
                        value={currentValuationOfCompany ? amountValueFormatter(currentValuationOfCompany, '') : null}
                        onChange={(e) => onValueChange(e.target.value, 'currentValuationPCO')}
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
                        label='Valuation of Emerald Holding'
                        value={valuationEmerald ? amountValueFormatter(valuationEmerald, '') : null}
                        onChange={(e) => onValueChange(e.target.value, 'currentValuationEmerald')}
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
                        aria-label="baseCapital"
                        label='Realised'
                        value={realised ? amountValueFormatter(realised, '') : null}
                        onChange={(e) => onValueChange(e.target.value, 'realised')}
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
    );
};

export default PCOFinancialsStepContentComponent;