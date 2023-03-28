import {Accordion, AccordionDetails, AccordionSummary, Grid,IconButton,Paper,Typography} from '@mui/material';
import {darken, lighten, useTheme} from "@mui/material/styles";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/slices/rootSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import { amountValueFormatter } from '../../../../helpers/app';
import PCOInvestmentsTableComponent from './PCOInvestmentsTable';
import PCOLPsTable from './PCOLPsTable';
import PCOFundsTable from './PCOFundsTable';
import { fetchTransactions } from '../../../../redux/thunks/transactionsThunk';
import { useAppDispatch } from '../../../../redux/store';


const SinglePCOBasic = () => {
    const theme=useTheme();
    const dispatch = useAppDispatch();
    const {selectedPCO} = useSelector((state: RootState) => state.pcos);
    const [isCommitmentsExpand, setIsCommitmentsExpand]=useState<boolean>(false);
    const [isFundsExpand, setIsFundsExpand]=useState<boolean>(false); 
    const [isPCOsExpand, setIsPCOsExpand]=useState<boolean>(false);
    const [isExitsExpand, setIsExitsExpand]=useState<boolean>(false);
    const [items, setItems] = useState<any[]>([]);

    const handleAccordionExp=(expanded: boolean, accordionId: string)=> {
        if(accordionId==='card-investments'){
            setIsCommitmentsExpand(!isCommitmentsExpand);
        } else if(accordionId==='card-lps'){
            setIsFundsExpand(!isFundsExpand);
        } else if(accordionId==='card-funds'){
            setIsPCOsExpand(!isPCOsExpand);
        } else{
            setIsExitsExpand(!isExitsExpand);
        }
    };

    const dateDifference=( date1:string, date2:string ) =>{
        const date1Date = new Date(date1);
        const date2Date = new Date(date2);
        const diffInMs = Math.abs(date2Date.getTime() - date1Date.getTime());
        const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(diffInMonths / 12);
        const months = diffInMonths % 12;
        const returnString= years && months? `${years} years and ${months} months` : years&&!months?`${years} years` : !years && months?`${months} months`:'';

        return returnString;
    }

    
    useEffect(() => {
        dispatch(fetchTransactions());
      }, [dispatch]);

    return (
        <Grid container spacing={2} sx={{display:'flex',flex:1, justifyContent:'flex-start', alignItems:'flex-start', flexDirection:'row',paddingRight:'0.5em', overflow:'auto'}}>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper, padding:'1em'}}>
                    <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Domicile:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Address:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedPCO?.address}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Website:</Typography>
                            <a style={{fontFamily:'Raleway'}}
                                href={`https://${selectedPCO?.website}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {selectedPCO?.website}
                            </a>
                           {/*  <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedPCO?.website}</Typography> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Date Invested:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.dateInitalInvestment ? moment(new Date(selectedPCO?.dateInitalInvestment)).format('DD MMM YYYY'):''}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Sector:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.emeraldIndustry2??''}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Stage:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.currentStage??''}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Board Seat:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.boardSeat}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Current Deal Team:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.currentDealteam ??''}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Status:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.status ??''}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} sx={{flex:1}}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper, padding:'1em'}}>
                <Grid container spacing={1} sx={{display:'flex', justifyContent:'flex-start', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column',flex:1}}>
                            <Grid item sx={{display:'flex'}}>
                            <Accordion
                            elevation={0}
                                key={`card-investments`}
                                expanded={isCommitmentsExpand}
                                onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-investments')}
                                sx={{backgroundColor:'transparent'}}
                                /* sx={{
                                    'marginBottom': '0.5em',
                                    'width': '100%',
                                    'flexDirection': 'column',
                                    'borderRadius': 5,
                                    'backgroundColor': theme.palette.background.paper,
                                    
                                }} */
                            >
                                <AccordionSummary
                                sx={{display: 'flex', 
                                alignItems: 'center', 
                                justifyContent:'flex-start', 
                                width:'340px', 
                                borderBottom:`1px solid ${theme.palette.mode==='dark'?darken(theme.palette.text.primary,0.6) : lighten(theme.palette.text.primary,0.7)}`,
                                '&:hover':{
                                    borderBottom:`1px solid ${theme.palette.text.primary}` ,
                                },
                                '& .Mui-expanded': {
                                    borderBottom: 'none',
                                }}} 
                                    /* sx={{
                                        'cursor': 'pointer',
                                        'width': '100%',
                                        'minHeight': '68px !important',
                                        'paddingTop': 0,
                                        'backgroundColor': theme.palette.background.paper,
                                    
                                    }} */
                                    expandIcon={
                                            <IconButton >
                                                <ExpandMoreIcon
                                                    sx={{pointerEvents: 'auto', cursor: 'pointer',
                                                    '&:hover':{
                                                        color:theme.palette.text.primary,
                                                    }}}/>
                                            </IconButton>
                                    }
                                >
                                    <Grid container spacing={2}
                                    >
                                        <Grid item sx={{marginLeft:'-1em'}}>
                                            <Typography sx={{color:theme.palette.secondary.main, fontWeight:400}}>Number of Investments:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>
                                                {selectedPCO?.numOfLPS ??0}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                {isCommitmentsExpand&& selectedPCO?.lps && <AccordionDetails
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                                    }}>
                                    <PCOInvestmentsTableComponent/>
                                </AccordionDetails>}
                            </Accordion>
                            </Grid>
                            <Grid item sx={{display:'flex',flex:1}}>
                            <Accordion
                            elevation={0}
                                key={`card-lps`}
                                expanded={isFundsExpand}
                                onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-lps')}
                                sx={{backgroundColor:'transparent'}}
                                /* sx={{
                                    'marginBottom': '0.5em',
                                    'width': '100%',
                                    'flexDirection': 'column',
                                    'borderRadius': 5,
                                    'backgroundColor': theme.palette.background.paper,
                                    
                                }} */
                            >
                                <AccordionSummary
                                sx={{display: 'flex', 
                                alignItems: 'center', 
                                justifyContent:'flex-start', 
                                width:'340px', 
                                borderBottom:`1px solid ${theme.palette.mode==='dark'?darken(theme.palette.text.primary,0.6) : lighten(theme.palette.text.primary,0.7)}`,
                                '&:hover':{
                                    borderBottom:`1px solid ${theme.palette.text.primary}` ,
                                },
                            '& .Mui-expanded': {
                                    borderBottom: 'none',
                                }}}
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
                                                    sx={{pointerEvents: 'auto', cursor: 'pointer',
                                                    '&:hover':{
                                                        color:theme.palette.text.primary,
                                                    }}}/>
                                            </IconButton>
                                    }
                                >
                                    <Grid container spacing={2}
                                    >
                                        <Grid item sx={{marginLeft:'-1em'}}>
                                            <Typography sx={{color:theme.palette.secondary.main, fontWeight:400}}>Number of LPs:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>
                                                {selectedPCO?.numOfLPS ??0}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                {isFundsExpand&& selectedPCO?.lps && <AccordionDetails
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        display: 'flex', height: '100%', pointerEvents: 'auto',flex:1,marginLeft:'-1em', width:'380px'
                                    }}>
                                <PCOLPsTable/>
                                </AccordionDetails>}
                            </Accordion>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                        <Accordion
                            elevation={0}
                                key={`card-funds`}
                                expanded={isPCOsExpand}
                                onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-funds')}
                                sx={{backgroundColor:'transparent'}}
                            
                            >
                                <AccordionSummary
                                sx={{display: 'flex', 
                                alignItems: 'center', 
                                justifyContent:'flex-start', 
                                width:'340px', 
                                borderBottom:`1px solid ${theme.palette.mode==='dark'?darken(theme.palette.text.primary,0.6) : lighten(theme.palette.text.primary,0.7)}`,
                                '&:hover':{
                                    borderBottom:`1px solid ${theme.palette.text.primary}` ,
                                },
                            '& .Mui-expanded': {
                                    borderBottom: 'none',
                                }}}
                                    
                                    expandIcon={
                                            <IconButton>
                                                <ExpandMoreIcon
                                                    sx={{pointerEvents: 'auto', cursor: 'pointer',
                                                    '&:hover':{
                                                        color:theme.palette.text.primary,
                                                    }}}/>
                                            </IconButton>
                                    }
                                >
                                    <Grid container spacing={2}
                                    >
                                        <Grid item sx={{marginLeft:'-1em'}}>
                                            <Typography sx={{color:theme.palette.secondary.main, fontWeight:400}}>Number of Funds:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>
                                                {selectedPCO?.numOfFunds ?? 0}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                {isPCOsExpand&& selectedPCO?.funds && <AccordionDetails
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                                    }}>
                                <PCOFundsTable/>
                                </AccordionDetails>}
                            </Accordion>
                            </Grid>
                            <Grid item sx={{display:'flex', alignItems:'end', marginTop:'1em'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Date of Exit:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.dateExit ? moment(new Date(selectedPCO?.dateExit)).format('DD MMM YYYY'):''}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper, padding:'1em'}}>
                    <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex',justifyContent:'space-between',width:'290px'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Amount Invested (EUR):</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{amountValueFormatter(selectedPCO?.amountInvestedFundCcy??0,'')}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex',justifyContent:'space-between',width:'290px'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>{`Amount Original Ccy (${selectedPCO?.localCurrency}):`}</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{amountValueFormatter(selectedPCO?.amountInvestedLocalCcy??0,'')}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex',justifyContent:'space-between',width:'290px'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Gross IRR:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedPCO?.grossIRR? `${(selectedPCO?.grossIRR* 100).toFixed(2)} %`:''}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Current Round:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.currentRound ??''}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Date of Last Round:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.lastRound ? moment(new Date(selectedPCO?.lastRound)).format('DD MMM YYYY'):''}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Holding Time:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.dateInitalInvestment && selectedPCO?.dateExit===null?dateDifference(selectedPCO.dateInitalInvestment??'', (new Date()).toISOString()) :''}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex',justifyContent:'space-between',width:'350px'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Current Valuation of Comany:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.currentValuationPCO ? `${amountValueFormatter(selectedPCO?.currentValuationPCO??0,'')} ${selectedPCO?.localCurrency}` :''}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex',justifyContent:'space-between',width:'350px'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Value of Emerald Holding:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.currentValuationEmerald ? `${amountValueFormatter(selectedPCO?.currentValuationEmerald??0,'')} EUR` :''}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex',justifyContent:'space-between',width:'350px'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Realised:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedPCO?.realised ??''}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SinglePCOBasic;