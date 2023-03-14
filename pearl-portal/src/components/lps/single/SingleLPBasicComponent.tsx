import {Grid,Paper,Typography} from '@mui/material';
import {darken, useTheme} from "@mui/material/styles";
import { useEffect } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import LPChartComponent from '../../../components/landing/LPChart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/rootSlice';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chart: {
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            alignContent: 'center',
        },
        summary: {
            flex:1
        },
    }),
);

const SingleLPBasic = () => {
    const classes=useStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();
    const {selectedLP} = useSelector((state: RootState) => state.lps);
    
    return (
        <Grid container spacing={2} sx={{display:'flex',flex:1, justifyContent:'flex-start', alignItems:'flex-start', flexDirection:'row',paddingRight:'1em'}}>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper, padding:'1em'}}>
                    <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Domicile:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Address:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Website:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>First Investment:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Type:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.type}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Main Contact:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Relationship Partner:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Relationship SS:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper, padding:'1em'}}>
                <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Domicile:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Address:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Of which terminated:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Main Contact:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Relationship Partner:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper,padding:'1em'}}>
                <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Management Fee:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Capital Paid In:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Capital Distributed:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.totalDistributions}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Capital Invested:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.totalInvestments}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Recycling Reserves:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Capital Available:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.totalInvestments}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Dry Powder:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Reserved:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Avg. Deals Available:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Tapped Out:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.tappedOot ? 'Yes':'No'}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Estimated Until Tapped Out:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper,padding:'1em'}}>
                <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Net DPI:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Gross DPI:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Net TVPI:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Gross TVPI:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.type}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Net IRR:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Gross IRR:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SingleLPBasic;