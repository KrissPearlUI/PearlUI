
import { Autocomplete, AutocompleteRenderInputParams, Fab, FormControlLabel, Grid, IconButton, InputAdornment, Switch, TextField, Tooltip, Typography, Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import { EditInvestment, NewInvestment, PCOSummary } from '../../../../../../models/pcos/pcoModels';
import { fetchFunds } from '../../../../../../redux/thunks/fundThunk';
import { fetchPCOs } from '../../../../../../redux/thunks/pcoThunk';
import { LPCashCallType } from '../../../../../../models/cashCalls/cashCallsModels';
import { useTheme } from "@mui/material/styles";
import { amountValueFormatter } from '../../../../../../helpers/app';

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

interface AddNewPCOInvestmentFromLPComponentProps {
    disabled: boolean,
    setDisabled: any,
    newInvestment: EditInvestment | null,
    setNewInvestment: (newState: any) => void
}

const PCOFundInvestmentEditComponent = ({ setDisabled, disabled, newInvestment, setNewInvestment }: AddNewPCOInvestmentFromLPComponentProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const autocompleteInputClasses = autocompleteInputStyles();
    const theme = useTheme();
    const [amountInvested, setAmountInvested] = useState<any>(0);
    const [currency, setCurrency] = useState<string>('');
    const { pcos, selectedPCO } = useSelector((state: RootState) => state.pcos);
    const pcoId = selectedPCO?.id ?? '';
    const pcoName = selectedPCO?.shortName ?? '';
    const [fundId, setFundId] = useState<string>('');
    const { funds, selectedFund } = useSelector((state: RootState) => state.funds);
    const { lps, selectedLP } = useSelector((state: RootState) => state.lps);
    const [transType, setTransType] = useState<string>('');
    const [investmentType, setInvestmentType] = useState<string>('');
    const [securityType, setSecurityType] = useState<string>('');
    const [lpId, setLPId] = useState<string>('');
    const [selectedFundLocal, setSelectedFundLocal] = useState<any>(funds && newInvestment ? funds.filter(x => x.id === newInvestment?.fundId)[0] ?? null : null)
    const [isFirstOpen, setIsFirstOpen] = useState<boolean>(true);

    const onValueChange = (value: string, field: string) => {
        setIsFirstOpen(false);
        switch (field) {
            case 'fundId':
                setFundId(value);
                setSelectedFundLocal(funds?.filter(x => x.id === value)[0] ?? null)
                setNewInvestment({
                    ...newInvestment,
                    fundId: value
                });
                setDisabled(value === '');
                break;
            case 'investmentType':
                setInvestmentType(value);
                setNewInvestment({
                    ...newInvestment,
                    investmentType: value
                });
                setDisabled(value === '' || fundId === '');
                break;
            case 'amountInvested':
                setAmountInvested(+value);
                setNewInvestment({
                    ...newInvestment,
                    amountInvested: +value
                });
                setDisabled(+value === 0 || fundId === '');
                break;
            default:
                break;
        }
    };

    const optionLabelFund = (option: string | FundSummary) => {
        if (typeof (option) === 'string') {
            return option;
        } else {
            return option.shortName ? option.shortName : option;
        }
    };


    useEffect(() => {
        dispatch(fetchFunds());
    }, [dispatch])


    useEffect(() => {
        if (newInvestment !== null && newInvestment !== undefined && fetchFunds && isFirstOpen && InvestmentType) {
            setSelectedFundLocal(funds && newInvestment ? funds.filter(x => x.id === newInvestment?.fundId)[0] ?? null : null);
            setAmountInvested(newInvestment.amountInvested ? amountValueFormatter(newInvestment.amountInvested ?? 0, '') : 0)
            setInvestmentType(InvestmentType.filter(x => x === newInvestment.invetsmentType)[0] ?? '');
        }
    }, [newInvestment, funds, isFirstOpen, InvestmentType]);

    return (
        <Grid container spacing={2} sx={{ paddingTop: '10px' }}>
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
                        onChange={(e, value: FundSummary | null) => onValueChange(value ? value.id : '', 'lpId')}
                        value={selectedFundLocal ?? undefined}
                        options={funds && funds.length > 0 ? lps.slice().sort(function (a, b) {
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
                                type={'text'}
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
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="baseCapital"
                        value={amountInvested}
                        label={'Amount Invested'}
                        onChange={(e) => onValueChange(e.target.value, 'amountInvested')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default PCOFundInvestmentEditComponent;