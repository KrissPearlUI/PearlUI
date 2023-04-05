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

const FundTypes = [
    "Flex-term",
    "General"
];

interface GeneralInformationStepContentProps {
    selectedFund: FundSummary | null,
    setSelectedFund: React.Dispatch<React.SetStateAction<FundSummary | null>>,
    disabled: boolean,
    setDisabled: any
}

const GeneralInformationStepContentComponent = ({ selectedFund, setSelectedFund, disabled, setDisabled }: GeneralInformationStepContentProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [domicile, setDomicile] = useState<string | null>(selectedFund?.country ?? '');
    const [investmentComitee, setInvestmentComitee] = useState<string | null>(selectedFund?.investmentComitee ?? '');
    const [finalClosingDate, setFinalClosingDate] = useState<string>(selectedFund?.finalClosingDate ?? '');
    const [currency, setCurrency] = useState<string>(selectedFund?.currency ?? '');
    const [address, setAddress] = useState<string>(selectedFund?.address ? selectedFund.address?.split(',')[0] : '');
    const [aifm, setAIFM] = useState<string | number>(selectedFund?.aifm ?? '');
    const [firstClosingDate, setFirstClosingDate] = useState<string>(selectedFund?.vintage ?? '');
    const [aifmContact, setAIFMContact] = useState<string>(selectedFund?.aifmContact ?? '');
    const [type, setType] = useState<string | null>(selectedFund?.type ?? '');

    const onValueChange = (value: string, field: string) => {
        if (selectedFund) {
            switch (field) {
                case 'domicile':
                    setDomicile(value);
                    setSelectedFund({
                        ...selectedFund,
                        country: value
                    });
                    setDisabled(value === '');
                    break;
                case 'address':
                    setAddress(value);
                    setSelectedFund({
                        ...selectedFund,
                        address: value
                    });
                    setDisabled(value === '');
                    break;
                case 'investmentComitee':
                    setInvestmentComitee(value);
                    setSelectedFund({
                        ...selectedFund,
                        investmentComitee: value
                    });
                    setDisabled(value === '');
                    break;
                case 'currency':
                    setCurrency(value);
                    setSelectedFund({
                        ...selectedFund,
                        currency: value
                    });
                    setDisabled(value === '');
                    break;
                case 'type':
                    setType(value);
                    setSelectedFund({
                        ...selectedFund,
                        type: value
                    });
                    setDisabled(value === '');
                    break;
                case 'aifm':
                    setAIFM(value);
                    setSelectedFund({
                        ...selectedFund,
                        aifm: value
                    });
                    setDisabled(value === '');
                    break;
                case 'aifmContact':
                    setAIFMContact(value);
                    setSelectedFund({
                        ...selectedFund,
                        aifmContact: value
                    });
                    setDisabled(value === '');
                    break;
                default:
                    break;
            }
        }
    };

    const onDateChange = (value: any, field: string) => {
        if (field === 'vintage') {
            setFirstClosingDate(value);
            if (selectedFund) {
                setSelectedFund({
                    ...selectedFund,
                    ['vintage']: value
                });
            }
        } else {
            setFinalClosingDate(value);
            if (selectedFund) {
                setSelectedFund({
                    ...selectedFund,
                    finalClosingDate: value
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
                        label='Investment Comittee'
                        aria-label="name"
                        value={investmentComitee}
                        onChange={(e) => onValueChange(e.target.value, 'investmentComitee')}
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
                        value={firstClosingDate ? moment(new Date(firstClosingDate)).format('DD MMM YYYY') : null}
                        disableHighlightToday
                        onChange={(e) => onDateChange(e ?? '', 'vintage')}
                        renderInput={(props: any) =>
                            <TextField {...props}
                                label={'First Closing Date'}
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
            <Grid item >
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '440px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <DatePicker
                        className={classes.datePickers}
                        inputFormat={'dd/MM/yyyy'}
                        disableFuture
                        value={finalClosingDate ? moment(new Date(finalClosingDate)).format('DD MMM YYYY') : null}
                        disableHighlightToday
                        onChange={(e) => onDateChange(e ?? '', 'finalClosingDate')}
                        renderInput={(props: any) =>
                            <TextField {...props}
                                label={'Final Closing Date'}
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
                        label='Currency'
                        value={currency}
                        onChange={(e) => onValueChange(e.target.value, 'currency')}
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
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '440px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <Autocomplete
                        id={'fundsAutocomplete'}
                        popupIcon={<ExpandMoreIcon />}
                        size={'small'}
                        autoHighlight={true}
                        autoSelect={true}
                        autoComplete={false}
                        classes={classes}
                        onChange={(e, value: any) => onValueChange(value, 'type')}
                        sx={{ marginRight: '1em', width: '440px' }}
                        isOptionEqualToValue={(option, value) => option === value}
                        value={type ?? ''}
                        options={FundTypes.slice()}
                        renderInput={(params: AutocompleteRenderInputParams) => {
                            params.InputProps.className = autocompleteInputClasses.textInput;
                            return <TextField {...params}
                                className={autocompleteInputClasses.autocomplete}
                                variant="outlined"
                                autoComplete="off"
                                label='Type'
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
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="baseCapital"
                        label='AIFM'
                        value={aifm}
                        onChange={(e) => onValueChange(e.target.value, 'aifm')}
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
                        label='AIFM Contact'
                        value={aifmContact}
                        onChange={(e) => onValueChange(e.target.value, 'aifmContact')}
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

export default GeneralInformationStepContentComponent;