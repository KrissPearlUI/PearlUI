import React, { ReactElement, Ref, useState } from 'react';
import { TransitionProps } from "@mui/material/transitions";
import { Autocomplete, AutocompleteRenderInputParams, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Slide, TextField, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { useAppDispatch } from '../../../redux/store';
import { RootState } from '../../../redux/slices/rootSlice';
import { setAddDiaogOpen, setDownloadDiaogOpen } from '../../../redux/slices/appSlice';
import AddIcon from '@mui/icons-material/Add';
import { FundSummary, NewFund } from '../../../models/funds/fundModels';
import { NewPCO, PCOSummary } from '../../../models/pcos/pcoModels';
import { LP, NewLP } from '../../../models/lps/lpModels';
import { NewCommitment } from '../../../models/shared/sharedModels';
import { NewTransaction } from '../../../models/transactions/transactionsModels';
import { NewCashCall } from '../../../models/cashCalls/cashCallsModels';
import { NewDistribution } from '../../../models/distributions/distributionsModels';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { DatePicker } from '@mui/x-date-pickers';
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
        height: '2.4em',
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
        searchBox: {
            width: '400px',
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
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

const transitionMethod = (props: TransitionProps & { children: ReactElement<any, any> }, ref: Ref<unknown>) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Slide direction="up" ref={ref} {...props} />;
};

const Transition = React.forwardRef(transitionMethod);


const TypeOfFiles = [
    "Excel",
    "PDF",
];

interface DownloadDialogComponentProps {
    pageName: string,
    pageTitle: string
}

export const DownloadDialogComponent = ({ pageName, pageTitle }: DownloadDialogComponentProps) => {
    const dispatch = useAppDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const { downloadDialogOpen } = useSelector((state: RootState) => state.app);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [newFund, setNewFund] = useState<NewFund | null>(null);
    const [newLP, setNewLP] = useState<NewLP | null>(null);
    const [newPCO, setNewPCO] = useState<NewPCO | null>(null);
    const [newCommitment, setNewCommitment] = useState<NewCommitment | null>(null);
    const [newTransaction, setNewTransaction] = useState<NewTransaction | null>(null);
    const [newCashCall, setNewCashCall] = useState<NewCashCall | null>(null);
    const [newDistribution, setNewDistribution] = useState<NewDistribution | null>(null);
    const [type, setType] = useState<string | null>('');
    const [startDate, setStartDate] = useState<string | null>('');
    const [endDate, setEndDate] = useState<string | null>('');
    const [fund, setFund] = useState<string | null>('');
    const [pco, setPCO] = useState<string | null>('');
    const [lp, setLP] = useState<string | null>('');

    /**
     * Handles the closing of the dialog
     */
    const handleClose = () => {
        dispatch(setDownloadDiaogOpen(false));
    };

    const handleDownloadBtnClick = () => {
        let valid = false;
        if (pageName === 'fundsOverview') {
            valid = newFund !== null && newFund.fundName !== '' && newFund.shortName !== '' && newFund.country !== '' && newFund.type !== '' && newFund.currency !== '';
        } else if (pageName === 'lpsOverview') {
            valid = newLP !== null && newLP.name !== '' && newLP.shortName !== '' && newLP.city !== '' && newLP.country !== '' && newLP.type !== '';
        } else if (pageName === 'pcosOverview') {
            valid = newPCO !== null && newPCO.pcoName !== '' && newPCO.shortName !== '' && newPCO.country !== '' && newPCO.sector !== '' && newPCO.currency !== '';
        } else if (pageName === 'commitments') {
            valid = newCommitment !== null && newCommitment.lpId !== '' && newCommitment.fundId !== '' && newCommitment.fundCurrency !== '' && newCommitment.committedAmount !== 0
        } else if (pageName === 'transactions') {
            valid = newTransaction !== null && newTransaction.pcoId !== '' && newTransaction.fundId !== '' && newTransaction.transType !== '' && newTransaction.securityType !== '' && newTransaction.amountFundCurrency !== 0 && (newTransaction.transType === 'Investment' && newTransaction.investmentType !== '')
        }
    }

    const onValueChange = (value: string, field: string) => {
        switch (field) {
            case 'type':
                setType(value);
                setNewLP({
                    ...newLP,
                    name: value
                });
                setDisabled(value === '');
                break;
            case 'startDate':
                setStartDate(value);
                setNewLP({
                    ...newLP,
                    shortName: value
                });
                setDisabled(value === '' || type === '');
                break;
            case 'endDate':
                setEndDate(value);
                setNewLP({
                    ...newLP,
                    address: value
                });
                setDisabled(value === '' || type === '');
                break;
            case 'fund':
                setFund(value);
                setNewLP({
                    ...newLP,
                    city: value
                });
                setDisabled(value === '' || type === '');
                break;
            case 'pco':
                setPCO(value);
                setNewLP({
                    ...newLP,
                    postalCode: value
                });
                setDisabled(value === '' || type === '');
                break;
            case 'lp':
                setLP(value);
                setNewLP({
                    ...newLP,
                    country: value
                });
                setDisabled(value === '' || type === '');
                break;
            default:
                break;
        }
    };

    const onDateChange = (value: any, field: string) => {
        if (field === 'startDate') {
            setStartDate(value);
            setNewLP({
                ...newLP,
                country: value
            });
        } else if (field === 'endDate') {
            setEndDate(value);
            setNewLP({
                ...newLP,
                country: value
            });
        }
    }

    return (
        <Dialog open={downloadDialogOpen} TransitionComponent={Transition}
            maxWidth={'xs'}
            fullWidth
            aria-label={'dialog extra data client'}>
            <DialogTitle sx={{
                cursor: 'move',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A'
            }} id="form-dialog-client-data">
                <Grid container sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', height: '100%', flexDirection: 'column' }}>
                    <Grid item xs={12} sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography style={{
                            fontSize: 18,
                            fontWeight: 600
                        }}>{pageTitle}</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ width: '100%' }} />
                    </Grid>

                </Grid>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', height: '100%', backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A' }}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Typography variant='body2'>Type of file*</Typography>
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
                                onChange={(e, value: any) => onValueChange(value, 'type')}
                                value={type ?? ''}
                                options={TypeOfFiles.slice()}
                                renderInput={(params: AutocompleteRenderInputParams) => {
                                    params.InputProps.className = autocompleteInputClasses.textInput;
                                    return <TextField {...params}
                                        className={autocompleteInputClasses.autocomplete}
                                        variant="outlined"
                                        autoComplete="off"
                                        helperText={!disabled && type === '' ? 'Required' : ''}
                                        type={'text'}
                                    />;
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>Start date</Typography>
                        <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '400px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                            <DatePicker
                                className={classes.datePickers}
                                inputFormat={'dd/MM/yyyy'}
                                disableFuture
                                value={startDate ? moment(new Date(startDate)).format('DD MMM YYYY') : null}
                                disableHighlightToday
                                onChange={(e) => onDateChange(e ?? '', 'firstInvestment')}
                                renderInput={(props: any) =>
                                    <TextField {...props}
                                        variant={'outlined'}
                                        size={'small'}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            sx: {
                                                fontSize: 'small',
                                            }
                                        }}
                                    />}
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>End date</Typography>
                        <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '400px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                            <DatePicker
                                className={classes.datePickers}
                                inputFormat={'dd/MM/yyyy'}
                                disableFuture
                                value={endDate ? moment(new Date(endDate)).format('DD MMM YYYY') : null}
                                disableHighlightToday
                                onChange={(e) => onDateChange(e ?? '', 'firstInvestment')}
                                renderInput={(props: any) =>
                                    <TextField {...props}
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
                </Grid>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A' }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                    startIcon={<DownloadRoundedIcon />}
                    disabled={disabled}
                    onClick={handleDownloadBtnClick}
                >
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    );
};
