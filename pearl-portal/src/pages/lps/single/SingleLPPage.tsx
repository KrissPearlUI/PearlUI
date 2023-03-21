import {Grid,Paper,Typography} from '@mui/material';
import {useTheme} from "@mui/material/styles";
import { useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import LPChartComponent from '../../../components/landing/LPChart';
import SingleLPToolbar from '../../../components/lps/single/SingleLPToolbarComponent';
import SingleSelection from '../../../components/lps/single/SingleSelectionComponent';
import SingleLPBasic from '../../../components/lps/single/basic/SingleLPBasicComponent';
import LPFundsTable from '../../../components/lps/single/basic/LPFundsTable';
import SingleLPCommitments from '../../../components/lps/single/commitments/SingleLPCommitmentsComponent';
import SingleLPCoinvestments from '../../../components/lps/single/coinvestments/SingleLPCoinvestments';
import SingleLPCallsAndDistributions from '../../../components/lps/single/callsAndDistributions/SingleLPCallsAndDistributions';
import SingleLPTransactions from '../../../components/lps/single/transactions/SingleLPTransactions';
import SingleLPDocuments from '../../../components/lps/single/documents/SingleLPDocuments';
import SingleLPPortfolios from '../../../components/lps/single/portfolios/SingleLPPortfoliosComponents';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/rootSlice';
import { setSelectedLP } from '../../../redux/slices/lps/lpsSlice';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            paddingLeft:'0.2em',
            paddingRight:'0.2em',
        },
    }),
);

const SingleLP = () => {
    const classes=useStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();
    const {lps,selectedLP} = useSelector((state: RootState) => state.lps);
    const [selectedView,setSelectedView]=useState<string>('basic');

    const handleButtonClick = (buttonId:string) => {
        setSelectedView(buttonId);
    };

    useEffect(() => {
        if(selectedLP){
            dispatch(setTopBarTitle(`${selectedLP.shortName} Details`));
        } else{
            dispatch(setSelectedLP(lps[0]));
        }
    }, [dispatch, selectedLP,lps])

    return (
        <Grid spacing={1} container sx={{display:'flex',flex:1, height:'100%', width:'100%', paddingLeft:'0.5em', flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', overflow:'auto' }}>
            <Grid item sx={{display:'flex', justifyContent:'start', alignItems:'start', width:'100%', height:'8vh'}}>
                <SingleLPToolbar/>
            </Grid>
            <Grid item sx={{display:'flex', justifyContent:'start', alignItems:'start',width:'100%',height:'8vh'}}>
                <SingleSelection selectedItem={selectedView} handleButtonClick={handleButtonClick}/>
            </Grid>
            <Grid item sx={{display:'flex', justifyContent:'start', alignItems:'start',width:'100%', height:'82%' }}>
                {selectedView==='basic' ? <SingleLPBasic/>
                : selectedView==='commitments'
                ?<SingleLPCommitments/>
                :selectedView==='coinvestments'
                ?<SingleLPCoinvestments/>
                :selectedView==='portfolio'
                ? <SingleLPPortfolios/>
                : selectedView==='callsDist'
                ?<SingleLPCallsAndDistributions/>
                : selectedView==='transactions'
                ?<SingleLPTransactions/>
                :<SingleLPDocuments/>}
            </Grid>
        </Grid>   
    );
};

export default SingleLP;