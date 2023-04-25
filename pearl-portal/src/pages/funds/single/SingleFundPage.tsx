import { Grid } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
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
import { fetchFunds } from '../../../redux/thunks/fundThunk';
import { AddDialogComponent } from '../../../components/shared/addPopup/AddPopupDialog';
import { setSelectedLP } from '../../../redux/slices/lps/lpsSlice';
import { setSelectedPCO } from '../../../redux/slices/pcos/pcosSlice';
import { EditDialogComponent } from '../../../components/shared/editPopup/EditPopupDialog';
import { GridApi } from 'ag-grid-community';

const SingleFund = () => {
    const dispatch = useAppDispatch();
    const { funds, selectedFund } = useSelector((state: RootState) => state.funds);
    const [selectedView, setSelectedView] = useState<string>('basic');
    const [selectedCallDistView, setSelecteCalDistdView] = useState<string>('Calls');
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [searchTextValue, setSearchTextValue] = useState<string | null>(null);

    const handleButtonClick = (buttonId: string) => {
        onCancelClick();
        setSelectedView(buttonId);
    };

    const onValueChange = useCallback((event: any) => {
        setSearchTextValue(event.target.value)
        if (gridApi) {
            gridApi.setQuickFilter(event.target.value);
        }
    }, [gridApi]);

    const onCancelClick = useCallback(() => {
        setSearchTextValue('');
        if (gridApi) {
            gridApi.setQuickFilter('');
        }
    }, [gridApi]);

    useEffect(() => {
        dispatch(fetchFunds());
        dispatch(setSelectedLP(null));
        dispatch(setSelectedPCO(null));
    }, [dispatch])

    useEffect(() => {
        if (selectedFund) {
            dispatch(setTopBarTitle(`${selectedFund.shortName} Details`));
        } else {
            dispatch(setSelectedFund(funds[0]));
        }
    }, [dispatch, selectedFund, funds])

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'start', flexDirection: 'row', paddingLeft: '0.5em' }}>
            <Grid item xs={12} md={12} lg={12} sx={{ flex: 1 }}>
                <Grid container spacing={2} sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'start' }}>
                    <Grid item xs={12} md={6} lg={6}>
                        {selectedFund && <AutocompleteFundComponent selectedFund={selectedFund} />}
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', flex: 1, justifyContent: { xs: 'flex-start', md: 'flex-end', lg: 'flex-end' }, alignSelf: 'flex-end' }}>
                        <DatePickerFundComponent />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{ flex: 1 }}>
                <Grid container spacing={2} sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'start' }}>
                    <Grid item xs={12} md={8} lg={8}>
                        <SelectionFundComponent selectedItem={selectedView} handleButtonClick={handleButtonClick} />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex', flex: 1, justifyContent: { xs: 'flex-start', md: 'flex-end', lg: 'flex-end' }, alignSelf: 'flex-end' }}>
                        <FiltersAndActionsFundComponent selectedItem={selectedView} handleButtonClick={handleButtonClick} addEditTooltip={selectedView === 'basic'
                            ? 'fundBasic'
                            : selectedView === 'commitments' ? 'commitments'
                                : selectedView === 'portfolio' ? 'fundPortfolio'
                                    : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'callsComponent'
                                        : 'distributionComponent'
                                        : 'transactions'}
                            searchTextValue={searchTextValue}
                            onValueChange={onValueChange}
                            onCancelClick={onCancelClick} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{ flex: 1, height: '82%' }}>
                {selectedView === 'basic' ? <SingleFundBasic />
                    : selectedView === 'commitments'
                        ? <SingleFundCommitments setGridApi={setGridApi} />
                        : selectedView === 'portfolio'
                            ? <SingleFundPortfolios setGridApi={setGridApi} />
                            : selectedView === 'callsDist'
                                ? <SingleFundCallsAndDistributions selectedCallDistView={selectedCallDistView} setSelecteCalDistdView={setSelecteCalDistdView} setGridApi={setGridApi} />
                                : selectedView === 'transactions'
                                    ? <SingleFundTransactions setGridApi={setGridApi} />
                                    : <SingleFundDocuments />}
            </Grid>
            <AddDialogComponent pageName={selectedView === 'commitments' ? 'commitments'
                : selectedView === 'portfolio' ? 'fundPortfolio'
                    : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'callsComponent'
                        : 'distributionComponent'
                        : 'transactions'}
                pageTitle={selectedView === 'commitments' ? 'Add New Commitment'
                    : selectedView === 'portfolio' ? 'Add New Portfolio'
                        : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'Add New Call'
                            : 'Add New Distribution'
                            : 'Add New Transaction'} />
            <EditDialogComponent pageName={selectedView === 'basic' ? 'fundBasic'
                : selectedView === 'commitments' ? 'commitments'
                    : selectedView === 'portfolio' ? 'fundPortfolio'
                        : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'callsComponent'
                            : 'distributionComponent'
                            : 'transactions'}
                pageTitle={selectedView === 'basic' ? 'Edit Basic Details'
                    : selectedView === 'commitments' ? 'Edit Commitment'
                        : selectedView === 'portfolio' ? 'Edit Portfolio'
                            : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'Edit Call'
                                : 'Edit Distribution'
                                : 'Edit Transaction'} />
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