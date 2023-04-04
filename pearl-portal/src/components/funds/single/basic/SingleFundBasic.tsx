import { Accordion, AccordionDetails, AccordionSummary, Grid, IconButton, Paper, Typography } from '@mui/material';
import { darken, lighten, useTheme } from "@mui/material/styles";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/slices/rootSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FundLpsTable from './FundLpsTable';
import FundPCOsTable from './FundPCOsTable';
import FundCommitmentsTable from './FundCommitmentsTable';
import moment from 'moment';
import FundExitsTable from './FundExitsTable';
import { amountValueFormatter } from '../../../../helpers/app';

const SingleFundBasic = () => {
    const theme = useTheme();
    const { selectedFund } = useSelector((state: RootState) => state.funds);
    const [isCommitmentsExpand, setIsCommitmentsExpand] = useState<boolean>(false);
    const [isFundsExpand, setIsFundsExpand] = useState<boolean>(false);
    const [isPCOsExpand, setIsPCOsExpand] = useState<boolean>(false);
    const [isExitsExpand, setIsExitsExpand] = useState<boolean>(false);

    const handleAccordionExp = (expanded: boolean, accordionId: string) => {
        if (accordionId === 'card-commitments') {
            setIsCommitmentsExpand(!isCommitmentsExpand);
        } else if (accordionId === 'card-lps') {
            setIsFundsExpand(!isFundsExpand);
        } else if (accordionId === 'card-pcos') {
            setIsPCOsExpand(!isPCOsExpand);
        } else {
            setIsExitsExpand(!isExitsExpand);
        }
    };

    const calculateForInvestments = (totalCommitments: number, managementFee: number, setUpFee: number, other: number, fundCurrency: string) => {
        const investments: number = totalCommitments - (managementFee + setUpFee + other)

        return investments <= 0 ? '' : `${amountValueFormatter(investments, '')} ${fundCurrency}`;
    };

    const calculateUnrealized = (totalInvestments: number, totalRealized: number, fundCurrency: string) => {
        const unrealized: number = Math.abs(totalInvestments - totalRealized);

        return unrealized <= 0 ? '' : `${amountValueFormatter(unrealized, '')} ${fundCurrency}`;
    };

    const calculateDistributed = (recycleReserves: number, nonRecycleReserves: number, fundCurrency: string) => {
        const distributed: number = recycleReserves + nonRecycleReserves;

        return distributed <= 0 ? '' : `${amountValueFormatter(distributed, '')} ${fundCurrency}`;
    };

    const calculateCarriedInterest = (escrow: number, realised: number, fundCurrency: string) => {
        const carriedInterest: number = escrow + realised;

        return carriedInterest <= 0 ? '' : `${amountValueFormatter(carriedInterest, '')} ${fundCurrency}`;
    };

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row', paddingRight: '0.5em', overflow: 'auto', paddingBottom: '1em' }}>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ backgroundColor: theme.palette.background.paper, padding: '1em' }}>
                    <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row' }}>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Domicile:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.country}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Address:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.address}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Investment Comittee:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.investmentComitee}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>First Closing Date:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.vintage ? moment(new Date(selectedFund?.vintage)).format('DD MMM YYYY') : ''}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Final Closing Date:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.finalClosingDate ? moment(new Date(selectedFund?.finalClosingDate)).format('DD MMM YYYY') : ''}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Currency:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.currency}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Type:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.type}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>AIFM:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.aifm ?? 'N/A'}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>AIFM Contact:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.aifmContact ?? 'N/A'}</Typography>
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
                                                    {selectedFund?.numOfLPs ?? 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    {isCommitmentsExpand && selectedFund?.lps && <AccordionDetails
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto', minWidth: { xs: '430px', md: '600px', lg: '600px' }, overflow: 'auto'
                                        }}>
                                        <FundCommitmentsTable />
                                    </AccordionDetails>}
                                </Accordion>
                            </Grid>
                            <Grid item sx={{ display: 'flex', flex: 1 }}>
                                <Accordion
                                    elevation={0}
                                    key={`card-lps`}
                                    expanded={isFundsExpand}
                                    onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-lps')}
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
                                                <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 400 }}>Number of LPs:</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                                    {selectedFund?.numOfLPs ?? 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    {isFundsExpand && selectedFund?.lps && <AccordionDetails
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            display: 'flex', height: '100%', pointerEvents: 'auto', flex: 1, marginLeft: '-1em', width: '100%',minWidth: { xs: '430px', md: '600px', lg: '600px' }, overflow: 'auto'
                                        }}>
                                        <FundLpsTable />
                                    </AccordionDetails>}
                                </Accordion>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Of which terminated:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.terminated ? selectedFund.terminated.length : 0}</Typography>
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
                                                    {selectedFund?.numOFPCOs ?? 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    {isPCOsExpand && selectedFund?.pcos && <AccordionDetails
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto',marginLeft: { xs: 0, md: '-2em', lg: '-2em' }, minWidth: { xs: '430px', md: '450px', lg: '450px' }, overflow: 'auto'
                                        }}>
                                        <FundPCOsTable />
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
                                                    {selectedFund?.exits?.length ?? 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    {isExitsExpand && selectedFund?.exits && <AccordionDetails
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto', marginLeft: { xs: 0, md: '-2em', lg: '-2em' }, minWidth: { xs: '430px', md: '450px', lg: '450px' }, overflow: 'auto'
                                        }}>
                                        <FundExitsTable />
                                    </AccordionDetails>}
                                </Accordion>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ backgroundColor: theme.palette.background.paper, padding: '1em' }}>
                    <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row' }}>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Currency:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500, textAlign: 'right', alignSelf: 'end' }}>
                                    {selectedFund?.currency ?? ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Committed Capital:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500, textAlign: 'right' }}>{amountValueFormatter(selectedFund?.sumCommittedAmountFundCcy ?? 0, '')}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Base Capital:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500, textAlign: 'right' }}>{amountValueFormatter(selectedFund?.sumBaseAmountFundCccy ?? 0, '')}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Currency:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedFund?.currency ?? ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Of which terminated:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.terminatedCommitedCapital}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Of which terminated:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{selectedFund?.terminatedBaseCapital}</Typography>
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
                                    {selectedFund?.kpis && selectedFund.kpis.netDPI ? selectedFund.kpis.netDPI : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Gross DPI:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedFund?.kpis && selectedFund.kpis.grossDPI ? selectedFund.kpis.grossDPI : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Net TVPI:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedFund?.kpis && selectedFund.kpis.netTVPI ? selectedFund.kpis.netTVPI : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Gross TVPI:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedFund?.kpis && selectedFund.kpis.grossTVPI ? selectedFund.kpis.grossTVPI : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Net IRR:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedFund?.kpis && selectedFund.kpis.netIRR ? `${(selectedFund.kpis.netIRR * 100).toFixed(2)} %` : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400 }}>Gross IRR:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                    {selectedFund?.kpis && selectedFund.kpis.grossIRR ? selectedFund.kpis.grossIRR : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', paddingLeft: '0.2em', paddingTop: '0.8em' }}>
                    <Grid item xs={12} md={3} lg={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={3} sx={{ backgroundColor: theme.palette.mode === 'light' ? 'rgba(37, 96, 126, 0.2)' : 'rgb(128, 192, 128,0.2)', padding: '0.5em', minHeight: '125px' }}>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 600, fontSize: 16 }}>Capital Called:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right', alignSelf: 'end' }}>
                                    {selectedFund?.totalCommitmentsFundCcy ? `${amountValueFormatter(selectedFund?.totalCommitmentsFundCcy ?? 0, '')} ${selectedFund?.currency}` : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400, fontSize: 14 }}>For investments:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right' }}>{calculateForInvestments(selectedFund?.totalCommitmentsFundCcy ?? 0, selectedFund?.sumManagementFeeFundCcy ?? 0, selectedFund?.sumSetUpFeeFundCcy ?? 0, selectedFund?.sumOperationalExpensesFundCcy ?? 0, selectedFund?.currency ?? '')}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400, fontSize: 14 }}>For fees:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right' }}>{selectedFund?.sumManagementFeeFundCcy ? `${amountValueFormatter(((selectedFund?.sumManagementFeeFundCcy ?? 0) + (selectedFund?.sumSetUpFeeFundCcy ?? 0)), '')} ${selectedFund?.currency}` : ''}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400, fontSize: 14 }}>For other:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right', alignSelf: 'end' }}>
                                    {selectedFund?.sumOperationalExpensesFundCcy ? `${amountValueFormatter(selectedFund?.sumOperationalExpensesFundCcy ?? 0, '')} ${selectedFund?.currency}` : ''}
                                </Typography>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={3} sx={{ backgroundColor: theme.palette.mode === 'light' ? 'rgba(37, 96, 126, 0.2)' : 'rgb(128, 192, 128,0.2)', padding: '0.5em', minHeight: '125px' }}>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 600, fontSize: 16 }}>Capital Invested:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right', alignSelf: 'end' }}>
                                    {selectedFund?.sumAmountInvestedFundCCy ? `${amountValueFormatter(selectedFund?.sumAmountInvestedFundCCy ?? 0, '')} ${selectedFund?.currency}` : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400, fontSize: 14 }}>Of which realized:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right' }}>
                                    {selectedFund?.sumAmountRealizedFundCCy ? `${amountValueFormatter(selectedFund?.sumAmountRealizedFundCCy ?? 0, '')} ${selectedFund?.currency}` : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400, fontSize: 14 }}>Of which unrealized:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right' }}>
                                    {calculateUnrealized(selectedFund?.sumAmountInvestedFundCCy ?? 0, selectedFund?.sumAmountRealizedFundCCy ?? 0, selectedFund?.currency ?? '')}
                                </Typography>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={3} sx={{ backgroundColor: theme.palette.mode === 'light' ? 'rgba(37, 96, 126, 0.2)' : 'rgb(128, 192, 128,0.2)', padding: '0.5em', minHeight: '125px' }}>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 600, fontSize: 16 }}>Capital Distributed:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right', alignSelf: 'end' }}>
                                    {calculateDistributed(selectedFund?.sumRecycleFundCccy ?? 0, selectedFund?.sumNonRecycleFundCccy ?? 0, selectedFund?.currency ?? '')}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400, fontSize: 14 }}>Of which recycling:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right' }}>
                                    {selectedFund?.sumRecycleFundCccy ? `${amountValueFormatter(selectedFund?.sumRecycleFundCccy ?? 0, '')} ${selectedFund?.currency}` : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400, fontSize: 14 }}>Of which non-recycle:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right' }}>
                                    {selectedFund?.sumNonRecycleFundCccy ? `${amountValueFormatter(selectedFund?.sumNonRecycleFundCccy ?? 0, '')} ${selectedFund?.currency}` : ''}
                                </Typography>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={3} sx={{ backgroundColor: theme.palette.mode === 'light' ? 'rgba(37, 96, 126, 0.2)' : 'rgb(128, 192, 128,0.2)', padding: '0.5em', minHeight: '125px' }}>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 600, fontSize: 16 }}>Carried Interest:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right', alignSelf: 'end' }}>
                                    {calculateCarriedInterest(selectedFund?.sumEscrowFundCccy ?? 0, selectedFund?.sumReleasedDistributionsFundCccy ?? 0, selectedFund?.currency ?? '')}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400, fontSize: 14 }}>Of which in escrow:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right' }}>
                                    {selectedFund?.sumEscrowFundCccy ? `${amountValueFormatter(selectedFund?.sumEscrowFundCccy ?? 0, '')} ${selectedFund?.currency}` : ''}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3em' }}>
                                <Typography sx={{ color: theme.palette.secondary.main, marginRight: '0.5em', fontWeight: 400, fontSize: 14, }}>Of which released:</Typography>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: 14, textAlign: 'right' }}>
                                    {selectedFund?.sumReleasedDistributionsFundCccy ? `${amountValueFormatter(selectedFund?.sumReleasedDistributionsFundCccy ?? 0, '')} ${selectedFund?.currency}` : ''}
                                </Typography>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SingleFundBasic;