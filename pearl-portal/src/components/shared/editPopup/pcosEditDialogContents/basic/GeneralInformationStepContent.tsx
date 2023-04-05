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
import moment from 'moment';
import { FundSummary } from '../../../../../models/funds/fundModels';
import { PCOSummary } from '../../../../../models/pcos/pcoModels';

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

const PCOStatus = [
    "Unrealized",
    "Realized"
];

interface GeneralInformationStepContentProps {
    selectedPCO: PCOSummary | null,
    setSelectedPCO: React.Dispatch<React.SetStateAction<PCOSummary | null>>,
    disabled: boolean,
    setDisabled: any
}

const GeneralInformationStepContentComponent = ({ selectedPCO, setSelectedPCO, disabled, setDisabled }: GeneralInformationStepContentProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [domicile, setDomicile] = useState<string | null>(selectedPCO?.country ?? '');
    const [sector, setSector] = useState<string | null>(selectedPCO?.emeraldIndustry2 ?? '');
    const [dateExit, setDateExit] = useState<string>(selectedPCO?.dateExit ?? '');
    const [currentStage, setCurrentStage] = useState<string>(selectedPCO?.currentStage ?? '');
    const [address, setAddress] = useState<string>(selectedPCO?.address ? selectedPCO.address?.split(',')[0] : '');
    const [boardSeat, setBoardSeat] = useState<string | number>(selectedPCO?.boardSeat ?? '');
    const [dateInvestment, setDateInvestment] = useState<string>(selectedPCO?.dateInitalInvestment ?? '');
    const [currentDealTeam, setCurrentDealTeam] = useState<string>(selectedPCO?.currentDealteam ?? '');
    const [status, setStatus] = useState<string | null>(selectedPCO?.status ?? '');
    const [website, setWebsite] = useState<string | null>(selectedPCO?.website ?? '');

    const onValueChange = (value: string, field: string) => {
        if (selectedPCO) {
            switch (field) {
                case 'domicile':
                    setDomicile(value);
                    setSelectedPCO({
                        ...selectedPCO,
                        country: value
                    });
                    setDisabled(value === '');
                    break;
                case 'address':
                    setAddress(value);
                    setSelectedPCO({
                        ...selectedPCO,
                        address: value
                    });
                    setDisabled(value === '');
                    break;
                case 'sector':
                    setSector(value);
                    setSelectedPCO({
                        ...selectedPCO,
                        emeraldIndustry2: value
                    });
                    setDisabled(value === '');
                    break;
                case 'currentStage':
                    setCurrentStage(value);
                    setSelectedPCO({
                        ...selectedPCO,
                        currentStage: value
                    });
                    setDisabled(value === '');
                    break;
                case 'status':
                    setStatus(value);
                    setSelectedPCO({
                        ...selectedPCO,
                        status: value
                    });
                    setDisabled(value === '');
                    break;
                case 'website':
                    setWebsite(value);
                    setSelectedPCO({
                        ...selectedPCO,
                        website: value
                    });
                    setDisabled(value === '');
                    break;
                case 'boardSeat':
                    setBoardSeat(value);
                    setSelectedPCO({
                        ...selectedPCO,
                        boardSeat: value
                    });
                    setDisabled(value === '');
                    break;
                case 'currentDealteam':
                    setCurrentDealTeam(value);
                    setSelectedPCO({
                        ...selectedPCO,
                        currentDealteam: value
                    });
                    setDisabled(value === '');
                    break;
                default:
                    break;
            }
        }
    };

    const onDateChange = (value: any, field: string) => {
        if (field === 'dateInitalInvestment') {
            setDateInvestment(value);
            if (selectedPCO) {
                setSelectedPCO({
                    ...selectedPCO,
                    dateInitalInvestment: value
                });
            }
        } else {
            setDateExit(value);
            if (selectedPCO) {
                setSelectedPCO({
                    ...selectedPCO,
                    dateExit: value
                });
            }
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
                        label='Domicile'
                        aria-label="name"
                        value={domicile}
                        onChange={(e) => onValueChange(e.target.value, 'domicile')}
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
                        label='Address'
                        aria-label="name"
                        value={address}
                        onChange={(e) => onValueChange(e.target.value, 'address')}
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
                        label='Website'
                        aria-label="name"
                        value={website}
                        onChange={(e) => onValueChange(e.target.value, 'website')}
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
            <Divider sx={{ marginTop: '1.5em', marginBottom: '0.5em', marginLeft: '1em', minWidth: '440px' }} />
            <Grid item >
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '440px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <DatePicker
                        className={classes.datePickers}
                        inputFormat={'dd/MM/yyyy'}
                        disableFuture
                        value={dateInvestment ? moment(new Date(dateInvestment)).format('DD MMM YYYY') : null}
                        onChange={(e) => onDateChange(e ?? '', 'dateInitalInvestment')}
                        disableHighlightToday
                        renderInput={(props: any) =>
                            <TextField {...props}
                                label={'Date Invested'}
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
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Sector'
                        value={sector}
                        onChange={(e) => onValueChange(e.target.value, 'sector')}
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
                        label='Current Stage'
                        value={currentStage}
                        onChange={(e) => onValueChange(e.target.value, 'currentStage')}
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
            <Divider sx={{ marginTop: '1.5em', marginBottom: '0.5em', marginLeft: '1em', minWidth: '440px' }} />
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="baseCapital"
                        label='Board Seat'
                        value={boardSeat}
                        onChange={(e) => onValueChange(e.target.value, 'boardSeat')}
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
                        label='Current Deal Team'
                        value={currentDealTeam}
                        onChange={(e) => onValueChange(e.target.value, 'currentDealTeam')}
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
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '440px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <Autocomplete
                        id={'fundsAutocomplete'}
                        popupIcon={<ExpandMoreIcon />}
                        size={'small'}
                        autoHighlight={true}
                        autoSelect={true}
                        autoComplete={false}
                        classes={classes}
                        sx={{ marginRight: '1em', width: '440px' }}
                        isOptionEqualToValue={(option, value) => option === value}
                        value={status ?? ''}
                        options={PCOStatus.slice()}
                        onChange={(e, value: any) => onValueChange(value, 'status')}
                        renderInput={(params: AutocompleteRenderInputParams) => {
                            params.InputProps.className = autocompleteInputClasses.textInput;
                            return <TextField {...params}
                                className={autocompleteInputClasses.autocomplete}
                                variant="outlined"
                                autoComplete="off"
                                label='Status'
                                type={'text'}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: 'small'
                                    }
                                }}
                            />;
                        }}
                    />
                </Box>
            </Grid>
            {status === 'Realized' && <Grid item >
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '440px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <DatePicker
                        className={classes.datePickers}
                        inputFormat={'dd/MM/yyyy'}
                        disableFuture
                        value={dateExit ? moment(new Date(dateExit)).format('DD MMM YYYY') : null}
                        disableHighlightToday
                        onChange={(e) => onDateChange(e ?? '', 'dateExit')}
                        renderInput={(props: any) =>
                            <TextField {...props}
                                label={'Date of Exit'}
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
            </Grid>}
        </Grid>
    );
};

export default GeneralInformationStepContentComponent;