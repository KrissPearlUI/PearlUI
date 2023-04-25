import { Grid, Paper, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/rootSlice';
import { ReactComponent as LPInfoBoxIcon } from '../../assets/icons/LPInfoBoxIcon.svg';
import { ReactComponent as FundsInfoCardIcon } from '../../assets/icons/FundsInfoCardIcon.svg';
import { ReactComponent as PCOInfoBoxIcon } from '../../assets/icons/PCOInfoBoxIcon.svg';
import { useNavigate } from 'react-router-dom';

const InfoCardsComponent = () => {
    const theme = useTheme();
    const { funds } = useSelector((state: RootState) => state.funds);
    const { lps } = useSelector((state: RootState) => state.lps);
    const { pcos } = useSelector((state: RootState) => state.pcos);
    const navigate = useNavigate();

    const handleNavigate = (pageName: string) => {
        let otherPageUrl = '';
        if (pageName === 'lps') {
            otherPageUrl = `/lpsOverview`;
        } else if (pageName === 'funds') {
            otherPageUrl = `/fundsOverview`;
        } else {
            otherPageUrl = `/pcosOverview`;
        }
        if (otherPageUrl !== '') {
            navigate(otherPageUrl);
        }
    }

    return (
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
            <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex', justifyContent: 'start' }}>
                <Paper elevation={3} sx={{ height: 100, width: 310, cursor: 'pointer' }} onClick={() => handleNavigate('lps')}>
                    <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '0.5em' }}>
                        <Grid item xs={12} sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                            <Typography variant='h6'>Limited Partners</Typography>
                            <LPInfoBoxIcon fill={theme.palette.primary.main} />
                        </Grid>
                        <Grid item xs={12} sx={{ marginTop: '-0.5em' }}>
                            <Typography variant='h5' sx={{ fontWeight: 600 }}>{lps?.length ?? 0}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex', justifyContent: { xs: 'start', md: 'center', lg: 'center' } }}>
                <Paper elevation={3} sx={{ height: 100, width: 310, cursor: 'pointer' }} onClick={() => handleNavigate('funds')}>
                    <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '0.5em' }}>
                        <Grid item xs={12} sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                            <Typography variant='h6'>Funds</Typography>
                            <FundsInfoCardIcon fill={theme.palette.primary.main} />
                        </Grid>
                        <Grid item xs={12} sx={{ marginTop: '-0.5em' }}>
                            <Typography variant='h5' sx={{ fontWeight: 600 }}>{funds?.length ?? 0}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex', justifyContent: { xs: 'start', md: 'end', lg: 'end' } }}>
                <Paper elevation={3} sx={{ height: 100, width: 310, cursor: 'pointer' }} onClick={() => handleNavigate('pcos')}>
                    <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '0.5em' }}>
                        <Grid item xs={12} sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                            <Typography variant='h6'>Portfolio Companies</Typography>
                            <PCOInfoBoxIcon fill={theme.palette.primary.main} />
                        </Grid>
                        <Grid item xs={12} sx={{ marginTop: '-0.5em' }}>
                            <Typography variant='h5' sx={{ fontWeight: 600 }}>{pcos?.length ?? 0}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default InfoCardsComponent;