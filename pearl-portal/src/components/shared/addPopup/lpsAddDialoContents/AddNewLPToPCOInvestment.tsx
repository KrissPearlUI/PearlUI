import { Autocomplete, AutocompleteRenderInputParams, Fab, FormControlLabel, Grid, IconButton, InputAdornment, Switch, TextField, Tooltip, Typography,Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList, CurrencyList } from '../../../../models/shared/sharedModels';
import { LP } from '../../../../models/lps/lpModels';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/slices/rootSlice';
import { useAppDispatch } from '../../../../redux/store';
import { fetchLPs } from '../../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../../models/funds/fundModels';
import { setSelectedLP } from '../../../../redux/slices/lps/lpsSlice';
import { setSelectedFund } from '../../../../redux/slices/funds/fundsSlice';
import { fetchFunds } from '../../../../redux/thunks/fundThunk';
import { fetchPCOs } from '../../../../redux/thunks/pcoThunk';
import { NewInvestment, PCOSummary } from '../../../../models/pcos/pcoModels';
import { InvestmentType } from '../../../../models/transactions/transactionsModels';
import { useTheme } from "@mui/material/styles";

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

interface AddNewLPToPCOinvestmentComponentProps {
    disabled: boolean,
    setDisabled: any,
    newInvestment: NewInvestment | null,
    setNewInvestment: (newState: any) => void
}

const AddNewLPToPCOinvestmentComponent = ({ setDisabled, disabled, newInvestment, setNewInvestment }: AddNewLPToPCOinvestmentComponentProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const autocompleteInputClasses = autocompleteInputStyles();
    const theme = useTheme();
    const [amount, setAmount] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('');
    const { lps, selectedLP } = useSelector((state: RootState) => state.lps);
    const lpId = selectedLP?.id ?? '';
    const lpName = selectedLP?.shortName ?? '';
    const [transfered, setTransfered] = useState<boolean>(false);
    const [pcoId, setPcoId] = useState<string>('');
    const { pcos,selectedPCO } = useSelector((state: RootState) => state.pcos);
    const [investmentType, setInvestmentType] = useState<string>('');

    const onValueChange = (value: string, field: string) => {
        switch (field) {
            case 'pcoId':
                setPcoId(value);
                setNewInvestment({
                    ...newInvestment,
                    pcoId: value
                });
                setDisabled(value === '' || currency === '' || amount === 0);
                break;
            case 'currency':
                setCurrency(value);
                setNewInvestment({
                    ...newInvestment,
                    currency: value
                });
                setDisabled(value === '' || pcoId === '' || amount === 0);
                break;
            case 'investmentType':
                setInvestmentType(value);
                setNewInvestment({
                    ...newInvestment,
                    investmentType: value
                });
                setDisabled(value === '' || pcoId === '' || amount === 0);
                break;
            case 'amount':
                setAmount(+value);
                setNewInvestment({
                    ...newInvestment,
                    amount: +value
                });
                setDisabled(currency === '' || pcoId === '' || +value === 0);
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
    useEffect(() => {
        dispatch(fetchPCOs());
    }, [dispatch])


    return (
        <Grid container spacing={2} sx={{ paddingTop: '10px' }}>
            <Grid item>
            <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    label={'LP'}
                    aria-label="baseCapital"
                    value={lpName}
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
                            label={'PCO'}
                            helperText={!disabled && pcoId === '' ? 'Required' : ''}
                            type={'text'}
                        />;
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
                    disableClearable
                    classes={classes}
                    sx={{ marginRight: '1em', width: '400px' }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value: any) => onValueChange(value, 'currency')}
                    value={currency ?? ''}
                    options={CurrencyList?.map(x => x.code)?.slice()}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            label={'Currency'}
                            helperText={!disabled && currency === '' ? 'Required' : ''}
                            type={'text'}
                        />;
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
                </Box>
            </Grid>
            <Grid item>
            <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    aria-label="baseCapital"
                    value={amount}
                    type={'number'}
                    label={'Amount'}
                    onChange={(e) => onValueChange(e.target.value, 'amount')}
                    inputProps={{
                        style: { height: '1em' },
                    }}
                />
                </Box>
            </Grid>
        </Grid>
    );
};

export default AddNewLPToPCOinvestmentComponent;