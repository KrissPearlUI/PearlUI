import {Grid} from '@mui/material';
import { useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/rootSlice';
import { setSelectedFund } from '../../../redux/slices/funds/fundsSlice';
import AutocompleteFundComponent from '../../../components/funds/single/AutocompleteFund';
import DatePickerFundComponent from '../../../components/funds/single/DatePickerFund';
import SelectionFundComponent from '../../../components/funds/single/SelectionComponent';
import FiltersAndActionsFundComponent from '../../../components/funds/single/FiltersAndActionsFund';
import SingleFundBasic from '../../../components/funds/single/basic/SingleFundBasic';
import SingleFundCommitments from '../../../components/funds/single/commitments/SingleFundCommitments';
import SingleFundDocuments from '../../../components/funds/single/documents/SingleFundDocuments';
import SingleFundPortfolios from '../../../components/funds/single/portfolios/SingleFundPortfolios';
import SingleFundTransactions from '../../../components/funds/single/transactions/SingleFundTransactions';
import SingleFundCallsAndDistributions from '../../../components/funds/single/callsAndDistributions/SingleFundCallsAndDistributions';

const SingleFund = () => {
    const dispatch = useAppDispatch();
    const {funds,selectedFund} = useSelector((state: RootState) => state.funds);
    const [selectedView,setSelectedView]=useState<string>('basic');

    const handleButtonClick = (buttonId:string) => {
        setSelectedView(buttonId);
    };

    useEffect(() => {
        if(selectedFund){
            dispatch(setTopBarTitle(`${selectedFund.shortName} Details`));
        } else{
            dispatch(setSelectedFund(funds[0]));
        }
    }, [dispatch, selectedFund,funds])

    return (
        <Grid container spacing={2} sx={{display:'flex', flex:1, width:'100%', height:'100%', justifyContent:'flex-start', alignItems:'start', flexDirection:'row', paddingLeft:'0.5em'}}>
            <Grid item xs={12} md={12} lg={12} sx={{flex:1}}>
                <Grid container spacing={2} sx={{display:'flex', flex:1, width:'100%', height:'100%',alignItems:'start'}}>
                    <Grid item xs={12} md={6} lg={6}>
                        <AutocompleteFundComponent/>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} sx={{display:'flex', flex:1, justifyContent:{ xs:'flex-start', md:'flex-end', lg:'flex-end'}, alignSelf:'flex-end'}}>
                        <DatePickerFundComponent/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{flex:1}}>
                <Grid container spacing={2} sx={{display:'flex', flex:1, width:'100%', height:'100%', alignItems:'start'}}>
                    <Grid item xs={12} md={8} lg={8}>
                       <SelectionFundComponent selectedItem={selectedView} handleButtonClick={handleButtonClick}/>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} sx={{display:'flex', flex:1, justifyContent:{ xs:'flex-start', md:'flex-end', lg:'flex-end'}, alignSelf:'flex-end'}}>
                        <FiltersAndActionsFundComponent selectedItem={selectedView} handleButtonClick={handleButtonClick}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{flex:1,height:'82%'}}>
                {selectedView==='basic' ? <SingleFundBasic/>
                : selectedView==='commitments'
                ?<SingleFundCommitments/>
                : selectedView==='portfolio'
                ? <SingleFundPortfolios/>
                : selectedView==='callsDist'
                ? <SingleFundCallsAndDistributions/>
                : selectedView==='transactions'
                ?<SingleFundTransactions/>
                :<SingleFundDocuments/>}
            </Grid>
        </Grid>
       /*  <Grid spacing={1} container sx={{display:'flex',flex:1, height:'100%', width:'100%', paddingLeft:'0.5em', flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', overflow:'auto' }}>
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
                :selectedView==='portfolio'
                ? <SingleLPPortfolios/>
                : selectedView==='callsDist'
                ?<SingleLPCallsAndDistributions/>
                : selectedView==='transactions'
                ?<SingleLPTransactions/>
                :<SingleLPDocuments/>}
            </Grid>
        </Grid>    */
    );
};

export default SingleFund;