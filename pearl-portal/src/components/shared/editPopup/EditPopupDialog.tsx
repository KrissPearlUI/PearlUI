import React, { ReactElement, Ref, useState } from 'react';
import { TransitionProps } from "@mui/material/transitions";
import { Button, darken, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Slide, Theme, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { useAppDispatch } from '../../../redux/store';
import { RootState } from '../../../redux/slices/rootSlice';
import { setEditDiaogOpen } from '../../../redux/slices/appSlice';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { NewFund } from '../../../models/funds/fundModels';
import { NewPCO } from '../../../models/pcos/pcoModels';
import { NewLP } from '../../../models/lps/lpModels';
import { NewCommitment } from '../../../models/shared/sharedModels';
import { NewTransaction } from '../../../models/transactions/transactionsModels';
import { NewCashCall } from '../../../models/cashCalls/cashCallsModels';
import { NewDistribution } from '../../../models/distributions/distributionsModels';
import LPBasicEditContentComponent from './lpsEditDialogContents/basic/LPBasicEditContent';
import { makeStyles } from '@mui/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.default
    },
    nextBtn: {
        'marginRight': theme.spacing(1),
        'backgroundColor': '#7F201C',
        'color': 'white',
        'borderRadius': 0,
        'borderColor': '#7F201C',
        'fontSize': 13,
        'textTransform': 'none',
        'fontFamily': 'IBM Plex Sans',
        '&:hover': {
            backgroundColor: '#FF563F',
            borderColor: '#FF563F',
            color: 'white'
        }

    },
    backBtn: {
        'fontFamily': 'IBM Plex Sans',
        'textTransform': 'none',
        'fontSize': 13,
        'height': '2em',
        'marginRight': '3.5em',
        'color': darken(theme.palette.text.primary, .2),
        '&:hover': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.default,
            textDecorationLine: 'underline'

        }
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: '2em'
    },
    stepper: {
        backgroundColor: theme.palette.background.default,
        cursor: 'pointer'
    }
}));

const transitionMethod = (props: TransitionProps & { children: ReactElement<any, any> }, ref: Ref<unknown>) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Slide direction="up" ref={ref} {...props} />;
};

const Transition = React.forwardRef(transitionMethod);

const getSteps = () => {
    return ['General Information', 'Commitments', 'LP Financials', 'KPIs & IRR'];
};

interface AddDialogComponentProps {
    pageName: string,
    pageTitle: string
}

export const EditDialogComponent = ({ pageName, pageTitle }: AddDialogComponentProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { editDialogOpen } = useSelector((state: RootState) => state.app);
    const [disabled, setDisabled] = useState<boolean>(true);
    const theme = useTheme()
    const [newFund, setNewFund] = useState<NewFund | null>(null);
    const [newLP, setNewLP] = useState<NewLP | null>(null);
    const [newPCO, setNewPCO] = useState<NewPCO | null>(null);
    const [newCommitment, setNewCommitment] = useState<NewCommitment | null>(null);
    const [newTransaction, setNewTransaction] = useState<NewTransaction | null>(null);
    const [newCashCall, setNewCashCall] = useState<NewCashCall | null>(null);
    const [newDistribution, setNewDistribution] = useState<NewDistribution | null>(null);
    const steps: string[] = getSteps();
    const [activeStep, setActiveStep] = useState<number>(0);

    /**
     * Handles the closing of the dialog
     */
    const handleClose = () => {
        setActiveStep(0);
        dispatch(setEditDiaogOpen(false));
    };

    const handleAddBtnClick = () => {
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
        console.log(valid);
    }

    /**
* Event triggered when click on next arrow
*/
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    /**
     * Event triggered when click on back arrow
     */
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Dialog open={editDialogOpen} TransitionComponent={Transition}
            maxWidth={'sm'}
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
                <LPBasicEditContentComponent steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
            </DialogContent>
            <DialogActions sx={{ backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A' }}>
                {pageName === 'lpBasic' ?
                    activeStep !== steps.length && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button disabled={activeStep === 0} onClick={handleBack}
                                startIcon={<ArrowBackIosNewIcon fontSize='small' sx={{ width: 16, height: 16 }} />}
                                sx={{ display: activeStep === 0 ? 'none' : 'flex', marginRight: '1em', textTransform: 'none', height: 36 }} variant="outlined">
                                {`Back`}
                            </Button>
                            <Button
                                variant="outlined"
                                endIcon={<ArrowBackIosNewIcon fontSize='small' sx={{ transform: 'rotate(180deg)', width: 16, height: 16 }} />}
                                onClick={handleNext}
                                sx={{ display: activeStep === steps.length - 1 ? 'none' : 'flex', marginRight: '1em', textTransform: 'none', height: 36 }}
                            >
                                Next
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: 'none', height: 36 }}
                                startIcon={<EditRoundedIcon />}
                                onClick={handleAddBtnClick}
                            >Edit</Button>
                        </div>
                    )
                    : <Button
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: 'none' }}
                        startIcon={<EditRoundedIcon />}
                        disabled={disabled}
                        onClick={handleAddBtnClick}
                    >
                        Edit
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
};
