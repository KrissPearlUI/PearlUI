import { Accordion, AccordionDetails, AccordionSummary, Grid, IconButton, Paper, Typography } from '@mui/material';
import { darken, lighten, useTheme } from "@mui/material/styles";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/slices/rootSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LPFundsTable from './LPFundsTable';
import LPPCOsTable from './LPPCOsTable';
import LPCommitmentsTable from './LPCommitmentsTable';
import moment from 'moment';
import LPExitsTable from './LPExitsTable';
import { amountValueFormatter } from '../../../../helpers/app';

const SingleLPBasic = () => {
    const theme = useTheme();
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const [isCommitmentsExpand, setIsCommitmentsExpand] = useState<boolean>(false);
    const [isFundsExpand, setIsFundsExpand] = useState<boolean>(false);
    const [isPCOsExpand, setIsPCOsExpand] = useState<boolean>(false);
    const [isExitsExpand, setIsExitsExpand] = useState<boolean>(false);

    const handleAccordionExp = (expanded: boolean, accordionId: string) => {
        if (accordionId === 'card-commitments') {
            setIsCommitmentsExpand(!isCommitmentsExpand);
        } else if (accordionId === 'card-funds') {
            setIsFundsExpand(!isFundsExpand);
        } else if (accordionId === 'card-pcos') {
            setIsPCOsExpand(!isPCOsExpand);
        } else {
            setIsExitsExpand(!isExitsExpand);
        }
    };

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row', paddingRight: '0.5em', overflow: 'auto' }}>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ backgroundColor: theme.palette.background.paper, padding: '1em' }}>
                    <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row' }}>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Domicile:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Address:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.address}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Website:</Typography>
                                <a style={{ fontFamily: 'Raleway' }}
                                    href={`https://${selectedLP?.website}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {selectedLP?.website}
                                </a>
                                {/* <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.website}</Typography> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>First Investment:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.firstInvestment ? moment(new Date(selectedLP?.firstInvestment)).format('DD MMM YYYY') : ''}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Type:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.type}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Main Contact:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.mainContact}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Relationship Partner:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.relationshipPartner}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Relationship SS:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.relationshipSS}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} sx={{ flex: 1 }}>
                <Paper elevation={3} sx={{ backgroundColor: theme.palette.background.paper, padding: '1em' }}>
                    <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row' }}>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Accordion
                                    elevation={0}
                                    key={`card-commitments`}
                                    expanded={isCommitmentsExpand}
                                    onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-commitments')}
                                    sx={{ backgroundColor: 'transparent' }}
                                /* sx={{
                                    'marginBottom': '0.5em',
                                    'width': '100%',
                                    'flexDirection': 'column',
                                    'borderRadius': 5,
                                    'backgroundColor': theme.palette.background.paper,
                                    
                                }} */
                                >
                                    <AccordionSummary
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            width: '340px',
                                            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? darken(theme.palette.text.primary, 0.6) : lighten(theme.palette.text.primary, 0.7)}`,
                                            '&:hover': {
                                                borderBottom: `1px solid ${theme.palette.text.primary}`,
                                            },
                                            '& .Mui-expanded': {
                                                borderBottom: 'none',
                                            }
                                        }}
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
                                                    sx={{
                                                        pointerEvents: 'auto', cursor: 'pointer',
                                                        '&:hover': {
                                                            color: theme.palette.text.primary,
                                                        }
                                                    }} />
                                            </IconButton>
                                        }
                                    >
                                        <Grid container spacing={2}
                                        >
                                            <Grid item sx={{ marginLeft: '-1em' }}>
                                                <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 400 }}>Number of Commitments:</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                                    {selectedLP?.commitments?.length ?? 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    {isCommitmentsExpand && selectedLP?.commitments && <AccordionDetails
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                                        }}>
                                        <LPCommitmentsTable />
                                    </AccordionDetails>}
                                </Accordion>
                            </Grid>
                            <Grid item sx={{ display: 'flex', flex: 1 }}>
                                <Accordion
                                    elevation={0}
                                    key={`card-funds`}
                                    expanded={isFundsExpand}
                                    onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-funds')}
                                    sx={{ backgroundColor: 'transparent' }}
                                /* sx={{
                                    'marginBottom': '0.5em',
                                    'width': '100%',
                                    'flexDirection': 'column',
                                    'borderRadius': 5,
                                    'backgroundColor': theme.palette.background.paper,
                                    
                                }} */
                                >
                                    <AccordionSummary
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            width: '340px',
                                            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? darken(theme.palette.text.primary, 0.6) : lighten(theme.palette.text.primary, 0.7)}`,
                                            '&:hover': {
                                                borderBottom: `1px solid ${theme.palette.text.primary}`,
                                            },
                                            '& .Mui-expanded': {
                                                borderBottom: 'none',
                                            }
                                        }}
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
                                                    sx={{
                                                        pointerEvents: 'auto', cursor: 'pointer',
                                                        '&:hover': {
                                                            color: theme.palette.text.primary,
                                                        }
                                                    }} />
                                            </IconButton>
                                        }
                                    >
                                        <Grid container spacing={2}
                                        >
                                            <Grid item sx={{ marginLeft: '-1em' }}>
                                                <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 400 }}>Number of Funds:</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                                    {selectedLP?.funds?.length ?? 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    {isFundsExpand && selectedLP?.funds && <AccordionDetails
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            display: 'flex', height: '100%', pointerEvents: 'auto', flex: 1, marginLeft: '-1em', width: '380px'
                                        }}>
                                        <LPFundsTable />
                                    </AccordionDetails>}
                                </Accordion>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Of which terminated:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.terminated ? selectedLP.terminated.length : 0}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Accordion
                                    elevation={0}
                                    key={`card-pcos`}
                                    expanded={isPCOsExpand}
                                    onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-pcos')}
                                    sx={{ backgroundColor: 'transparent' }}

                                >
                                    <AccordionSummary
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            width: '340px',
                                            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? darken(theme.palette.text.primary, 0.6) : lighten(theme.palette.text.primary, 0.7)}`,
                                            '&:hover': {
                                                borderBottom: `1px solid ${theme.palette.text.primary}`,
                                            },
                                            '& .Mui-expanded': {
                                                borderBottom: 'none',
                                            }
                                        }}

                                        expandIcon={
                                            <IconButton>
                                                <ExpandMoreIcon
                                                    sx={{
                                                        pointerEvents: 'auto', cursor: 'pointer',
                                                        '&:hover': {
                                                            color: theme.palette.text.primary,
                                                        }
                                                    }} />
                                            </IconButton>
                                        }
                                    >
                                        <Grid container spacing={2}
                                        >
                                            <Grid item sx={{ marginLeft: '-1em' }}>
                                                <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 400 }}>Number of PCOs:</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                                    {selectedLP?.pcos?.length ?? 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    {isPCOsExpand && selectedLP?.pcos && <AccordionDetails
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                                        }}>
                                        <LPPCOsTable />
                                    </AccordionDetails>}
                                </Accordion>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Accordion
                                    elevation={0}
                                    key={`card-exits`}
                                    expanded={isExitsExpand}
                                    onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-exits')}
                                    sx={{ backgroundColor: 'transparent' }}

                                >
                                    <AccordionSummary
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            width: '340px',
                                            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? darken(theme.palette.text.primary, 0.6) : lighten(theme.palette.text.primary, 0.7)}`,
                                            '&:hover': {
                                                borderBottom: `1px solid ${theme.palette.text.primary}`,
                                            },
                                            '& .Mui-expanded': {
                                                borderBottom: 'none',
                                            }
                                        }}

                                        expandIcon={
                                            <IconButton>
                                                <ExpandMoreIcon
                                                    sx={{
                                                        pointerEvents: 'auto', cursor: 'pointer',
                                                        '&:hover': {
                                                            color: theme.palette.text.primary,
                                                        }
                                                    }} />
                                            </IconButton>
                                        }
                                    >
                                        <Grid container spacing={2}
                                        >
                                            <Grid item sx={{ marginLeft: '-1em' }}>
                                                <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 400 }}>Number of Exits:</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                                    {selectedLP?.exits?.length ?? 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    {isExitsExpand && selectedLP?.exits && <AccordionDetails
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                                        }}>
                                        <LPExitsTable />
                                    </AccordionDetails>}
                                </Accordion>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ backgroundColor: theme.palette.background.paper, padding: '1em' }}>
                    <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row' }}>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '290px', md: '270px', lg: '270px' } }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Management Fee:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500, textAlign: 'right', alignSelf: 'end' }}>
                                    {selectedLP?.fees && selectedLP.fees.filter(x => x.feeType === 'Management Fee')[0] ? `${amountValueFormatter(selectedLP.fees.filter(x => x.feeType === 'Management Fee')[0]?.amount / 5, '')} EUR` : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '290px', md: '270px', lg: '270px' } }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Capital Paid In:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500, textAlign: 'right' }}>{selectedLP?.capPaidIn}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '290px', md: '270px', lg: '270px' } }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Capital Distributed:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500, textAlign: 'right' }}>{selectedLP?.totalDistributions ? `${amountValueFormatter(selectedLP?.totalDistributions ?? 0, '')} EUR` : ''}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '290px', md: '270px', lg: '270px' } }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Capital Invested:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500, textAlign: 'right' }}>{selectedLP?.totalInvestments ? `${amountValueFormatter(selectedLP?.totalInvestments ?? 0, '')} EUR` : ''}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '290px', md: '270px', lg: '270px' } }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Recycling Reserves:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedLP?.fees && selectedLP.fees.filter(x => x.feeType === 'Recycling Reserves')[0] ? `${amountValueFormatter(selectedLP.fees.filter(x => x.feeType === 'Recycling Reserves')[0]?.amount ?? 0, '')} EUR` : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Capital Available:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.capAvailable}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Dry Powder:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.dryPowder}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Reserved:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.reserved}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Avg. Deals Available:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.avgDealsAvailable}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Tapped Out:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.tappedOot ? 'Yes' : 'No'}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Estimated Until Tapped Out:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedLP?.dateTappedOut}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ backgroundColor: theme.palette.background.paper, padding: '1em' }}>
                    <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row' }}>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Net DPI:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedLP?.kpis && selectedLP.kpis.netDPI ? selectedLP.kpis.netDPI : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Gross DPI:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedLP?.kpis && selectedLP.kpis.grossDPI ? selectedLP.kpis.grossDPI : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Net TVPI:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedLP?.kpis && selectedLP.kpis.netTVPI ? selectedLP.kpis.netTVPI : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Gross TVPI:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedLP?.kpis && selectedLP.kpis.grossTVPI ? selectedLP.kpis.grossTVPI : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Net IRR:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedLP?.kpis && selectedLP.kpis.netIRR ? `${(selectedLP.kpis.netIRR * 100).toFixed(2)} %` : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Gross IRR:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedLP?.kpis && selectedLP.kpis.grossIRR ? selectedLP.kpis.grossIRR : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SingleLPBasic;