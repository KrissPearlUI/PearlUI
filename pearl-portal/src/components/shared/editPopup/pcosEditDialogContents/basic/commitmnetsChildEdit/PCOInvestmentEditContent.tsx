import { Autocomplete, AutocompleteRenderInputParams, Box, Fab, FormControlLabel, Grid, IconButton, InputAdornment, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList, CurrencyList, NewCommitment } from '../../../../../../models/shared/sharedModels';
import { LP } from '../../../../../../models/lps/lpModels';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/slices/rootSlice';
import { useAppDispatch } from '../../../../../../redux/store';
import { fetchLPs } from '../../../../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../../../../models/funds/fundModels';
import { setLPs, setSelectedLP } from '../../../../../../redux/slices/lps/lpsSlice';
import { setSelectedFund } from '../../../../../../redux/slices/funds/fundsSlice';
import { InvestmentType, NewTransaction, SecurityType, Transaction, TransactionType } from '../../../../../../models/transactions/transactionsModels';
import { setSelectedPCO } from '../../../../../../redux/slices/pcos/pcosSlice';
import { NewInvestment, PCOSummary } from '../../../../../../models/pcos/pcoModels';
import { fetchFunds } from '../../../../../../redux/thunks/fundThunk';
import { fetchPCOs } from '../../../../../../redux/thunks/pcoThunk';
import { LPCashCallType } from '../../../../../../models/cashCalls/cashCallsModels';
import { DatePicker } from '@mui/x-date-pickers';
import { useTheme } from "@mui/material/styles";
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
            width: '400px',
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
        switchField: {
            '& .MuiFormControlLabel-label': {
                fontFamily: 'Raleway'
            }
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

interface PCOInvestmentEditContentComponentProps {
    disabled: boolean,
    setDisabled: any,
    newInvestment: NewInvestment | null,
    setNewInvestment: (newState: any) => void,
}

const PCOInvestmentEditContentComponent = ({ setDisabled, disabled, newInvestment, setNewInvestment }: PCOInvestmentEditContentComponentProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [amountFundCurrency, setAmountFundCurrency] = useState<number>(newInvestment?.amount ?? 0);
    const [currency, setCurrency] = useState<string>('');
    const { pcos, selectedPCO } = useSelector((state: RootState) => state.pcos);
    const pcoId = selectedPCO?.id ?? '';
    const pcoName = selectedPCO?.shortName ?? '';
    const { funds, selectedFund } = useSelector((state: RootState) => state.funds);
    const { lps, selectedLP } = useSelector((state: RootState) => state.lps);
    const [transType, setTransType] = useState<string>('');
    const [investmentType, setInvestmentType] = useState<string>(newInvestment?.invetsmentType ?? '');
    const [securityType, setSecurityType] = useState<string>('');
    const [fundId, setFundId] = useState<string>(newInvestment?.fundId ?? '');
    const [dateInvestment, setDateInvestment] = useState<string>(newInvestment?.dateInvestment ?? '');

    const onValueChange = (value: string, field: string) => {
        switch (field) {
            case 'fundId':
                setFundId(value);
                setNewInvestment({
                    ...newInvestment,
                    fundId: value
                });
                setDisabled(value === '' || investmentType === '' || amountFundCurrency === 0);
                break;
            case 'investmentType':
                setInvestmentType(value);
                setNewInvestment({
                    ...newInvestment,
                    investmentType: value
                });
                setDisabled(value === '' || fundId === '' || amountFundCurrency === 0);
                break;
            case 'amountFundCurrency':
                setAmountFundCurrency(+value);
                setNewInvestment({
                    ...newInvestment,
                    amountFundCurrency: +value
                });
                setDisabled(+value === 0 || investmentType === '' || fundId === '');
                break;
            default:
                break;
        }
    };

    const optionLabelFund = (option: string | FundSummary) => {
        if (typeof (option) === 'string') {
            return option;
        } else {
            return option.fundName ? option.fundName : option;
        }
    };

    const onDateChange = (value: any, field: string) => {
        if (field === 'dateInvestment') {
            setDateInvestment(value);
            if (selectedPCO) {
                setSelectedPCO({
                    ...selectedPCO,
                    dateInitalInvestment: value
                });
            }
        }
    }

    useEffect(() => {
        dispatch(fetchFunds());
    }, [dispatch])


    return (
        <Grid container spacing={2} sx={{ paddingTop: '10px' }}>
            <Grid item>
                <Autocomplete
                    id={'fundsAutocomplete'}
                    popupIcon={<ExpandMoreIcon />}
                    size={'small'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    classes={classes}
                    sx={{ marginRight: '1em', width: '400px' }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value: FundSummary | null) => onValueChange(value ? value.id : '', 'fundId')}
                    value={selectedFund ?? undefined}
                    options={funds && funds.length > 0 ? funds.slice().sort(function (a, b) {
                        if (a.id.toLowerCase() < b.id.toLowerCase()) return -1;
                        if (a.id.toLowerCase() > b.id.toLowerCase()) return 1;
                        return 0;
                    }) : []}
                    getOptionLabel={(option) => optionLabelFund(option).toString()}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            label={'Fund'}
                            helperText={!disabled && fundId === '' ? 'Required' : ''}
                            type={'text'}
                        />;
                    }}
                />
            </Grid>
            <Grid item>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    label={'PCO'}
                    aria-label="baseCapital"
                    value={pcoName}
                    inputProps={{
                        style: { height: '1em' },
                    }}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Grid>
            <Grid item >
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '440px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <DatePicker
                        className={classes.datePickers}
                        inputFormat={'dd/MM/yyyy'}
                        disableFuture
                        value={dateInvestment ? moment(new Date(dateInvestment)).format('DD MMM YYYY') : null}
                        onChange={(e) => onDateChange(e ?? '', 'dateInvestment')}
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
                <Autocomplete
                    id={'fundsAutocomplete'}
                    popupIcon={<ExpandMoreIcon />}
                    size={'small'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    disableClearable
                    classes={classes}
                    sx={{ marginRight: '1em', width: '400px' }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value: any) => onValueChange(value, 'investmentType')}
                    value={investmentType ?? ''}
                    options={InvestmentType?.slice()}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            label={'Investment Type'}
                            helperText={!disabled && investmentType === '' ? 'Required' : ''}
                            type={'text'}
                        />;
                    }}
                />
            </Grid>
            <Grid item>
                <Typography variant='body2'>Amount</Typography>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    aria-label="baseCapital"
                    value={amountFundCurrency}
                    type={'number'}
                    onChange={(e) => onValueChange(e.target.value, 'amountFundCurrency')}
                    inputProps={{
                        style: { height: '1em' },
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default PCOInvestmentEditContentComponent;