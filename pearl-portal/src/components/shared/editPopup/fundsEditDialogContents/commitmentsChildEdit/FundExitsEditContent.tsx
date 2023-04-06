import { Autocomplete, AutocompleteRenderInputParams, Fab, FormControlLabel, Grid, IconButton, InputAdornment, Switch, TextField, Tooltip, Typography, Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList, CurrencyList, NewCommitment } from '../../../../../models/shared/sharedModels';
import { EditExit, LP } from '../../../../../models/lps/lpModels';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/slices/rootSlice';
import { useAppDispatch } from '../../../../../redux/store';
import { fetchLPs } from '../../../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../../../models/funds/fundModels';
import { setLPs, setSelectedLP } from '../../../../../redux/slices/lps/lpsSlice';
import { setSelectedFund } from '../../../../../redux/slices/funds/fundsSlice';
import { InvestmentType, NewTransaction, SecurityType, Transaction, TransactionType } from '../../../../../models/transactions/transactionsModels';
import { setSelectedPCO } from '../../../../../redux/slices/pcos/pcosSlice';
import { PCOSummary } from '../../../../../models/pcos/pcoModels';
import { fetchFunds } from '../../../../../redux/thunks/fundThunk';
import { fetchPCOs } from '../../../../../redux/thunks/pcoThunk';
import { LPDistributionTypes, NewDistribution } from '../../../../../models/distributions/distributionsModels';
import { useTheme } from "@mui/material/styles";
import { amountValueFormatter } from '../../../../../helpers/app';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers';

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
        datePickers: {
            width: '100%',
            flex: 1,
        },
        textField: {
            width: '400px',
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

interface AddNewFundExitComponentProps {
    disabled: boolean,
    setDisabled: any,
    newDistribution: EditExit | null,
    setNewDistribution: (newState: any) => void
}

const FundsExitEditContentComponent = ({ setDisabled, disabled, newDistribution, setNewDistribution }: AddNewFundExitComponentProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const autocompleteInputClasses = autocompleteInputStyles();
    const theme = useTheme();
    const [amountGained, setAmountGained] = useState<any>(0);
    const [currency, setCurrency] = useState<string>('');
    const [pcoId, setPCOId] = useState<string>('');
    const { pcos, selectedPCO } = useSelector((state: RootState) => state.pcos);
    const { funds, selectedFund } = useSelector((state: RootState) => state.funds);
    const { lps, selectedLP } = useSelector((state: RootState) => state.lps);
    const [transType, setTransType] = useState<string>('');
    const [investmentType, setInvestmentType] = useState<string>('');
    const [securityType, setSecurityType] = useState<string>('');
    const fundId = selectedFund?.id ?? '';
    const fundName = selectedFund?.shortName ?? '';
    const [selectedPCOLocal, setSelectedPCOLocal] = useState<any>(pcos && newDistribution ? pcos.filter(x => x.id === newDistribution?.pcoId)[0] ?? null : null);
    const [isFirstOpen, setIsFirstOpen] = useState<boolean>(true);
    const [date, setDateExit] = useState<string>(newDistribution?.date ?? '');

    const onValueChange = (value: string, field: string) => {
        switch (field) {
            case 'pcoId':
                setPCOId(value);
                setSelectedPCOLocal(pcos?.filter(x => x.id === value)[0] ?? null)
                setNewDistribution({
                    ...newDistribution,
                    pcoId: value
                });
                setDisabled(value === '');
                break;
            case 'transType':
                setTransType(value);
                setNewDistribution({
                    ...newDistribution,
                    transType: value
                });
                setDisabled(value === '' || pcoId === '');
                break;
            case 'amountGained':
                setAmountGained(+value);
                setNewDistribution({
                    ...newDistribution,
                    amountGained: +value
                });
                setDisabled(+value === 0 || pcoId === '');
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

    const optionLabelLP = (option: string | LP) => {
        if (typeof (option) === 'string') {
            return option;
        } else {
            return option.name ? option.name : option;
        }
    };

    const onDateChange = (value: any, field: string) => {
        if (field === 'date') {
            setDateExit(value);
            if (newDistribution) {
                setNewDistribution({
                    ...newDistribution,
                    date: value
                });
            }
        }
    }

    useEffect(() => {
        dispatch(fetchFunds());
        dispatch(fetchPCOs());
        dispatch(fetchLPs());
    }, [dispatch])


    useEffect(() => {
        if (newDistribution !== null && newDistribution !== undefined && pcos && isFirstOpen) {
            setSelectedPCOLocal(pcos && newDistribution ? pcos.filter(x => x.id === newDistribution?.pcoId)[0] ?? null : null);
            setAmountGained(amountValueFormatter(newDistribution.amountGained ?? 0, ''));
            setDateExit(newDistribution.date ?? '');
        }
    }, [newDistribution, pcos, isFirstOpen]);

    return (
        <Grid container spacing={2} sx={{ paddingTop: '10px' }}>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        label={'Fund'}
                        aria-label="baseCapital"
                        value={fundName}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '400px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
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
                        value={selectedPCOLocal ?? undefined}
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
                                label={'PCO'}
                                type={'text'}
                            />;
                        }}
                    />
                </Box>
            </Grid>
            <Grid item >
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '400px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <DatePicker
                        className={classes.datePickers}
                        inputFormat={'dd/MM/yyyy'}
                        disableFuture
                        value={date ? moment(new Date(date)).format('DD MMM YYYY') : null}
                        onChange={(e) => onDateChange(e ?? '', 'date')}
                        disableHighlightToday
                        renderInput={(props: any) =>
                            <TextField {...props}
                                label={'Date Exit'}
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
                        aria-label="baseCapital"
                        value={amountGained}
                        label={'Amount'}
                        onChange={(e) => onValueChange(e.target.value, 'amountGained')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default FundsExitEditContentComponent;