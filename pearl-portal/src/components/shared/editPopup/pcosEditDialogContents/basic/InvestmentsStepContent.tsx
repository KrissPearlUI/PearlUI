import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, AutocompleteRenderInputParams, Box, Divider, Fab, Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList } from '../../../../../models/shared/sharedModels';
import { LP, NewLP } from '../../../../../models/lps/lpModels';
import { darken, useTheme } from "@mui/material/styles";
import { DatePicker } from '@mui/x-date-pickers';
import { minHeight } from '@mui/system';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { PCOSummary } from '../../../../../models/pcos/pcoModels';
import PCOInvestmentsStepContentTableComponent from './PCOInvestmentsStepContentTable';
import PCOLPsStepContentTable from './PCOLPSStepContentTaple';
import PCOFundsStepContentTable from './PCOFundsStepContentTable';
import { AddChildDialogComponent } from '../../../addPopup/AddChildDialog';
import { EditChildDialogComponent } from '../../EditChildDialog';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/slices/rootSlice';

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
            width: '435px',
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
            width: '435px',
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

interface InvestmentsStepContentProps {
    selectedPCO: PCOSummary | null,
    setSelectedPCO: React.Dispatch<React.SetStateAction<PCOSummary | null>>,
    disabled: boolean,
    setDisabled: any
}

const InvestmentsStepContentComponent = ({ selectedPCO, setSelectedPCO, disabled, setDisabled }: InvestmentsStepContentProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const { editChildDialogOpen } = useSelector((state: RootState) => state.app);
    const [investmentsExpanded, setInvestmentsExpanded] = useState<boolean>(false);
    const [fundsExpanded, setFundsExpanded] = useState<boolean>(false);
    const [lpsExpanded, setLPsExpanded] = useState<boolean>(false);
    const [addChildDialogOpen, setAddChildDialogOpen] = useState<boolean>(false);
    const [pageName, setPageName] = useState<string>('');
    const [editPageName, setEditPageName] = useState<string>('');
    const [selectedInvetsment, setSelectedInvestment] = useState<any>(null);
    const [selectedPCOLP, setSelectedPCOLP] = useState<any>(null);
    const [selectedPCOFund, setSelectedPCOFund] = useState<any>(null);

    const handleAccordionExp = (expanded: boolean, cardName: string) => {
        if (cardName === 'investments') {
            setInvestmentsExpanded(!investmentsExpanded);
        } else if (cardName === 'funds') {
            setFundsExpanded(!fundsExpanded);
        } else {
            setLPsExpanded(!lpsExpanded);
        }
    };

    const handleOpenChildDialog = (accordion: string) => {
        setPageName(accordion);
        setAddChildDialogOpen(!addChildDialogOpen);
    }

    return (
        <Grid container spacing={2} sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'start', marginTop: '0.2em' }}>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between', flex: 1, width: '100%', flexDirection: 'row', minWidth: '400px' }}>
                <Grid item xs={10}>
                    <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '390px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                        <Accordion
                            key={`card-investments`}
                            expanded={investmentsExpanded}
                            onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'investments')}
                            sx={{ marginBottom: '0.5em', backgroundColor: theme.palette.background.paper, width: '390px', borderLeft: `1px solid rgba(133, 133, 133,0.5)`, borderRight: `1px solid rgba(133, 133, 133,0.5)`, borderTop: `1px solid rgba(133, 133, 133,0.5)`, borderBottom: 'none' }}
                        >
                            <AccordionSummary
                                sx={{ height: '40px' }}
                                /* sx={{
                                    'cursor': 'pointer',
                                    'width': '100%',
                                    'minHeight': '68px !important',
                                    'paddingTop': 0,
                                    'backgroundColor': theme.palette.background.paper,
                                   
                                }} */
                                expandIcon={
                                    <IconButton>
                                        <ExpandMoreIcon
                                            sx={{ pointerEvents: 'auto', cursor: 'pointer' }} />
                                    </IconButton>
                                }
                            >
                                <Grid container
                                    sx={{ display: 'flex', flex: 1, height: '100%', width: '100%', alignItems: 'center' }}>
                                    <Grid container>
                                        <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Investments</Typography>
                                    </Grid>
                                    <Grid container>
                                        <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>{`${selectedPCO?.numOfLPS} Investments`}</Typography>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                                }}>
                                {investmentsExpanded && <PCOInvestmentsStepContentTableComponent setEditPageName={setEditPageName} />}
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'end', flex: 1, marginLeft: '2em', alignItems: 'start', marginTop: '0.6em' }}>
                    <Tooltip title={"Add a new investment"}>
                        <Box
                            sx={{
                                width: '30px',
                                height: '30px',
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
                                transition: 'box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    cursor: 'pointer',
                                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.6)',
                                    backgroundColor: darken(theme.palette.primary.main, 0.2)
                                }
                            }}
                            onClick={() => { handleOpenChildDialog('investments') }}
                        >
                            <AddRoundedIcon fontSize='small' sx={{ height: 20, width: 20 }} />
                        </Box>
                        {/* <span>
                        <Fab
                            color={'primary'}
                            size="small"
                            sx={{ boxShadow: 'none', height:10,width:30 }}
                            aria-label="AddBtn"
                            onFocus={(e: any) => (e.target.blur())}
                            className={classes.fabIcon}>
                            <AddRoundedIcon  fontSize='small' sx={{height:10,width:10}}/>
                        </Fab>
                    </span> */}
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between', flex: 1, width: '100%', flexDirection: 'row', minWidth: '400px' }}>
                <Grid item xs={10}>
                    <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '390px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                        <Accordion
                            key={`card-lps`}
                            expanded={lpsExpanded}
                            onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'lps')}
                            sx={{ marginBottom: '0.5em', backgroundColor: theme.palette.background.paper, width: '390px', borderLeft: `1px solid rgba(133, 133, 133,0.5)`, borderRight: `1px solid rgba(133, 133, 133,0.5)`, borderTop: `1px solid rgba(133, 133, 133,0.5)`, borderBottom: 'none' }}
                        >
                            <AccordionSummary
                                sx={{ height: '40px' }}
                                /* sx={{
                                    'cursor': 'pointer',
                                    'width': '100%',
                                    'minHeight': '68px !important',
                                    'paddingTop': 0,
                                    'backgroundColor': theme.palette.background.paper,
                                   
                                }} */
                                expandIcon={
                                    <IconButton>
                                        <ExpandMoreIcon
                                            sx={{ pointerEvents: 'auto', cursor: 'pointer' }} />
                                    </IconButton>
                                }
                            >
                                <Grid container
                                    sx={{ display: 'flex', flex: 1, height: '100%', width: '100%', alignItems: 'center' }}>
                                    <Grid container>
                                        <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>LPs</Typography>
                                    </Grid>
                                    <Grid container>
                                        <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>{`${selectedPCO?.numOfLPS} LPs`}</Typography>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                                }}>
                                {lpsExpanded && <PCOLPsStepContentTable setEditPageName={setEditPageName}/>}
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'end', flex: 1, marginLeft: '2em', alignItems: 'start', marginTop: '0.6em' }}>
                    <Tooltip title={"Add a new investment from LP"}>
                        <Box
                            sx={{
                                width: '30px',
                                height: '30px',
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
                                transition: 'box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    cursor: 'pointer',
                                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.6)',
                                    backgroundColor: darken(theme.palette.primary.main, 0.2)
                                }
                            }}
                            onClick={() => { handleOpenChildDialog('pcoLPs') }}
                        >
                            <AddRoundedIcon fontSize='small' sx={{ height: 20, width: 20 }} />
                        </Box>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between', flex: 1, width: '100%', flexDirection: 'row', minWidth: '400px' }}>
                <Grid item xs={10}>
                    <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '390px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                        <Accordion
                            key={`card-funds`}
                            expanded={fundsExpanded}
                            onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'funds')}
                            sx={{ marginBottom: '0.5em', backgroundColor: theme.palette.background.paper, width: '390px', borderLeft: `1px solid rgba(133, 133, 133,0.5)`, borderRight: `1px solid rgba(133, 133, 133,0.5)`, borderTop: `1px solid rgba(133, 133, 133,0.5)`, borderBottom: 'none' }}
                        >
                            <AccordionSummary
                                sx={{ height: '40px' }}
                                /* sx={{
                                    'cursor': 'pointer',
                                    'width': '100%',
                                    'minHeight': '68px !important',
                                    'paddingTop': 0,
                                    'backgroundColor': theme.palette.background.paper,
                                   
                                }} */
                                expandIcon={
                                    <IconButton>
                                        <ExpandMoreIcon
                                            sx={{ pointerEvents: 'auto', cursor: 'pointer' }} />
                                    </IconButton>
                                }
                            >
                                <Grid container
                                    sx={{ display: 'flex', flex: 1, height: '100%', width: '100%', alignItems: 'center' }}>
                                    <Grid container>
                                        <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Funds</Typography>
                                    </Grid>
                                    <Grid container>
                                        <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>{`${selectedPCO?.numOfFunds} Funds`}</Typography>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                                }}>
                                {fundsExpanded && <PCOFundsStepContentTable setEditPageName={setEditPageName} />}
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'end', flex: 1, marginLeft: '2em', alignItems: 'start', marginTop: '0.6em' }}>
                    <Tooltip title={"Add a new investment from Fund"}>
                        <Box
                            sx={{
                                width: '30px',
                                height: '30px',
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
                                transition: 'box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    cursor: 'pointer',
                                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.6)',
                                    backgroundColor: darken(theme.palette.primary.main, 0.2)
                                }
                            }}
                            onClick={() => { handleOpenChildDialog('pcoFunds') }}
                        >
                            <AddRoundedIcon fontSize='small' sx={{ height: 20, width: 20 }} />
                        </Box>
                    </Tooltip>
                </Grid>
            </Grid>
            {addChildDialogOpen && <AddChildDialogComponent open={addChildDialogOpen} pageName={pageName} pageTitle={pageName === 'investments' ? 'Add New Investment' : pageName === 'pcoLPs' ? 'Add New Investment From LP' : 'Add New Investment From Fund'} setDialogOpen={setAddChildDialogOpen} />}
            {editChildDialogOpen && <EditChildDialogComponent open={editChildDialogOpen} pageName={editPageName} pageTitle={editPageName === 'investments' ? 'Edit Investment' : editPageName === 'pcoLPs' ? 'Edit Investment From LP' : editPageName === 'pcoFunds' ? 'Edit Investment From Fund' : ''}  />}
        </Grid>
    );
};

export default InvestmentsStepContentComponent;