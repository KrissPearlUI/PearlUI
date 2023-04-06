import React, { ReactElement, Ref, useState } from 'react';
import { TransitionProps } from "@mui/material/transitions";
import { Button, darken, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Slide, Theme, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { useAppDispatch } from '../../../redux/store';
import { RootState } from '../../../redux/slices/rootSlice';
import { setEditChildDiaogOpen, setEditDiaogOpen } from '../../../redux/slices/appSlice';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { FundSummary, NewFund } from '../../../models/funds/fundModels';
import { EditInvestment, NewInvestment, NewPCO, PCOSummary } from '../../../models/pcos/pcoModels';
import { EditExit, LP, NewLP } from '../../../models/lps/lpModels';
import { EditCommitment, NewCommitment } from '../../../models/shared/sharedModels';
import { NewTransaction } from '../../../models/transactions/transactionsModels';
import { NewCashCall } from '../../../models/cashCalls/cashCallsModels';
import { NewDistribution } from '../../../models/distributions/distributionsModels';
import LPBasicEditContentComponent from './lpsEditDialogContents/basic/LPBasicEditContent';
import { makeStyles } from '@mui/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FundBasicEditContentComponent from './fundsEditDialogContents/basic/FundBasicEditContent';
import PCOBasicEditContentComponent from './pcosEditDialogContents/basic/PCOBasicEditContent';
import PCOInvestmentEditContentComponent from './pcosEditDialogContents/basic/commitmnetsChildEdit/PCOInvestmentEditContent';
import PCOLPEditComponent from './pcosEditDialogContents/basic/commitmnetsChildEdit/PCOLPEditContent';
import PCOFundInvestmentEditComponent from './pcosEditDialogContents/basic/commitmnetsChildEdit/PCOFundCInvestmentEditContent';
import LPCommitmentEditContentComponent from './lpsEditDialogContents/commitmentsChildEdit/LPCommitmentEditContent';
import LPFundsEditContentComponent from './lpsEditDialogContents/commitmentsChildEdit/LPFundsEditContent';
import LPPCOsEditContentComponent from './lpsEditDialogContents/commitmentsChildEdit/LPPCOsEditContent';
import LPExitsEditContentCmponent from './lpsEditDialogContents/commitmentsChildEdit/LPExitsEditContent';
import FundCommitmentEditContentComponent from './fundsEditDialogContents/commitmentsChildEdit/FundCommitmentsEditContent';
import FundLPsEditContentComponent from './fundsEditDialogContents/commitmentsChildEdit/FundLPsEditContent';
import FundPCOsEditContentComponent from './fundsEditDialogContents/commitmentsChildEdit/FundPCOsEditContent';

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

const getLPSteps = () => {
    return ['General Information', 'Commitments', 'LP Financials', 'KPIs & IRR'];
};

const getFundSteps = () => {
    return ['General Information', 'Commitments', 'Fund Financials', 'KPIs & IRR'];
};

const getStepsPCO = () => {
    return ['General Information', 'Investments', 'PCO Financials'];
};

interface EditChildDialogComponentProps {
    pageName: string,
    pageTitle: string,
    open: boolean,
}

export const EditChildDialogComponent = ({ open, pageName, pageTitle }: EditChildDialogComponentProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { editChildDialogOpen } = useSelector((state: RootState) => state.app);
    const [disabled, setDisabled] = useState<boolean>(false);
    const theme = useTheme()
    const [newFund, setNewFund] = useState<NewFund | null>(null);
    const [newLP, setNewLP] = useState<NewLP | null>(null);
    const [newPCO, setNewPCO] = useState<NewPCO | null>(null);
    const [newCommitment, setNewCommitment] = useState<NewCommitment | null>(null);
    const [newTransaction, setNewTransaction] = useState<NewTransaction | null>(null);
    const [newCashCall, setNewCashCall] = useState<NewCashCall | null>(null);
    const [newDistribution, setNewDistribution] = useState<NewDistribution | null>(null);
    const stepsLP: string[] = getLPSteps();
    const stepsFund: string[] = getFundSteps();
    const stepsPCO: string[] = getStepsPCO();
    const [activeStepLP, setActiveStepLP] = useState<number>(0);
    const [activeStepFund, setActiveStepFund] = useState<number>(0);
    const [activeStepPCO, setActiveStepPCO] = useState<number>(0);
    const { selectedFund } = useSelector((state: RootState) => state.funds);
    const [selectedFundLocal, setSelectedFundLocal] = useState<FundSummary | null>(selectedFund ?? null)
    const { selectedLP, selectedCommitment, selectedExit } = useSelector((state: RootState) => state.lps);
    const [selectedLPLocal, setSelectedLPLocal] = useState<LP | null>(selectedLP ?? null);
    const { selectedPCO, selectedInvestment } = useSelector((state: RootState) => state.pcos);
    const [selectedPCOLocal, setSelectedPCOLocal] = useState<PCOSummary | null>(selectedPCO ?? null);
    const [selectedInvetsmentLocal, setSelecetdInvestmentLocal] = useState<EditInvestment | null>(selectedInvestment ? selectedInvestment : null);
    const [selectedCommitmentLocal, setSelectedCommitmentLocal] = useState<EditCommitment | null>(selectedCommitment ? selectedCommitment : null);
    const [selectedExitLocal, setSelectedExitLocal] = useState<EditExit | null>(selectedExit ? selectedExit : null);

    /**
     * Handles the closing of the dialog
     */
    const handleClose = () => {
        setSelectedFundLocal(selectedFund);
        setSelectedLPLocal(selectedLP);
        setSelectedPCOLocal(selectedPCO);
        setActiveStepLP(0);
        setActiveStepFund(0);
        setActiveStepPCO(0);
        dispatch(setEditChildDiaogOpen(false));
    };

    const handleEditBtnClick = () => {
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
    const handleNext = (pageName: string) => {
        if (pageName === 'lpBasic') {
            setActiveStepLP((prevActiveStep) => prevActiveStep + 1);
        } else if (pageName === 'fundBasic') {
            setActiveStepFund((prevActiveStep) => prevActiveStep + 1);
        } else if (pageName === 'pcoBasic') {
            setActiveStepPCO((prevActiveStep) => prevActiveStep + 1);
        }
    };

    /**
     * Event triggered when click on back arrow
     */
    const handleBack = (pageName: string) => {
        if (pageName === 'lpBasic') {
            setActiveStepLP((prevActiveStep) => prevActiveStep - 1);
        } else if (pageName === 'fundBasic') {
            setActiveStepFund((prevActiveStep) => prevActiveStep - 1);
        } else if (pageName === 'pcoBasic') {
            setActiveStepPCO((prevActiveStep) => prevActiveStep - 1);
        }
    };

    return (
        <Dialog open={editChildDialogOpen} TransitionComponent={Transition}
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
                {open && pageName === 'investments' ? <PCOInvestmentEditContentComponent disabled={disabled} setDisabled={setDisabled} newInvestment={selectedInvetsmentLocal} setNewInvestment={setSelecetdInvestmentLocal} />
                    : pageName === 'pcoFunds' ? <PCOFundInvestmentEditComponent disabled={disabled} setDisabled={setDisabled} newInvestment={selectedInvetsmentLocal} setNewInvestment={setSelecetdInvestmentLocal} />
                        : pageName === 'pcoLPs' ? <PCOLPEditComponent disabled={disabled} setDisabled={setDisabled} newInvestment={selectedInvetsmentLocal} setNewInvestment={setSelecetdInvestmentLocal} />
                            : pageName === 'lpCommitments' ? <LPCommitmentEditContentComponent disabled={disabled} setDisabled={setDisabled} newCommitment={selectedCommitmentLocal} setNewCommitment={setSelectedCommitmentLocal} />
                                : pageName === 'lpFunds' ? <LPFundsEditContentComponent disabled={disabled} setDisabled={setDisabled} newCommitment={selectedCommitmentLocal} setNewCommitment={setSelectedCommitmentLocal} />
                                    : pageName === 'lpPCOs' ? <LPPCOsEditContentComponent disabled={disabled} setDisabled={setDisabled} newInvestment={selectedInvetsmentLocal} setNewInvestment={setSelecetdInvestmentLocal} />
                                        : pageName === 'lpExits' ? <LPExitsEditContentCmponent disabled={disabled} setDisabled={setDisabled} newDistribution={selectedExitLocal} setNewDistribution={setSelectedExitLocal} />
                                            : pageName === 'fundCommitments' ? <FundCommitmentEditContentComponent disabled={disabled} setDisabled={setDisabled} newCommitment={selectedCommitmentLocal} setNewCommitment={setSelectedCommitmentLocal} />
                                                : pageName === 'fundLPs' ? <FundLPsEditContentComponent disabled={disabled} setDisabled={setDisabled} newCommitment={selectedCommitmentLocal} setNewCommitment={setSelectedCommitmentLocal} />
                                                    : pageName === 'fundPCOs' ? <FundPCOsEditContentComponent disabled={disabled} setDisabled={setDisabled} newInvestment={selectedInvetsmentLocal} setNewInvestment={setSelecetdInvestmentLocal} />
                                                        : null}
            </DialogContent>
            <DialogActions sx={{ backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A' }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                    startIcon={<EditRoundedIcon />}
                    disabled={disabled}
                    onClick={handleEditBtnClick}
                >
                    Edit
                </Button>

            </DialogActions>
        </Dialog>
    );
};
