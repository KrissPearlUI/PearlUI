import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
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
import AutocompleteLPComponent from '../../../components/lps/single/AutocompleteLP';
import DatePickerLPComponent from '../../../components/lps/single/DatePickerLP';
import SelectionLPComponent from '../../../components/lps/single/SelectionComponentLP';
import FiltersAndActionsLPComponent from '../../../components/lps/single/FiltersAndActionsLP';
import { fetchLPs } from '../../../redux/thunks/lpThunk';
import { AddDialogComponent } from '../../../components/shared/addPopup/AddPopupDialog';
import { setSelectedFund } from '../../../redux/slices/funds/fundsSlice';
import { setSelectedPCO } from '../../../redux/slices/pcos/pcosSlice';
import { EditDialogComponent } from '../../../components/shared/editPopup/EditPopupDialog';

const SingleLP = () => {
    const dispatch = useAppDispatch();
    const { lps, selectedLP } = useSelector((state: RootState) => state.lps);
    const [selectedView, setSelectedView] = useState<string>('basic');
    const [selectedCallDistView, setSelecteCalDistdView] = useState<string>('Calls');

    const handleButtonClick = (buttonId: string) => {
        setSelectedView(buttonId);
    };

    useEffect(() => {
        dispatch(fetchLPs());
        dispatch(setSelectedFund(null));
        dispatch(setSelectedPCO(null));
    }, [dispatch])

    useEffect(() => {
        if (selectedLP) {
            dispatch(setTopBarTitle(`${selectedLP.shortName} Details`));
        } else {
            dispatch(setSelectedLP(lps[0]));
        }
    }, [dispatch, selectedLP, lps])

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'start', flexDirection: 'row', paddingLeft: '0.5em' }}>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ flex: 1 }}>
                <Grid container spacing={2} sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'start' }}>
                    <Grid item xs={12} md={6} lg={6}>
                        <AutocompleteLPComponent selectedLP={selectedLP} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', flex: 1, justifyContent: { xs: 'flex-start', md: 'flex-end', lg: 'flex-end' }, alignSelf: 'flex-end' }}>
                        <DatePickerLPComponent />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ flex: 1 }}>
                <Grid container spacing={2} sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'start', justifyContent: 'flex-start' }}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <SelectionLPComponent selectedItem={selectedView} handleButtonClick={handleButtonClick} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} sx={{ display: 'flex', flex: 1, justifyContent: { xs: 'flex-start', md: 'flex-end', lg: 'flex-end' }, alignSelf: 'flex-end' }}>
                        <FiltersAndActionsLPComponent selectedItem={selectedView} handleButtonClick={handleButtonClick} addEditTooltip={selectedView === 'basic'
                            ? 'lpBasic'
                            : selectedView === 'commitments' ? 'commitments'
                                : selectedView === 'portfolio' ? 'lpPortfolio'
                                    : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'callsComponent'
                                        : 'distributionComponent'
                                        : 'transactions'} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ flex: 1, height: '82%' }}>
                {selectedView === 'basic' ? <SingleLPBasic />
                    : selectedView === 'commitments'
                        ? <SingleLPCommitments />
                        : selectedView === 'coinvestments'
                            ? <SingleLPCoinvestments />
                            : selectedView === 'portfolio'
                                ? <SingleLPPortfolios />
                                : selectedView === 'callsDist'
                                    ? <SingleLPCallsAndDistributions selectedCallDistView={selectedCallDistView} setSelecteCalDistdView={setSelecteCalDistdView} />
                                    : selectedView === 'transactions'
                                        ? <SingleLPTransactions />
                                        : <SingleLPDocuments />}
            </Grid>
            <AddDialogComponent pageName={selectedView === 'commitments' ? 'commitments'
                : selectedView === 'portfolio' ? 'lpPortfolio'
                    : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'callsComponent'
                        : 'distributionComponent'
                        : 'transactions'}
                pageTitle={selectedView === 'commitments' ? 'Add New Commitment'
                    : selectedView === 'portfolio' ? 'Add New Portfolio'
                        : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'Add New Call'
                            : 'Add New Distribution'
                            : 'Add New Transaction'} />

            <EditDialogComponent pageName={selectedView === 'basic' ? 'lpBasic'
            :selectedView === 'commitments' ? 'commitments'
                : selectedView === 'portfolio' ? 'lpPortfolio'
                    : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'callsComponent'
                        : 'distributionComponent'
                        : 'transactions'}
                pageTitle={selectedView === 'basic' ? 'Edit Basic Details'
                    :selectedView === 'commitments' ? 'Edit Commitment'
                    : selectedView === 'portfolio' ? 'Edit Portfolio'
                        : selectedView === 'callsDist' ? selectedCallDistView === 'Calls' ? 'Edit Call'
                            : 'Edit Distribution'
                            : 'Edit Transaction'} />
        </Grid>
    );
};

export default SingleLP;
