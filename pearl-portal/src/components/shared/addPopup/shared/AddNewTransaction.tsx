import { Autocomplete, AutocompleteRenderInputParams, Fab, FormControlLabel, Grid, IconButton, InputAdornment, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList, CurrencyList, NewCommitment } from '../../../../models/shared/sharedModels';
import { LP } from '../../../../models/lps/lpModels';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/slices/rootSlice';
import { useAppDispatch } from '../../../../redux/store';
import { fetchLPs } from '../../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../../models/funds/fundModels';
import { setLPs, setSelectedLP } from '../../../../redux/slices/lps/lpsSlice';
import { setSelectedFund } from '../../../../redux/slices/funds/fundsSlice';
import { InvestmentType, NewTransaction, SecurityType, Transaction, TransactionType } from '../../../../models/transactions/transactionsModels';
import { setSelectedPCO } from '../../../../redux/slices/pcos/pcosSlice';
import { PCOSummary } from '../../../../models/pcos/pcoModels';
import { fetchFunds } from '../../../../redux/thunks/fundThunk';
import { fetchPCOs } from '../../../../redux/thunks/pcoThunk';

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

interface AddNewCommitmentComponentProps {
    disabled: boolean,
    setDisabled: any,
    newTransaction: NewTransaction | null,
    setNewTransaction: (newState: any) => void
}

const AddNewTransactionComponent = ({ setDisabled, disabled, newTransaction, setNewTransaction }: AddNewCommitmentComponentProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [amountFundCurrency, setAmountFundCurrency] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('');
    const [pcoId, setPCOId] = useState<string>('');
    const { pcos, selectedPCO } = useSelector((state: RootState) => state.pcos);
    const [fundId, setFundId] = useState<string>('');
    const { funds, selectedFund } = useSelector((state: RootState) => state.funds);
    const [transType, setTransType] = useState<string>('');
    const [investmentType, setInvestmentType] = useState<string>('');
    const [securityType, setSecurityType] = useState<string>('');

    const onValueChange = (value: string, field: string) => {
        switch (field) {
            case 'pcoId':
                setPCOId(value);
                dispatch(setSelectedPCO(pcos?.filter(x => x.id === value)[0] ?? null))
                setNewTransaction({
                    ...newTransaction,
                    pcoId: value
                });
                setDisabled(value === '' || transType === '' || fundId === '' || securityType === '' || amountFundCurrency === 0 || ((transType === 'Investment' || transType === 'Spin-off') && investmentType === ''));
                break;
            case 'fundId':
                setFundId(value);
                dispatch(setSelectedFund(funds?.filter(x => x.id === value)[0] ?? null))
                setNewTransaction({
                    ...newTransaction,
                    fundId: value
                });
                setDisabled(value === '' || transType === '' || pcoId === '' || securityType === '' || amountFundCurrency === 0 || ((transType === 'Investment' || transType === 'Spin-off') && investmentType === ''));
                break;
            case 'transType':
                setTransType(value);
                setNewTransaction({
                    ...newTransaction,
                    transType: value
                });
                setDisabled(value === '' || pcoId === '' || fundId === '' || securityType === '' || amountFundCurrency === 0 || ((transType === 'Investment' || transType === 'Spin-off') && investmentType === ''));
                break;
            case 'securityType':
                setSecurityType(value);
                setNewTransaction({
                    ...newTransaction,
                    securityType: value
                });
                setDisabled(value === '' || transType === '' || fundId === '' || pcoId === '' || amountFundCurrency === 0 || ((transType === 'Investment' || transType === 'Spin-off') && investmentType === ''));
                break;
            case 'amountFundCurrency':
                setAmountFundCurrency(+value);
                setNewTransaction({
                    ...newTransaction,
                    amountFundCurrency: +value
                });
                setDisabled(+value === 0 || transType === '' || fundId === '' || pcoId === '' || pcoId === '' || ((transType === 'Investment' || transType === 'Spin-off') && investmentType === ''));
                break;
            case 'investmentType':
                setInvestmentType(value);
                setNewTransaction({
                    ...newTransaction,
                    investmentType: value
                });
                setDisabled(value === '' || transType === '' || fundId === '' || pcoId === '' || amountFundCurrency === 0);
                break;
            default:
                break;
        }
    };

    const optionLabel = (option: string | PCOSummary) => {
        if (typeof (option) === 'string') {
            return option;
        } else {
            return option.pcoName ? option.pcoName : option;
        }
    };

    const optionLabelFund = (option: string | FundSummary) => {
        if (typeof (option) === 'string') {
            return option;
        } else {
            return option.fundName ? option.fundName : option;
        }
    };

    useEffect(() => {
        dispatch(fetchFunds());
        dispatch(fetchPCOs());
    }, [dispatch])


    return (
        <Grid container spacing={2}>
            <Grid item>
                <Typography variant='body2'>Fund*</Typography>
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
                            helperText={!disabled && fundId === '' ? 'Required' : ''}
                            type={'text'}
                        />;
                    }}
                />
            </Grid>
            <Grid item>
                <Typography variant='body2'>Portfolio Company*</Typography>
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
                    onChange={(e, value: PCOSummary | null) => onValueChange(value ? value.id : '', 'pcoId')}
                    value={selectedPCO ?? undefined}
                    options={pcos && pcos.length > 0 ? pcos.slice().sort(function (a, b) {
                        if (a.id.toLowerCase() < b.id.toLowerCase()) return -1;
                        if (a.id.toLowerCase() > b.id.toLowerCase()) return 1;
                        return 0;
                    }) : []}
                    getOptionLabel={(option) => optionLabel(option).toString()}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            helperText={!disabled && pcoId === '' ? 'Required' : ''}
                            type={'text'}
                        />;
                    }}
                />
            </Grid>
            <Grid item>
                <Typography variant='body2'>Transaction Type*</Typography>
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
                    onChange={(e, value: any) => onValueChange(value, 'transType')}
                    value={transType ?? ''}
                    options={TransactionType?.slice()}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            helperText={!disabled && transType === '' ? 'Required' : ''}
                            type={'text'}
                        />;
                    }}
                />
            </Grid>
            {(transType === 'Investment' || transType === 'Spin-off') && <Grid item>
                <Typography variant='body2'>Investment Type*</Typography>
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
                            helperText={!disabled && investmentType === '' ? 'Required' : ''}
                            type={'text'}
                        />;
                    }}
                />
            </Grid>}
            <Grid item>
                <Typography variant='body2'>Security Type*</Typography>
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
                    onChange={(e, value: any) => onValueChange(value, 'securityType')}
                    value={securityType ?? ''}
                    options={SecurityType?.slice()}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            helperText={!disabled && securityType === '' ? 'Required' : ''}
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

export default AddNewTransactionComponent;