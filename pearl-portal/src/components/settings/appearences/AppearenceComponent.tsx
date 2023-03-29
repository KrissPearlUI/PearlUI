import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, IconButton, Typography } from '@mui/material';
import { darken, useTheme } from "@mui/material/styles";
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardDetailsCustomization from './DashboardDetailsCustomization';
import LPsOverviewDetailsCustomization from './LPsOverviewDetailsCustomization';
import FundsOverviewDetailsCustomization from './FundsOverviewDetailsCustomization';
import PCOsOverviewDetailsCustomization from './PCOsOverviewDetailsCustomization';

interface ExpandedPagesProps {
    [key: string]: boolean;
}

export const routes = [
    {
        key: 'Dashboard',
        title: 'Dashboard',
        description: 'Select which charts to show and which to hide',
        data: [
            { key: 'Allocation per LP', description: 'Allocation per LP Chart', isSelected: true },
            { key: 'Commitments per Fund', description: 'Commitments per Fund Chart', isSelected: true },
            { key: 'Forecast Revenue & EBITDA Growth', description: 'Forecast Revenue & EBITDA Growth Chart', isSelected: true }
        ]
    },
    {
        key: 'LPs',
        title: 'Limited Partners Overview',
        description: 'Select columns you want to display in the LP Overview table',
        data: [
            { key: 'Short', description: 'Short Column', isSelected: true },
            { key: 'Name', description: 'Name Column', isSelected: true },
            { key: 'Headquarters', description: 'Headquarters Column', isSelected: true },
            { key: 'TotalCommitments', description: 'Total Commitments Column', isSelected: true },
            { key: 'Funds', description: 'Funds Column', isSelected: true },
            { key: 'ActivePCOs', description: 'Active PCOs Column', isSelected: true },
            { key: 'Type', description: 'Type Column', isSelected: true },
            { key: 'CapitalInvested', description: 'Capital Invested Column', isSelected: true },
            { key: 'Reserved', description: 'Reserved Column', isSelected: true },
            { key: 'CapitalDistributed', description: 'Capital Distributed Column', isSelected: true },
            { key: 'TappedOut', description: 'Tapped Out Column', isSelected: true }
        ]
    },
    {
        key: 'Funds',
        title: 'Funds Overview',
        description: 'Select columns you want to display in the Funds Overview table',
        data: [
            { key: 'Id', description: 'Id Column', isSelected: true },
            { key: 'Short', description: 'Short Column', isSelected: true },
            { key: 'Name', description: 'Name Column', isSelected: true },
            { key: 'Currency', description: 'Currency Column', isSelected: true },
            { key: 'Vintage', description: 'Vintage Column', isSelected: true },
            { key: 'TotalCommitments', description: 'Total Commitments Column', isSelected: true },
            { key: 'LPs', description: 'LPs Column', isSelected: true },
            { key: 'ActivePCOs', description: 'Active PCOs Column', isSelected: true },
            { key: 'Domicile', description: 'Domicile Column', isSelected: true }
        ]
    },
    {
        key: 'PCOs',
        title: 'Portfolio Companies Overview',
        description: 'Select columns you want to display in the PCO Overview table',
        data: [
            { key: 'Short', description: 'Short Column', isSelected: true },
            { key: 'Name', description: 'Name Column', isSelected: true },
            { key: 'Headquarters', description: 'Headquarters Column', isSelected: true },
            { key: 'LocalCurrency', description: 'Local Currency Column', isSelected: true },
            { key: 'TotalInvestments', description: 'Total Investments Column', isSelected: true },
            { key: 'Funds', description: 'Funds Column', isSelected: true },
            { key: 'LPs', description: 'Active PCOs Column', isSelected: true },
            { key: 'Status', description: 'Type Column', isSelected: true },
        ]
    }
];

const Appearence = () => {
    const theme = useTheme();
    const [pageExpandedState, setPageExpandedState] = useState<ExpandedPagesProps>({});
    const [routesExpanded, setRoutesExpanded] = useState<any>();

    const handleAccordionExpandedChange = (expanded: boolean, accountId: string) => {
        const currentAccountsExpandedState = { ...pageExpandedState };
        currentAccountsExpandedState[`${accountId}`] = expanded;
        setPageExpandedState(currentAccountsExpandedState);
    };

    useEffect(() => {
        if (routes) {

            let obj: ExpandedPagesProps = {};

            routes.forEach(page => {
                obj = { ...obj, [`${page.key}`]: false };
            });

            setPageExpandedState(obj);
            setRoutesExpanded(obj)
        }
    }, [routes]);

    return (
        <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={1} sx={{ marginRight: '1em' }}>
            <Grid item sx={{ marginLeft: '1em' }}>
                <Grid container>
                    <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Change Theme</Typography>
                </Grid>
                <Grid container>
                    <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>Select your interface theme</Typography>
                </Grid>
            </Grid>
            <Grid item sx={{ width: '100%' }}>
                <Divider sx={{ marginTop: '1em', width: '100%' }} />
            </Grid>
            <Grid item sx={{ marginLeft: '1em', marginTop: '1em', width: '97.5%' }}>
                {routes && routes.map((page) =>
                    <>
                        <Accordion
                            key={`card-${page.key}`}
                            expanded={pageExpandedState[`${page.key}`]}
                            onChange={(event, expanded: boolean) => handleAccordionExpandedChange(expanded, page.key)}
                            sx={{ marginBottom: '0.5em', backgroundColor: theme.palette.background.paper }}
                        /* sx={{
                            'marginBottom': '0.5em',
                            'width': '100%',
                            'flexDirection': 'column',
                            'borderRadius': 5,
                            'backgroundColor': theme.palette.background.paper,
                            
                        }} */
                        >
                            <AccordionSummary
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
                                        <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>{`Change ${page.title}`}</Typography>
                                    </Grid>
                                    <Grid container>
                                        <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>{page.description}</Typography>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            {(page && pageExpandedState[`${page.key}`]) && <AccordionDetails
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                                }}>
                                {page.key === 'Dashboard' ? <DashboardDetailsCustomization />
                                    : page.key === 'LPs' ? <LPsOverviewDetailsCustomization />
                                        : page.key === 'Funds' ? <FundsOverviewDetailsCustomization />
                                            : <PCOsOverviewDetailsCustomization />
                                }
                            </AccordionDetails>}
                        </Accordion>
                    </>
                )}
            </Grid>
        </Grid>
    );
};

export default Appearence;