import {Grid} from '@mui/material';
import { useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import SingleLPToolbar from '../../../components/lps/single/SingleLPToolbarComponent';
import SingleSelection from '../../../components/lps/single/SingleSelectionComponent';
import SingleLPBasic from '../../../components/lps/single/basic/SingleLPBasicComponent';
import SingleLPCommitments from '../../../components/lps/single/commitments/SingleLPCommitmentsComponent';
import SingleLPCoinvestments from '../../../components/lps/single/coinvestments/SingleLPCoinvestments';
import SingleLPCallsAndDistributions from '../../../components/lps/single/callsAndDistributions/SingleLPCallsAndDistributions';
import SingleLPTransactions from '../../../components/lps/single/transactions/SingleLPTransactions';
import SingleLPDocuments from '../../../components/lps/single/documents/SingleLPDocuments';
import SingleLPPortfolios from '../../../components/lps/single/portfolios/SingleLPPortfoliosComponents';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/rootSlice';
import { setSelectedLP } from '../../../redux/slices/lps/lpsSlice';



const SingleLP = () => {
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